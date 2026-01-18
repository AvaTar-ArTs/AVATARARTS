Music Video MCP (Apps SDK)

Overview
- Exposes an MCP server with tools to create music videos end‑to‑end:
  - music.transcribe_lyrics: Whisper transcription from an audio URL
  - music.generate_storyboard: scene/shot planning with JSON output
  - music.generate_keyframes: keyframe images per shot via gpt-image-1
  - music.render_video: full video render via Sora‑2 (Responses API)
  - music.run_audio_analysis: instructs ChatGPT to execute Python that computes BPM/beatmap, energy, and a heuristic genre from an audio URL
  - music.present_analysis: render analysis JSON in the Analysis widget
  - music.present_timeline: show shots in a horizontal NLE-like timeline
  - music.confirm_storyboard / music.confirm_shots: simple approvals to gate next steps
  - music.mux_after_render: merges the original audio track into the completed video via Python run by ChatGPT
  - music.plan_shot_timing: assigns per-shot durations from beat intervals for timeline display
  - music.download_assets_bundle: guides ChatGPT to download video/audio/keyframes and zip them for the user

Requirements
- Node 20+
- OPENAI_API_KEY in environment
- Optional: STRIPE_SECRET_KEY to require payment before image/video generation
 - Optional: SUPABASE_URL and SUPABASE_SERVICE_KEY to enable credit-based billing

Run Locally
1) Install deps: `npm i` (in this folder)
2) Start server (free mode): `OPENAI_API_KEY=sk-... npm run start`
3) Start server (paid – Stripe): `OPENAI_API_KEY=sk-... STRIPE_SECRET_KEY=sk_test_... BILLING_REQUIRED=true npm run start`
   - Optional pricing overrides: `PRICE_PER_IMAGE_USD=0.25 PRICE_PER_VIDEO_USD=1`
3) Health check: GET http://localhost:8787/health

Use with MCP Inspector
1) Start server (step above)
2) Point Inspector to POST http://localhost:8787/mcp
3) List and invoke tools; components render for storyboard/render

Connect to ChatGPT (dev mode)
1) Expose HTTPS during development (e.g. ngrok): `ngrok http 8787`
2) Create a new connector in ChatGPT → Developer → Connectors
   - Type: MCP (HTTP)
   - URL: https://<your-ngrok-subdomain>.ngrok.app/mcp
3) Add this app to a conversation and invoke the tools.

Notes
- The Sora‑2 API surface in this scaffold uses the Responses API with `model: "sora-2"` and `modalities: ["video"]`. If your account has a newer/alternate video endpoint, update the call shape accordingly.
  - Updated: The server now uses the official `v1/videos` endpoints. `music.render_video` returns a job `id`, and `music.get_video_status` polls until `status` is `completed`. When ready, the server exposes a proxied playable URL at `/videos/{id}/content` shown by the render component.

Video flow (v1/videos)
- `music.render_video` → creates a job with Sora‑2 using `openai.videos.create({ model: 'sora-2', prompt, size })` and returns `{ state, details: { id }, videoUrl: null }`.
- `music.get_video_status` → `openai.videos.retrieve(id)`, returning `{ state, details, videoUrl }`. `videoUrl` is only present when `state` is `completed` and points to the proxy route.
- Optional: `music.remix_video` → `openai.videos.remix(id, { prompt })` and poll again.
- Optional (post-render audio): `music.mux_after_render { videoId, audioUrl }` → instructs ChatGPT to pull the video from `/videos/{id}/content`, mux your audio, and return an attachment of the final MP4.

Payment flow (Stripe)
- Tools:
  - `music.create_checkout_session` → returns `url` and `sessionId` for images or video (quantity = number of shots).
  - `music.verify_checkout_session` → returns `payment_status` for a given `sessionId`.
- Generation tools (`music.generate_keyframes`, `music.render_video`):
  - In paid mode, they require a paid `paymentSessionId` matching the number of shots. Pass `paymentSessionId` in the tool input after completing Checkout.
  - In free mode (`BILLING_REQUIRED=false`), generation proceeds without payment.

ChatGPT account billing
- If/when Apps SDK exposes first‑party billing in ChatGPT, replace Stripe gating with the native payment primitives. The server isolates billing logic in `requirePaymentOrContinue()` for easy swap‑out.
Audio analysis (Python executed by ChatGPT)
- Tool: `music.run_audio_analysis { audioUrl }`
  - Returns a code block and execution instructions. ChatGPT will run the Python in its server‑side environment (Code Interpreter), install dependencies if needed, execute, and return the JSON printed by the script.
  - `structuredContent.outputSchema` describes the expected JSON shape (bpm, beatmap, energy, features, genre_guess, duration).
  - The widget mirrors the code for visibility, but end‑to‑end execution happens in ChatGPT.
End-to-end flow (suggested orchestration inside ChatGPT)
- User uploads an audio file in the ChatGPT thread.
- Transcribe: call `music.transcribe_lyrics { fileId?, audioUrl? }` with `fileId` (ChatGPT attachment) or `audioUrl`.
- Analyze: call `music.run_audio_analysis { audioUrl }` to run Python; paste the resulting JSON into `music.present_analysis` so the widget shows results.
- Storyboard: call `music.generate_storyboard { lyrics, artist?, style? }`; the storyboard widget renders automatically and now exposes purchase/link buttons.
- Keyframes: either link credits via `resolve_supabase_user { email }` (buttons included in the widget) or purchase with Stripe using the “Buy Keyframe Credits” button. Once credits/payment is ready, press “Generate Keyframes” to update the grid.
- Approval: call `music.confirm_storyboard { ok: true }`.
- Timeline: call `music.present_timeline { scenes: <from keyframes>, beats: <from analysis.beatmap>, audioUrl? }` to preview shot order and beat markers.
- Optional: call `music.plan_shot_timing { scenes, beats }` before `music.present_timeline` to fill `durationMs` per shot.
- Approval: call `music.confirm_shots { ok: true }`.
- Render: `music.render_video { storyboard, audioUrl, paymentSessionId? }` → returns `{ details: { id } }`.
- Poll: `music.get_video_status { id }` until `completed`, then the render widget shows a playable video.
- Mux (optional): `music.mux_after_render { videoId: id, audioUrl }` to merge the original track; ChatGPT returns the final MP4 as an attachment.
- Save (optional): Use the “Save Project on Sunova” button in the widgets to open the Sunova signup flow and persist work outside the ChatGPT session.

Component‑initiated actions
- Storyboard widget →
  - “Buy Keyframe Credits (Stripe)” calls `music.create_checkout_session { product: 'image', quantity: <shot count> }`.
  - “Generate Keyframes” calls `music.generate_keyframes { storyboard }` once payment is confirmed.
  - “Save Project on Sunova” opens the Sunova signup page so the user can create an account and persist work.
- Timeline widget →
  - “Buy Video Credits (Stripe)” calls `music.create_checkout_session { product: 'video', quantity: <shot count> }`.
  - “Render Video” calls `music.render_video { storyboard, audioUrl? }` once payment is ready.
  - “Save Project on Sunova” opens the Sunova signup page.
- Render widget → “Refresh Status” calls `music.get_video_status { id }`; “Mux With Original Audio” calls `music.mux_after_render { videoId, audioUrl }`.
- All widgets surface contextual banners (info/success/warning) so users know when Stripe checkout is ready, when payment is confirmed, and when rendering is underway.

Visual polish & UX
- Toolbars disable buttons while generation/checkouts are running, and banners announce success, warnings, or in-progress states.
- Checkout responses show amount + direct Stripe link inside the widget so users never hunt for URLs.
- Render status includes a dedicated video container, status JSON, and one-click refresh/mux actions with live feedback.
- Render widget auto-refreshes while Sora is processing, showing a live progress bar and percent updates.

Billing options
- Stripe (pay-per-run): set `BILLING_REQUIRED=true`. Use the widget buttons to launch a Stripe Checkout session before image/video generation. Prices are controlled by `PRICE_PER_IMAGE_USD` and `PRICE_PER_VIDEO_USD`.
- If you trigger `create_checkout_session` manually, pass `context: "storyboard" | "timeline" | "render"` so the matching widget refreshes automatically with the checkout link.
- Saving projects: users must create a Sunova account (the widgets surface a “Save Project on Sunova” link). Without an account, projects remain ephemeral within the ChatGPT conversation.
