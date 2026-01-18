# 🐍 Mamba Quick Reference Card

**One-page cheat sheet for daily use**

---

## 🚀 Quick Start

```bash
# Setup everything (one-time)
~/ai-sites/environments/setup_all_envs.sh

# Activate main environment
mamba activate automation-master

# Interactive manager
~/ai-sites/environments/manage_envs.sh
```

---

## 🎯 Common Commands

| Task | Command |
|------|---------|
| **List environments** | `mamba env list` |
| **Activate** | `mamba activate env-name` |
| **Deactivate** | `mamba deactivate` |
| **Install package** | `mamba install package-name` |
| **Install via pip** | `pip install package-name` |
| **Update all** | `mamba update --all` |
| **Create env** | `mamba env create -f env.yml` |
| **Remove env** | `mamba env remove -n env-name` |
| **Export env** | `mamba env export > env.yml` |
| **Search package** | `mamba search package-name` |

---

## 📦 Your Environments

### automation-master (Main)
**Use for:** All automation scripts, APIs, content generation
**Activate:** `mamba activate automation-master`
**Location:** `~/ai-sites/environments/automation-master.yml`

### ai-voice-agents
**Use for:** OpenAI voice agents, Twilio, phone automation
**Activate:** `mamba activate ai-voice-agents`
**Location:** `~/ai-sites/environments/ai-voice-agents.yml`

### data-analysis
**Use for:** Revenue dashboards, analytics, Jupyter notebooks
**Activate:** `mamba activate data-analysis`
**Location:** `~/ai-sites/environments/data-analysis.yml`

### content-generation
**Use for:** DALL-E, image/video processing, content creation
**Activate:** `mamba activate content-generation`
**Location:** `~/ai-sites/environments/content-generation.yml`

### web-scraping
**Use for:** Lead generation, Google Maps, web scraping
**Activate:** `mamba activate web-scraping`
**Location:** `~/ai-sites/environments/web-scraping.yml`

---

## 🔄 Workflows

### Start Work Session
```bash
cd ~/ai-sites
mamba activate automation-master
python3 automation/quick-wins/stats.sh
```

### Run Voice Agent Demo
```bash
cd ~/ai-sites/monetization/ai-voice-agents
mamba activate ai-voice-agents
python3 openai_voice_agent.py demo
```

### Analyze Revenue Data
```bash
cd ~/ai-sites/automation/revenue-dashboard
mamba activate data-analysis
python3 dashboard.py
```

### Generate Content
```bash
cd ~/ai-sites
mamba activate content-generation
python3 automation/api-powered/dalle_auto_generator.py daily
```

---

## 🛠️ Maintenance

### Weekly (5 min)
```bash
# Update all packages
mamba activate automation-master
mamba update --all -y

# Check for broken packages
python --version
python -c "import openai; import requests; print('OK')"
```

### Monthly (10 min)
```bash
# Update all environments
for env in automation-master ai-voice-agents data-analysis content-generation web-scraping; do
    mamba activate $env
    mamba update --all -y
done

# Export updated environments
cd ~/ai-sites/environments
for env in automation-master ai-voice-agents data-analysis content-generation web-scraping; do
    mamba activate $env
    mamba env export > $env.yml
done
```

---

## 🆘 Troubleshooting

### "Environment not found"
```bash
# List all environments
mamba env list

# Recreate if missing
mamba env create -f ~/ai-sites/environments/automation-master.yml
```

### "Package not found"
```bash
# Search in conda-forge
mamba search package-name

# If not in conda, use pip
pip install package-name
```

### "Conflicts detected"
```bash
# Remove and recreate environment
mamba env remove -n automation-master
mamba env create -f ~/ai-sites/environments/automation-master.yml
```

### "Can't activate"
```bash
# Re-initialize mamba
mamba init zsh  # or bash
source ~/.zshrc

# Try again
mamba activate automation-master
```

### "Slow installation"
```bash
# Make sure you're using mamba (not conda!)
mamba install package-name  # Fast ✅
conda install package-name  # Slow ❌
```

---

## 🎨 Auto-Activation (Optional)

Add to `~/.zshrc`:

```bash
# Auto-activate environments based on directory
source ~/ai-sites/environments/auto_activate.sh
```

Then:
- `cd ~/ai-sites` → activates `automation-master`
- `cd ~/ai-sites/monetization/ai-voice-agents` → activates `ai-voice-agents`
- `cd ~/Documents/python` → activates `data-analysis`

---

## 💡 Pro Tips

### Tip 1: Check Active Environment
```bash
echo $CONDA_DEFAULT_ENV
```

### Tip 2: Quick Environment Info
```bash
mamba list | grep openai  # Check if package installed
python -c "import openai; print(openai.__version__)"  # Check version
```

### Tip 3: Clone Environment
```bash
# Create a copy for testing
mamba create --name test-env --clone automation-master
```

### Tip 4: Pin Package Version
```bash
# In environment.yml
dependencies:
  - openai=1.0.0  # Exact version
  - requests>=2.28  # Minimum version
```

### Tip 5: Clean Up
```bash
# Remove unused packages
mamba clean --all -y

# Free up disk space
mamba clean --packages -y
```

---

## 🔗 Quick Links

- **Full docs:** `~/ai-sites/environments/README.md`
- **Interactive manager:** `~/ai-sites/environments/manage_envs.sh`
- **Environment files:** `~/ai-sites/environments/*.yml`
- **Mamba docs:** https://mamba.readthedocs.io

---

**🎯 Most Common:**
1. `mamba activate automation-master`
2. `cd ~/ai-sites`
3. Start coding!

**Save this to your desktop for quick reference!**
