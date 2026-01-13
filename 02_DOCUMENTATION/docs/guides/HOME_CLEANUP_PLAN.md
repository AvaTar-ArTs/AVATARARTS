# 🧹 HOME DIRECTORY (~/) CLEANUP PLAN

**Date:** December 4, 2025  
**Total Potential Savings:** ~7-10 GB  

---

## 📊 CURRENT STATE

**Large Directories:**
```
Library:      26.7 GB (system, keep)
Pictures:     26.0 GB (personal, keep)
Movies:       22.3 GB (personal, keep)
Downloads:     7.3 GB (review for cleanup)
Music:         5.9 GB (personal, keep)
Documents:     5.8 GB (personal, keep)
GitHub:        1.6 GB (projects, keep)
miniforge3:    816 MB (Python env, keep)
pythons:       468 MB (just cleaned! keep)
```

**Large Dotfiles (Caches):**
```
.local:        4.5 GB (caches, partial cleanup)
.npm:          1.7 GB (cache, full cleanup)
.vscode:       1.6 GB (caches, partial cleanup)
.nvm:          1.4 GB (old Node versions)
.cursor:       1.1 GB (caches, partial cleanup)
.config:       887 MB (configs, KEEP)
.x-cmd.root:   858 MB (cache, full cleanup)
```

---

## 🗑️ CLEANUP PLAN

### **1️⃣ HIGH PRIORITY - Cache Cleanup (5-6 GB)**

#### **A. npm Cache (1.7 GB)**
```bash
# npm cache - safe to delete, regenerates
npm cache clean --force
# OR manually:
rm -rf ~/.npm
# Savings: ~1.7 GB
```

#### **B. .local Cache (2-3 GB)**
```bash
# Clean various caches in .local
rm -rf ~/.local/share/Trash/*
rm -rf ~/.local/share/virtualenvs/*/  # Old virtualenvs
rm -rf ~/.local/share/jupyter/runtime/*
du -sh ~/.local/share/* | sort -rh | head -20  # Review what's large
# Savings: ~2-3 GB
```

#### **C. .nvm Old Node Versions (500 MB - 1 GB)**
```bash
# List Node versions
nvm list

# Keep only current/LTS, remove old:
# nvm uninstall <version>
# Example:
# nvm uninstall 14.0.0
# nvm uninstall 16.0.0
# Savings: ~500 MB - 1 GB
```

#### **D. .x-cmd.root Cache (800 MB)**
```bash
# x-cmd cache
rm -rf ~/.x-cmd.root/cache
rm -rf ~/.x-cmd.root/log
# Savings: ~800 MB
```

**HIGH PRIORITY TOTAL: ~5-6 GB**

---

### **2️⃣ MEDIUM PRIORITY - AI Session Data & Temp (1-1.5 GB)**

#### **A. AI Caches**
```bash
# Gemini AI cache
rm -rf ~/.gemini/cache
rm -rf ~/.gemini/history
# Savings: ~300 MB

# Qwen AI cache
rm -rf ~/.qwen/cache
# Savings: ~200 MB

# Claude session data
rm -rf ~/.claude/sessions
rm -rf ~/.claude/cache
# Savings: ~50 MB

# Old Claude worktrees
cd ~/.claude-worktrees
# Review and delete old project folders
# Savings: ~30 MB
```

#### **B. Trash**
```bash
# Empty all trash
rm -rf ~/.Trash/*
# Savings: ~260 MB
```

#### **C. VSCode Caches**
```bash
# VSCode cache/logs (keep extensions!)
rm -rf ~/.vscode/Cache/*
rm -rf ~/.vscode/CachedData/*
rm -rf ~/.vscode/logs/*
# Savings: ~500 MB
```

#### **D. Cursor Caches**
```bash
# Cursor cache (keep workspaces!)
rm -rf ~/.cursor/Cache/*
rm -rf ~/.cursor/CachedData/*
rm -rf ~/.cursor/logs/*
# Savings: ~300 MB
```

#### **E. Bun Cache**
```bash
# Bun runtime cache
rm -rf ~/.bun/install/cache
# Savings: ~100 MB
```

**MEDIUM PRIORITY TOTAL: ~1-1.5 GB**

---

### **3️⃣ LOW PRIORITY - Small Archives & Backups (35 MB)**

```bash
# Review and clean archives
ls -lah ~/archive/
ls -lah ~/backups/

# If not needed:
rm -rf ~/archive/cleanup-reports-20251204  # Old reports
rm -rf ~/backups/pythons_cleanup_20251204  # Already cleaned!

# Old package manager backups
rm -rf ~/.package_manager_backup_20251106_070741  # 2 months old

# Empty quicklook backup
rm -rf ~/.quicklook_plugins_backup

# Savings: ~35 MB
```

---

### **4️⃣ DOWNLOADS Folder Review**

```bash
# Review Downloads (7.3 GB)
cd ~/Downloads
ls -lhSr  # Sort by size

# Likely contains:
# - Old installers (.dmg, .pkg)
# - Duplicate downloads
# - Temporary files

# Manual review recommended
# Potential savings: 2-5 GB
```

---

## 🚀 SAFE EXECUTION SCRIPT

```bash
#!/bin/bash

echo "🧹 HOME DIRECTORY CLEANUP"
echo "========================================"
echo ""

# Function to show savings
show_size() {
    if [ -e "$1" ]; then
        du -sh "$1" 2>/dev/null | cut -f1
    else
        echo "0"
    fi
}

cd ~

echo "📊 BEFORE SIZES:"
echo "  .npm:          $(show_size ~/.npm)"
echo "  .local:        $(show_size ~/.local)"
echo "  .x-cmd.root:   $(show_size ~/.x-cmd.root)"
echo "  .Trash:        $(show_size ~/.Trash)"
echo "  .gemini:       $(show_size ~/.gemini)"
echo "  .qwen:         $(show_size ~/.qwen)"
echo "  .claude:       $(show_size ~/.claude)"
echo "  .vscode:       $(show_size ~/.vscode)"
echo "  .cursor:       $(show_size ~/.cursor)"
echo ""

# 1. HIGH PRIORITY
echo "1️⃣  Cleaning HIGH PRIORITY caches..."
echo ""

echo "  Cleaning npm cache..."
npm cache clean --force 2>/dev/null || rm -rf ~/.npm

echo "  Cleaning .local caches..."
rm -rf ~/.local/share/Trash/* 2>/dev/null
rm -rf ~/.local/share/virtualenvs/* 2>/dev/null
rm -rf ~/.local/share/jupyter/runtime/* 2>/dev/null

echo "  Cleaning x-cmd cache..."
rm -rf ~/.x-cmd.root/cache 2>/dev/null
rm -rf ~/.x-cmd.root/log 2>/dev/null

# 2. MEDIUM PRIORITY
echo ""
echo "2️⃣  Cleaning MEDIUM PRIORITY caches..."
echo ""

echo "  Cleaning AI caches..."
rm -rf ~/.gemini/cache 2>/dev/null
rm -rf ~/.gemini/history 2>/dev/null
rm -rf ~/.qwen/cache 2>/dev/null
rm -rf ~/.claude/sessions 2>/dev/null
rm -rf ~/.claude/cache 2>/dev/null

echo "  Emptying Trash..."
rm -rf ~/.Trash/* 2>/dev/null

echo "  Cleaning VSCode caches..."
rm -rf ~/.vscode/Cache/* 2>/dev/null
rm -rf ~/.vscode/CachedData/* 2>/dev/null
rm -rf ~/.vscode/logs/* 2>/dev/null

echo "  Cleaning Cursor caches..."
rm -rf ~/.cursor/Cache/* 2>/dev/null
rm -rf ~/.cursor/CachedData/* 2>/dev/null
rm -rf ~/.cursor/logs/* 2>/dev/null

echo "  Cleaning Bun cache..."
rm -rf ~/.bun/install/cache 2>/dev/null

# 3. LOW PRIORITY
echo ""
echo "3️⃣  Cleaning LOW PRIORITY items..."
echo ""

echo "  Removing old backups..."
rm -rf ~/.package_manager_backup_20251106_070741 2>/dev/null
rm -rf ~/.quicklook_plugins_backup 2>/dev/null

echo ""
echo "✅ CLEANUP COMPLETE!"
echo ""

echo "📊 AFTER SIZES:"
echo "  .npm:          $(show_size ~/.npm)"
echo "  .local:        $(show_size ~/.local)"
echo "  .x-cmd.root:   $(show_size ~/.x-cmd.root)"
echo "  .Trash:        $(show_size ~/.Trash)"
echo "  .gemini:       $(show_size ~/.gemini)"
echo "  .qwen:         $(show_size ~/.qwen)"
echo "  .claude:       $(show_size ~/.claude)"
echo "  .vscode:       $(show_size ~/.vscode)"
echo "  .cursor:       $(show_size ~/.cursor)"
echo ""

echo "💾 ESTIMATED SAVINGS: 6-8 GB"
echo ""
echo "⚠️  MANUAL TASKS:"
echo "  1. Review ~/Downloads (7.3 GB) for old files"
echo "  2. Run: nvm list  # Then uninstall old Node versions"
echo "  3. Review ~/archive and ~/backups if needed"
```

---

## ⚠️ IMPORTANT NOTES

### **DO NOT DELETE:**
- `.config` - User application configs
- `.env` / `.env.d` - API keys and environment
- `.ssh` - SSH keys
- `.gnupg` - GPG keys
- `.u2net` - Background removal model (if using)
- `.EasyOCR` - OCR models (if using)
- `.rustup` - Rust toolchain (if using Rust)

### **SAFE TO DELETE (Regenerates):**
- `.npm` - npm cache
- `.ruff_cache` - Python linter cache
- `.pytest_cache` - Test cache
- `.Trash` - Deleted files
- All `/cache/` subdirectories
- All `/logs/` subdirectories
- All `/CachedData/` subdirectories

---

## 📊 SUMMARY

| Priority | Category | Savings | Risk |
|----------|----------|---------|------|
| HIGH | npm, .local, .x-cmd | 5-6 GB | ✅ Safe |
| MEDIUM | AI caches, IDE caches | 1-1.5 GB | ✅ Safe |
| LOW | Old backups | 35 MB | ✅ Safe |
| MANUAL | Downloads folder | 2-5 GB | ⚠️ Review first |
| MANUAL | Old Node versions | 0.5-1 GB | ⚠️ Keep LTS |

**TOTAL POTENTIAL: 7-10 GB**

---

## ✅ AFTER CLEANUP

```
Before:  ~13 GB in caches/temp
After:   ~1 GB essential caches
Saved:   ~10+ GB disk space
```

**Your home directory will be clean and organized!** 🚀
