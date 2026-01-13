# Copilot Instructions for Advanced Toolkit

## Project Overview

**Advanced File Management Toolkit** — Python-based intelligent system for organizing, analyzing, and managing files with specialized support for music libraries (esp. Suno/AvatarArts generated content). The codebase combines file fingerprinting, content classification, and metadata extraction across multiple file types.

## Architecture & Data Flow

### Core Components (interconnected)

1. **`file_intelligence.py`** — Foundation engine
   - `FileIntelligenceDB`: SQLite schema with files, relationships, hashes (MD5, SHA256)
   - `FileAnalyzer`: Scans directories, builds fingerprints, extracts metadata
   - `FileFingerprint`: Dataclass holding size, hashes, MIME type, language, encoding, line_count, and relationship lists
   - Indexes on: `hash_md5`, `hash_sha256`, `extension`, `mime_type` for fast lookups

2. **`smart_organizer.py`** — Organization orchestration
   - `SmartOrganizer`: Groups files by category/content type, handles dry-run vs. execute modes
   - `DuplicateManager`: Finds duplicate sets via hashing, supports selective removal
   - `ContentGrouper`: Clusters related files (e.g., multi-part series, remixes)

3. **`suno_organizer.py`** — Music-specific workflows
   - `SunoOrganizer`: Detects genre (cinematic, ambient, electronic, folk, rock, classical, hip_hop, jazz, world, pop, experimental) and mood (dark, uplifting, melancholic, energetic, peaceful, mysterious)
   - Pattern matching on filenames for versions, parts, dates, remixes, variations, sections
   - Organizes into `SUNO_BY_GENRE/` and `SUNO_BY_SERIES/` structures

4. **`master_control.py`** — CLI entry point
   - Commands: `scan`, `stats`, `duplicates`, `remove-duplicates`, `organize`, `analyze`, `related`, `export`
   - **Workflow**: Always dry-run first (`--dry-run` flag), then execute

5. **`config_manager.py`** — Configuration loader
   - Loads from `~/.env.d/` directory (.env files + config.json)
   - Supports API keys: `SERVICE_API_KEY`, `SERVICE_TOKEN`, `SERVICE_SECRET`
   - Pattern: `get_api_key(service)`, `get(key, default)`

### Data Storage

- **SQLite DB**: `~/.file_intelligence.db` (persistent across runs)
- **API Keys**: `~/.env.d/*.env` files (never committed)
- **Exports**: JSON reports (via `master_control export`)

## Critical Developer Workflows

### 1. Scanning & Analysis
```bash
python master_control.py scan ~/Music          # Populate DB
python master_control.py stats                 # Show file breakdown
python master_control.py analyze ~/Music/file.mp3  # Inspect single file
```

### 2. Finding & Removing Duplicates
```bash
python master_control.py duplicates --min-size 1024     # Dry-run: find duplicates
python master_control.py remove-duplicates --dry-run    # Preview removal
python master_control.py remove-duplicates              # Execute removal
```

### 3. Suno Music Organization
```bash
python suno_organizer.py scan                  # Detect genre/mood/series
python suno_organizer.py organize              # Dry-run: show proposed structure
python suno_organizer.py organize --execute    # Execute organization
python suno_organizer.py catalog               # Generate suno_catalog.json
```

### 4. General File Organization
```bash
python master_control.py organize ~/Downloads --dry-run
python master_control.py organize ~/Downloads  # Execute
```

## Project-Specific Conventions

### Naming & Organization
- **Suno songs**: Located in `~/Music/nocTurneMeLoDieS/FINAL_ORGANIZED/YOUR_SUNO_SONGS/`
- **Output structure**: Genre/mood hierarchies (e.g., `CINEMATIC/dark/`, `AMBIENT/peaceful/`)
- **Series detection**: Extracts base name from patterns like `song-v2`, `song-part-1`, `song-remix`

### Dry-Run Pattern (Critical)
- **All destructive operations must support `--dry-run` flag** (e.g., `organize`, `remove-duplicates`)
- Dry-run outputs proposed changes without modifying files
- Users always inspect dry-run output before executing

### Database Design
- Hashes used as deduplication keys; relationships stored in SQL table, not filesystem
- MIME type detection via `mimetypes` module + fallback to `file` command
- Metadata extraction: mutagen for audio, chardet for encoding, AST for Python files

### API Integration
- Config manager loads from `~/.env.d/`; no hardcoded credentials
- Pattern: check `config.has_api_key(service)` before attempting API calls
- Support graceful degradation if API keys missing

### Error Handling
- Invalid paths: exit early with error message
- Missing API keys: warn but continue with default behavior
- Database corruption: fail fast with clear diagnostics

## Key Files & Patterns

| File | Purpose | Example Usage |
|------|---------|----------------|
| `file_intelligence.py` | Core fingerprinting & relationship detection | Import `FileAnalyzer`; call `scan_directory()` |
| `config_manager.py` | Load API keys & settings from `~/.env.d/` | `get_config()` → `get_api_key('SPOTIFY')` |
| `suno_organizer.py` | Genre/mood classification for music | `SunoOrganizer().scan_suno_library()` |
| `smart_organizer.py` | Dry-run + execute organization | `SmartOrganizer().organize(dry_run=True)` |
| `master_control.py` | Unified CLI interface | Entry point; routes subcommands |
| `README.md` | User quickstart & feature overview | Start here for setup instructions |
| `QUICKSTART.md` | Step-by-step workflows | Copy-paste command examples |
| `INTEGRATION_GUIDE.md` | How toolkit integrates with existing music empire | Context on folder structure |

## Common Implementation Patterns

### Adding a New Organizer
1. Inherit from `SmartOrganizer` base
2. Override `_categorize()` to define classification rules
3. Implement dry-run logic: return proposed moves without executing
4. Add CLI entry in `master_control.py` if top-level command needed

### Extending File Analysis
1. Add new fields to `FileFingerprint` dataclass
2. Extend `FileIntelligenceDB._init_schema()` SQL table if persistent storage needed
3. Populate new fields in `FileAnalyzer.scan_directory()` loop
4. Update `get_statistics()` to include new metrics

### Adding API Integration
1. Store credentials in `~/.env.d/SERVICE.env` (e.g., `SPOTIFY_API_KEY=...`)
2. Load via `config.get_api_key('SPOTIFY')`
3. Wrap API calls in try-except; gracefully degrade if key missing or rate-limited

## Common Pitfalls

- **Forgetting `--dry-run`**: Always run organize/remove-duplicates with dry-run flag first
- **Hardcoded paths**: Use `Path.home()` + `config` manager; never hardcode home directory
- **DB locking**: SQLite can have contention; avoid concurrent writes to `~/.file_intelligence.db`
- **API credential leaks**: Never commit `.env` files or secrets to git
- **Path expansion**: Use `.expanduser()` and `.resolve()` to handle `~` and symlinks
