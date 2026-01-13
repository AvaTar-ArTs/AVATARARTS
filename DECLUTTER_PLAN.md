# AVATARARTS Declutter Plan

**Date**: January 2025  
**Goal**: Remove duplicates, temporary files, and organize remaining clutter

---

## 📊 Clutter Identified

### 1. System Files
- ✅ .DS_Store files: 0 found (already clean)

### 2. Temporary/Log Files (5 files)
- `update-log-20260102-095936.log`
- `reorganization_execution.log`
- `upwork_sync.log`
- `jupyter.log`
- `index.pack.gz.old`

### 3. Duplicate Files
- **168 README.md files** - Many are legitimate, but some duplicates
- **Multiple INDEX.md files** - Can be consolidated
- **Files with "copy" in name** - 30+ files
- **Duplicate ZIP files**: 
  - `heavenlyHands.zip` (2 copies: 103MB each)
  - `heavenly-hands-call-tracking.zip` (2 copies: 101MB each)
- **Duplicate HTML files**:
  - `Automation-Sora-epic.html` (2 copies: 104MB, 105MB)

### 4. Large Files That Can Be Archived
- `data.js` (192MB) - Should be in appropriate directory
- Large CSV files (>10MB):
  - `CONSOLIDATION_MAPPING_*.csv` (85MB, 51MB)
  - `MULTIFOLDER_DEEPDIVE_*.csv` (61MB)
  - `COMPLETE_DUPLICATES_MAPPING.csv` (52MB)
  - `steven-scan-docs-2025-12-25.csv` (43MB)

### 5. Empty Directories
- `01_TOOLS/deepindex/` - Empty
- Multiple empty archive subdirectories

### 6. Files with "copy" in Name (30+ files)
- Many are legitimate (like `copy.py` scripts)
- Some are actual duplicates that can be removed

### 7. Root-Level Files
- Scripts: `generate_docs.py`, `reorganize_project.py`
- HTML: `INCOME_OPPORTUNITIES_INTERACTIVE.html`, `docs_index.html`
- CSS: `styles.css`
- JS: `claude-project-extract.js`, `script.js`, `data.js` (192MB!)

---

## 🎯 Declutter Actions

### Phase 1: Remove Temporary Files
```bash
# Remove log files
rm -f update-log-*.log
rm -f reorganization_execution.log
rm -f *.log (in project directories, review first)

# Remove .old files
rm -f *.old
```

### Phase 2: Remove Duplicate Large Files
```bash
# Remove duplicate ZIP files (keep one copy)
# Review and remove duplicate heavenlyHands.zip
# Review and remove duplicate HTML files
```

### Phase 3: Archive Large CSV Files
```bash
# Move large analysis CSV files to archives
# Keep only most recent versions
```

### Phase 4: Organize Root Files
```bash
# Move scripts to 01_TOOLS/scripts/
# Move HTML/CSS/JS to appropriate directories
# Move data.js (192MB) to appropriate location
```

### Phase 5: Remove Empty Directories
```bash
# Remove empty directory structures
```

### Phase 6: Review "Copy" Files
```bash
# Identify which "copy" files are duplicates
# Remove actual duplicates
# Keep legitimate files (like copy.py scripts)
```

---

## 📋 Priority Actions

### High Priority (Immediate Space Savings):
1. Remove duplicate ZIP files (save ~200MB)
2. Remove duplicate HTML files (save ~200MB)
3. Archive large CSV files (save ~300MB)
4. Move/archive data.js (192MB)

### Medium Priority:
5. Remove log files
6. Organize root-level files
7. Remove empty directories

### Low Priority (Review First):
8. Consolidate duplicate README files
9. Review "copy" files
10. Consolidate INDEX files

---

*Ready to begin decluttering*
