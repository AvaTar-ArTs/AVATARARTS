# Markdown Archive (Static Site Builder)

A tiny, dependency-light tool to turn a folder of Markdown files into a **static, searchable archive** you can open locally or host on GitHub Pages/Netlify.

## Features
- Recursively scans your folder for `*.md`
- Extracts title, date (file mtime), tags (YAML front matter `tags:` if present)
- Renders each file to a clean HTML page (with dark theme)
- Generates:
  - `index.html` (sortable list + quick filter)
  - `search.html` + `search_index.json` (client-side search, no external CDNs)
  - `archive.db` (optional SQLite FTS5 for CLI queries)
- Handles weird filenames/spaces/emoji safely by hashing the relative path in output file names
- Zero JavaScript frameworks; everything is **static**

## Install (macOS)
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

> Optional: For CLI search via SQLite FTS, Python's built-in `sqlite3` is used; most macOS Python builds include it.

## Build
```bash
python build_archive.py --src "/Users/steven/Documents/markD" --out "./site" --serve
```
- Open `./site/index.html` in your browser.
- Set `--base-url "/my/subpath/"` if you plan to host under a subdirectory.

## CLI FTS Search (optional)
```bash
# After a build (which created site/archive.db)
python - <<'PY'
import sqlite3, sys
conn = sqlite3.connect("site/archive.db")
q = "project AND 2025"  # your query
for row in conn.execute("SELECT title, path FROM docs WHERE docs MATCH ?", (q,)):
    print(row)
PY
```

## Notes
- Titles are taken from the first `# Heading` in the file, or the first non-empty line, or the filename.
- Tags are read from YAML front matter if you have it:
  ```yaml
  ---
  title: Example
  tags: [python, notes]
  date: 2025-09-01 12:00
  ---
  ```
- Content rendering uses Python `markdown` with `extra`, `tables`, and `fenced_code` extensions.
- For very large archives, the client-side search scans a compact index (`title/tags/excerpt`). It’s instant for a few thousand docs. For giant corpuses, consider wiring the SQLite DB to a tiny Flask API instead.

## Host on GitHub Pages
- Commit the `site/` folder to a branch hosted by Pages, or put the builder in a GitHub Action to run on push.
- Since everything is static, no server is required.

## Rebuild/Refresh
Run the same build command again. The script overwrites output files each time.

---

**Made for Steven (TechnoMancer) ⚡** — plug in your `/Users/steven/Documents/markD` and go.
