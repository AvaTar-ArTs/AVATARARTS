# 🧠 Intelligence Tools

Unified intelligent content-analysis system for your entire home directory.

## Files

- **`master_content_analyzer.py`** - Master analyzer for 25+ directories (Documents, GitHub, workspace, Music, Pictures, etc.)
- **`intelligent_documents_analyzer.py`** - Specialized analyzer for Documents directory with deep semantic analysis
- **`README.md`** - This file

## Quick Start

```bash
# Load required APIs
source ~/.env.d/loader.sh llm-apis vector-memory

# Master analyzer - Process all 25+ directories
python ~/intelligence/master_content_analyzer.py --all --limit 10
python ~/intelligence/master_content_analyzer.py --dir "Documents"
python ~/intelligence/master_content_analyzer.py --list
python ~/intelligence/master_content_analyzer.py --report

# Documents analyzer - Deep semantic analysis of Documents folder
python ~/intelligence/intelligent_documents_analyzer.py --analyze-all
python ~/intelligence/intelligent_documents_analyzer.py --process-new
python ~/intelligence/intelligent_documents_analyzer.py --search "API keys setup"
python ~/intelligence/intelligent_documents_analyzer.py --report
```

## Directory Structure

```
~/intelligence/                    ← All intelligence scripts (this folder)
  ├── master_content_analyzer.py   (Master analyzer for all directories)
  ├── intelligent_documents_analyzer.py  (Documents-specific deep analysis)
  └── README.md

~/Documents/.intelligence/         ← Hidden metadata (Documents analysis cache/results)
  └── (analysis results, cache files, metadata.json)

~/.intelligence/                  ← Master metadata (if needed)
  └── (master analysis metadata, results/)
```

## Utility Scripts

- **`scan_hidden_folders.py`** - Scan and analyze hidden folders
- **`cleanup_history.sh`** - Clean old history files

## Related Tools

- **`~/.env.d/`** - Environment management scripts (loader.sh, envctl.py, etc.)

## Hidden Folders Reference

### User Scripts (Visible)
- `~/intelligence/` - All intelligence scripts ✅

### Metadata (Hidden - Correct)
- `~/Documents/.intelligence/` - Analysis cache/results
- `~/.intelligence/` - Master metadata (if exists)

### System Scripts (Hidden - Correct)
- `~/.n8n/` - n8n service scripts (setup.sh, service.sh, start.sh)
- `~/.chatgpt/scripts/` - ChatGPT extension scripts
- `~/.claude/shell-snapshots/` - Claude shell snapshots

### History/Backups (Hidden - Correct)
- `~/.history/` - File history/backups (35+ files)
  - Use `cleanup_history.sh` to clean old files

### Config/Cache (Hidden - Correct)
- `~/.config/`, `~/.cache/`, `~/.local/` - System config/cache
- `~/.grok/`, `~/.gemini/`, `~/.claude/` - AI tool configs

## Requirements

```bash
pip install openai anthropic qdrant-client chromadb
```

## API Keys Needed

- `OPENAI_API_KEY` - For embeddings and summaries
- `ANTHROPIC_API_KEY` - For topic extraction  
- Qdrant running on localhost:6333 (optional, for vector search)

