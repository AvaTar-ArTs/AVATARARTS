# Vault Ops Toolkit

A **hot-rising Obsidian workflow bundle**: keyword auto-linking, conditional properties, a simple review queue, trash restore, and macOS “open vault in terminal”.

This plugin is intentionally designed around workflows currently rising in the ecosystem:
- “Auto Keyword Linker” style linking (build backlinks without friction)
- “Conditional Properties” (note-type driven frontmatter scaffolding)
- “Note Reviewer / Task Marker / Habit Tracker” vibe: a lightweight review queue
- “Trash Explorer” convenience
- “Open in Terminal” dev-quality-of-life
- “Local REST API / Vault LLM Assistant” adjacent: designed to pair with automation + AI, without requiring internet.

## Features (v0.1)
1. **Auto Keyword Linker-lite**
   - Command: “Link keywords in current note…”
   - Configure a JSON map: keyword → target note
2. **Conditional Properties**
   - Command: “Apply conditional properties…”
   - Based on frontmatter key (default `type`)
3. **Review Queue**
   - Command: “Open next due review note”
   - Uses frontmatter date `reviewDue: YYYY-MM-DD`
4. **Open Vault in Terminal (macOS)**
   - Command: “Open vault folder in Terminal…”
5. **Trash Explorer**
   - Command: “Trash Explorer: list + restore”
   - Restores selected file to `/Restored/`

## Install (dev)
1. `npm i`
2. `npm run build`
3. Copy `main.js`, `manifest.json`, `styles.css` into:
   - `<vault>/.obsidian/plugins/vault-ops-toolkit/`

## Roadmap (easy wins)
- Per-folder keyword maps
- “Link keywords in folder” (batch)
- Review scoring + spaced repetition intervals
- Habit tracking (daily check-ins with streaks)
- Optional integration hooks for Local REST API (if installed)

## Notes
- Default is **Dry-run** to avoid surprise edits. Turn it off in settings when ready.
