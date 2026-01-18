# AVATARARTS Reorganization Plan

**Date**: January 2025  
**Status**: Ready to Execute

---

## 🎯 Reorganization Goals

1. **Consolidate duplicate directories** (save ~2.6GB)
2. **Move misplaced directories** to correct numbered structure
3. **Clean up root directory**
4. **Standardize naming conventions**
5. **Create master index**

---

## 📋 Phase 1: Directory Consolidation

### Step 1.1: Merge ai-sites Directories
**Action**: Compare and merge `ai-sites/` with `04_WEBSITES/ai-sites/`
- Check if they're duplicates or different versions
- Merge into `04_WEBSITES/ai-sites/`
- Archive old `ai-sites/` if different

### Step 1.2: Consolidate Documentation
**Actions**:
```bash
# Move all documentation to 02_DOCUMENTATION/
mv docs/ 02_DOCUMENTATION/docs/
mv Master_Documentation_Index/* 02_DOCUMENTATION/
mv DOCUMENTATION/* 02_DOCUMENTATION/
mv docs-sphinx/ 02_DOCUMENTATION/sphinx/
```

### Step 1.3: Consolidate Data Directories
**Actions**:
```bash
# Move data directories to 05_DATA/
mv DATA_ANALYTICS/ 05_DATA/analytics/
mv DATABASES/ 05_DATA/databases/
```

### Step 1.4: Move Business Projects
**Actions**:
```bash
# Move revenue dashboard to business directory
mv revenue-dashboard/ 00_ACTIVE/BUSINESS/revenue-dashboard/
```

### Step 1.5: Archive/Review Unknown Directories
**Actions**:
```bash
# Archive disco
mv disco/ 03_ARCHIVES/disco/

# Review gol-ia-newq (needs investigation)
# Move to appropriate location after review
```

---

## 📋 Phase 2: Root Directory Cleanup

### Step 2.1: Move Backup Files
**Actions**:
```bash
# Create backups directory if needed
mkdir -p 03_ARCHIVES/backups/

# Move large backup files
mv AVATARARTS_backup_*.tar.gz 03_ARCHIVES/backups/
```

### Step 2.2: Organize Root Files
**Actions**:
- Move index files to `02_DOCUMENTATION/`
- Move any loose documentation to appropriate directories
- Clean up any temporary files

---

## 📋 Phase 3: Standardization

### Step 3.1: Standardize Naming
- Ensure all directories follow numbered structure
- Standardize file naming conventions
- Create naming guidelines

### Step 3.2: Consolidate Duplicates
- Identify duplicate README files
- Merge similar documentation
- Remove redundant files

---

## 🚀 Execution Plan

### Immediate Actions (High Priority):
1. ✅ Create reorganization script
2. ✅ Backup before reorganization
3. ✅ Execute Phase 1 (directory consolidation)
4. ✅ Execute Phase 2 (root cleanup)
5. ✅ Verify structure
6. ✅ Update index

### Next Steps:
- Execute Phase 3 (standardization)
- Create master index
- Document new structure

---

*Ready to begin reorganization*
