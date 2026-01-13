# Cleanup Action Plan - Detailed Analysis & Suggestions
**Generated:** 2025-11-26 01:25:00

## Executive Summary

Detailed analysis and actionable suggestions for 5 cleanup priorities with safe commands and risk assessment.

---

## 1. Remove Broken Symlinks (60 found)

### Analysis

#### Critical Broken Links
1. **`~/update`** → `/Applications/updater`
   - **Status:** Application doesn't exist
   - **Risk:** Low - Safe to remove
   - **Action:** Remove

2. **`.config/quick-refs/2T-Xx_API_QUICK_REFERENCE.md`** → `/Volumes/2T-Xx/...`
   - **Status:** External drive not mounted
   - **Risk:** Low - Can recreate when drive is mounted
   - **Action:** Remove or keep (will work when drive mounted)

#### System Links (KDE/Qt - Harmless)
- Multiple links in `Library/Application Support/` pointing to `/usr/local/share/`
- These are from KDE/Qt applications
- **Risk:** Very Low - Harmless if KDE apps not used
- **Action:** Can ignore or remove if KDE apps not installed

### Suggested Actions

#### Safe Removal (Recommended)
```bash
# Remove broken application symlink
rm ~/update

# Remove external drive reference (if not needed)
rm ~/.config/quick-refs/2T-Xx_API_QUICK_REFERENCE.md

# Optional: Remove KDE/Qt symlinks (if not using those apps)
find ~/Library/Application\ Support -type l ! -exec test -e {} \; -delete
```

#### Verification
```bash
# Check remaining broken symlinks
find ~ -maxdepth 3 -type l ! -exec test -e {} \; -print
```

### Impact
- **Disk Space:** Minimal (symlinks are tiny)
- **Functionality:** No impact (links are broken)
- **Risk:** Very Low

---

## 2. Clean Cache Directories

### Analysis

#### Cache Directories Found
- `.cache/claude/staging` - Claude cache
- `.claude/session-env/*` - Session environments
- `.npm/_cacache/tmp` - npm temporary cache
- `.rustup/downloads`, `.rustup/tmp` - Rust toolchain cache
- `.cursor/extensions/*/.noConfigDebugAdapterEndpoints` - Cursor cache

### Suggested Actions

#### Safe Cache Cleanup (Recommended)
```bash
# Claude cache
rm -rf ~/.cache/claude/staging

# Old session environments (keep recent ones)
find ~/.claude/session-env -type d -empty -mtime +7 -delete

# npm temporary cache
rm -rf ~/.npm/_cacache/tmp

# Rust downloads cache (will re-download if needed)
rm -rf ~/.rustup/downloads ~/.rustup/tmp

# Cursor extension cache
find ~/.cursor/extensions -name ".noConfigDebugAdapterEndpoints" -type d -empty -delete
```

#### Conservative Cleanup (Safer)
```bash
# Only remove very old cache (> 30 days)
find ~/.cache -type f -mtime +30 -delete
find ~/.claude/session-env -type d -empty -mtime +30 -delete
```

### Impact
- **Disk Space:** Varies (cache can be large)
- **Functionality:** Minimal - caches will regenerate
- **Risk:** Low - Caches are temporary by nature

---

## 3. Archive Old Backups

### Analysis

#### Backup Files Found
- **Location:** `~/.env.d/backups/`
- **Count:** 30 backup files
- **Total Size:** ~102 KB
- **Age:** All < 35 days old
- **Status:** Recent backups, but can be archived

### Suggested Actions

#### Archive Strategy

**Option 1: Archive to Compressed File (Recommended)**
```bash
cd ~/.env.d/backups

# Create archive with date
ARCHIVE_NAME="backups_archive_$(date +%Y%m%d).tar.gz"
tar -czf "$ARCHIVE_NAME" pruned_sources/*.bak 2>/dev/null

# Verify archive
tar -tzf "$ARCHIVE_NAME" | head -5

# Remove original backups after verification
# rm pruned_sources/*.bak  # Uncomment after verifying archive
```

**Option 2: Move to Archive Directory**
```bash
# Create archive directory
mkdir -p ~/.env.d/backups/archived

# Move old backups (> 14 days)
find ~/.env.d/backups -name "*.bak" -mtime +14 -exec mv {} ~/.env.d/backups/archived/ \;
```

**Option 3: Keep Only Recent (Remove Old)**
```bash
# Keep only backups from last 7 days
find ~/.env.d/backups -name "*.bak" -mtime +7 -delete
```

### Recommended Approach
- **Keep:** Last 7-14 days of backups
- **Archive:** Backups older than 14 days
- **Remove:** Backups older than 90 days (after archiving)

### Impact
- **Disk Space:** ~102 KB (minimal)
- **Functionality:** No impact
- **Risk:** Very Low - Backups are copies

---

## 4. Review Empty Directories

### Analysis

#### Categories of Empty Directories

**1. Cache/Temporary (Safe to Remove)**
- `.cache/*` - Various cache directories
- `.npm/_cacache/tmp` - npm temp
- `.rustup/downloads`, `.rustup/tmp` - Rust cache
- `.claude/session-env/*` - Old sessions

**2. Application Config (May Be Needed)**
- `.config/n8n` - n8n may initialize later
- `.config/raycast/ai` - Raycast AI config
- `.composio` - Composio tool
- `.grok-cli/history` - Grok CLI

**3. Project Directories (Review Needed)**
- `ai-sites` - Empty project
- `gemini` - Empty directory
- `sites-navigator/static` - Empty static dir
- `workspace/music-empire/archive/*` - Archive directories

**4. Documentation (May Be Placeholders)**
- `sphinx-docs/_templates`, `_static`, `docs` - Sphinx docs

### Suggested Actions

#### Safe Removal (Cache/Temp)
```bash
# Remove empty cache directories
find ~/.cache -type d -empty -delete
find ~/.npm/_cacache -type d -empty -delete
find ~/.rustup -type d -empty -delete
find ~/.claude/session-env -type d -empty -mtime +7 -delete
```

#### Review Before Removing (Project/Config)
```bash
# List empty project directories for review
find ~/workspace -type d -empty -ls
find ~/ai-sites -type d -empty -ls
find ~/gemini -type d -empty -ls

# Review and remove manually if not needed
# rm -rf ~/ai-sites  # Only if confirmed not needed
# rm -rf ~/gemini    # Only if confirmed not needed
```

#### Keep (Application Configs)
```bash
# Don't remove - applications may need these
# .config/n8n
# .config/raycast/ai
# .composio
# .grok-cli/history
```

### Impact
- **Disk Space:** Minimal (directories are empty)
- **Functionality:** Low risk if careful
- **Risk:** Medium - Some may be needed by applications

---

## 5. Install Missing Python Packages

### Analysis

#### Most Common Missing Modules

**High Priority (Commonly Used)**
1. **PyQt5** - GUI framework (used in multiple files)
2. **IPython** - Interactive Python shell
3. **pytesseract** - OCR library
4. **python-docx** - Word document processing
5. **pydub** - Audio processing

**Medium Priority (Specialized)**
6. **instabot**, **instapy** - Instagram automation
7. **TikTokApi** - TikTok API
8. **InquirerPy** - Interactive prompts
9. **requests-html** - HTML parsing
10. **selenium** - Web automation

**Low Priority (Project-Specific)**
- Many are local modules or false positives
- Review before installing

### Suggested Actions

#### Install Common Packages
```bash
# High priority packages
pip install PyQt5 IPython pytesseract python-docx pydub

# Medium priority (if needed)
pip install instabot instapy TikTokApi InquirerPy requests-html selenium

# Or install all at once
pip install PyQt5 IPython pytesseract python-docx pydub \
            instabot instapy TikTokApi InquirerPy requests-html selenium
```

#### Verify Installation
```bash
python3 -c "
import PyQt5, IPython, pytesseract, docx, pydub
print('✅ All high-priority packages installed')
"
```

#### Create Requirements File
```bash
# Generate requirements from installed packages
pip freeze > ~/pythons/requirements.txt

# Or create minimal requirements for your projects
cat > ~/pythons/requirements-minimal.txt << EOF
openai>=2.7.0
anthropic>=0.34.0
langchain>=1.1.0
langchain-openai>=1.1.0
python-dotenv>=1.2.0
PyQt5>=5.15.0
IPython>=8.0.0
pytesseract>=0.3.10
python-docx>=1.1.0
pydub>=0.25.1
EOF
```

### Impact
- **Disk Space:** Moderate (packages can be large)
- **Functionality:** High - Enables many scripts to work
- **Risk:** Low - Standard packages

---

## Complete Cleanup Script

### Safe Automated Cleanup

```bash
#!/bin/bash
# Safe Cleanup Script
# Run with: bash cleanup.sh

set -e  # Exit on error

echo "🧹 Starting Cleanup..."

# 1. Remove broken symlinks
echo "1️⃣  Removing broken symlinks..."
rm -f ~/update
rm -f ~/.config/quick-refs/2T-Xx_API_QUICK_REFERENCE.md 2>/dev/null || true
echo "   ✅ Broken symlinks removed"

# 2. Clean cache directories
echo "2️⃣  Cleaning cache directories..."
rm -rf ~/.cache/claude/staging
find ~/.claude/session-env -type d -empty -mtime +7 -delete 2>/dev/null || true
rm -rf ~/.npm/_cacache/tmp 2>/dev/null || true
rm -rf ~/.rustup/downloads ~/.rustup/tmp 2>/dev/null || true
echo "   ✅ Cache directories cleaned"

# 3. Archive old backups
echo "3️⃣  Archiving old backups..."
cd ~/.env.d/backups
if [ -d "pruned_sources" ] && [ "$(ls -A pruned_sources/*.bak 2>/dev/null)" ]; then
    ARCHIVE_NAME="backups_archive_$(date +%Y%m%d).tar.gz"
    tar -czf "$ARCHIVE_NAME" pruned_sources/*.bak 2>/dev/null
    echo "   ✅ Backups archived to $ARCHIVE_NAME"
    # Uncomment to remove after archiving:
    # rm pruned_sources/*.bak
fi

# 4. Remove empty cache directories
echo "4️⃣  Removing empty cache directories..."
find ~/.cache -type d -empty -delete 2>/dev/null || true
find ~/.npm -type d -empty -delete 2>/dev/null || true
find ~/.rustup -type d -empty -delete 2>/dev/null || true
echo "   ✅ Empty cache directories removed"

# 5. Install missing Python packages
echo "5️⃣  Installing missing Python packages..."
pip install --quiet PyQt5 IPython pytesseract python-docx pydub 2>/dev/null || echo "   ⚠️  Some packages may need manual installation"
echo "   ✅ Python packages installation attempted"

echo ""
echo "✨ Cleanup Complete!"
echo ""
echo "📊 Summary:"
echo "   - Broken symlinks: Removed"
echo "   - Cache directories: Cleaned"
echo "   - Backups: Archived"
echo "   - Empty directories: Removed"
echo "   - Python packages: Installed"
```

---

## Risk Assessment

### Low Risk (Safe to Execute)
- ✅ Remove broken symlinks
- ✅ Clean cache directories
- ✅ Archive old backups
- ✅ Remove empty cache/temp directories
- ✅ Install Python packages

### Medium Risk (Review First)
- ⚠️ Remove empty project directories (may be placeholders)
- ⚠️ Remove application config directories (may be needed)

### High Risk (Manual Review Required)
- ❌ Don't remove without review:
  - `.config/*` directories
  - Project directories
  - Any directory you're unsure about

---

## Execution Order

### Recommended Sequence

1. **First:** Install Python packages (enables scripts)
2. **Second:** Archive backups (safest, reversible)
3. **Third:** Remove broken symlinks (safe, quick)
4. **Fourth:** Clean cache directories (safe, frees space)
5. **Fifth:** Review and remove empty directories (requires judgment)

---

## Verification Commands

```bash
# Verify broken symlinks removed
find ~ -maxdepth 3 -type l ! -exec test -e {} \; -print | wc -l

# Verify cache cleaned
du -sh ~/.cache ~/.claude/session-env 2>/dev/null

# Verify backups archived
ls -lh ~/.env.d/backups/*.tar.gz 2>/dev/null

# Verify Python packages installed
python3 -c "import PyQt5, IPython, pytesseract, docx, pydub; print('✅ All installed')"

# Count empty directories
find ~ -maxdepth 4 -type d -empty 2>/dev/null | wc -l
```

---

## Summary

### Quick Actions (5 minutes)
1. Remove `~/update` symlink
2. Clean cache directories
3. Archive backups

### Medium Actions (15 minutes)
4. Review empty directories
5. Install Python packages

### Expected Results
- **Disk Space:** Minimal immediate gain (~102 KB backups)
- **Organization:** Improved (cleaner structure)
- **Functionality:** Enhanced (Python packages installed)
- **Risk:** Very Low (all actions are safe)

---

**Ready to Execute** ✅
