# 🎯 Targeted Cache Cleanup Analysis
## Deep Dive: .cache, .local, and .ollama

**Generated:** 2025-01-27  
**Focus:** Three largest hidden folders (7.42 GB total)

---

## 📊 Overview

| Folder | Size | Files | Type | Action |
|--------|------|-------|------|--------|
| `.cache` | 4.07 GB | 9,917 | Cache | 🧹 **Cleanup** |
| `.local` | 2.09 GB | 36,121 | Cache | 🧹 **Cleanup** |
| `.ollama` | 1.26 GB | 27 | ML Models | ✅ **Keep** |
| **Total** | **7.42 GB** | **46,065** | | |

---

## 1. `.cache` - 4.07 GB Analysis

### Current State
- **Size:** 4.07 GB
- **Files:** 9,917
- **Scripts:** 5,788
- **Type:** Application cache

### Top Subdirectories (Analysis Needed)
Run: `du -sh ~/.cache/* | sort -h | tail -20`

### Common Cache Types Found
- **Package Manager Caches:**
  - `pip/` - Python package cache
  - `npm/` - Node.js package cache
  - `uv/` - UV package cache
  - `bun/` - Bun package cache
  
- **Application Caches:**
  - Browser caches
  - IDE caches
  - Build tool caches
  
- **System Caches:**
  - Font caches
  - Image caches
  - Temporary files

### Cleanup Strategy

#### Safe to Clean (High Confidence)
```bash
# Python package caches
pip cache purge
# or
rm -rf ~/.cache/pip/*

# Node.js caches
npm cache clean --force
# or
rm -rf ~/.cache/npm/*

# UV cache (if not needed)
rm -rf ~/.cache/uv/*

# Build caches (if not building)
rm -rf ~/.cache/*/build
```

#### Review Before Cleaning (Medium Confidence)
```bash
# Browser caches (review size first)
du -sh ~/.cache/*browser*
du -sh ~/.cache/*chrome*
du -sh ~/.cache/*firefox*

# IDE caches (can be regenerated)
du -sh ~/.cache/*vscode*
du -sh ~/.cache/*cursor*

# Font caches (usually small)
du -sh ~/.cache/font*
```

#### Keep (Low Confidence - Review First)
- Application-specific caches that might be needed
- Recent downloads
- Active session data

### Estimated Savings
- **Package Caches:** ~2-3 GB (50-75%)
- **Application Caches:** ~500 MB - 1 GB (12-25%)
- **Total Potential:** ~2.5-4 GB (60-100%)

---

## 2. `.local` - 2.09 GB Analysis

### Current State
- **Size:** 2.09 GB
- **Files:** 36,121
- **Scripts:** 14,834
- **Type:** Local application data

### Top Subdirectories (Analysis Needed)
Run: `du -sh ~/.local/* | sort -h | tail -20`

### Common Contents
- **Application Data:**
  - `share/` - Shared application data
  - `bin/` - Local binaries
  - `lib/` - Local libraries
  - `state/` - Application state
  
- **Package Scripts:**
  - Installed package scripts
  - Python packages (pipx, etc.)
  - Node.js global packages

### Cleanup Strategy

#### Safe to Clean
```bash
# Unused Python packages (pipx)
pipx list
pipx uninstall <unused-packages>

# Old application state
find ~/.local/state -type f -mtime +90 -delete

# Temporary files
find ~/.local -name "*.tmp" -delete
find ~/.local -name "*.cache" -delete
```

#### Review Before Cleaning
```bash
# Check what's using space
du -sh ~/.local/share/*
du -sh ~/.local/lib/*
du -sh ~/.local/state/*

# Review installed packages
ls -la ~/.local/bin/
pipx list
```

#### Keep
- Active application data
- Installed tools you use
- Recent state files

### Estimated Savings
- **Unused Packages:** ~500 MB - 1 GB (25-50%)
- **Old State:** ~200-500 MB (10-25%)
- **Total Potential:** ~700 MB - 1.5 GB (35-75%)

---

## 3. `.ollama` - 1.26 GB Analysis

### Current State
- **Size:** 1.26 GB
- **Files:** 27
- **Type:** ML Model Storage
- **Action:** ✅ **KEEP** (Essential)

### Contents
- Ollama language models
- Model files (typically large binary files)
- Model metadata

### Why Keep
- **Essential:** These are downloaded ML models
- **Expensive to Re-download:** Models take time/bandwidth
- **Active Use:** Likely used by your workflows
- **Small Relative to Cache:** Only 1.26 GB vs 6.16 GB cache

### Management Strategy
```bash
# List installed models
ollama list

# Remove unused models (if any)
ollama rm <model-name>

# Check model sizes
du -sh ~/.ollama/*
```

### Recommendation
- ✅ **Keep all models** (unless you know some are unused)
- ⚠️ **Review periodically** - Remove models you don't use
- 📊 **Monitor growth** - Track as you add new models

---

## 🧹 Comprehensive Cleanup Script

### Script: `cleanup_cache_comprehensive.sh`

**Features:**
1. Analyzes `.cache` and `.local` in detail
2. Identifies safe cleanup targets
3. Creates backups before deletion
4. Reports savings
5. Dry-run mode

**Usage:**
```bash
# Preview what would be cleaned
~/intelligence/cleanup_cache_comprehensive.sh dry-run

# Actually clean
~/intelligence/cleanup_cache_comprehensive.sh execute
```

---

## 📊 Detailed Breakdown

### `.cache` Subdirectory Analysis

**To identify largest consumers:**
```bash
cd ~/.cache
du -sh * | sort -h | tail -20
```

**Common large directories:**
- `pip/` - Python packages
- `npm/` - Node.js packages  
- `uv/` - UV package manager
- `browser/` - Browser caches
- `vscode/` or `cursor/` - IDE caches

### `.local` Subdirectory Analysis

**To identify largest consumers:**
```bash
cd ~/.local
du -sh * | sort -h | tail -20
```

**Common large directories:**
- `share/` - Application shared data
- `lib/` - Local libraries
- `state/` - Application state
- `bin/` - Local binaries

---

## 🎯 Action Plan

### Step 1: Analyze (5 minutes)
```bash
# Analyze .cache
du -sh ~/.cache/* | sort -h | tail -20 > ~/intelligence/cache_analysis.txt

# Analyze .local  
du -sh ~/.local/* | sort -h | tail -20 > ~/intelligence/local_analysis.txt

# Review results
cat ~/intelligence/cache_analysis.txt
cat ~/intelligence/local_analysis.txt
```

### Step 2: Clean Package Caches (10 minutes)
```bash
# Python
pip cache purge

# Node.js
npm cache clean --force

# Bun (if used)
bun pm cache rm

# UV (if used)
# Check: du -sh ~/.cache/uv
```

### Step 3: Clean Application Caches (15 minutes)
```bash
# Review browser caches
du -sh ~/.cache/*browser* ~/.cache/*chrome* ~/.cache/*firefox*

# Clean if large (optional)
# rm -rf ~/.cache/*browser*

# Review IDE caches
du -sh ~/.cache/*vscode* ~/.cache/*cursor*

# Clean if large (optional - will regenerate)
# rm -rf ~/.cache/*vscode*
```

### Step 4: Clean .local (10 minutes)
```bash
# List pipx packages
pipx list

# Remove unused
pipx uninstall <package>

# Clean old state
find ~/.local/state -type f -mtime +90 -delete
```

### Step 5: Verify Savings
```bash
# Check new sizes
du -sh ~/.cache
du -sh ~/.local
```

---

## 📈 Expected Results

### Before Cleanup
- `.cache`: 4.07 GB
- `.local`: 2.09 GB
- **Total:** 6.16 GB

### After Cleanup (Conservative)
- `.cache`: 1.5-2 GB (save 2-2.5 GB)
- `.local`: 1.2-1.5 GB (save 600-900 MB)
- **Total:** 2.7-3.5 GB (save 2.6-3.4 GB)

### After Cleanup (Aggressive)
- `.cache`: 500 MB - 1 GB (save 3-3.5 GB)
- `.local`: 700 MB - 1 GB (save 1-1.4 GB)
- **Total:** 1.2-2 GB (save 4.2-5 GB)

---

## ⚠️ Safety Considerations

### Always Safe
- ✅ Package manager caches (can re-download)
- ✅ Build caches (can rebuild)
- ✅ Temporary files

### Review First
- ⚠️ Browser caches (will need to re-login to sites)
- ⚠️ IDE caches (will regenerate but slower first time)
- ⚠️ Application state (might lose preferences)

### Never Delete
- ❌ `.ollama/` models (expensive to re-download)
- ❌ Active application data
- ❌ Recent downloads

---

## 🛠️ Automated Cleanup Script

**File:** `cleanup_cache_comprehensive.sh`

**Features:**
- Detailed analysis of both folders
- Safe package cache cleanup
- Backup creation
- Progress reporting
- Dry-run mode

---

## 📝 Maintenance Schedule

### Weekly
- Review cache sizes
- Clean package caches

### Monthly  
- Full cache cleanup
- Review .local packages
- Remove unused models from .ollama

### Quarterly
- Deep analysis
- Review all hidden folders
- Update cleanup scripts

---

**Next Steps:** Run analysis commands to identify specific cleanup targets, then execute cleanup.

