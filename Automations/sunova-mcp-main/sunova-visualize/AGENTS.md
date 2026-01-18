# AGENTS.md (Template)

## Stack & Versions
- Language(s): TypeScript 5.8.3 (frontend + Supabase Edge functions), JavaScript (Node 20.x runtime for scripts), JSON Schema for Supabase type definitions.
- Framework(s): React 18.3.1 with Vite 5.4.19 toolchain; Shadcn UI on top of Radix UI 1.x; Supabase Edge Runtime (Deno, configured via `supabase/functions/deno.json`).
- Key libraries: `@supabase/supabase-js` 2.58.0, `@tanstack/react-query` 5.83.0, `react-router-dom` 6.30.1, `zod` 4.1.11, `tailwindcss` 3.4.17, `@ffmpeg/ffmpeg` 0.12.15, `audiomotion-analyzer` 4.5.1.
- Source of truth: `package-lock.json` (npm) governs frontend/server dependencies; `supabase/functions/deno.json` pins Edge runtime options.

## Docs Lock (via context7)
_For each dependency you touch, refresh via **context7** and record below **before** coding._
| dependency | version | doc URL | checked_at (UTC) | notes |
|------------|---------|---------|------------------|-------|
| @ffmpeg/ffmpeg | 0.12.6 | N/A – context7 tool unavailable in environment | N/A | Pending doc review once context7 access is provided. |
| PostgreSQL (RLS) | 15 | https://www.postgresql.org/docs/15/ddl-rowsecurity.html | 2025-10-09T02:50:00Z | Attempted fetch via curl/python blocked by 403 from upstream; proceeding with previously cached knowledge. |
| Segmind Workflows API | v2024-09 | https://docs.segmind.com/ | 2025-10-09T02:50:00Z | GitBook endpoints return 404/JS bundle in this environment; recorded for compliance, will rely on prior integration behavior. |
| OpenAI Chat Completions API | 2024-12-17 | https://platform.openai.com/docs/api-reference/chat/create | 2025-10-09T23:38:52Z | Static HTML fetch returned empty body due to JS-rendered docs; recorded URL and version prior to prompt adjustments. |

## Current Intent
- Restore Segmind media surfacing by hardening webhook task matching when `task_id` is omitted and re-enable admin visibility into `generation_tasks` via role-aware RLS policies.
- Monitor remaining audio export edge cases after the FFmpeg command and manifest fixes.
- Extend regression coverage if additional media handling utilities are touched.

## Recent Changes
- Added scene planning heuristics + retry logic to the `scene-breakdown` Edge function so multi-location concepts produce multiple scenes, and introduced Vitest coverage for the heuristics helper.
- Hardened Segmind webhook task reconciliation to derive `request_id` matches when Segmind omits our `task_id` query param, and opened `generation_tasks` visibility to admins via a dedicated RLS policy migration. Added Vitest coverage for the request-id extractor shared helper.
- Normalized FFmpeg audio input handling by deriving the container extension from the uploaded file metadata and quoting concat manifests.
- Added `timelineExport` Vitest coverage to lock in the file staging workflow and cleanup behavior.

## MCP Usage Matrix
- **context7**: authoritative docs, migrations, deprecations. Use **before any coding**; update Docs Lock.
- **GitHub**: read/write repo ops (search/tree/blame, issues/PRs/branches/commits/CI). Also used to commit `README.md` & `AGENTS.md` updates **before and after** every action.
- **Stripe**: test-mode customers/prices/payments/setup intents/webhooks; simulate events; verify idempotency keys; never expose secrets; document live rollout separately.
- **Hugging Face**: model/dataset/Space selection; record **model card + license + exact revision/SHA** in Docs Lock; deterministic seeds for tests (when available).
- **Apify**: run actors; fetch datasets; define/validate stable schemas; capture dataset contracts for integration tests; mind rate limits/robots/TOS.

## Policies
- **Tests Always**: new code → new tests; touching untested legacy → add **characterization tests first**.
- **No mock data/simulation/shortcuts/truncation**. Provide real test-mode or local fixtures; justify any unavoidable placeholders with a removal plan.
- **Pre/Post Doc Sync**: `README.md` & `AGENTS.md` must be updated **immediately before** and **immediately after** each action.
- **Security**: no secrets in code/logs; validate inputs; escape outputs; least privilege; record secret names (not values) and where they are supplied.
- **Performance**: avoid N+1; protect hot paths; add micro-benchmarks when perf is a goal.
- **Compliance/Licensing**: record licenses (esp. HF models/datasets) and constraints; ensure compatible usage.

## Quality Gates (commands; adapt to project)
```bash
npm run lint && npm run typecheck && npm run format:check
npm test && npm run test:integration && npm run test:e2e
npm run build
npm audit || true
```

## Operational Runbook
- Migrations: idempotent `up`/`down`, pre/post validation, backfill strategy, rollback steps.
- Seeding: deterministic seeds; data shape documented.
- Smoke checks: endpoints/CLI/cron; health/readiness probes.

## Contribution Workflow
- Branch naming, PR template, review gates (security/perf/accessibility where relevant), release tagging, changelog policy.

## Recent Changes
### 2025-10-06: Restore Segmind Async Flow
- **Pre**: Investigate Segmind generation regressions after webhook rollout. Upcoming actions include extracting polling logic into a shared helper, updating StoryboardEditor/VideoEditor to handle `status:"processing"` responses, and aligning Vitest expectations.
- **Post**: Implemented `waitForGenerationTaskCompletion`, updated storyboard/video flows to poll `generation_tasks`, and reinstated deterministic `requestId`/`shotId` payload fields. Vitest suite passes; ESLint still reports long-standing `any`/hook dependency violations outside this patch.
### 2025-10-06: Concept Ready Guard (pre)
- **Intent**: Diagnose why StoryboardEditor flashes "Concept not ready" after concept extraction until toast clears. Focus on readiness checks around `hasStoryboardConcept` and async Supabase persistence.
### 2025-10-06: Concept Ready Guard (post)
- **Outcome**: Storyboard initialization now waits for a populated concept and re-checks via concept fingerprinting so automatic scene generation fires without manual retries. Verified with `npm test -- --run Tests` (Vitest).
### 2025-10-05: Fixed Scene Keyframe Generation Issues
#### Part 1: Validation Error
- **Issue**: Scene keyframe generation failed with ZodError: `requestId` (invalid UUID) and `shot_audio` (invalid URL)
- **Root cause**: Validation schema was too strict - `requestId` required UUID format but scene IDs aren't always UUIDs; `shot_audio` required URL format but is empty/unused for keyframe generation
- **Fix**: Relaxed validation in `segmind-generation/index.ts`:
  - Line 362: Changed `requestId` from `z.string().uuid().optional()` to `z.string().optional()`
  - Line 372: Changed `shot_audio` from `z.string().url().optional()` to `z.string().optional()`
- **Rationale**: `shot_audio` is only used for shot video generation, not scene keyframes. Scene IDs may be any string format.

#### Part 2: Webhook Response Format
- **Issue**: After validation fix, keyframe generation failed with "Segmind did not return an image"
- **Root cause**: Segmind webhook response format changed - image URL now at `outputs[0].output.data` instead of previous paths
- **Fix**: Updated `extractMediaFromResponse` function (lines 144-163) to check webhook format first:
  - Added support for `outputs[0].output.data` structure
  - Check `output.type` to determine if it's an image or video
  - Maintains backward compatibility with older response formats
- **Deployed**: Edge function deployed to production (project yggkcvlrhelueulbumqe)
