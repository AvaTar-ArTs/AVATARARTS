# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is Steven's home directory containing multiple interconnected projects and systems:
- **Workspace** (`~/workspace/`) - 8 major AI business projects (75-85% complete)
- **Harbor** (`~/.harbor/`) - Containerized LLM toolkit with Boost proxy and Tauri app
- **Environment Management** (`~/.env.d/`) - Centralized API key and configuration system
- **Analysis Tools** - Python scripts for home directory analysis and organization

## Key Directories

### Workspace Projects (Priority Order)
```
~/workspace/
├── passive-income-empire/       (85%) - Multi-stream automation platform
├── retention-suite-complete/    (80%) - Enterprise SaaS for user retention
├── cleanconnect-complete/       (75%) - Airbnb cleaning marketplace
├── heavenlyhands-complete/      (70%) - Premium cleaning services
├── avatararts-complete/         (65%) - AI avatar/art platform
├── quantumforge-complete/       (40%) - Media processing lab
├── education/                   (40%) - AI learning platform
└── marketplace/                 (40%) - NFT/POD content marketplace
```

### Harbor LLM Toolkit
```
~/.harbor/
├── app/              - Tauri desktop application
├── boost/            - LLM proxy with OpenAI-compatible API
├── docs/             - Comprehensive documentation
└── .scripts/         - Development and management scripts
```

### Environment Management
```
~/.env.d/
├── API_AUDIT_REPORT.md          - Security audit documentation
├── MASTER_CONSOLIDATED.txt      - Consolidated environment variables
├── loader.sh                    - Environment variable loader
└── *.env, *.env.bak            - API keys and configurations
```

## Development Commands

### Workspace Projects

**Passive Income Empire**
```bash
cd ~/workspace/passive-income-empire
./setup_environment.sh     # First-time setup
./launch_empire.sh         # Launch all systems
python revenue_dashboard.py # View revenue metrics
```

**CleanConnect Pro**
```bash
cd ~/workspace/cleanconnect-complete
yarn dev          # Start both frontend + backend
yarn dev:api      # Backend only
yarn dev:frontend # Frontend only
yarn build        # Production build
yarn test         # Run all tests
```

**AvatarArts**
```bash
cd ~/workspace/avatararts-complete
python gallery_init.py     # Initialize gallery
python DaLL-E/sort.py      # Sort AI-generated images
```

### Harbor Development

**Harbor App (Tauri)**
```bash
cd ~/.harbor/app
bun install                # Install dependencies
bun tauri dev             # Development mode
bun tauri build           # Production build
```

**Harbor Boost**
```bash
harbor build boost        # Pre-build the image
harbor up boost           # Start the service
harbor url boost          # Get service URL
harbor open boost         # Open in browser
```

## Environment Setup

### API Key Management
All API keys are managed through the centralized `~/.env.d/` system:

```bash
# Load specific environment groups
source ~/.env.d/loader.sh llm-apis
source ~/.env.d/loader.sh audio-music
source ~/.env.d/loader.sh vector-memory

# Check available keys
ls ~/.env.d/*.env
```

### Python Environment
- Primary Python version: 3.12 (via Homebrew)
- Formatting: black with 120 character line length
- Analysis tools use standard Python libraries

### Node.js Projects
- React 18 + Vite + TypeScript + Tailwind CSS
- Express.js backend with PostgreSQL
- Socket.io for real-time features

## Architecture Patterns

### Common Tech Stack
- **Backend**: Python (primary), Node.js/Express
- **Frontend**: React 18 + Vite + TypeScript + Tailwind
- **Database**: PostgreSQL, SQLite
- **Real-time**: Socket.io, WebSockets
- **AI**: OpenAI, Claude, voice agents throughout

### Project Structure
- Each workspace project has its own `CLAUDE.md` with specific instructions
- Shared utilities in `~/workspace/scripts/`
- Documentation in `~/workspace/docs/`
- Archive in `~/workspace/archive/`

### Harbor Integration
- Harbor Boost acts as OpenAI-compatible proxy for LLM services
- Custom modules in `~/.harbor/boost/src/custom_modules/`
- Tauri app provides GUI for service management

## Security Notes

- API keys are stored in `~/.env.d/` with restricted permissions
- Backup files (`.env.bak`) may contain old keys - rotate periodically
- Use `chmod 700 ~/.env.d` and `chmod 600 ~/.env.d/*.env*` for security

## Analysis Tools

Several Python scripts exist for home directory analysis:

```bash
python3 analyze_home_fast.py          # Fast priority directory scan
python3 analyze_home_directory.py     # Full deep analysis
python3 view_analysis_results.py      # View analysis results
./quick_scan_key_files.sh             # Quick bash scan
```

## Music Empire

Specialized music production system:
- 1,286 original tracks (783 unique, 43 hours)
- DistroKid integration ready
- 9 Python automation scripts in `music-empire/`

## Conventions

- Use existing patterns in each project's `CLAUDE.md`
- Python: black formatting, 120 char lines
- Dashboards use HTML + visualizations in `analysis_visualizations/`
- Revenue tracking in `*_dashboard.py` files
- Project-specific documentation in each project's `documentation/` folder

## Getting Started

1. **Review project priorities** in `~/workspace/00_README.md`
2. **Check individual project** `CLAUDE.md` files for specific instructions
3. **Load environment** with `source ~/.env.d/loader.sh llm-apis`
4. **Follow project-specific** setup and development commands