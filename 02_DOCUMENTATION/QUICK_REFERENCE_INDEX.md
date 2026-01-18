# Quick Reference Index

**Quick lookup guide for Python Automation Repositories**

---

## 📊 By Numbers

| Metric | pythons | pythons-sort |
|--------|---------|--------------|
| **Python Files** | 777 | 3,299+ |
| **Functions** | 4,515 | - |
| **Classes** | 427 | - |
| **Root Scripts** | 172 | 1 (CLI) |
| **Organize Scripts** | 66 | - |
| **Cleanup Scripts** | 46 | - |
| **Platform Integrations** | - | 12+ |
| **Service Integrations** | - | 14+ |

---

## 🗂️ Directory Quick Lookup

### pythons/ - Top Level Categories

| Directory | Purpose | File Count |
|-----------|---------|------------|
| `AI_CONTENT/` | AI generation, LLM orchestration | 3 |
| `AUTOMATION_BOTS/` | Social media, YouTube automation | 3 |
| `MEDIA_PROCESSING/` | Video, audio, image processing | 12 |
| `DATA_UTILITIES/` | Analyzers, data tools | Largest |
| `file_organization/` | Organizers, renamers, cleaners | 43 |
| `code_analysis/` | Code quality, complexity, AST | 24 |
| `audio_generation/` | TTS, music generation | 1 |
| `audio_transcription/` | Whisper, AssemblyAI, Deepgram | - |
| `audio_video_conversion/` | FFmpeg, format converters | 28 |
| `content_creation/` | Content generators, SEO tools | - |
| `utilities/` | General helpers, CLI tools | - |
| `documentation/` | Documentation generators | 13 |

### pythons-sort/ - Organized Structure

| Directory | Purpose | Tool Count |
|-----------|---------|------------|
| `src/tools/analysis/` | Code analysis tools | 653 |
| `src/tools/cleanup/` | File cleanup tools | 703 |
| `src/tools/dedup/` | Duplicate detection | 955 |
| `src/tools/rename/` | Renaming utilities | 113 |
| `src/tools/scanners/` | File scanning tools | 875 |
| `platforms/` | Platform integrations | 12+ |
| `services/` | AI/ML service integrations | 14+ |

---

## 🔍 Find Tools By Task

### I want to...

**Organize files**
- → `pythons/file_organization/` (43 files)
- → `pythons-sort/src/tools/cleanup/` (703 tools)

**Find duplicates**
- → `pythons/file_organization/` (15+ scripts)
- → `pythons-sort/src/tools/dedup/` (955 tools)

**Analyze code**
- → `pythons/code_analysis/` (24 files)
- → `pythons-sort/src/tools/analysis/` (653 tools)

**Process media**
- → `pythons/MEDIA_PROCESSING/` (12 files)
- → `pythons/audio_video_conversion/` (28 files)

**Use AI services**
- → `pythons/AI_CONTENT/` (3 files)
- → `pythons-sort/services/` (14+ services)

**Automate platforms**
- → `pythons/AUTOMATION_BOTS/` (3 files)
- → `pythons-sort/platforms/` (12+ platforms)

**Clean up files**
- → `pythons/file_organization/` (46+ cleanup scripts)
- → `pythons-sort/src/tools/cleanup/` (703 tools)

**Rename files**
- → `pythons-sort/src/tools/rename/` (113 tools)

**Scan files**
- → `pythons-sort/src/tools/scanners/` (875 tools)

---

## 🤖 Platform Integrations

| Platform | Location |
|----------|----------|
| Etsy | `pythons-sort/platforms/etsy/` |
| GitHub | `pythons-sort/platforms/github/` |
| Instagram | `pythons-sort/platforms/instagram/` |
| Medium | `pythons-sort/platforms/medium/` |
| Notion | `pythons-sort/platforms/notion/` |
| Reddit | `pythons-sort/platforms/reddit/` |
| Spotify | `pythons-sort/platforms/spotify/` |
| Telegram | `pythons-sort/platforms/telegram/` |
| TikTok | `pythons-sort/platforms/tiktok/` |
| Twitch | `pythons-sort/platforms/twitch/` |
| Twitter | `pythons-sort/platforms/twitter/` |
| Upwork | `pythons-sort/platforms/upwork/` |
| YouTube | `pythons-sort/platforms/youtube/` |

---

## 🔌 AI/ML Service Integrations

| Service | Location |
|---------|----------|
| AssemblyAI | `pythons-sort/services/assemblyai/` |
| AWS | `pythons-sort/services/aws/` |
| Claude (Anthropic) | `pythons-sort/services/claude/` |
| Gemini (Google) | `pythons-sort/services/gemini/` |
| Groq | `pythons-sort/services/groq/` |
| HuggingFace | `pythons-sort/services/huggingface/` |
| Leonardo | `pythons-sort/services/leonardo/` |
| Ollama | `pythons-sort/services/ollama/` |
| OpenAI | `pythons-sort/services/openai/` |
| Perplexity | `pythons-sort/services/perplexity/` |
| Replicate | `pythons-sort/services/replicate/` |
| Stability AI | `pythons-sort/services/stability/` |
| xAI | `pythons-sort/services/xai/` |

---

## 🛠️ Helper Scripts

| Script | Purpose | Location |
|--------|---------|----------|
| `categorize_root_scripts.py` | Auto-categorize root scripts | `pythons/` |
| `find_duplicate_scripts.py` | Find duplicate scripts | `pythons/` |
| `generate_inventory.py` | Generate inventory | `pythons/` |
| `pythons_sort.py` | Main CLI entry point | `pythons-sort/` |

---

## 📝 Documentation Files

| File | Purpose | Location |
|------|---------|----------|
| `ANALYSIS_REPORT.md` | Comprehensive analysis | `/Users/steven/` |
| `ACTIONABLE_SUGGESTIONS.md` | Implementation suggestions | `/Users/steven/` |
| `QUICK_START.md` | Quick reference guide | `/Users/steven/` |
| `MASTER_INDEX.md` | Complete index | `/Users/steven/` |
| `QUICK_REFERENCE_INDEX.md` | This file | `/Users/steven/` |
| `DEEP_DIVE_ANALYSIS_2025-01-02.md` | Deep dive analysis | `pythons/` |
| `Python Automation Framework.md` | Framework overview | `pythons-sort/` |

---

## 📊 Data Files

| File | Purpose | Location |
|------|---------|----------|
| `inventory.json` | Complete script inventory (JSON) | `pythons/` |
| `inventory.csv` | Complete script inventory (CSV) | `pythons/` |
| `pythons-scan-audio-2025-12-27.csv` | Audio scan results | `pythons/` |
| `pythons-scan-docs-2025-12-29.csv` | Documentation scan results | `pythons/` |
| `BEFORE_AFTER.csv` | Improvement tracking | `pythons-sort/` |

---

## 🎯 Common Tasks Quick Reference

### Clean up root directory
```bash
cd /Users/steven/pythons
python categorize_root_scripts.py --dry-run  # Preview
python categorize_root_scripts.py --execute  # Execute
```

### Find duplicates
```bash
cd /Users/steven/pythons
python find_duplicate_scripts.py --all  # Find all
python find_duplicate_scripts.py --all --delete  # Delete
```

### Generate inventory
```bash
cd /Users/steven/pythons
python generate_inventory.py  # Creates JSON and CSV
```

### Use pythons-sort CLI
```bash
cd /Users/steven/pythons-sort
python pythons_sort.py analyze <path>
python pythons_sort.py cleanup <path>
python pythons_sort.py dedup <path>
python pythons_sort.py organize <path>
```

---

## 🔢 Script Counts by Category

### pythons/ - Root Level
- **Organize scripts:** 66+
- **Cleanup scripts:** 46+
- **Analyzer scripts:** 26+
- **Duplicate finders:** 15+
- **Total root scripts:** 172

### pythons/ - By Directory
- **file_organization/:** 43 files
- **code_analysis/:** 24 files
- **audio_video_conversion/:** 28 files
- **documentation/:** 13 files
- **AUTOMATION_BOTS/bot_tools/:** 15 files
- **upload/:** 28 files

### pythons-sort/ - By Category
- **analysis/:** 653 tools
- **cleanup/:** 703 tools
- **dedup/:** 955 tools
- **rename/:** 113 tools
- **scanners/:** 875 tools

---

## 🚀 Quick Start Commands

```bash
# Navigate to pythons
cd /Users/steven/pythons

# Preview categorization
python categorize_root_scripts.py

# Find duplicates
python find_duplicate_scripts.py --all

# Generate inventory
python generate_inventory.py

# Navigate to pythons-sort
cd /Users/steven/pythons-sort

# Use CLI
python pythons_sort.py info --all
python pythons_sort.py analyze <path>
```

---

**Last Updated:** January 2025
**For detailed information:** See `MASTER_INDEX.md`

