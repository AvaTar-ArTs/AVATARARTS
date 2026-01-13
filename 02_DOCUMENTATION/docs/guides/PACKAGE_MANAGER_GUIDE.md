# 📦 Package Manager Quick Reference Guide

## Your Current Setup

| Tool | Version | Status | Location |
|------|---------|--------|----------|
| **Homebrew** | 4.6.20 | ✅ Healthy | `/usr/local/bin/brew` |
| **Node** | v25.1.0 | ✅ Via Homebrew | `/usr/local/bin/node` |
| **NPM** | 11.6.2 | ✅ Via Node | `/usr/local/bin/npm` |
| **Python** | 3.12.8 | ⚠️ Multiple versions | `/usr/local/bin/python3` |
| **Pip** | 25.3 | ✅ Working | User site-packages |

## ⚠️ Issues Found

1. **Multiple Python Versions**: You have Python 3.11, 3.12, AND 3.13 installed
2. **225+ pip packages**: Many installed globally (should use venv instead)
3. **Mixed package locations**: Pip packages in multiple directories

## 🚀 Quick Start - Run Cleanup

```bash
# Run the automated cleanup script
bash ~/package_manager_cleanup.sh

# Review the recommendations
cat ~/.package_manager_backup_*/RECOMMENDATIONS.md
```

## 📚 When to Use Which Package Manager

### Homebrew (macOS Package Manager)
**Use for:** System utilities, programming languages, databases, CLI tools

```bash
# Install
brew install git node python postgresql ffmpeg

# Update everything
brew update && brew upgrade

# Clean up old versions
brew cleanup && brew autoremove

# Check for issues
brew doctor

# Search for packages
brew search <package>
```

**Examples of what to install:**
- Programming languages: `python`, `node`, `go`, `rust`
- Databases: `postgresql`, `mysql`, `redis`
- Tools: `git`, `wget`, `curl`, `ffmpeg`, `imagemagick`
- CLI utilities: `bat`, `fzf`, `ripgrep`, `fd`

---

### NPM (Node Package Manager)
**Use for:** JavaScript/Node.js packages and tools

```bash
# Global installation (CLI tools you use everywhere)
npm install -g typescript eslint prettier

# Local installation (project dependencies)
npm install express react lodash

# Update global packages
npm update -g

# Check for outdated packages
npm outdated -g

# Clean cache
npm cache clean --force

# Use npx for one-time commands (no installation)
npx create-react-app my-app
```

**Global vs Local:**
- **Global (-g)**: CLI tools like `n8n`, `typescript`, `eslint`
- **Local**: Project dependencies like `react`, `express`, `axios`

---

### Pip (Python Package Manager)
**Use for:** Python libraries and tools

```bash
# BEST PRACTICE: Always use with python -m
python3 -m pip install <package>

# Your alias makes this easier:
pip install <package>  # Same as python3 -m pip install

# For projects: ALWAYS use virtual environments
python3 -m venv myproject_env
source myproject_env/bin/activate
pip install flask sqlalchemy requests
pip freeze > requirements.txt

# Deactivate virtual environment
deactivate

# Install from requirements.txt
pip install -r requirements.txt

# List installed packages
pip list
```

**⚠️ NEVER do:**
```bash
sudo pip install <package>  # DON'T! Breaks system Python
```

---

### Pipx (Python CLI Tools - RECOMMENDED)
**Use for:** Python CLI tools (isolated from each other)

```bash
# Install pipx first
brew install pipx
pipx ensurepath

# Install Python CLI tools (better than pip!)
pipx install black        # Code formatter
pipx install flake8       # Linter
pipx install youtube-dl   # YouTube downloader
pipx install httpie       # HTTP client

# Update all
pipx upgrade-all

# List installed
pipx list
```

**Why pipx?**
- Each tool gets its own isolated environment
- No dependency conflicts
- Easy to manage and update
- Specifically designed for CLI tools

---

## 🎯 Decision Matrix

| I want to... | Use this command |
|--------------|------------------|
| Install Git, Python, Node | `brew install git python node` |
| Install a system utility (ffmpeg) | `brew install ffmpeg` |
| Install a Python library for a project | Use venv + `pip install` |
| Install a Python CLI tool | `pipx install <tool>` |
| Install TypeScript globally | `npm install -g typescript` |
| Install React for a project | `npm install react` |
| Run create-react-app once | `npx create-react-app my-app` |
| Install a database | `brew install postgresql` |

---

## 🧹 Cleanup Recommendations

### Immediate Actions:

1. **Choose ONE Python version** (recommend 3.12 or 3.13)
   ```bash
   # Edit and run the generated script:
   bash ~/.package_manager_backup_*/remove_extra_pythons.sh
   ```

2. **Install pipx for Python CLI tools**
   ```bash
   brew install pipx
   pipx ensurepath
   ```

3. **Audit your pip packages**
   ```bash
   pip list | wc -l  # You have 225+!
   
   # Consider which are needed globally vs in venv
   pip list > ~/pip_audit.txt
   ```

4. **Set up a project template with venv**
   ```bash
   mkdir ~/project_template
   cd ~/project_template
   python3 -m venv venv
   echo "venv/" >> .gitignore
   echo "# Install: python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt" > README.md
   ```

### Regular Maintenance:

```bash
# Weekly or monthly
brew update && brew upgrade && brew cleanup && brew autoremove
npm update -g
pipx upgrade-all

# Check for issues
brew doctor
npm doctor
```

---

## 🔧 PATH Configuration

Your current PATH order (good!):
1. `/usr/local/bin` - Homebrew binaries ✅
2. `/usr/local/sbin` - Homebrew system binaries ✅
3. `/usr/local/opt/python@3.12/libexec/bin` - Python 3.12 ✅
4. `~/.local/bin` - User binaries ✅
5. `/usr/bin` - System binaries ✅

This is correct! Homebrew before system binaries.

---

## 📝 Best Practices Summary

### DO ✅
- Use Homebrew for system tools and languages
- Use virtual environments (venv) for Python projects
- Use npm locally for project dependencies
- Use pipx for Python CLI tools
- Keep package managers updated
- Run cleanup commands regularly

### DON'T ❌
- Never use `sudo pip install`
- Don't install project dependencies globally
- Don't mix package managers (e.g., installing Python both via Homebrew and python.org)
- Don't ignore virtual environments
- Don't let old versions pile up

---

## 🆘 Troubleshooting

### "Command not found"
```bash
# Check if it's installed
which <command>
brew list | grep <command>
npm list -g | grep <command>
pip list | grep <command>

# Check your PATH
echo $PATH

# Reload shell config
source ~/.zshrc
```

### "Permission denied"
```bash
# DON'T use sudo! Fix permissions instead:
# For Homebrew
sudo chown -R $(whoami) /usr/local/bin /usr/local/lib

# For npm (if needed)
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
# Add to PATH: export PATH=~/.npm-global/bin:$PATH
```

### "Version mismatch"
```bash
# Check all versions
which -a python python3 pip pip3 node npm

# If multiple versions, check PATH order
echo $PATH | tr ':' '\n'
```

### "Dependency conflict"
```bash
# For Python: Use virtual environments!
python3 -m venv fresh_env
source fresh_env/bin/activate
pip install <package>

# For npm: Use npm ci for clean install
rm -rf node_modules package-lock.json
npm ci
```

---

## 📖 Additional Resources

- **Homebrew**: https://brew.sh/
- **NPM**: https://docs.npmjs.com/
- **Python venv**: https://docs.python.org/3/library/venv.html
- **pipx**: https://pipx.pypa.io/

---

## 🎯 Your Next Steps

1. ✅ Run the cleanup script: `bash ~/package_manager_cleanup.sh`
2. ✅ Review recommendations: `cat ~/.package_manager_backup_*/RECOMMENDATIONS.md`
3. ⬜ Choose one Python version and remove others
4. ⬜ Install pipx: `brew install pipx && pipx ensurepath`
5. ⬜ Audit pip packages and move to venv where appropriate
6. ⬜ Set up project templates with venv for future Python projects

---

*Last updated: 2025-11-06*
*Backup location: ~/.package_manager_backup_[timestamp]/*
