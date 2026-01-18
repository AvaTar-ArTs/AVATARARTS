
## Audio Analysis Architecture

The music analysis workflow now runs entirely in the browser using the `ClientAudioAnalyzer` utility. Audio uploads are still stored in Supabase for persistence, but the subsequent tempo, key, mood, and beat detection steps all execute client-side. As a result, the former `audio-analysis` and `real-audio-analysis` edge functions are deprecated and removed.

Contributors should avoid redeploying or re-adding those functions—only the `concept-analysis`, `audio-transcription`, `realtime-voice`, and `segmind-generation` edge functions require deployment. This ensures local development and production deployments rely on a single, tested analysis path.

## Segmind integration configuration

The storyboard keyframe and timeline shot generators call Segmind's workflow APIs from the `segmind-generation` edge function. Configure the following environment variables before deploying so requests reach the correct pipelines and webhook callbacks validate successfully:

| Variable | Description |
| --- | --- |
| `SEGMIND_SCENE_IMAGE_WORKFLOW_URL` | HTTPS endpoint for the Segmind workflow that generates storyboard keyframe images. Supports optional character images. |
| `SEGMIND_FIRST_SHOT_WORKFLOW_URL` | HTTPS endpoint for the Segmind workflow that renders the first video shot of each scene. |
| `SEGMIND_REMAINING_SHOT_WORKFLOW_URL` | HTTPS endpoint for the Segmind workflow that renders subsequent video shots within a scene. |
| `SEGMIND_WEBHOOK_URL` | Callback URL Segmind should notify when renders finish. Production uses `https://sunova.app/segmind-api/`. |
| `SEGMIND_WEBHOOK_SECRET` | Signing secret Segmind uses for webhook payload verification. Rotate in both Supabase and the receiving webhook handler when changed. |

All variables must be present in the Supabase function environment; missing values cause generation attempts to fail fast with descriptive errors.

## Credit System & Stripe Integration

Generative actions draw down a USD-denominated credit balance tracked on each `user_profiles` row (`credit_balance`). Key updates:

- **Costs**: Image keyframes charge $0.25; video shots charge $1.00. Admin accounts (`is_admin` or `subscription_tier = 'admin'`) bypass charges.
- **Database**: Credits flow through the `credit_transactions` table with helper functions `spend_credits` and `add_credits`. All updates are atomic and guard against negative balances.
- **Edge Functions**:
  - `create-checkout-session` creates authenticated Stripe Checkout sessions so users can pre-purchase credits.
  - `stripe-webhook` finalizes purchases by crediting accounts on `checkout.session.completed` events.
- **Environment variables**: Provide `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` alongside the existing Supabase service credentials.

After a successful payment Stripe redirects users back to `/dashboard?payment=success`, and the client automatically refreshes balances.
