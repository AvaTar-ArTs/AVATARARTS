# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workspace Overview

This is Steven's creative AI business ecosystem containing 8 major revenue-generating projects plus supporting tools and content libraries. The repository houses both completed projects and an extensive collection of automation scripts, analysis tools, and content assets (9k+ images, 1,286 music tracks).

## Project Structure & Priorities

The workspace is organized by completion percentage:

1. **passive-income-empire/** (85%) - Multi-stream automation platform
2. **retention-suite-complete/** (80%) - Enterprise SaaS with 8 apps
3. **cleanconnect-complete/** (75%) - Airbnb cleaning marketplace
4. **heavenlyhands-complete/** (70%) - Premium cleaning services
5. **avatararts-complete/** (65%) - AI avatar/art platform
6. **quantumforge-complete/** (40%) - Media processing lab
7. **education/** (40%) - AI learning platform
8. **marketplace/** (40%) - NFT/POD content marketplace

Supporting directories:
- **tools/** - Consolidated toolkit (229MB, 1,493+ Python scripts, 98+ API integrations) - Merged from AvaTarArTs-Suite
- **music-empire/** - 1,286 tracks (783 unique, 43 hours), 9 Python automation scripts, DistroKid integration
- **ai-sites/** - Web properties and galleries
- **scripts/** - Automation and analysis tools
- **Portfolio/** - Auto-generated portfolio documentation (updated via GitHub Actions)
- **SEO_CONTENT_STRATEGY/** - SEO automation and content tools
- **archive/** - Reference files and backups (includes merged project archives)

## Tech Stack

**Backend:**
- Python 3.12 (primary) via Homebrew
- Node.js/Express for web services

**Frontend:**
- React 18 + Vite + TypeScript + Tailwind CSS

**Data:**
- PostgreSQL (production databases)
- SQLite (local analysis)
- CSV files (primary data interchange format)

**AI/ML:**
- OpenAI API (GPT models)
- Claude API (analysis, content generation)
- Voice agents throughout projects

**Real-time:**
- Socket.io, WebSockets

## Development Commands

### Environment Setup

```bash
# Load API keys (required for AI features)
source ~/.env.d/loader.sh llm-apis

# Keys are managed in ~/.env.d/ directory
# Never commit API keys to the repository
```

### Python Analysis Tools

The repository contains numerous analysis scripts that follow a common pattern:

```bash
# Run file inventory analyzer
python analyze_avatararts.py

# Generate CSV reports
python csv_analyzer.py
python batch_csv_analyzer.py

# Content analysis
python semantic_content_analyzer.py
python content_based_duplicate_analyzer.py

# Portfolio generation (also runs via GitHub Actions)
python scripts/build_portfolio.py .
```

### Music Empire Tools

```bash
cd music-empire/

# Available automation scripts:
python BATCH_ORGANIZE.py
python CLEANUP_AND_COMPARE.py
python DEEP_SEARCH_YOUR_CONTENT.py
python RECATEGORIZE_OTHER_MUSIC.py
```

### Dashboard Generation

Revenue tracking dashboards are HTML-based with visualizations:

```bash
# Generate analysis visualizations
python ai-sites/master_revenue_dashboard.py
python ai-sites/retention-products-suite/master_retention_dashboard.py

# Outputs go to analysis_visualizations/ or project-specific dirs
```

## Architecture Patterns

### CSV-Driven Analysis System

The codebase extensively uses CSV files as the primary data interchange format. Key patterns:

**Analysis Output Pattern:**
- Scripts scan directories/content → Generate timestamped CSV files
- CSV columns typically: filepath, size, type, category, metadata
- Files named with timestamps: `ANALYSIS_YYYYMMDD_HHMMSS.csv`

**Common CSV Categories:**
- `*_INVENTORY.csv` - Complete file listings
- `*_ANALYSIS.csv` - Categorized analysis results
- `*_ASSETS.csv` - Asset catalogs (images, audio, video)
- `*_DUPLICATES.csv` - Duplicate file detection
- `portfolio_descriptions.csv` - Auto-generated project catalog

### Python Script Categories

Scripts follow functional categorization visible in `build_portfolio.py`:

1. **AI & Machine Learning** - LLM integration, embeddings, model inference
2. **Automation & Workflows** - Task orchestration, batch processing
3. **Web Scraping & Data Collection** - API clients, web scrapers
4. **Data Analysis & Visualization** - Pandas, CSV processing, dashboards
5. **Music & Audio** - Track organization, discography management
6. **SEO & Marketing** - Keyword analysis, content optimization
7. **Web Development** - Flask/FastAPI services, HTML generation
8. **Database & Storage** - SQLite, PostgreSQL utilities
9. **File Processing** - CSV/JSON parsers, format converters
10. **Utilities & Tools** - CLI helpers, general scripts

### Portfolio Auto-Generation

The GitHub Actions workflow (`.github/workflows/portfolio-builder.yml`) automatically:
- Scans all Python files on push to main/master
- Extracts docstrings, categories, and metadata
- Generates `Portfolio/portfolio_descriptions.csv`
- Runs weekly via cron schedule
- Can be triggered manually via workflow_dispatch

### Dashboard & Visualization Pattern

Revenue/analytics dashboards follow this pattern:
- Python script generates JSON data
- HTML file with inline JavaScript renders visualizations
- Files stored in `analysis_visualizations/` or project dirs
- Naming: `*_dashboard.py` for generators, `*-dashboard.html` for outputs

## Code Conventions

### Python Style
- Use `black` formatter with 120 character line length
- Shebang: `#!/usr/bin/env python3`
- Docstrings at module and function level
- Type hints for function signatures (when adding new code)
- Exception handling: prefer specific exceptions, log errors

### File Organization
- Root-level Python scripts: analysis and one-off tools
- `scripts/` directory: reusable automation utilities
- Project-specific tools: within project subdirectories
- Generated files: timestamped naming convention

### CSV Generation
- Always include headers
- Use ISO timestamps: `YYYYMMDD_HHMMSS`
- Save with UTF-8 encoding
- Include summary stats in companion `.md` files

### Dashboard Generation
- Python generates data → JSON
- Separate HTML template with visualization library (Chart.js, D3.js, etc.)
- Self-contained HTML (inline CSS/JS) for portability
- Include data refresh timestamp

## Common Development Tasks

### Adding New Analysis Script

1. Follow existing pattern in root-level analyzer scripts
2. Output to CSV with timestamp
3. Generate companion markdown summary
4. Use `Path` from `pathlib` for cross-platform compatibility
5. Add docstring for portfolio auto-discovery

### Working with Projects

Each major project (passive-income-empire, retention-suite-complete, etc.) is self-contained:
- Check for project-specific README or START-HERE.md
- May have separate package.json or requirements.txt
- Database configs typically in project root
- Environment variables loaded from `~/.env.d/`

### Music Empire Organization

Music files organized by:
- Platform (suno, custom, etc.)
- Category (nocturnemelodies, etc.)
- Format (MP3, WAV)

Use existing scripts in `music-empire/` for batch operations. DistroKid integration expects specific file/folder structure.

### SEO Content Strategy

SEO tools located in `SEO_CONTENT_STRATEGY/`:
- Batch CSV analyzers for content inventory
- HTML+Sphinx documentation generators
- Keyword tracking and optimization tools

## Key Files & Their Purpose

- `analyze_avatararts.py` - Deep inventory of entire workspace
- `csv_analyzer.py` - CSV conversation analysis and improvement
- `semantic_content_analyzer.py` - AI-powered content categorization
- `scripts/build_portfolio.py` - Auto-generates portfolio from codebase
- `scripts/analyze_home_directory.py` - Home directory file analysis
- `scripts/analyze_scattered_files.py` - Identifies orphaned files
- `AVATARARTS_INVENTORY.csv` - Master file inventory (regenerate as needed)
- `Portfolio/portfolio_descriptions.csv` - Auto-generated project catalog

## External Dependencies

The workspace assumes these system dependencies:
- Python 3.12+ (via Homebrew on macOS)
- Node.js (for React projects)
- PostgreSQL (for production databases)
- Git (for version control and GitHub Actions)

API keys required (managed in `~/.env.d/`):
- OpenAI API key
- Claude API key (Anthropic)
- DistroKid credentials (for music distribution)
- Project-specific service credentials

## Testing & CI/CD

- GitHub Actions workflow for portfolio generation (weekly + on push)
- No formal test suite currently - scripts are primarily one-off analyzers
- Each major project may have project-specific tests

## Revenue Tracking

Revenue metrics tracked in:
- `*_dashboard.py` files
- HTML visualizations in `analysis_visualizations/`
- Project-specific tracking in each major project directory

Priority order for revenue maximization:
1. retention-suite-complete (highest potential: $50-150K/mo)
2. passive-income-empire (easiest to deploy: 2-3 days)
3. Other projects in completion order

## Notes for Claude Code

- This workspace contains extensive analysis scripts that generate CSV reports - when examining file operations, look for CSV output patterns
- The `~/.env.d/` system is external to this repo - API keys are loaded via shell scripts, never committed
- Portfolio auto-generation means `Portfolio/` directory will have automated commits from GitHub Actions
- Music empire has complex organization - use existing scripts rather than manual file operations
- Many Python scripts are standalone analyzers without external dependencies - can be run directly
