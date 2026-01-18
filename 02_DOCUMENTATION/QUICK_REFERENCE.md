# ⚡ Quick Reference - Your Development Environment

```
╔═══════════════════════════════════════════════════════════════════╗
║                  STEVEN'S MODULAR DEV ENVIRONMENT                 ║
║                    "Everything Just Works™"                       ║
╚═══════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────┐
│  ~/.zshrc (1,346 lines)                                         │
│  ┌───────────┬───────────┬───────────┬───────────┬───────────┐  │
│  │  Lazy     │  Modern   │  Python   │   File    │   Smart   │  │
│  │  Loading  │   CLI     │   Mgmt    │  Scanning │   Venv    │  │
│  └───────────┴───────────┴───────────┴───────────┴───────────┘  │
│       ↓            ↓           ↓           ↓           ↓         │
│     brew         eza        3.11/3.12    scan      auto-cd      │
│     ngrok        bat       auto-venv     CSV      activate      │
│                  fzf        tobase                               │
└─────────────────────────────────────────────────────────────────┘
                               ↓
                ┌──────────────┴──────────────┐
                ↓                             ↓
┌──────────────────────────┐    ┌──────────────────────────┐
│  ~/.env.d/ (20 files)    │    │  ~/pythons/ (39 dirs)    │
│  ┌────────────────────┐  │    │  ┌────────────────────┐  │
│  │ llm-apis.env       │  │    │  │ AI_CONTENT/        │  │
│  │ art-vision.env     │  │    │  │ MEDIA_PROCESSING/  │  │
│  │ audio-music.env    │  │    │  │ AUTOMATION_BOTS/   │  │
│  │ automation-*.env   │  │    │  │ DATA_UTILITIES/    │  │
│  │ cloud-*.env        │  │    │  │ content_creation/  │  │
│  │ + 15 more...       │  │    │  │ + 34 more...       │  │
│  └────────────────────┘  │    │  └────────────────────┘  │
│  ┌────────────────────┐  │    │  ┌────────────────────┐  │
│  │ envctl.py          │  │    │  │ 586 Python files   │  │
│  │ loader.sh          │  │    │  │ 424 Markdown docs  │  │
│  │ backup_manager.py  │  │    │  │ 158 Text files     │  │
│  └────────────────────┘  │    │  └────────────────────┘  │
└──────────────────────────┘    └──────────────────────────┘
```

---

## 📚 Command Categories

### 🔑 Environment Management
```bash
loadllm              # Load LLM APIs (OpenAI, Anthropic, Groq)
loadai               # Load all AI services
loadmedia            # Load art + audio services
loaddev              # Load cloud + dev tools

env-update <cat>     # Edit → Rebuild → Reload (one command!)
envctl validate      # Check for issues
envctl list          # Show all categories
summon env           # Interactive picker (FZF)

env-quick            # Show QUICKSTART.md
env-help             # Show CHEATSHEET.txt
```

### 🐍 Python Development
```bash
venv [3.11|3.12]     # Create venv with specific Python
venv-setup           # Create venv + install requirements
init-project         # Full project initialization
reqs [--force]       # Generate + install requirements

pclean [dir]         # Remove venv, return to base
tobase               # Deactivate all environments
pyenv-status         # Show current Python environment
```

### 📁 File Operations
```bash
scan <type> <dir>    # Scan files, generate CSV
                     # Types: audio, docs, images, videos, other, all
organize-files       # Organize from CSV

# Examples:
scan all ~/Downloads
scan videos /Volumes/2T-Xx
organize-files /path/to/scan.csv ~/Destination
```

### 🤖 AI Tools
```bash
grok                 # Interactive Grok CLI
grok --print "..."   # One-shot query
ask-grok            # Alias for grok
ai                   # Smart AI selector (OpenAI/Claude/Grok)

# Aliases from pythons/
py-ai --target <dir> # AI-powered code analysis
py-analyze <file>    # Comprehensive analysis
```

### 📊 System Utilities
```bash
alias-stats          # Show most-used commands
pyenv-status         # Python environment info
envstatus            # Show loaded API keys
checkdefault         # Check default LLM APIs

cleanup-conda-configs # Clean up old conda/mamba
```

### 🎨 Modern CLI Tools
```bash
ll                   # eza -la --icons --git
lt                   # eza -la --icons --git --sort=modified
tree                 # eza --tree --icons
cat                  # bat --style=auto (syntax highlighted)
z <dir>              # zoxide smart cd
```

---

## 🚀 Common Workflows

### Start AI Project
```bash
mkdir ~/my-ai-project && cd ~/my-ai-project
loadai               # Load all AI APIs
init-project         # Create venv, setup requirements
# ✅ Auto-activated: my-ai-project
python my_script.py
```

### Scan & Organize Files
```bash
scan all /Volumes/MyDrive
# Review CSVs, then organize:
organize-files /Volumes/MyDrive/MyDrive-scan-audio-*.csv ~/Music
```

### Add New API Key
```bash
env-update llm-apis
# → Opens editor, rebuilds master, reloads
# → Keys immediately available
```

### Switch Contexts
```bash
cd ~/project1        # ✅ Auto-activated: project1
loadai               # Load AI keys

cd ~/project2        # ✅ Auto-activated: project2
loadmedia            # Load media keys

tobase               # Return to clean state
```

---

## 🎯 Performance Features

### Lazy Loading
- Homebrew: Loads on first `brew` call (~100ms → 5ms)
- GROK key: Cached per session (100ms → instant)
- Modern tools: Fallback if not installed

### Auto-Activation
- `cd` into project → venv activates automatically
- No manual `source .venv/bin/activate` needed
- Works in subdirectories too!

### Smart Caching
- API key checks: Once per session
- Command tracking: Async writes every 10 commands
- FZF integration: Instant category selection

---

## 🔧 Troubleshooting

### Keys Not Loading?
```bash
echo $OPENAI_API_KEY  # Check if loaded
loadllm               # Try loading
envctl validate       # Check for errors
envctl build --force  # Rebuild master
```

### Venv Not Activating?
```bash
ls -la .venv          # Check if exists
source ~/.zshrc       # Reload config
venv                  # Recreate venv
```

### Scan Script Errors?
```bash
# We fixed broken symlink issue!
# If still errors, check:
python3 --version     # Ensure Python 3.11+
which python3         # Verify path
```

---

## 📖 Documentation

### Main Docs
- **System Map**: `~/SYSTEM_ARCHITECTURE_MAP.md`
- **Workflows**: `~/WORKFLOW_GUIDE.md`
- **Quick Ref**: `~/QUICK_REFERENCE.md` (this file)

### Component Docs
- **Environment**: `~/.env.d/QUICKSTART.md`
- **Cheatsheet**: `~/.env.d/CHEATSHEET.txt`
- **Config**: `~/.zshrc` (1,346 lines, well-commented)

### Quick Access
```bash
env-quick            # Environment quickstart
env-help             # Environment cheatsheet
scan help            # File scanning help
cat ~/SYSTEM_ARCHITECTURE_MAP.md    # Full system overview
```

---

## 🎓 Design Philosophy

1. **Modular**: Everything is a composable component
2. **Discoverable**: Type `env-` + TAB to see all options
3. **Self-Documenting**: Every component has built-in help
4. **Zero-Config**: Auto-activation, auto-loading, auto-backup
5. **Performance-First**: Lazy loading, caching, optimization

---

## 📊 System Stats

```
~/.zshrc:         1,346 lines | 60+ aliases | 20+ functions
~/.env.d/:        20 categories | 100+ API keys | Auto-backup
~/pythons/:       39 directories | 1,400+ files | 586 Python scripts

Startup Time:     ~200ms (with lazy loading)
API Key Loading:  ~50ms per category
Venv Activation:  Instant (auto on cd)
```

---

**Last Updated:** $(date)
**Quick Access:** `cat ~/QUICK_REFERENCE.md`
