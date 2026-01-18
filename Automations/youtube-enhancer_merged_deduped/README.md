# YouTube Enhancer — merged + deduped

This folder is a clean merge of 8 uploaded ZIPs (`youtube-enhancer(1..8).zip`) with duplicates removed.

## What changed
- **No content changes** to the files — only deduplication + a tidy folder layout:
  - `src/` contains JavaScript files
  - `docs/` contains Markdown documentation

## Files included
- `src/youtube-enhancer-v8.1.0.js`
- `src/youtube-enhancer-improved.js`
- `docs/youtube-enhancer-analysis.md`
- `docs/youtube-enhancer-quick-reference.md`
- `docs/WHATS-NEW.md`
- `docs/CHANGELOG-v8.1.0.md`

## Integrity
See `manifest.json` for SHA-256 hashes and which original ZIP(s) each file came from.

## Quick use (generic)
If these scripts are meant for a browser extension/userscript:
1. Review the code in `src/` (security first).
2. Use your preferred manager (e.g., Tampermonkey/Violentmonkey) or extension build flow.
3. If you’re unsure which script is “the one”, start with the versioned file: `youtube-enhancer-v8.1.0.js`.
