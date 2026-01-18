# 🚀 Complete AVATARARTS Setup Guide

**Step-by-Step Installation, Setup, and Running Instructions**

**Last Updated:** 2026-01-13
**Workspace Location:** `/Users/steven/AVATARARTS/`

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Workspace Setup](#initial-workspace-setup)
3. [Directory Structure Overview](#directory-structure-overview)
4. [Documentation Systems Setup](#documentation-systems-setup)
5. [Tools & Utilities Setup](#tools--utilities-setup)
6. [Business Systems Setup](#business-systems-setup)
7. [Running Different Components](#running-different-components)
8. [Troubleshooting](#troubleshooting)
9. [Environment Variables & API Keys](#10-environment-variables--api-keys)

---

## 1. Prerequisites

> **🔑 IMPORTANT: API Keys Location**
>
> All API keys are stored in `~/.env.d/` directory. This is a centralized, secure location for all environment variables and API keys. Use `source ~/.env.d/loader.sh [category]` to load keys before running any systems that require them.

### Required Software

**System Requirements:**
- macOS (Darwin) - Current system
- Terminal access (zsh shell)
- Administrator/sudo access (for some installations)

**Essential Tools:**

1. **Python 3.8+**
   ```bash
   # Check if installed
   python3 --version
   # Should show: Python 3.x.x

   # If not installed (macOS):
   brew install python3
   ```

2. **Node.js 18+**
   ```bash
   # Check if installed
   node --version
   npm --version

   # If not installed (macOS):
   brew install node
   ```

3. **Git**
   ```bash
   # Check if installed
   git --version

   # If not installed (macOS):
   xcode-select --install
   ```

4. **Homebrew** (macOS package manager)
   ```bash
   # Check if installed
   brew --version

   # If not installed:
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

### Optional but Recommended

- **Virtual Environment Tools** (venv, virtualenv)
- **Code Editor** (VS Code, Cursor, etc.)
- **Git GUI** (optional)

---

## 2. Initial Workspace Setup

### Step 1: Navigate to Workspace

```bash
cd /Users/steven/AVATARARTS
```

### Step 2: Verify Directory Structure

```bash
# Check main directories exist
ls -la | grep "^d" | grep -E "00_ACTIVE|01_TOOLS|02_DOCUMENTATION"

# Should see:
# 00_ACTIVE/
# 01_TOOLS/
# 02_DOCUMENTATION/
# 03_ARCHIVES/
# 04_WEBSITES/
# 05_DATA/
# 06_SEO_MARKETING/
# 07_MISC/
```

### Step 3: Initialize Git (if not already done)

```bash
# Check if git is initialized
git status

# If not initialized:
git init
git add .gitignore README.md
git commit -m "Initial commit: AVATARARTS workspace"
```

### Step 4: Run Initialization Script

```bash
# Make script executable
chmod +x init.sh

# Run initialization
./init.sh
```

**What this does:**
- Initializes git repository (if needed)
- Creates essential directories
- Sets script permissions
- Creates initial commit

---

## 3. Directory Structure Overview

### Understanding the Numbered System

```
AVATARARTS/
├── 00_ACTIVE/          # Active projects (1.9 GB)
├── 01_TOOLS/           # Tools & scripts (13 MB)
├── 02_DOCUMENTATION/   # Documentation (1.2 MB)
├── 03_ARCHIVES/        # Archives (717 MB)
├── 04_WEBSITES/        # Websites (2.6 GB)
├── 05_DATA/            # Data files (135 MB)
├── 06_SEO_MARKETING/   # SEO tools (36 MB)
└── 07_MISC/            # Miscellaneous (9.3 MB)
```

### Key Directories Explained

**00_ACTIVE/** - Your working directory
- Business projects
- Client work
- Active development

**01_TOOLS/** - Analysis and utility tools
- Python scripts
- Dashboards
- Data analysis tools

**02_DOCUMENTATION/** - All documentation
- Guides
- Reports
- Analysis documents

---

## 4. Documentation Systems Setup

### 4.1 Docusaurus Documentation

**Location:** `docs-docusaurus/`

#### Step 1: Navigate to Directory

```bash
cd /Users/steven/AVATARARTS/docs-docusaurus
```

#### Step 2: Install Dependencies

```bash
# Install Node.js dependencies
npm install
```

**Expected output:**
- Downloads and installs packages
- Creates `node_modules/` directory
- Takes 2-5 minutes

#### Step 3: Verify Installation

```bash
# Check if dependencies installed
npm list --depth=0

# Should show:
# @docusaurus/core@3.9.2
# @docusaurus/preset-classic@3.9.2
# react@18.3.1
# etc.
```

#### Step 4: Start Development Server

```bash
npm start
```

**What happens:**
- Starts development server
- Opens browser at `http://localhost:3000`
- Hot-reload enabled (changes auto-refresh)

#### Step 5: Build for Production

```bash
npm run build
```

**Output:**
- Creates `build/` directory
- Generates static HTML files
- Ready for deployment

#### Step 6: Serve Production Build

```bash
npm run serve
```

**Access:**
- Local: `http://localhost:3000`
- Network: Check terminal for network URL

#### Common Commands

```bash
# Clear cache
npm run clear

# Stop server
# Press Ctrl+C in terminal

# Or kill by port
lsof -ti:3000 | xargs kill -9
```

---

### 4.2 MkDocs Documentation

**Location:** `docs-mkdocs/`

#### Step 1: Navigate to Directory

```bash
cd /Users/steven/AVATARARTS/docs-mkdocs
```

#### Step 2: Create Virtual Environment (Recommended)

```bash
# Create virtual environment
python3 -m venv .venv

# Activate virtual environment
source .venv/bin/activate

# Your prompt should show: (.venv)
```

#### Step 3: Install Dependencies

```bash
# Install from requirements.txt
pip install -r requirements.txt

# Or install individually
pip install mkdocs>=1.5.0
pip install mkdocs-material>=9.0.0
pip install mkdocs-minify-plugin>=0.7.0
pip install pymdown-extensions>=10.0.0
```

#### Step 4: Verify Installation

```bash
# Check MkDocs version
mkdocs --version

# Should show: mkdocs, version 1.6.1
```

#### Step 5: Start Development Server

```bash
mkdocs serve
```

**What happens:**
- Starts development server
- Opens browser at `http://127.0.0.1:8000`
- Auto-reload on file changes

#### Step 6: Build for Production

```bash
mkdocs build
```

**Output:**
- Creates `site/` directory
- Generates static HTML files

#### Step 7: Stop Server

```bash
# In terminal where mkdocs serve is running:
# Press Ctrl+C

# Or kill by port
lsof -ti:8000 | xargs kill -9
```

#### Deactivate Virtual Environment

```bash
deactivate
```

---

### 4.3 Sphinx Documentation

**Location:** `docs-sphinx/`

#### Step 1: Navigate to Directory

```bash
cd /Users/steven/AVATARARTS/docs-sphinx
```

#### Step 2: Install Sphinx

```bash
# Install Sphinx and theme
pip install sphinx sphinx-rtd-theme sphinx-autobuild
```

#### Step 3: Build Documentation

```bash
# Build HTML
make html

# Or using sphinx-build directly
sphinx-build -b html source build/html
```

#### Step 4: View Documentation

```bash
# Open in browser
open build/html/index.html
```

---

### 4.4 VitePress Documentation

**Location:** `docs-vitepress/`

#### Step 1: Navigate to Directory

```bash
cd /Users/steven/AVATARARTS/docs-vitepress
```

#### Step 2: Install Dependencies

```bash
npm install
```

#### Step 3: Start Development Server

```bash
npm run dev
```

**Access:** `http://localhost:5173` (default VitePress port)

---

## 5. Tools & Utilities Setup

### 5.1 Analysis Tools

**Location:** `01_TOOLS/scripts/`

#### Setup Python Environment

```bash
# Navigate to tools directory
cd /Users/steven/AVATARARTS/01_TOOLS

# Create virtual environment (optional but recommended)
python3 -m venv venv
source venv/bin/activate

# Install common dependencies
pip install pandas numpy
```

#### Run Analysis Scripts

```bash
# Structure analysis
python3 scripts/analyze_structure.py

# Income opportunity analysis
python3 scripts/analyze_income_opportunities.py

# Deep comprehensive analysis
python3 scripts/deep_comprehensive_analysis.py

# Find large files
python3 scripts/find_large_files.py . 10
```

### 5.2 Revenue Dashboard

**Location:** `01_TOOLS/dashboards/`

#### Setup

```bash
cd /Users/steven/AVATARARTS/01_TOOLS/dashboards

# Install dependencies
pip install sqlite3  # Usually built-in
# Install any other required packages
```

#### Run Dashboard

```bash
python3 master_revenue_dashboard.py
```

---

## 6. Business Systems Setup

### 6.1 Passive Income Empire

**Location:** `00_ACTIVE/BUSINESS/passive-income-empire/`

#### Step 1: Navigate to Directory

```bash
cd /Users/steven/AVATARARTS/00_ACTIVE/BUSINESS/passive-income-empire
```

#### Step 2: Setup Environment

```bash
# Run setup script
./setup_environment.sh

# Or manually load API keys
# All API keys are in ~/.env.d/
source ~/.env.d/loader.sh llm-apis audio-music

# Verify keys are loaded
env | grep -i "api_key" | head -3
```

#### Step 3: Launch System

```bash
# Launch main menu
./launch_empire.sh

# Or launch specific systems:
cd ai-recipe-generator
./launch_ai_recipe_generator.sh

cd ../ai-receptionist
./launch_ai_receptionist.sh
```

#### Step 4: Run Revenue Dashboard

```bash
python3 revenue_dashboard.py
```

### 6.2 CleanConnect Complete

**Location:** `00_ACTIVE/BUSINESS/cleanconnect-complete/`

#### Setup

```bash
cd /Users/steven/AVATARARTS/00_ACTIVE/BUSINESS/cleanconnect-complete

# Check for setup script
ls -la setup*.sh

# Run setup if available
./setup_environment.sh  # or similar
```

### 6.3 Retention Suite Complete

**Location:** `00_ACTIVE/BUSINESS/retention-suite-complete/`

#### Setup

```bash
cd /Users/steven/AVATARARTS/00_ACTIVE/BUSINESS/retention-suite-complete

# Check for setup instructions
cat README.md

# Follow project-specific setup
```

---

## 7. Running Different Components

### 7.1 Documentation Sites

#### Docusaurus
```bash
cd docs-docusaurus
npm start
# Access: http://localhost:3000
```

#### MkDocs
```bash
cd docs-mkdocs
source .venv/bin/activate  # If using venv
mkdocs serve
# Access: http://127.0.0.1:8000
```

#### Sphinx
```bash
cd docs-sphinx
make html
open build/html/index.html
```

#### VitePress
```bash
cd docs-vitepress
npm run dev
# Access: http://localhost:5173
```

### 7.2 Analysis Tools

```bash
# Workspace analysis
cd /Users/steven/AVATARARTS
python3 01_TOOLS/scripts/deep_comprehensive_analysis.py

# Find large files
python3 01_TOOLS/scripts/find_large_files.py . 10

# Structure analysis
python3 01_TOOLS/scripts/analyze_structure.py
```

### 7.3 Business Systems

```bash
# Passive Income Empire
cd 00_ACTIVE/BUSINESS/passive-income-empire
./launch_empire.sh

# Revenue Dashboard
python3 01_TOOLS/dashboards/master_revenue_dashboard.py
```

---

## 8. Quick Reference Commands

### Navigation

```bash
# Go to workspace root
cd /Users/steven/AVATARARTS

# Go to active projects
cd 00_ACTIVE/BUSINESS

# Go to tools
cd 01_TOOLS/scripts

# Go to documentation
cd 02_DOCUMENTATION
```

### Common Tasks

```bash
# Start Docusaurus
cd docs-docusaurus && npm start

# Start MkDocs
cd docs-mkdocs && mkdocs serve

# Run analysis
python3 01_TOOLS/scripts/analyze_structure.py

# Find large files
python3 01_TOOLS/scripts/find_large_files.py . 50

# Launch business system
cd 00_ACTIVE/BUSINESS/passive-income-empire && ./launch_empire.sh
```

### Stopping Services

```bash
# Stop Docusaurus (port 3000)
lsof -ti:3000 | xargs kill -9

# Stop MkDocs (port 8000)
lsof -ti:8000 | xargs kill -9

# Stop VitePress (port 5173)
lsof -ti:5173 | xargs kill -9

# Stop all Node processes
pkill -f node

# Stop all Python processes (be careful!)
pkill -f python
```

---

## 9. Troubleshooting

### Common Issues

#### Issue: "Command not found"

**Solution:**
```bash
# Check if tool is installed
which python3
which node
which npm

# Install missing tools
brew install python3 node
```

#### Issue: "Permission denied"

**Solution:**
```bash
# Make script executable
chmod +x script.sh

# Check permissions
ls -l script.sh
```

#### Issue: "Module not found" (Python)

**Solution:**
```bash
# Install missing module
pip install module-name

# Or install from requirements
pip install -r requirements.txt
```

#### Issue: "Package not found" (Node.js)

**Solution:**
```bash
# Install dependencies
npm install

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Issue: Port already in use

**Solution:**
```bash
# Find process using port
lsof -ti:3000  # Replace 3000 with your port

# Kill process
lsof -ti:3000 | xargs kill -9
```

#### Issue: Virtual environment not activating

**Solution:**
```bash
# Check if venv exists
ls -la .venv

# Create if missing
python3 -m venv .venv

# Activate (bash/zsh)
source .venv/bin/activate

# Activate (fish shell)
source .venv/bin/activate.fish
```

#### Issue: API Key not found / Missing API keys

**Solution:**
```bash
# Check if ~/.env.d/ exists
ls -la ~/.env.d/

# Load API keys before running scripts
source ~/.env.d/loader.sh llm-apis

# Verify keys are loaded
env | grep -i "api_key" | head -3

# Check specific key
[ -n "$OPENAI_API_KEY" ] && echo "✅ OpenAI key loaded" || echo "❌ OpenAI key missing"

# If loader.sh doesn't work, source directly
source ~/.env.d/llm-apis.env
```

#### Issue: "Permission denied" accessing ~/.env.d/

**Solution:**
```bash
# Check permissions
ls -la ~/.env.d/

# Fix permissions (if needed)
chmod 700 ~/.env.d/
chmod 600 ~/.env.d/*.env

# Verify loader.sh is executable
chmod +x ~/.env.d/loader.sh
```

---

## 10. Environment Variables & API Keys

### API Keys Location

**All API keys are stored in:** `~/.env.d/`

This is a centralized, secure location for all API keys and environment variables.

### Loading API Keys

#### Method 1: Using loader.sh (Recommended)

```bash
# Load specific category
source ~/.env.d/loader.sh llm-apis

# Load multiple categories
source ~/.env.d/loader.sh llm-apis audio-music

# Load all categories
source ~/.env.d/loader.sh all
```

#### Method 2: Direct Source

```bash
# Source specific env file
source ~/.env.d/llm-apis.env

# Or export manually
export OPENAI_API_KEY="your-key-here"
```

### Available API Key Categories

Common categories in `~/.env.d/`:

- **`llm-apis.env`** - LLM services
  - OpenAI
  - Anthropic (Claude)
  - Groq
  - XAI (Grok)

- **`art-vision.env`** - Image generation
  - Leonardo AI
  - Stability AI
  - Midjourney

- **`audio-music.env`** - Audio services
  - ElevenLabs
  - Suno AI

- **`automation-agents.env`** - Automation tools
  - n8n
  - Other automation platforms

- **`cloud-infrastructure.env`** - Cloud services
  - AWS
  - Other cloud providers

- **`cursor.env`** - Cursor IDE API keys

- **`github.env`** - GitHub tokens

- And more...

### Setting Up API Keys

#### Step 1: Check Existing Keys

```bash
# List available env files
ls -la ~/.env.d/*.env

# View structure (without exposing keys)
ls -la ~/.env.d/ | grep "\.env$"
```

#### Step 2: Add or Edit Keys

```bash
# Edit specific category
vim ~/.env.d/llm-apis.env

# Or use your preferred editor
code ~/.env.d/llm-apis.env
```

#### Step 3: Load Keys

```bash
# Load after editing
source ~/.env.d/loader.sh llm-apis

# Verify keys are loaded (without showing values)
env | grep -i "api_key" | sed 's/=.*/=***/'
```

### Using API Keys in Projects

#### In Python Scripts

```python
import os

# Keys are automatically available after sourcing
api_key = os.getenv('OPENAI_API_KEY')
```

#### In Shell Scripts

```bash
# Keys are available as environment variables
echo $OPENAI_API_KEY
```

#### In Business Systems

Most business systems automatically load keys:

```bash
# Passive Income Empire
cd 00_ACTIVE/BUSINESS/passive-income-empire
./setup_environment.sh  # Loads keys automatically
```

### Security Best Practices

1. **Never commit API keys to git**
   - Ensure `~/.env.d/` is in `.gitignore`
   - Use `.env.example` files for templates

2. **Use category-based loading**
   - Only load what you need
   - Don't load all keys unnecessarily

3. **Verify keys are loaded**
   ```bash
   # Check if key is set (without showing value)
   [ -n "$OPENAI_API_KEY" ] && echo "✅ Key loaded" || echo "❌ Key not loaded"
   ```

4. **Backup keys securely**
   - Use encrypted backup
   - Store in password manager
   - Never share keys

### Quick Reference

```bash
# Load LLM APIs (most common)
source ~/.env.d/loader.sh llm-apis

# Load for AI content creation
source ~/.env.d/loader.sh llm-apis art-vision audio-music

# Load for automation
source ~/.env.d/loader.sh automation-agents

# Check what's loaded
env | grep API_KEY | wc -l
```

---

## 11. Verification Checklist

After setup, verify everything works:

- [ ] Python 3.8+ installed
- [ ] Node.js 18+ installed
- [ ] Git initialized
- [ ] Docusaurus starts (`npm start` in docs-docusaurus)
- [ ] MkDocs starts (`mkdocs serve` in docs-mkdocs)
- [ ] Analysis tools run (test one script)
- [ ] Business systems accessible
- [ ] API keys loaded (if needed)

---

## 12. Next Steps

### For First-Time Users

1. ✅ Complete prerequisites installation
2. ✅ Run initial workspace setup
3. ✅ Start with Docusaurus documentation
4. ✅ Explore one business system
5. ✅ Run an analysis tool

### For Developers

1. ✅ Set up development environment
2. ✅ Review project structure
3. ✅ Check out active projects
4. ✅ Review tools and utilities
5. ✅ Set up API keys

### For Content Creators

1. ✅ Access SEO tools (`06_SEO_MARKETING/`)
2. ✅ Review content packages
3. ✅ Check data analytics (`05_DATA/`)
4. ✅ Explore revenue systems

---

## 📚 Additional Resources

- **Main README:** `/Users/steven/AVATARARTS/README.md`
- **Quick Start:** `/Users/steven/AVATARARTS/QUICK_START.md`
- **Start Here:** `/Users/steven/AVATARARTS/START_HERE.md`
- **Workspace Analysis:** `/Users/steven/AVATARARTS/COMPREHENSIVE_WORKSPACE_ANALYSIS.md`

---

## 🆘 Getting Help

### Check Documentation

1. Review `02_DOCUMENTATION/` for guides
2. Check project-specific README files
3. Review analysis reports

### Common Commands Reference

```bash
# Check what's running
ps aux | grep -E "node|python|mkdocs|docusaurus"

# Check ports in use
lsof -i :3000
lsof -i :8000
lsof -i :5173

# Check disk space
df -h

# Check workspace size
du -sh /Users/steven/AVATARARTS
```

---

**Setup Complete!** 🎉

Your AVATARARTS workspace is now ready to use. Start with the documentation systems or dive into the business projects.

**Last Updated:** 2026-01-13
