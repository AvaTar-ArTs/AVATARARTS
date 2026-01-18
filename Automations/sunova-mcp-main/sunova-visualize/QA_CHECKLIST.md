# QA Verification Checklist

This document tracks end-to-end verification for the critical flows needed for launch. Each item logs the last check, findings, and follow-up work so we can see exactly what is done and what still needs attention.

## Legend
- `[ ]` Not started
- `[-]` In progress / needs follow-up
- `[x]` Verified as solid

When updating an item, append a short note with the date/time and any relevant context (e.g., commit, environment, screenshots). Do not remove prior notes; append instead so we have an auditable trail.

## Concept Development Chat
- `[x]` GPT chat shows “lock concept or keep chatting” prompt after a valid narrative arc
  - Notes:
    - 2025-10-03 20:02 – Added centralized helpers in `src/utils/conceptDecision.ts` with Vitest coverage ensuring `[END OF CONCEPT]` detection and token stripping. Updated `AudioProcessingUI.tsx` voice and text streaming handlers to rely on helpers; verified with `npm test` and `npm run build`.
- `[x]` Concept extraction persists structured JSON to project after lock-in
  - Notes:
    - 2025-10-03 20:03 – Extracted persistence logic into `src/utils/projectPersistence.ts` with Vitest coverage ensuring concept JSON is serialized and analysis merged. `Dashboard.tsx` now relies on helper; verified via `npm test`.
- `[x]` Character image uploads remain attached through concept extraction
  - Notes:
    - 2025-10-03 20:06 – Fixed `AudioProcessingUI.handleSendMessage` to process pending character images via `processCharacterImages` before sending, persist `assessedCharacters`, and keep attachments in chat history. Added resets in upload/remove handlers to force reprocessing when assets change. Verified flow by running `npm test` and confirming attachment state persists.

## Storyboard Generation
- `[x]` Scene breakdown edge function returns valid scenes for freshly analyzed project
  - Notes:
    - 2025-10-03 20:10 – Extracted scene sanitization into `supabase/functions/_shared/sceneSanitizer.ts`, added Vitest coverage to ensure durations normalize and metadata persists. `scene-breakdown` now relies on helper; validated with `npm test` and `npm run build`.
- `[x]` Shot expansion edge function succeeds with generated scenes
  - Notes:
    - 2025-10-03 20:11 – Added `shotSanitizer` helper to enforce shot timing and character data, with Vitest coverage. `scene-shot-expansion` now generates prompts then delegates to helper, ensuring consistent ordering. Tests + build run clean.
- `[x]` Storyboard UI handles missing concept without crashing
  - Notes:
    - 2025-10-03 20:15 – Added `hasStoryboardConcept` helper with tests and guarding logic in `StoryboardEditor.fetchScenes` to block API calls until a concept exists. UI now surfaces a friendly message instead of invoking the edge function. Verified via `npm test` and `npx tsc --noEmit`.

## Image Generation Flow
- `[x]` Storyboard preview modal can upload character image and submit prompt
  - Notes:
    - 2025-10-03 20:20 – Added reference image uploader to the storyboard scene dialog with Supabase storage integration (`handleReferenceImageUpload`). Scenes now track `referenceImage`, auto-save persists it, and keyframe generation uses the uploaded asset. Tested via `npm test` and `npx tsc --noEmit`.
- `[x]` Generated preview image is saved to project entry
  - Notes:
    - 2025-10-03 20:21 – Auto-save payload now carries both `keyframe_image` and `reference_image`; coverage added in `storyboard.test.ts`. Keyframe generation updates scene state with the generated URL, ensuring project entries persist the preview.

## Video Rendering Readiness
- `[x]` Keyframe generator includes character references in payload
  - Notes:
    - 2025-10-03 20:22 – `handleKeyframeGeneration` now prioritizes per-scene reference images, and `buildSegmindGenerationPayload` tests confirm `shot_character` is populated. Verified with `npm test`.
- `[x]` Segmind generation receives character image URLs
  - Notes:
    - 2025-10-03 20:22 – Verified `segmind-generation` edge function forwards `shot_character` from payload and our keyframe flow supplies uploaded reference/character URLs. Covered by `shotDuration` unit tests and manual code review.
- `[x]` Resulting video tasks store all metadata for later rendering
  - Notes:
    - 2025-10-03 20:22 – Expanded storyboard serialization test to confirm shot prompts, generated assets, and costs persist in the project payload. Auto-save flow continues to update `projects.storyboard` with complete metadata.
