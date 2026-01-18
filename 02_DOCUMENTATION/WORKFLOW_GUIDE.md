# 🚀 Real-World Workflows - How Everything Works Together

**Last Updated:** $(date)

---

## 📋 Table of Contents

1. [AI Content Creation](#ai-content-creation)
2. [Media Processing](#media-processing)
3. [File Organization](#file-organization)
4. [Python Development](#python-development)
5. [API Key Management](#api-key-management)
6. [System Maintenance](#system-maintenance)

---

## 🤖 AI Content Creation

### Scenario: Generate blog posts using multiple AI services

```bash
# Step 1: Load AI APIs
loadai
# → Loads: llm-apis + art-vision + automation-agents
# → Available: OpenAI, Anthropic, Groq, Stability AI, etc.

# Step 2: Navigate to AI tools
cd ~/pythons/AI_CONTENT/text_generation

# Step 3: Auto-activate venv (if exists)
# ✅ Auto-activated: text_generation

# Step 4: Run your script
python generate_blog_post.py --topic "AI automation" --provider openai

# Step 5: Generate images for the post
cd ../image_generation
python generate_hero_image.py --prompt "AI automation concept art"
```

**What Happened:**
- `loadai` → sourced ~/.env.d/loader.sh with 3 categories
- `cd` → triggered chpwd hook → auto-activated .venv
- Scripts have access to all API keys from env.d

---

## 🎨 Media Processing

### Scenario: Process videos from multiple sources

```bash
# Step 1: Scan external drive for videos
scan videos /Volumes/2T-Xx
# → Output: /Volumes/2T-Xx/2T-Xx-scan-videos-2025-12-29.csv

# Step 2: Review the CSV
cat /Volumes/2T-Xx/2T-Xx-scan-videos-2025-12-29.csv | head -20

# Step 3: Organize videos by type
organize-files /Volumes/2T-Xx/2T-Xx-scan-videos-2025-12-29.csv ~/Videos

# Step 4: Process with Python tools
cd ~/pythons/MEDIA_PROCESSING/video_tools
python batch_process.py --input ~/Videos --output ~/Processed
```

**Integration Points:**
- `scan` → uses zshrc function → calls Python script → generates CSV
- `organize-files` → reads CSV → copies/moves files systematically
- Auto-venv activation when entering video_tools/

---

## 📁 File Organization

### Scenario: Clean up a messy downloads folder

```bash
# Step 1: Scan all file types
scan all ~/Downloads
# Creates:
#   ~/Downloads/Downloads-scan-audio-2025-12-29.csv
#   ~/Downloads/Downloads-scan-docs-2025-12-29.csv
#   ~/Downloads/Downloads-scan-images-2025-12-29.csv
#   ~/Downloads/Downloads-scan-videos-2025-12-29.csv
#   ~/Downloads/Downloads-scan-other-2025-12-29.csv

# Step 2: Review what was found
wc -l ~/Downloads/Downloads-scan-*.csv

# Step 3: Organize by category
organize-files ~/Downloads/Downloads-scan-audio-2025-12-29.csv ~/Music
organize-files ~/Downloads/Downloads-scan-images-2025-12-29.csv ~/Pictures
organize-files ~/Downloads/Downloads-scan-docs-2025-12-29.csv ~/Documents

# Step 4: Run cleanup analyzer
cd ~/pythons
python batch_dupe_content_analyzer.py --target ~/Downloads
```

**Why This Works:**
- Scan function skips broken symlinks (we fixed that!)
- Each file type has its own CSV for targeted organization
- Deduplication prevents copying duplicates

---

## 🐍 Python Development

### Scenario: Start a new Python project with proper setup

```bash
# Step 1: Create project directory
mkdir ~/my-new-project && cd ~/my-new-project

# Step 2: Initialize with venv and requirements
init-project
# → Creates .venv with Python 3.12
# → Upgrades pip, setuptools, wheel
# → Generates requirements.txt from code (if any)
# → Installs requirements
# ✅ Auto-activated: my-new-project

# Step 3: Write some code
cat > main.py << 'CODE'
import requests
import anthropic

def main():
    print("Hello from my project!")

if __name__ == "__main__":
    main()
CODE

# Step 4: Update requirements
reqs --force
# → Scans code for imports
# → Generates requirements.txt
# → Installs all dependencies

# Step 5: Load API keys when needed
loadllm
# → OpenAI, Anthropic, etc. now available

# Step 6: Run your code
python main.py

# Step 7: When done, clean up
cd ~
pclean ~/my-new-project
# → Deactivates venv
# → Removes .venv
# → Returns to base environment
```

**Smart Features:**
- `init-project` → One command does everything
- `reqs` → Auto-detects imports and installs them
- Auto-activation → No need to manually source venv
- `pclean` → Complete cleanup in one command

---

## 🔑 API Key Management

### Scenario: Add a new API service

```bash
# Method 1: Quick update workflow (recommended)
env-update llm-apis
# → Opens editor at ~/.env.d/llm-apis.env
# → After you save and close:
#   - Rebuilds master file
#   - Reloads llm-apis category
#   - Keys immediately available

# Method 2: Manual workflow
vim ~/.env.d/llm-apis.env
# Add: export NEWSERVICE_API_KEY="sk-..."
envctl build --force
loadllm

# Verify it loaded
echo $NEWSERVICE_API_KEY
# → sk-...

# Method 3: Interactive category picker
summon env
# → Shows FZF picker
# → Select multiple categories
# → Loads them all at once
```

**Security Features:**
- All .env files are chmod 600 (automatic)
- Auto-backup before every rebuild
- Validation checks for empty/duplicate keys
- Master file is in .gitignore

---

## 🛠️ System Maintenance

### Scenario: Regular system health check

```bash
# Check Python environment status
pyenv-status
# Shows:
#   - Conda/Mamba status
#   - Current venv
#   - Python version
#   - Pip info

# Validate environment files
envctl validate
# Checks for:
#   - Missing files
#   - Duplicate keys
#   - Empty values
#   - Permission issues

# Check which aliases you actually use
alias-stats
# Shows top 20 most-used custom commands

# Clean up broken symlinks in pythons/
find ~/pythons -type l ! -exec test -e {} \; -delete

# Rebuild environment master file
env-rebuild

# Check all loaded API keys
envstatus
# Shows first 10 API keys/tokens/secrets

# Check specific APIs
checkdefault
# Shows status of:
#   - OpenAI
#   - Anthropic
#   - XAI (Grok)
#   - Groq
```

---

## 🎯 Advanced Workflows

### Multi-Project Context Switching

```bash
# Morning: AI content generation
cd ~/ai-sites/blog-generator
loadai
# ✅ Auto-activated: blog-generator
python generate.py

# Afternoon: Media processing
cd ~/pythons/MEDIA_PROCESSING
loadmedia
# → Previous venv auto-deactivated
# ✅ Auto-activated: MEDIA_PROCESSING
python process_videos.py

# Evening: Return to base
tobase
# → Deactivates all venvs
# → Clears all language-specific vars
# ✅ Clean base environment
```

### Batch File Processing

```bash
# Process multiple drives
for drive in /Volumes/2T-Xx /Volumes/Backup /Volumes/Archive; do
  echo "Processing $drive..."
  scan all "$drive"
done

# Review all scans
ls /Volumes/*/\*-scan-\*.csv

# Organize everything
for csv in /Volumes/*/\*-scan-audio-\*.csv; do
  organize-files "$csv" ~/Music/Imported
done
```

### Environment Composition

```bash
# Load exactly what you need
source ~/.env.d/loader.sh llm-apis storage github
# → Loads only 3 categories
# → Faster than loading all
# → Cleaner environment

# Or use composite aliases
loaddev
# → Loads cloud-infrastructure + other-tools

loadai
# → Loads llm-apis + art-vision + automation-agents
```

---

## 📊 Performance Tips

### Startup Optimization

Your .zshrc already implements:
- **Lazy loading**: Brew, ngrok only load when called
- **Session caching**: GROK key check runs once per session
- **Conditional loading**: Only loads what's needed

### API Key Loading Strategy

```bash
# Startup: Only load LLM keys (automatic)
# → ~/.zshrc does this for you

# When needed: Load additional categories
loadmedia    # When working with images/audio
loaddev      # When doing cloud/infrastructure work
```

### Venv Management

```bash
# Let auto-activation handle it
cd ~/project          # Auto-activates .venv
cd ~/other-project    # Switches to other .venv
cd ~                  # Doesn't auto-deactivate (feature!)
tobase                # Manual deactivate when needed
```

---

## 🎓 Best Practices

### 1. Don't Load Everything
```bash
# ❌ Bad
source ~/.env.d/load_master.sh

# ✅ Good
loadllm              # Only what you need
```

### 2. Use Composite Aliases
```bash
# ✅ Pre-defined combinations
loadai               # AI work
loadmedia            # Media work
loaddev              # Development work
```

### 3. Let Auto-Activation Work
```bash
# ❌ Bad
cd ~/project
source .venv/bin/activate

# ✅ Good
cd ~/project         # Auto-activates!
```

### 4. Use Helper Functions
```bash
# ❌ Bad
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# ✅ Good
venv-setup           # Does all of the above
```

### 5. Regular Validation
```bash
# Run weekly
envctl validate
pyenv-status
alias-stats
```

---

## 🔍 Debugging Common Issues

### "API key not found"
```bash
# Check if loaded
echo $OPENAI_API_KEY

# If empty, load category
loadllm

# If still empty, check file
cat ~/.env.d/llm-apis.env | grep OPENAI

# Rebuild if needed
envctl build --force && loadllm
```

### "Wrong Python version"
```bash
# Check current
python --version

# If in venv, check venv Python
which python

# If wrong, recreate venv
pclean
venv 3.12            # Or 3.11
```

### "Venv not auto-activating"
```bash
# Check if .venv exists
ls -la .venv

# Check if hook is working
echo $VIRTUAL_ENV    # Should be empty when outside venv

# If broken, source zshrc
source ~/.zshrc
```

---

**Quick Reference:**
- System Architecture: `~/SYSTEM_ARCHITECTURE_MAP.md`
- Environment Guide: `~/.env.d/QUICKSTART.md`
- Workflow Examples: `~/WORKFLOW_GUIDE.md` (this file)

**Last Updated:** $(date)
