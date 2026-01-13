# 🛠️ CleanConnect Pro 2.0 - Installation Methods

This guide covers multiple ways to set up CleanConnect Pro 2.0 with all dependencies.

---

## 📋 Table of Contents

1. [Quick Setup (Bash Script)](#quick-setup-bash-script)
2. [Mamba/Conda Environment](#mambaconda-environment)
3. [Manual Installation](#manual-installation)
4. [Docker Setup (Coming Soon)](#docker-setup-coming-soon)
5. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Setup (Bash Script)

### Overview
The automated bash script handles complete setup in one command, including dependency checking, installation, and database setup.

### Files
- **`setup.sh`** - Main setup script (executable)

### Quick Start

```bash
# 1. Make script executable (if needed)
chmod +x setup.sh

# 2. Run with default options
bash setup.sh

# 3. Follow on-screen prompts
```

### Usage Options

```bash
# Full setup with all features
bash setup.sh

# Check dependencies only (don't install)
bash setup.sh --check-only

# Skip database setup
bash setup.sh --skip-db

# Show verbose output
bash setup.sh --verbose

# Show help
bash setup.sh --help
```

### What the Script Does

✅ **Dependency Checking**
- Checks for Node.js 18+
- Verifies Yarn 3+
- Checks npm installation
- Validates PostgreSQL 14+
- Confirms Git availability
- Checks for optional tools (curl, make)

✅ **Installation** (if missing)
- Installs Node.js via package manager
- Installs Yarn globally
- Installs PostgreSQL
- Starts PostgreSQL service

✅ **Project Setup**
- Creates .env file from template
- Installs root dependencies
- Installs backend dependencies
- Installs frontend dependencies

✅ **Database Setup**
- Creates PostgreSQL database
- Applies database schema
- Loads sample data (if available)

### macOS Example

```bash
# Navigate to project
cd ~/path/to/cleanconnect-pro

# Run setup script
bash setup.sh

# Output:
# ✅ Checking dependencies...
# ✅ Node.js found: v18.18.2
# ✅ npm found: v9.8.1
# ✅ Yarn found: v4.0.2
# ...
# ✅ Setup Complete!
```

### Linux Example

```bash
# Navigate to project
cd ~/path/to/cleanconnect-pro

# Run setup script (may need sudo for some operations)
bash setup.sh

# Will prompt to install missing dependencies
# Handles apt package manager automatically
```

### Script Features

| Feature                | Description                            |
| ---------------------- | -------------------------------------- |
| **Auto-Detection**     | Detects OS and package manager         |
| **Color Output**       | Easy-to-read colored status messages   |
| **Error Handling**     | Stops and reports on errors            |
| **Flexible Options**   | Multiple flags for different scenarios |
| **User Prompts**       | Interactive dependency installation    |
| **Clear Instructions** | Shows next steps after completion      |

---

## 🐍 Mamba/Conda Environment

### Overview
Use Mamba or Conda to create an isolated Python/Node.js environment with all dependencies.

### Files
- **`environment.yml`** - Environment specification file

### Prerequisites

#### Install Mamba (Recommended)
```bash
# macOS via Homebrew
brew install mambaforge

# Linux via official installer
wget https://github.com/conda-forge/miniforge/releases/latest/download/Mambaforge-Linux-x86_64.sh
bash Mambaforge-Linux-x86_64.sh

# Or use Conda
conda install -c conda-forge mamba
```

#### Or Install Conda
```bash
# Miniconda (lighter than Anaconda)
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
bash Miniconda3-latest-Linux-x86_64.sh

# Or download Anaconda from https://www.anaconda.com/download
```

### Setup with Mamba

```bash
# 1. Navigate to project
cd /path/to/cleanconnect-pro

# 2. Create environment from file
mamba env create -f environment.yml

# 3. Activate environment
mamba activate cleanconnect-pro

# 4. Verify installation
node --version      # Should show v18.x.x
yarn --version      # Should show 4.x.x
psql --version      # Should show PostgreSQL 14+
python --version    # Should show 3.11+
```

### Setup with Conda

```bash
# Same steps but use conda instead of mamba
conda env create -f environment.yml
conda activate cleanconnect-pro

# Continue with project setup
yarn install
```

### Environment Management

```bash
# List all environments
mamba env list
conda env list

# Update environment with new file
mamba env update -f environment.yml --prune
conda env update -f environment.yml --prune

# Remove environment
mamba env remove -n cleanconnect-pro
conda env remove -n cleanconnect-pro

# Create backup
mamba env export > environment-backup.yml

# Deactivate environment
conda deactivate
```

### Environment Contents

The `environment.yml` includes:

**Core Runtime:**
- Python 3.11
- Node.js 18.18.2
- Yarn 4.0.2

**Build Tools:**
- make, cmake, pkg-config
- gcc, g++

**Database:**
- PostgreSQL 14
- libpq

**System Utilities:**
- git, curl, wget, jq
- grep, sed, awk

**Development:**
- vim, nano, htop, lsof

**Optional Python Tools:**
- pandas, numpy, matplotlib
- psycopg2-binary, paramiko, requests

### Python Packages in Environment

```yaml
pip:
  - python-dotenv==1.0.0
  - psycopg2-binary==2.9.9
  - paramiko==3.4.0
  - requests==2.31.0
  - pyyaml==6.0.1
```

### Advantages of Conda/Mamba

✅ **Isolated Environment** - No system-wide installation conflicts
✅ **Easy Management** - Simple activate/deactivate
✅ **Binary Packages** - Often faster than compilation
✅ **Version Control** - Consistent across machines
✅ **Easy Backup** - Export environment to file
✅ **Multiple Environments** - Run different versions side-by-side

---

## 📦 Manual Installation

### Prerequisites

Ensure these are installed on your system:

| Tool           | Version | Installation                              |
| -------------- | ------- | ----------------------------------------- |
| **Node.js**    | 18.0.0+ | [nodejs.org](https://nodejs.org/)         |
| **Yarn**       | 3.0.0+  | `npm install -g yarn`                     |
| **PostgreSQL** | 14+     | [postgresql.org](https://postgresql.org/) |
| **Git**        | Latest  | [git-scm.com](https://git-scm.com/)       |

### Step 1: Install Node.js

**macOS:**
```bash
# Via Homebrew
brew install node@18

# Or download from nodejs.org
# Then verify
node --version
npm --version
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Linux (Fedora/RHEL):**
```bash
sudo dnf install nodejs npm
```

### Step 2: Install Yarn

```bash
# Via npm (works everywhere)
npm install -g yarn

# Via Homebrew (macOS)
brew install yarn

# Via apt (Linux)
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn

# Verify
yarn --version
```

### Step 3: Install PostgreSQL

**macOS:**
```bash
# Via Homebrew
brew install postgresql@14
brew services start postgresql@14

# Verify
psql --version
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify
psql --version
```

**Linux (Fedora/RHEL):**
```bash
sudo dnf install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Step 4: Clone Repository

```bash
git clone https://github.com/quantumforgelabs/cleanconnect-pro.git
cd cleanconnect-pro
```

### Step 5: Install Dependencies

```bash
# Root dependencies
yarn install

# Backend
cd backend && yarn install && cd ..

# Frontend
cd frontend && yarn install && cd ..

# Mobile (optional)
cd mobile && yarn install && cd ..

# Admin (optional)
cd admin && yarn install && cd ..
```

### Step 6: Setup Environment

```bash
cp .env.example .env
nano .env  # Edit with your configuration
```

### Step 7: Setup Database

```bash
# Create database
createdb cleanconnect_pro_dev

# Apply schema
psql -d cleanconnect_pro_dev -f database/database-schema.sql

# Load sample data (optional)
psql -d cleanconnect_pro_dev -f database/sample-data.sql
```

### Step 8: Start Development

```bash
# Terminal 1: Backend
yarn dev:api

# Terminal 2: Frontend
yarn dev:frontend

# Terminal 3: Mobile (optional)
yarn dev:mobile
```

---

## 🐳 Docker Setup (Coming Soon)

Docker support is planned for version 2.1. This will include:

- ✅ Containerized backend API
- ✅ Containerized frontend
- ✅ PostgreSQL container
- ✅ Redis cache container
- ✅ Docker Compose configuration
- ✅ Development and production configs

**Stay tuned!**

---

## 🆘 Troubleshooting

### Bash Script Issues

**"Permission denied" error:**
```bash
chmod +x setup.sh
bash setup.sh
```

**Script exits with errors:**
```bash
# Run with verbose output
bash setup.sh --verbose

# Or check dependencies first
bash setup.sh --check-only
```

**Installation asks for password multiple times:**
- This is normal for Homebrew/apt
- Ensure you have admin/sudo access

### Conda/Mamba Issues

**"mamba: command not found":**
```bash
# Install Mamba
brew install mambaforge

# Or use Conda
conda install -c conda-forge mamba
```

**Environment not activating:**
```bash
# Re-initialize shell
conda init bash
# or
conda init zsh

# Restart terminal and try again
mamba activate cleanconnect-pro
```

**Dependency conflicts:**
```bash
# Solve conflicts automatically
mamba env update -f environment.yml --prune

# Or start fresh
mamba env remove -n cleanconnect-pro
mamba env create -f environment.yml
```

### General Issues

**"Port 3000 already in use":**
```bash
# Find and kill process
lsof -i :3000
kill -9 <PID>

# Or use different port
PORT=3001 yarn dev:api
```

**"PostgreSQL connection refused":**
```bash
# Check if PostgreSQL is running
psql --version

# Start PostgreSQL
brew services start postgresql@14  # macOS
sudo systemctl start postgresql     # Linux

# Create database
createdb cleanconnect_pro_dev
```

**"Yarn cache issues":**
```bash
# Clear cache
yarn cache clean

# Remove and reinstall
rm -rf node_modules yarn.lock
yarn install
```

---

## 📊 Comparison of Installation Methods

| Feature             | Bash Script   | Mamba/Conda  | Manual        |
| ------------------- | ------------- | ------------ | ------------- |
| **Speed**           | ⚡ Fastest     | ⚡⚡ Very Fast | ⚡⚡⚡ Slowest   |
| **Automation**      | ✅ Full        | ✅ Partial    | ❌ None        |
| **Isolation**       | ❌ System-wide | ✅ Isolated   | ❌ System-wide |
| **Control**         | Low           | Medium       | ✅ Full        |
| **Reproducibility** | Medium        | ✅ Excellent  | Low           |
| **OS Support**      | macOS/Linux   | ✅ All        | ✅ All         |
| **Learning**        | None          | Medium       | ✅ High        |

---

## 🎯 Recommended Setup

### For Most Users
**Use the Bash Script:**
```bash
bash setup.sh
```
- Fastest
- Fully automated
- Handles everything

### For Data Scientists/Python Users
**Use Mamba/Conda:**
```bash
mamba env create -f environment.yml
mamba activate cleanconnect-pro
```
- Isolated environment
- Easy to manage multiple versions
- Includes Python tools

### For Advanced Users
**Manual Installation:**
- More control
- Better understanding of setup
- Useful for CI/CD integration

---

## 📚 Next Steps

After installation completes:

1. **Edit Configuration:**
   ```bash
   nano .env
   ```

2. **Verify Setup:**
   ```bash
   node --version
   yarn --version
   psql --version
   ```

3. **Start Development:**
   ```bash
   yarn dev
   ```

4. **Read Documentation:**
   - `README.md` - Quick start
   - `YARN_SETUP.md` - Detailed setup
   - `docs/api-endpoints.md` - API reference

---

## 📞 Support

- 📧 **Email:** dev@quantumforgelabs.org
- 💬 **Discord:** [Community](https://discord.gg/quantumforgelabs)
- 🐛 **Issues:** [GitHub](https://github.com/quantumforgelabs/cleanconnect-pro/issues)

---

**Built with ❤️ by [Quantum Forge Labs](https://quantumforgelabs.org)**

© 2025 CleanConnect Pro. All rights reserved.
