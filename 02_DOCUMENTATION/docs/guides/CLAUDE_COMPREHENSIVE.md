# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workspace Overview

Steven's creative AI business ecosystem containing 8 revenue-generating projects plus a comprehensive Python automation library at `~/pythons` (760+ scripts).

## Project Priority (by completion)

| Project | Status | Description |
|---------|--------|-------------|
| passive-income-empire | 85% | Multi-stream automation platform (DEPLOYMENT READY) |
| retention-suite-complete | 80% | Enterprise SaaS for user retention |
| cleanconnect-complete | 75% | Airbnb cleaning marketplace (React/Express/PostgreSQL) |
| heavenlyhands-complete | 70% | Premium cleaning services |
| avatararts-complete | 65% | AI avatar/art platform (9k+ images) |
| quantumforge-complete | 40% | Media processing lab |
| education | 40% | AI learning platform |
| marketplace | 40% | NFT/POD content marketplace |

### Music Empire (Specialized)
- 1,286 original tracks (783 unique, 43 hours)
- Location: `~/Music/nocTurneMeLoDieS/` (symlinked to `music-empire/`)
- DistroKid integration ready

## Tech Stack Patterns

**Backend**: Python (primary), Node.js/Express
**Frontend**: React 18 + Vite + TypeScript + Tailwind CSS
**Database**: PostgreSQL, SQLite
**Real-time**: Socket.io, WebSockets
**AI Services**: OpenAI, Claude, Groq, Gemini, Grok, and 7 others (see below)

## Environment Setup

```bash
# Load all LLM API keys (12 services)
source ~/.env.d/loader.sh llm-apis
# Or use alias
loadllm

# Verify AI setup
python3 ~/pythons/check-ai-sdks.py

# Load audio/music APIs
source ~/.env.d/loader.sh audio-music
```

API keys managed via modular `~/.env.d/` system:
- `llm-apis.env` - All LLM keys (OpenAI, Anthropic, Groq, Gemini, XAI, etc.)
- `MASTER_CONSOLIDATED.env` - Full key inventory
- Individual `.env` files per service

## Python Environment

- **Version**: Python 3.12 via Homebrew
- **Package Manager**: Mamba (conda alternative)
- **Shell**: Zsh on macOS

## Common Commands

### CleanConnect (~/workspace/cleanconnect-complete)
```bash
yarn dev          # Start both frontend + backend
yarn dev:api      # Backend only (Express)
yarn dev:frontend # Frontend only (Vite)
yarn build        # Production build
yarn test         # Run tests
yarn migrate      # Database migrations
```

### Passive Income Empire
```bash
./setup_environment.sh     # First-time setup
./launch_empire.sh         # Launch all systems
python revenue_dashboard.py # View revenue metrics
```

### Python Scripts (~/pythons)
```bash
# Run any script
python3 ~/pythons/script-name.py

# Key categories available:
# - transcribe/ (30+ scripts) - Audio/video transcription
# - _library/ - Reusable modules (api, core, media, generators, etc.)
# - instagram-*.py - Social media automation
# - leonardo-*.py - AI image generation
# - content-*.py - Content creation pipelines
```

## Code Conventions

### Python
- Black formatting, 120 char line length
- Use descriptive variable names (avoid `CONSTANT_*` style)
- Use `pathlib.Path` for file paths (not string concatenation)
- Environment variables loaded from `~/.env.d/`
- Use `print()` for output (not undefined `logger`)

### JavaScript/TypeScript
- ESLint + Prettier
- React functional components with hooks
- Tailwind for styling

### Git
- Branch: master
- Commit style: Emoji prefixes (add, fix, refactor, docs, test)
- Always stage and commit with descriptive messages
- Ask before pushing to remote

## Directory Structure

```
~/workspace/
├── passive-income-empire/       # Multi-stream automation (85%)
├── retention-suite-complete/    # SaaS retention tools (80%)
├── cleanconnect-complete/       # Airbnb marketplace (75%)
├── heavenlyhands-complete/      # Cleaning services (70%)
├── avatararts-complete/         # AI art platform (65%)
├── quantumforge-complete/       # Media processing (40%)
├── education/                   # Learning platform (40%)
├── marketplace/                 # NFT/POD (40%)
├── music-empire/               # Symlink → ~/Music/nocTurneMeLoDieS
├── ai-voice-agents/            # Voice AI systems
├── csvs-consolidated/          # Data files
├── archive/                    # Old versions/reference
└── scripts/                    # Helper utilities

~/pythons/                      # 760+ automation scripts
├── transcribe/                 # Audio transcription pipeline
├── _library/                   # Reusable Python modules
│   ├── api/                    # API clients
│   ├── core/                   # Core utilities
│   ├── media/                  # Media processing
│   ├── generators/             # Content generators
│   ├── instagram/              # IG automation
│   └── utilities/              # General utils
├── _analysis/                  # Analysis reports
├── _docs/                      # Documentation
└── [categorized scripts]       # By function (leonardo-, instagram-, etc.)
```

## AI Services Available (12 configured)

| Service | Variable | SDK |
|---------|----------|-----|
| OpenAI | `OPENAI_API_KEY` | openai |
| Claude | `ANTHROPIC_API_KEY` | anthropic |
| Grok | `XAI_API_KEY` | Uses OpenAI SDK (base_url: api.x.ai) |
| Groq | `GROQ_API_KEY` | groq |
| Gemini | `GEMINI_API_KEY` | google-generativeai |
| DeepSeek | `DEEPSEEK_API_KEY` | Uses OpenAI SDK |
| Perplexity | `PERPLEXITY_API_KEY` | llm-perplexity |
| Mistral | `MISTRAL_API_KEY` | - |
| Cohere | `COHERE_API_KEY` | cohere |
| OpenRouter | `OPENROUTER_API_KEY` | - |
| Together AI | `TOGETHER_API_KEY` | - |
| Cerebras | `CEREBRAS_API_KEY` | - |

## Session Handoff Protocol

Before ending sessions, create `HANDOFF_PROMPT.md` with:
- Context summary
- Completed work
- Key files modified
- Next steps
- Quick commands

```bash
# Copy handoff to clipboard
cat HANDOFF_PROMPT.md | pbcopy
```

## Integration Points

- `passive-income-empire/` connects to `music-empire/` for music licensing
- `cleanconnect-complete/` shares leads with `passive-income-empire/`
- All projects use common `~/.env.d/` API key system
- Dashboards use HTML + visualizations in `analysis_visualizations/`
- Revenue tracking in `*_dashboard.py` files
