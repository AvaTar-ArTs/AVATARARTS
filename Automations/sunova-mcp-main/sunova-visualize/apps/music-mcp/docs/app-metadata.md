# App Metadata Reference

Use this file when updating the ChatGPT connector listing or `app.json`. Every field should stay aligned with the behaviours documented in `metadata-optimization.md`.

## App identity

- **Name**: `Sunova Music Video Studio`
- **Short description**: "Create, refine, and render AI music videos inside ChatGPT."
- **Long description**: "Use Sunova Music Video Studio to transcribe vocals, plan cinematic storyboards, generate keyframes, analyse beats, and render Sora-2 videos without leaving ChatGPT. Ideal for artists and editors who want an end-to-end workflow from lyrics to final cut."
- **Icon**: `public/apple-touch-icon.png`
- **Tags**: `video`, `music`, `creative-tools`

## Starter prompts

Use these in the directory listing or launcher so users discover high-signal flows:

1. "Turn these lyrics into a storyboard with Sunova." → runs `music.generate_storyboard`
2. "Analyse this track and give me beat timings for a video edit." → runs `music.run_audio_analysis`
3. "Render my approved storyboard as a 4K music video." → runs `music.render_video`

## Tool inventory

| Tool ID | Summary | Read-only |
| --- | --- | --- |
| `music.transcribe_lyrics` | Transcribe a vocal track into lyrics. | ✅ |
| `music.generate_storyboard` | Build a multi-scene storyboard from lyrics and style cues. | ✅ |
| `music.generate_keyframes` | Produce keyframe images for each shot. | ❌ |
| `music.plan_shot_timing` | Map beats to per-shot durations. | ✅ |
| `music.present_timeline` | Display current storyboard and timing in the timeline widget. | ✅ |
| `music.run_audio_analysis` | Execute Python beat and energy analysis. | ✅ |
| `music.present_analysis` | Render analysis JSON in the analysis widget. | ✅ |
| `music.render_video` | Launch a Sora-2 render job. | ❌ |
| `music.get_video_status` | Retrieve render job progress and playback URL. | ✅ |
| `music.remix_video` | Create a remix job for an existing render. | ❌ |
| `music.create_checkout_session` | Generate a Stripe checkout for credits. | ❌ |
| `music.verify_checkout_session` | Confirm Stripe payment status. | ✅ |
| `music.mux_after_render` | Instruct ChatGPT to mux original audio into the render. | ❌ |
| `music.download_assets_bundle` | Package render, audio, and keyframes into a ZIP. | ✅ |

## Parameter guidance

Whenever you change schema descriptions, update this table with examples for the developer portal docs:

- `music.render_video`
  - `storyboard`: Pass the object returned by `music.generate_storyboard` or `music.generate_keyframes`.
  - `audioUrl`: Public HTTPS link to the mastered track.
  - `paymentSessionId`: Required when `BILLING_REQUIRED=true`.
- `music.generate_keyframes`
  - `storyboard`: Same shape as `music.generate_storyboard` output.
  - `stylePreset`: Suggested values include `"neo-noir cinematic still"`, `"anime storyboard"`, `"lo-fi watercolor"`.
- `music.run_audio_analysis`
  - `sampleRate`: Keep defaults unless the user requests higher fidelity.
  - `timeSignature`: Accepts integers between 1 and 12.

Record any copy edits or new examples so the golden prompt regressions line up with the shipped metadata.
