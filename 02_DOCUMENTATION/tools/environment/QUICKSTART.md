# ?? Environment System Quick Start Guide

## ?? Overview

Your environment system uses a **modular architecture** where API keys and secrets are organized into category files. The system automatically builds a master file for easy loading.

**Key Concept:** Edit category files ? Rebuild master ? Reload environment

---

## ?? File Structure

```
~/.env.d/
??? MASTER_CONSOLIDATED.env    # Auto-generated master file (DON'T EDIT)
??? llm-apis.env                # AI/LLM API keys (OpenAI, Anthropic, etc.)
??? art-vision.env              # Image generation (Leonardo, Stability)
??? audio-music.env             # Audio services (ElevenLabs, Suno)
??? automation-agents.env       # Automation tools
??? cloud-infrastructure.env    # AWS, cloud services
??? documents.env               # Document services
??? n8n.env                     # n8n automation
??? notifications.env           # Email, SMS services
??? other-tools.env             # Misc tools
??? seo-analytics.env           # SEO and analytics
??? storage.env                 # Storage services
??? vector-memory.env           # Vector databases
??? loader.sh                   # Environment loader script
??? envctl.py                   # Management tool
??? backups/                    # Automatic backups
```

---

## ?? Quick Commands

### View Available Categories
```bash
envctl list                     # Show all categories with stats
envctl list --format names      # Just names (for scripting)
```

### Load Environment Variables
```bash
# Load specific category
env-load-llm                    # Load LLM APIs only
env-load-audio                  # Load audio services
source ~/.env.d/loader.sh llm-apis audio-music  # Load multiple

# Load all categories
env-load-all
source ~/.env.d/load_master.sh  # Alternative
```

### Edit and Update
```bash
# Quick edit workflow (recommended)
env-update llm-apis             # Opens editor, rebuilds, reloads

# Manual workflow
vim ~/.env.d/llm-apis.env       # 1. Edit category file
envctl build --force            # 2. Rebuild master
source ~/.env.d/loader.sh llm-apis  # 3. Reload
```

### Validate Configuration
```bash
envctl validate                 # Check for errors and issues
envctl search OPENAI            # Find specific variables
envctl info                     # Show system stats
```

### Interactive Selection
```bash
summon env                      # FZF interactive category picker
```

---

## ?? Common Workflows

### Adding a New API Key

1. **Identify the category:**
   ```bash
   envctl list                  # Find the right category
   ```

2. **Edit the category file:**
   ```bash
   vim ~/.env.d/llm-apis.env    # Add your key
   ```
   
   Example entry:
   ```bash
   export OPENAI_API_KEY="sk-..."
   export ANTHROPIC_API_KEY="sk-ant-..."
   ```

3. **Rebuild and reload:**
   ```bash
   envctl build --force
   source ~/.env.d/loader.sh llm-apis
   ```
   
   **Or use the shortcut:**
   ```bash
   env-update llm-apis          # Does all 3 steps!
   ```

### Creating a New Category

1. **Create the file:**
   ```bash
   vim ~/.env.d/my-new-service.env
   ```

2. **Add variables:**
   ```bash
   # === MY NEW SERVICE ===
   export MY_API_KEY="..."
   export MY_API_SECRET="..."
   ```

3. **Rebuild master:**
   ```bash
   envctl build --force
   ```

4. **Add alias to .zshrc** (optional):
   ```bash
   alias env-load-myservice='source ~/.env.d/loader.sh my-new-service'
   ```

### Checking What's Loaded

```bash
# Check if specific key is loaded
echo $OPENAI_API_KEY

# See all loaded env vars
env | grep API_KEY

# Check loader status
env-status
```

---

## ?? Security Best Practices

1. **File Permissions (automatic):**
   ```bash
   chmod 700 ~/.env.d           # Directory
   chmod 600 ~/.env.d/*.env     # All env files
   ```

2. **Never commit env files:**
   ```bash
   # Already in ~/.gitignore_global:
   *.env
   .env.d/
   ```

3. **Use backups:**
   ```bash
   ls ~/.env.d/backups/         # Automatic backups created on rebuild
   ```

4. **Validate regularly:**
   ```bash
   envctl validate              # Check for empty values, duplicates
   ```

---

## ?? Customization

### Add Custom Aliases in .zshrc

```bash
# Quick access aliases
alias env-llm='vim ~/.env.d/llm-apis.env'
alias env-audio='vim ~/.env.d/audio-music.env'

# Compound loading
alias env-ai='source ~/.env.d/loader.sh llm-apis art-vision'
alias env-dev='source ~/.env.d/loader.sh cloud-infrastructure storage'
```

### Use with Scripts

```bash
#!/bin/bash
# Load specific environment for script
source ~/.env.d/loader.sh llm-apis

# Now API keys are available
python3 my_ai_script.py
```

---

## ?? System Management

### View System Info
```bash
envctl info
# Shows:
# - Total categories
# - Total variables
# - Master file size
# - Last rebuild time
```

### Search for Keys
```bash
envctl search OPENAI            # Find all OPENAI-related vars
envctl search github            # Case-insensitive search
```

### Rebuild Master File
```bash
envctl build --force            # Force rebuild from categories
```

### Validate Everything
```bash
envctl validate
# Checks for:
# - Missing files
# - Duplicate keys
# - Empty values
# - Permission issues
```

---

## ?? Troubleshooting

### Keys Not Loading

```bash
# 1. Check if file exists
ls -la ~/.env.d/llm-apis.env

# 2. Check permissions
ls -l ~/.env.d/*.env            # Should show -rw-------

# 3. Check master file
envctl validate                 # Look for issues

# 4. Rebuild master
envctl build --force

# 5. Reload environment
source ~/.env.d/loader.sh llm-apis

# 6. Verify
echo $OPENAI_API_KEY
```

### Duplicate Keys Warning

```bash
envctl validate                 # Shows duplicates
# Edit category files to remove duplicates
# The first occurrence wins
```

### Master File Out of Sync

```bash
# Rebuild from category files
envctl build --force

# Or use the update workflow
env-update llm-apis
```

---

## ?? Advanced Usage

### Load Multiple Categories at Once

```bash
source ~/.env.d/loader.sh llm-apis art-vision audio-music
```

### Conditional Loading in .zshrc

```bash
# Only load LLM keys when needed
ai() {
  if [[ -z "$OPENAI_API_KEY" ]]; then
    source ~/.env.d/loader.sh llm-apis >/dev/null 2>&1
  fi
  grok --prompt "$@"
}
```

### Project-Specific Environments

```bash
# In your project directory
echo "source ~/.env.d/loader.sh llm-apis storage" > .envrc
# Use with direnv or source manually
```

---

## ?? Reference

### All Available Aliases

```bash
env-load              # Load with categories as arguments
env-load-all          # Load everything
env-load-llm          # Load LLM APIs
env-load-audio        # Load audio services
envctl                # Main management tool
env-rebuild           # Force rebuild master
env-validate          # Validate config
env-status            # Show loader status
env-list              # List categories
env-help              # Show cheatsheet
env-quick             # Show this file
env-edit              # List env files
env-update [category] # Edit ? Rebuild ? Reload workflow
summon env            # Interactive category picker
```

### envctl Commands

```bash
envctl list                     # List all categories
envctl list --format names      # Names only
envctl list --format json       # JSON output
envctl build --force            # Rebuild master
envctl validate                 # Check for issues
envctl search <query>           # Search variables
envctl info                     # System information
```

---

## ?? Tips & Tricks

1. **Use tab completion:** Type `env-` and press TAB to see all env aliases

2. **Quick edits:** Use `env-update` instead of manual edit?rebuild?reload

3. **FZF integration:** Use `summon env` for interactive category selection

4. **Check what's loaded:** Run `env | grep -i api` to see loaded keys

5. **Backup before big changes:** Master file auto-backs up, but you can manually backup:
   ```bash
   tar -czf ~/.env.d/manual-backup-$(date +%Y%m%d).tar.gz ~/.env.d/*.env
   ```

6. **Search history:** Use `env-fzf` to fuzzy-find and edit category files

---

## ?? Getting Help

```bash
envctl --help                   # Tool help
env-help                        # Show cheatsheet
env-quick                       # Show this guide
cat ~/.env.d/CHEATSHEET.txt     # Quick reference
```

---

**Last Updated:** 2025-11-05  
**System Version:** 2.0 (Hybrid Auto-Sync Architecture)
