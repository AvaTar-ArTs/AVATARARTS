# 🎯 Targeted Cleanup Plan
## Actionable Strategy for .cache, .local, and .ollama

**Based on:** Actual directory analysis  
**Total Size:** 5.5 GB  
**Potential Savings:** ~2-3 GB

---

## 📊 Actual Breakdown

### `.cache` - 2.3 GB (Actual, not 4.07 GB)

| Directory | Size | Type | Action |
|-----------|------|------|--------|
| `huggingface/` | 1.7 GB | ML Model Cache | ⚠️ **Review** (keep active models) |
| `pre-commit/` | 197 MB | Git Hooks Cache | 🧹 **Clean** (can regenerate) |
| `chroma/` | 166 MB | Vector DB Cache | ⚠️ **Review** (might be in use) |
| `whisper/` | 139 MB | ML Model Cache | ⚠️ **Review** (keep if using) |
| `node/` | 25 MB | Node.js Cache | 🧹 **Clean** (can regenerate) |
| `uv/` | 19 MB | UV Package Cache | 🧹 **Clean** (can regenerate) |
| Others | <2 MB | Various | ✅ Minimal |

**Total Cleanable (Safe):** ~241 MB (pre-commit, node, uv)  
**Total Review Needed:** ~2.0 GB (huggingface, chroma, whisper)

### `.local` - 2.0 GB

| Directory | Size | Type | Action |
|-----------|------|------|--------|
| `lib/` | 1.1 GB | Libraries | ⚠️ **Review** (check what's installed) |
| `share/` | 694 MB | Shared Data | ⚠️ **Review** (application data) |
| `state/` | 88 MB | App State | 🧹 **Clean** (old state files) |
| `bin/` | 86 MB | Binaries | ✅ **Keep** (installed tools) |
| Others | <100 KB | Config | ✅ Minimal |

**Total Cleanable (Safe):** ~88 MB (old state)  
**Total Review Needed:** ~1.8 GB (lib, share)

### `.ollama` - 1.2 GB ✅

| Item | Size | Type | Action |
|------|------|------|--------|
| `models/` | ~1.2 GB | ML Models | ✅ **Keep** (essential) |
| `logs/` | Small | Logs | 🧹 **Clean** (old logs) |

**Total Cleanable:** Logs only (minimal)  
**Total Keep:** 1.2 GB (models)

---

## 🧹 Cleanup Actions

### Immediate Safe Cleanup (~330 MB)

#### 1. Clean Package Caches
```bash
# Pre-commit cache (197 MB)
rm -rf ~/.cache/pre-commit/*

# Node.js cache (25 MB)
npm cache clean --force
# or
rm -rf ~/.cache/node/*

# UV cache (19 MB)
rm -rf ~/.cache/uv/*
```

**Savings:** ~241 MB

#### 2. Clean Old Application State
```bash
# Old state files (88 MB)
find ~/.local/state -type f -mtime +90 -delete

# Old logs
find ~/.ollama/logs -type f -mtime +30 -delete
```

**Savings:** ~88 MB

**Total Immediate Savings:** ~330 MB

---

### Review Before Cleaning (~3.8 GB)

#### 1. HuggingFace Cache (1.7 GB) ⚠️
**Analysis Needed:**
```bash
# See what models are cached
du -sh ~/.cache/huggingface/* | sort -hr

# Check if models are in use
# Review your projects for HuggingFace usage
```

**Decision:**
- **Keep:** Models you actively use
- **Clean:** Unused/old model downloads
- **Potential Savings:** 500 MB - 1.2 GB (if many unused)

#### 2. Chroma Cache (166 MB) ⚠️
**Analysis Needed:**
```bash
# Check if ChromaDB is actively used
# Review: ~/.env.d/vector-memory.env
# You have CHROMADB_API_KEY configured
```

**Decision:**
- **Keep:** If actively using ChromaDB
- **Clean:** If not using (but you have it configured, so probably keep)
- **Potential Savings:** 0-166 MB

#### 3. Whisper Cache (139 MB) ⚠️
**Analysis Needed:**
```bash
# Check if using Whisper for transcription
# You have transcription scripts in ~/scripts/transcription/
```

**Decision:**
- **Keep:** If using Whisper
- **Clean:** If not using
- **Potential Savings:** 0-139 MB

#### 4. .local/lib (1.1 GB) ⚠️
**Analysis Needed:**
```bash
# See what's installed
du -sh ~/.local/lib/* | sort -hr

# Check Python packages
pip list --user

# Check pipx packages
pipx list
```

**Decision:**
- **Keep:** Packages you use
- **Clean:** Unused packages
- **Potential Savings:** 200-500 MB (if many unused)

#### 5. .local/share (694 MB) ⚠️
**Analysis Needed:**
```bash
# See what applications are storing data
du -sh ~/.local/share/* | sort -hr
```

**Decision:**
- **Keep:** Active application data
- **Clean:** Unused application data
- **Potential Savings:** 100-300 MB

---

## 🎯 Recommended Cleanup Sequence

### Phase 1: Safe Cleanup (Now) - 330 MB
```bash
# 1. Clean package caches
rm -rf ~/.cache/pre-commit/*
npm cache clean --force
rm -rf ~/.cache/uv/*

# 2. Clean old state
find ~/.local/state -type f -mtime +90 -delete
find ~/.ollama/logs -type f -mtime +30 -delete

# Verify
du -sh ~/.cache ~/.local ~/.ollama
```

**Expected Result:** Save ~330 MB immediately

### Phase 2: Review & Clean (This Week) - 500 MB - 1.5 GB
```bash
# 1. Analyze HuggingFace cache
du -sh ~/.cache/huggingface/* | sort -hr > ~/intelligence/hf_models.txt
# Review and remove unused models

# 2. Analyze .local/lib
du -sh ~/.local/lib/* | sort -hr > ~/intelligence/local_lib.txt
pip list --user > ~/intelligence/pip_packages.txt
# Review and uninstall unused packages

# 3. Analyze .local/share
du -sh ~/.local/share/* | sort -hr > ~/intelligence/local_share.txt
# Review and clean unused app data
```

**Expected Result:** Save additional 500 MB - 1.5 GB

### Phase 3: Deep Clean (Optional) - 500 MB - 1 GB
- Remove all unused HuggingFace models
- Clean all unused Python packages
- Clean all unused application data

**Expected Result:** Save additional 500 MB - 1 GB

---

## 📋 Detailed Cleanup Script

### Script: `cleanup_targeted.sh`

**Features:**
1. Safe cleanup (Phase 1) - automatic
2. Analysis mode (Phase 2) - generates reports
3. Interactive cleanup (Phase 2) - asks before deleting
4. Backup creation
5. Progress reporting

**Usage:**
```bash
# Phase 1: Safe cleanup
~/intelligence/cleanup_targeted.sh safe

# Phase 2: Analysis
~/intelligence/cleanup_targeted.sh analyze

# Phase 2: Interactive cleanup
~/intelligence/cleanup_targeted.sh interactive
```

---

## 🔍 HuggingFace Cache Deep Dive

### What's Likely in `~/.cache/huggingface/`
- Downloaded model files
- Model tokenizers
- Model configs
- Transformers library cache

### Safe to Remove
- Models you don't use
- Old model versions
- Failed downloads

### Keep
- Models you actively use
- Recently downloaded models
- Models referenced in your code

### Analysis Command
```bash
# List all cached models
find ~/.cache/huggingface -name "*.bin" -o -name "*.safetensors" | \
  xargs -I {} dirname {} | sort -u

# Check model sizes
du -sh ~/.cache/huggingface/hub/* 2>/dev/null | sort -hr
```

---

## 🔍 .local/lib Deep Dive

### What's Likely in `~/.local/lib/`
- Python packages (pip install --user)
- pipx installed packages
- Application libraries

### Analysis Commands
```bash
# List pip packages
pip list --user

# List pipx packages
pipx list

# Check package sizes
du -sh ~/.local/lib/python*/site-packages/* | sort -hr | head -20
```

### Safe to Remove
- Unused Python packages
- Old package versions
- Packages you've replaced

### Keep
- Packages you actively use
- Dependencies of your projects
- Recently installed packages

---

## 📊 Expected Savings Summary

### Conservative (Safe Only)
- Package caches: 241 MB
- Old state: 88 MB
- **Total: 330 MB (6%)**

### Moderate (With Review)
- Package caches: 241 MB
- Old state: 88 MB
- HuggingFace (unused): 500 MB
- .local/lib (unused): 200 MB
- .local/share (unused): 100 MB
- **Total: 1.13 GB (21%)**

### Aggressive (Deep Clean)
- Package caches: 241 MB
- Old state: 88 MB
- HuggingFace (all unused): 1.2 GB
- .local/lib (all unused): 500 MB
- .local/share (all unused): 300 MB
- **Total: 2.33 GB (42%)**

---

## ⚠️ Safety Checklist

### Before Cleaning
- [ ] Backup important data
- [ ] Review what will be deleted
- [ ] Check if applications are running
- [ ] Verify you can re-download if needed

### During Cleaning
- [ ] Start with safe cleanup only
- [ ] Verify after each step
- [ ] Check application functionality
- [ ] Monitor disk space

### After Cleaning
- [ ] Verify applications still work
- [ ] Check disk space savings
- [ ] Document what was cleaned
- [ ] Schedule next cleanup

---

## 🛠️ Quick Commands

### Immediate Safe Cleanup
```bash
# One-liner for safe cleanup
rm -rf ~/.cache/pre-commit/* && \
npm cache clean --force && \
rm -rf ~/.cache/uv/* && \
find ~/.local/state -type f -mtime +90 -delete && \
find ~/.ollama/logs -type f -mtime +30 -delete && \
echo "✅ Safe cleanup complete"
```

### Analysis Commands
```bash
# Generate analysis reports
du -sh ~/.cache/* | sort -hr > ~/intelligence/cache_breakdown.txt
du -sh ~/.local/* | sort -hr > ~/intelligence/local_breakdown.txt
du -sh ~/.cache/huggingface/* 2>/dev/null | sort -hr > ~/intelligence/hf_models.txt
pip list --user > ~/intelligence/pip_packages.txt
```

---

## 📈 Monitoring

### Track Before/After
```bash
# Before
du -sh ~/.cache ~/.local ~/.ollama > ~/intelligence/before_cleanup.txt

# After
du -sh ~/.cache ~/.local ~/.ollama > ~/intelligence/after_cleanup.txt

# Compare
diff ~/intelligence/before_cleanup.txt ~/intelligence/after_cleanup.txt
```

---

**Next Steps:** Run safe cleanup first, then review analysis reports for Phase 2.

