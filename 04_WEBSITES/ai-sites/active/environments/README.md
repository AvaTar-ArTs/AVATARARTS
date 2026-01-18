# 🐍 Mamba/Miniforge Environment Management

**Complete Python environment setup for your automation empire**

---

## 📦 Why Mamba?

- **Fast:** 10-100x faster than conda
- **Isolated:** Each project has its own dependencies
- **Reproducible:** Share environment files with others
- **No conflicts:** Avoid "it works on my machine" issues

---

## 🌟 Available Environments

### 1. **automation-master** (Main environment)
**Location:** `ai-sites/environments/automation-master.yml`
**Purpose:** All automation tools, API integrations, content generation

**Includes:**
- OpenAI, Anthropic, Groq (LLM APIs)
- Requests, BeautifulSoup (web scraping)
- Pillow, opencv (image processing)
- Pandas, numpy (data analysis)
- Twilio (phone/SMS)
- Flask (web servers)
- DuckDB (database)

**Usage:**
```bash
mamba env create -f ~/ai-sites/environments/automation-master.yml
mamba activate automation-master
```

### 2. **ai-voice-agents** (Voice agent development)
**Location:** `ai-sites/environments/ai-voice-agents.yml`
**Purpose:** OpenAI voice agents, Twilio integration

**Includes:**
- OpenAI (GPT, Whisper, TTS)
- Twilio (phone system)
- Flask (webhook server)
- BeautifulSoup (web scraping for knowledge)

**Usage:**
```bash
mamba env create -f ~/ai-sites/environments/ai-voice-agents.yml
mamba activate ai-voice-agents
```

### 3. **data-analysis** (Analytics & reporting)
**Location:** `ai-sites/environments/data-analysis.yml`
**Purpose:** Revenue dashboards, performance analysis, reporting

**Includes:**
- Pandas, numpy (data manipulation)
- Matplotlib, seaborn (visualization)
- DuckDB, sqlite (databases)
- Jupyter (notebooks)

**Usage:**
```bash
mamba env create -f ~/ai-sites/environments/data-analysis.yml
mamba activate data-analysis
```

### 4. **content-generation** (Image/video/audio)
**Location:** `ai-sites/environments/content-generation.yml`
**Purpose:** DALL-E, image processing, video editing

**Includes:**
- OpenAI (DALL-E)
- Pillow, opencv (image processing)
- Moviepy (video editing)
- Pydub (audio processing)
- Requests (API calls)

**Usage:**
```bash
mamba env create -f ~/ai-sites/environments/content-generation.yml
mamba activate content-generation
```

### 5. **web-scraping** (Lead generation)
**Location:** `ai-sites/environments/web-scraping.yml`
**Purpose:** Google Maps scraping, local SEO, lead gen

**Includes:**
- Requests, BeautifulSoup (scraping)
- Selenium (browser automation)
- Playwright (modern browser control)
- Pandas (data export)

**Usage:**
```bash
mamba env create -f ~/ai-sites/environments/web-scraping.yml
mamba activate web-scraping
```

---

## 🚀 Quick Start

### Setup ALL Environments (One Command)
```bash
~/ai-sites/environments/setup_all_envs.sh
```

This will:
1. Create all 5 environments
2. Test each one
3. Generate activation helpers
4. Update your shell config

### Activate an Environment
```bash
# Use the helper script
~/ai-sites/environments/activate.sh automation-master

# Or directly with mamba
mamba activate automation-master
```

### List All Environments
```bash
mamba env list
```

### Update an Environment
```bash
mamba activate automation-master
mamba update --all
```

### Remove an Environment
```bash
mamba env remove -n automation-master
```

---

## 📁 Directory-Specific Environments

### For AI-Sites Projects
```bash
cd ~/ai-sites/automation
mamba activate automation-master
python3 revenue-dashboard/dashboard.py
```

### For Documents Projects
```bash
cd ~/Documents/python
mamba activate data-analysis
jupyter notebook
```

### For Downloads/Testing
```bash
cd ~/Downloads
mamba activate automation-master
python3 test_script.py
```

---

## 🔧 Environment Files Structure

Each environment file (`*.yml`) contains:

```yaml
name: environment-name
channels:
  - conda-forge
  - defaults
dependencies:
  - python=3.11
  - pip
  - package1
  - package2
  - pip:
    - pip-only-package
```

**Channels:**
- `conda-forge`: Community-maintained packages (best)
- `defaults`: Anaconda's official packages

**Dependencies:**
- Listed packages are installed via conda/mamba
- `pip:` section installs via pip (for packages not in conda)

---

## 💡 Best Practices

### 1. One Environment Per Project Type
❌ **Don't:** Use one environment for everything
✅ **Do:** Use `automation-master` for automation, `data-analysis` for analytics

### 2. Pin Python Version
```yaml
dependencies:
  - python=3.11  # Specific version
```

### 3. Export Your Environment
```bash
# After adding packages
mamba env export > environment.yml

# Share with others
git add environment.yml
git commit -m "Update environment"
```

### 4. Keep Environments Updated
```bash
# Monthly or when issues arise
mamba activate automation-master
mamba update --all
```

### 5. Use Requirements.txt for Pip Packages
For pip-only packages:
```bash
pip install -r requirements.txt
```

---

## 🐛 Troubleshooting

### "Environment not found"
```bash
# List all environments
mamba env list

# Recreate if missing
mamba env create -f ~/ai-sites/environments/automation-master.yml
```

### "Package conflict"
```bash
# Remove and recreate
mamba env remove -n automation-master
mamba env create -f ~/ai-sites/environments/automation-master.yml
```

### "Slow installation"
```bash
# Use mamba (not conda!)
mamba install package-name  # Fast!
conda install package-name  # Slow
```

### "Can't activate environment"
```bash
# Initialize shell
mamba init zsh  # or bash
source ~/.zshrc

# Then try activating
mamba activate automation-master
```

---

## 📊 Environment Management Helper

Use the provided helper script for common tasks:

```bash
# Menu-driven interface
~/ai-sites/environments/manage_envs.sh
```

**Options:**
1. List all environments
2. Create new environment
3. Activate environment
4. Update environment
5. Remove environment
6. Export environment
7. Test all environments

---

## 🔄 Auto-Activation (Optional)

Add to `~/.zshrc` or `~/.bashrc`:

```bash
# Auto-activate based on directory
function auto_activate_env() {
  if [[ "$PWD" == "/Users/steven/ai-sites/"* ]]; then
    if [[ "$CONDA_DEFAULT_ENV" != "automation-master" ]]; then
      mamba activate automation-master
    fi
  elif [[ "$PWD" == "/Users/steven/Documents/python"* ]]; then
    if [[ "$CONDA_DEFAULT_ENV" != "data-analysis" ]]; then
      mamba activate data-analysis
    fi
  fi
}

# Run on directory change
chpwd_functions+=(auto_activate_env)
```

Now when you `cd` into directories, the right environment activates automatically!

---

## 📦 Quick Reference

| Task | Command |
|------|---------|
| Create env | `mamba env create -f environment.yml` |
| Activate | `mamba activate env-name` |
| Deactivate | `mamba deactivate` |
| List envs | `mamba env list` |
| Install package | `mamba install package-name` |
| Update all | `mamba update --all` |
| Remove env | `mamba env remove -n env-name` |
| Export env | `mamba env export > environment.yml` |

---

## 🎯 Next Steps

1. **Run setup:** `~/ai-sites/environments/setup_all_envs.sh`
2. **Test environments:** Each should activate without errors
3. **Start using:** `mamba activate automation-master`
4. **Customize:** Add packages as needed per project

---

**Your Python environments are now organized and isolated!** 🎉

No more dependency conflicts. No more "works on my machine" issues.
