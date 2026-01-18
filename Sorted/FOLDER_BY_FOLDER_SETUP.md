# 📁 Folder-by-Folder Setup Guide

**Complete setup instructions for every folder in AVATARARTS workspace**

**Last Updated:** January 13, 2026
**Workspace Location:** `/Users/steven/AVATARARTS/`

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Core Numbered Directories](#core-numbered-directories)
   - [00_ACTIVE](#00_active)
   - [01_TOOLS](#01_tools)
   - [02_DOCUMENTATION](#02_documentation)
   - [03_ARCHIVES](#03_archives)
   - [04_WEBSITES](#04_websites)
   - [05_DATA](#05_data)
   - [06_SEO_MARKETING](#06_seo_marketing)
   - [07_MISC](#07_misc)
3. [Documentation Systems](#documentation-systems)
4. [Business & Revenue](#business--revenue)
5. [Data & Databases](#data--databases)
6. [Content & Assets](#content--assets)
7. [Automation & Tools](#automation--tools)
8. [Root Level Files](#root-level-files)

---

## Prerequisites

### Essential Requirements

```bash
# Check Python
python3 --version  # Should be 3.8+

# Check Node.js
node --version     # Should be 18+

# Check Git
git --version

# Load API Keys (CRITICAL)
source ~/.env.d/loader.sh llm-apis
```

### API Keys Setup

All API keys are in `~/.env.d/`. Load them before running any system:

```bash
# Load LLM APIs (most common)
source ~/.env.d/loader.sh llm-apis

# Load for AI content creation
source ~/.env.d/loader.sh llm-apis art-vision audio-music

# Load for automation
source ~/.env.d/loader.sh automation-agents
```

---

## Core Numbered Directories

### 00_ACTIVE

**Purpose:** Active projects and development work

**Location:** `/Users/steven/AVATARARTS/00_ACTIVE/`

#### Structure

```
00_ACTIVE/
├── BUSINESS/           # Business projects
├── CLIENT_PROJECTS/    # Client work
├── CONTENT/            # Content creation
└── DEVELOPMENT/        # Development tools
```

#### Setup Steps

**1. Navigate to directory:**
```bash
cd /Users/steven/AVATARARTS/00_ACTIVE
```

**2. Load API keys:**
```bash
source ~/.env.d/loader.sh llm-apis
```

**3. Setup Business Projects:**
```bash
cd BUSINESS/passive-income-empire
./setup_environment.sh
```

**4. Setup Development Tools:**
```bash
cd DEVELOPMENT/UTILITIES_TOOLS
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### Dependencies

- Python 3.8+
- Node.js 18+ (for some projects)
- ~/.env.d/ API keys
- 01_TOOLS/ scripts
- 05_DATA/ databases

#### Common Commands

```bash
# Run business system
cd BUSINESS/passive-income-empire
./launch_empire.sh

# Run development tools
cd DEVELOPMENT/UTILITIES_TOOLS
python3 tools/scripts/analyze_project.py
```

---

### 01_TOOLS

**Purpose:** Tools, utilities, and analysis scripts

**Location:** `/Users/steven/AVATARARTS/01_TOOLS/`

#### Structure

```
01_TOOLS/
├── dashboards/         # Revenue and analytics dashboards
├── scripts/            # Analysis and utility scripts
└── data/              # Generated data files
```

#### Setup Steps

**1. Navigate to directory:**
```bash
cd /Users/steven/AVATARARTS/01_TOOLS
```

**2. Create virtual environment (optional but recommended):**
```bash
python3 -m venv venv
source venv/bin/activate
```

**3. Install dependencies:**
```bash
pip install pandas numpy sqlite3
# Or install from requirements if available
pip install -r requirements.txt
```

**4. Setup dashboards:**
```bash
cd dashboards
python3 master_revenue_dashboard.py --setup
```

#### Dependencies

- Python 3.8+
- pandas
- numpy
- sqlite3 (usually built-in)
- pathlib (built-in)
- 05_DATA/ databases

#### Common Scripts

```bash
# Structure analysis
python3 scripts/analyze_structure.py

# Deep comprehensive analysis
python3 scripts/deep_comprehensive_analysis.py

# Find large files
python3 scripts/find_large_files.py . 10

# Revenue dashboard
python3 dashboards/master_revenue_dashboard.py
```

---

### 02_DOCUMENTATION

**Purpose:** Documentation and guides

**Location:** `/Users/steven/AVATARARTS/02_DOCUMENTATION/`

#### Setup Steps

**1. Navigate to directory:**
```bash
cd /Users/steven/AVATARARTS/02_DOCUMENTATION
```

**2. Review key files:**
```bash
# Quick start guide
cat QUICK_START_GUIDE.md

# Workflow guide
cat WORKFLOW_GUIDE.md

# System architecture
cat SYSTEM_ARCHITECTURE_MAP.md
```

**3. No special setup required** - These are markdown files for reference

#### Dependencies

- Markdown viewer (built into most editors)
- Documentation systems (docs-docusaurus, docs-mkdocs, etc.)

---

### 03_ARCHIVES

**Purpose:** Archived content and old projects

**Location:** `/Users/steven/AVATARARTS/03_ARCHIVES/`

#### Setup Steps

**1. Navigate to directory:**
```bash
cd /Users/steven/AVATARARTS/03_ARCHIVES
```

**2. No setup required** - This is for archived/reference content

**3. To restore archived project:**
```bash
# Copy back to 00_ACTIVE if needed
cp -r archived_project/ ../00_ACTIVE/
```

---

### 04_WEBSITES

**Purpose:** Website projects and deployments

**Location:** `/Users/steven/AVATARARTS/04_WEBSITES/`

#### Setup Steps

**1. Navigate to directory:**
```bash
cd /Users/steven/AVATARARTS/04_WEBSITES
```

**2. Check for setup scripts:**
```bash
find . -name "setup*.sh" -o -name "setup*.py"
```

**3. Setup specific website:**
```bash
cd ai-sites/active/heavenlyHands
./setup_environment.sh  # If available
```

**4. Install dependencies:**
```bash
# For Node.js projects
npm install

# For Python projects
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### Dependencies

- Node.js 18+ (for React/Next.js sites)
- Python 3.8+ (for Python-based sites)
- ~/.env.d/ API keys

---

### 05_DATA

**Purpose:** Data files, databases, and exports

**Location:** `/Users/steven/AVATARARTS/05_DATA/`

#### Setup Steps

**1. Navigate to directory:**
```bash
cd /Users/steven/AVATARARTS/05_DATA
```

**2. Check database files:**
```bash
find . -name "*.db" -o -name "*.sqlite"
```

**3. Initialize databases (if needed):**
```bash
# SQLite databases are ready to use
sqlite3 database.db ".tables"
```

**4. No special setup required** - Data files are ready to use

#### Dependencies

- SQLite3 (usually built-in)
- Python scripts that use the data

---

### 06_SEO_MARKETING

**Purpose:** SEO tools and marketing content

**Location:** `/Users/steven/AVATARARTS/06_SEO_MARKETING/`

#### Setup Steps

**1. Navigate to directory:**
```bash
cd /Users/steven/AVATARARTS/06_SEO_MARKETING
```

**2. Load API keys:**
```bash
source ~/.env.d/loader.sh llm-apis
```

**3. Setup SEO tools:**
```bash
# Check for setup scripts
find . -name "setup*.sh" -o -name "setup*.py"

# Install Python dependencies
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt  # If available
```

**4. Run SEO analysis:**
```bash
# Example - adjust based on available scripts
python3 scripts/seo_analyzer.py
```

#### Dependencies

- Python 3.8+
- ~/.env.d/ API keys (for AI-powered SEO)
- SEO content packages

---

### 07_MISC

**Purpose:** Miscellaneous tools and projects

**Location:** `/Users/steven/AVATARARTS/07_MISC/`

#### Setup Steps

**1. Navigate to directory:**
```bash
cd /Users/steven/AVATARARTS/07_MISC
```

**2. Check what's available:**
```bash
ls -la
```

**3. Setup varies by project** - Check individual README files

---

## Documentation Systems

### docs-docusaurus

**Purpose:** Docusaurus documentation site

**Location:** `/Users/steven/AVATARARTS/docs-docusaurus/`

#### Setup Steps

**1. Navigate to directory:**
```bash
cd /Users/steven/AVATARARTS/docs-docusaurus
```

**2. Install dependencies:**
```bash
npm install
```

**3. Start development server:**
```bash
npm start
```

**4. Build for production:**
```bash
npm run build
npm run serve
```

#### Dependencies

- Node.js 18+
- npm
- @docusaurus/core ^3.0.0
- React ^18.2.0

#### Access

- Development: `http://localhost:3000`
- Production: After build, served locally

---

### docs-mkdocs

**Purpose:** MkDocs documentation site

**Location:** `/Users/steven/AVATARARTS/docs-mkdocs/`

#### Setup Steps

**1. Navigate to directory:**
```bash
cd /Users/steven/AVATARARTS/docs-mkdocs
```

**2. Create virtual environment:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

**3. Install dependencies:**
```bash
pip install -r requirements.txt
```

**4. Start development server:**
```bash
mkdocs serve
```

**5. Build for production:**
```bash
mkdocs build
```

#### Dependencies

- Python 3.8+
- mkdocs >=1.5.0
- mkdocs-material >=9.0.0
- mkdocs-minify-plugin >=0.7.0

#### Access

- Development: `http://127.0.0.1:8000`
- Production: `site/` directory after build

---

### docs-sphinx

**Purpose:** Sphinx documentation site

**Location:** `/Users/steven/AVATARARTS/docs-sphinx/`

#### Setup Steps

**1. Navigate to directory:**
```bash
cd /Users/steven/AVATARARTS/docs-sphinx
```

**2. Create virtual environment:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

**3. Install dependencies:**
```bash
pip install -r source/requirements.txt
# Or
pip install sphinx sphinx-rtd-theme
```

**4. Build documentation:**
```bash
make html
# Or
sphinx-build -b html source build
```

**5. View documentation:**
```bash
open build/html/index.html
```

#### Dependencies

- Python 3.8+
- Sphinx
- sphinx-rtd-theme (optional)

---

### docs-vitepress

**Purpose:** VitePress documentation site

**Location:** `/Users/steven/AVATARARTS/docs-vitepress/`

#### Setup Steps

**1. Navigate to directory:**
```bash
cd /Users/steven/AVATARARTS/docs-vitepress
```

**2. Install dependencies:**
```bash
npm install
```

**3. Start development server:**
```bash
npm run dev
```

**4. Build for production:**
```bash
npm run build
npm run preview
```

#### Dependencies

- Node.js 18+
- npm
- vitepress ^1.6.4

#### Access

- Development: `http://localhost:5173`
- Production: After build, preview locally

---

## Business & Revenue

### BUSINESS/

**Purpose:** Business projects and revenue systems

**Location:** `/Users/steven/AVATARARTS/BUSINESS/`

#### Setup Steps

**1. Navigate to directory:**
```bash
cd /Users/steven/AVATARARTS/BUSINESS
```

**2. Load API keys:**
```bash
source ~/.env.d/loader.sh llm-apis
```

**3. Check available projects:**
```bash
ls -la
```

**4. Setup specific project:**
```bash
cd passive-income-empire
./setup_environment.sh
```

#### Dependencies

- Python 3.8+
- ~/.env.d/ API keys
- 01_TOOLS/ scripts
- 05_DATA/ databases

---

### Revenue/

**Purpose:** Revenue generation systems and monetization

**Location:** `/Users/steven/AVATARARTS/Revenue/`

#### Setup Steps

**1. Navigate to directory:**
```bash
cd /Users/steven/AVATARARTS/Revenue
```

**2. Load API keys:**
```bash
source ~/.env.d/loader.sh llm-apis automation-agents
```

**3. Check structure:**
```bash
ls -la
```

**4. Setup Trend Pulse OS:**
```bash
cd trend-pulse-os
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### Dependencies

- Python 3.8+
- ~/.env.d/ API keys
- Various Python packages (see requirements.txt)

---

### heavenlyHands/

**Purpose:** Heavenly Hands business system

**Location:** `/Users/steven/AVATARARTS/heavenlyHands/`

#### Setup Steps

**1. Navigate to directory:**
```bash
cd /Users/steven/AVATARARTS/heavenlyHands
```

**2. Load API keys:**
```bash
source ~/.env.d/loader.sh llm-apis
```

**3. Setup intelligent organization system:**
```bash
cd intelligent-organization-system
python3 setup.py
# Or
python3 setup_enhanced_system.py
```

**4. Install dependencies:**
```bash
pip install -r requirements.txt
```

#### Dependencies

- Python 3.8+
- ~/.env.d/ API keys
- Various AI/ML libraries

---

## Data & Databases

### DATABASES/

**Purpose:** Database files

**Location:** `/Users/steven/AVATARARTS/DATABASES/`

#### Setup Steps

**1. Navigate to directory:**
```bash
cd /Users/steven/AVATARARTS/DATABASES
```

**2. Check database files:**
```bash
ls -la *.db *.sqlite
```

**3. Access databases:**
```bash
sqlite3 database.db
.tables
.quit
```

**4. No special setup required** - Databases are ready to use

#### Dependencies

- SQLite3 (usually built-in)
- Python scripts that access databases

---

### INDEXES/

**Purpose:** Generated indexes and search data

**Location:** `/Users/steven/AVATARARTS/INDEXES/`

#### Setup Steps

**1. Navigate to directory:**
```bash
cd /Users/steven/AVATARARTS/INDEXES
```

**2. Regenerate indexes (if needed):**
```bash
cd /Users/steven/AVATARARTS
python3 01_TOOLS/scripts/index_all_folders.py
```

**3. No special setup required** - Indexes are generated by scripts

---

## Content & Assets

### content/

**Purpose:** Content files and assets

**Location:** `/Users/steven/AVATARARTS/content/`

#### Setup Steps

**1. Navigate to directory:**
```bash
cd /Users/steven/AVATARARTS/content
```

**2. No special setup required** - Content files are ready to use

**3. Organize content (optional):**
```bash
# Use organization scripts if available
python3 ../01_TOOLS/scripts/organize_content.py
```

---

### assets/

**Purpose:** Static assets (images, CSS, JS)

**Location:** `/Users/steven/AVATARARTS/assets/`

#### Setup Steps

**1. Navigate to directory:**
```bash
cd /Users/steven/AVATARARTS/assets
```

**2. No special setup required** - Assets are ready to use

---

## Automation & Tools

### scripts/

**Purpose:** Root-level automation scripts

**Location:** `/Users/steven/AVATARARTS/scripts/`

#### Setup Steps

**1. Navigate to directory:**
```bash
cd /Users/steven/AVATARARTS/scripts
```

**2. Make scripts executable:**
```bash
chmod +x *.sh
```

**3. Run setup scripts:**
```bash
./init.sh  # If available
```

#### Dependencies

- Bash/Zsh
- Python 3.8+ (for Python scripts)
- ~/.env.d/ API keys (for some scripts)

---

### n8n/

**Purpose:** n8n workflow automation

**Location:** `/Users/steven/AVATARARTS/n8n/`

#### Setup Steps

**1. Navigate to directory:**
```bash
cd /Users/steven/AVATARARTS/n8n
```

**2. Install n8n:**
```bash
npm install n8n -g
# Or use npx
npx n8n
```

**3. Start n8n:**
```bash
n8n start
# Or
npx n8n start
```

#### Dependencies

- Node.js 18+
- npm
- ~/.env.d/ API keys (for workflows)

#### Access

- Web UI: `http://localhost:5678`

---

## Root Level Files

### Setup Scripts

**Location:** `/Users/steven/AVATARARTS/`

#### setup_avatararts_org.py

**Purpose:** Setup AVATARARTS organization

**Setup:**
```bash
cd /Users/steven/AVATARARTS
python3 setup_avatararts_org.py
```

#### setup_avatararts_website.py

**Purpose:** Setup AVATARARTS website

**Setup:**
```bash
cd /Users/steven/AVATARARTS
python3 setup_avatararts_website.py
```

---

## Quick Setup Checklist

### Initial Setup (Do Once)

- [ ] Install Python 3.8+
- [ ] Install Node.js 18+
- [ ] Install Git
- [ ] Setup ~/.env.d/ API keys
- [ ] Load API keys: `source ~/.env.d/loader.sh llm-apis`

### Per-Folder Setup

- [ ] **00_ACTIVE**: Run `./setup_environment.sh` in business projects
- [ ] **01_TOOLS**: Create venv and install dependencies
- [ ] **docs-docusaurus**: Run `npm install`
- [ ] **docs-mkdocs**: Create venv and `pip install -r requirements.txt`
- [ ] **docs-sphinx**: Create venv and install Sphinx
- [ ] **docs-vitepress**: Run `npm install`
- [ ] **Business systems**: Load API keys and run setup scripts
- [ ] **n8n**: Install globally or use npx

---

## Troubleshooting

### Common Issues

**1. "Command not found"**
```bash
# Check if tool is installed
which python3
which node
which npm

# Install missing tools
brew install python3 node
```

**2. "Module not found" (Python)**
```bash
# Install missing module
pip install module-name

# Or install from requirements
pip install -r requirements.txt
```

**3. "Package not found" (Node.js)**
```bash
# Install dependencies
npm install

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**4. "API Key not found"**
```bash
# Load API keys
source ~/.env.d/loader.sh llm-apis

# Verify keys are loaded
env | grep -i "api_key" | head -3
```

**5. "Port already in use"**
```bash
# Find process using port
lsof -ti:3000  # Replace 3000 with your port

# Kill process
lsof -ti:3000 | xargs kill -9
```

---

## Quick Reference

### Load API Keys
```bash
source ~/.env.d/loader.sh llm-apis
source ~/.env.d/loader.sh llm-apis art-vision audio-music
source ~/.env.d/loader.sh all
```

### Start Documentation Sites
```bash
# Docusaurus
cd docs-docusaurus && npm start

# MkDocs
cd docs-mkdocs && mkdocs serve

# Sphinx
cd docs-sphinx && make html

# VitePress
cd docs-vitepress && npm run dev
```

### Run Analysis Tools
```bash
cd 01_TOOLS/scripts
python3 analyze_structure.py
python3 deep_comprehensive_analysis.py
```

### Start Business Systems
```bash
cd 00_ACTIVE/BUSINESS/passive-income-empire
./launch_empire.sh
```

---

**Last Updated:** January 13, 2026
**Maintained by:** Steven Chaplinski
