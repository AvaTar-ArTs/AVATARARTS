# 🏠 HOME DIRECTORY CONSOLIDATION - DETAILED CHECKLIST

**Generated:** 2025-11-30 22:49:00
**Status:** Ready for execution
**Estimated Time:** 2-3 hours (with verification)
**Risk Level:** LOW (with backup strategy)

---

## ⚠️ PRE-EXECUTION REQUIREMENTS

### Step 0: Safety Preparation

- [ ] **Create full backup**
  ```bash
  cd ~
  tar -czf home_backup_20251130.tar.gz \
    docs* analysis_reports claude_export* csv_outputs \
    advanced_toolkit intelligence organize \
    QuantumForgeLabs* ai-sites gemini tests
  ```
  - [ ] Verify backup was created: `ls -lh ~/home_backup_20251130.tar.gz`
  - [ ] Check backup size is reasonable (~500MB expected)
  - [ ] Move backup to safe location: `mv ~/home_backup_20251130.tar.gz ~/Documents/Backups/`

- [ ] **Create rollback log**
  ```bash
  touch ~/CONSOLIDATION_ROLLBACK_LOG.txt
  echo "Consolidation started: $(date)" >> ~/CONSOLIDATION_ROLLBACK_LOG.txt
  ```

- [ ] **Verify disk space**
  ```bash
  df -h ~
  ```
  - [ ] Confirm at least 2GB free space available

- [ ] **Close all applications** that might be accessing these directories

---

## 🔥 PHASE 1: HIGH PRIORITY CONSOLIDATIONS

### 1.1 Documentation Consolidation (7 → 1 directory)

**Directories to consolidate:**
- `docs/` (140K)
- `docs_docsify/` (16K)
- `docs_mkdocs/` (16K)
- `docs_pdoc/` (4K)
- `docs_seo/` (15M)
- `pydocs/` (17M)
- `sphinx-docs/` (10M)

#### Step 1.1.1: Create unified structure

- [ ] Create base directory:
  ```bash
  mkdir -p ~/docs_unified
  ```

- [ ] Create subdirectories:
  ```bash
  mkdir -p ~/docs_unified/{master_index,seo,python_api,sphinx_general,_implementations}
  mkdir -p ~/docs_unified/_implementations/{docsify,mkdocs,pdoc_generator}
  ```

- [ ] Verify structure:
  ```bash
  tree -L 2 ~/docs_unified
  ```

#### Step 1.1.2: Copy (not move) documentation directories

- [ ] **Copy master docs:**
  ```bash
  rsync -av --progress ~/docs/ ~/docs_unified/master_index/
  ```
  - [ ] Verify: `ls -la ~/docs_unified/master_index/`
  - [ ] Confirm files: `diff -r ~/docs/ ~/docs_unified/master_index/`

- [ ] **Copy SEO docs:**
  ```bash
  rsync -av --progress ~/docs_seo/ ~/docs_unified/seo/
  ```
  - [ ] Verify: `ls -la ~/docs_unified/seo/`
  - [ ] Check size: `du -sh ~/docs_unified/seo/`

- [ ] **Copy Python API docs:**
  ```bash
  rsync -av --progress ~/pydocs/ ~/docs_unified/python_api/
  ```
  - [ ] Verify: `ls -la ~/docs_unified/python_api/`
  - [ ] Check size: `du -sh ~/docs_unified/python_api/`

- [ ] **Copy Sphinx general docs:**
  ```bash
  rsync -av --progress ~/sphinx-docs/ ~/docs_unified/sphinx_general/
  ```
  - [ ] Verify: `ls -la ~/docs_unified/sphinx_general/`
  - [ ] Check size: `du -sh ~/docs_unified/sphinx_general/`

- [ ] **Copy implementation templates:**
  ```bash
  rsync -av --progress ~/docs_docsify/ ~/docs_unified/_implementations/docsify/
  rsync -av --progress ~/docs_mkdocs/ ~/docs_unified/_implementations/mkdocs/
  rsync -av --progress ~/docs_pdoc/ ~/docs_unified/_implementations/pdoc_generator/
  ```
  - [ ] Verify all three: `ls -la ~/docs_unified/_implementations/*/`

#### Step 1.1.3: Verification checkpoint

- [ ] **Verify total size matches:**
  ```bash
  echo "Original total:"
  du -sh ~/docs ~/docs_* ~/pydocs ~/sphinx-docs | awk '{sum+=$1} END {print sum}'
  echo "New unified:"
  du -sh ~/docs_unified
  ```

- [ ] **Spot check critical files:**
  - [ ] Check ~/docs_unified/master_index/catalog.json exists
  - [ ] Check ~/docs_unified/seo/conf.py exists
  - [ ] Check ~/docs_unified/python_api/ has content

- [ ] **Log consolidation:**
  ```bash
  echo "DOCS CONSOLIDATION: Copied 7 directories to ~/docs_unified/ at $(date)" >> ~/CONSOLIDATION_ROLLBACK_LOG.txt
  ```

#### Step 1.1.4: Archive originals (DO NOT DELETE YET)

- [ ] **Rename originals with _OLD suffix:**
  ```bash
  mv ~/docs ~/docs_OLD
  mv ~/docs_docsify ~/docs_docsify_OLD
  mv ~/docs_mkdocs ~/docs_mkdocs_OLD
  mv ~/docs_pdoc ~/docs_pdoc_OLD
  mv ~/docs_seo ~/docs_seo_OLD
  mv ~/pydocs ~/pydocs_OLD
  mv ~/sphinx-docs ~/sphinx-docs_OLD
  ```

- [ ] **Test unified docs work** (open some files, verify paths)

- [ ] **Wait 24-48 hours** before final deletion

- [ ] **After 48 hours, if satisfied:**
  ```bash
  rm -rf ~/docs_OLD ~/docs_*_OLD ~/pydocs_OLD ~/sphinx-docs_OLD
  ```

---

### 1.2 Analysis/Data Consolidation (3 → 1 directory)

**Directories to consolidate:**
- `analysis_reports/` (1.3M)
- `claude_export_all_2025-11-28-csv/` (1.8M)
- `csv_outputs/` (73M)

#### Step 1.2.1: Create unified structure

- [ ] Create base directory:
  ```bash
  mkdir -p ~/analysis
  ```

- [ ] Create subdirectories:
  ```bash
  mkdir -p ~/analysis/{reports,ai_exports,csvs}
  ```

#### Step 1.2.2: Copy analysis directories

- [ ] **Copy analysis reports:**
  ```bash
  rsync -av --progress ~/analysis_reports/ ~/analysis/reports/
  ```
  - [ ] Verify: `ls -la ~/analysis/reports/`
  - [ ] Check files match: `diff -r ~/analysis_reports/ ~/analysis/reports/`

- [ ] **Copy Claude exports:**
  ```bash
  rsync -av --progress ~/claude_export_all_2025-11-28-csv/ ~/analysis/ai_exports/claude_2025-11-28/
  ```
  - [ ] Verify: `ls -la ~/analysis/ai_exports/claude_2025-11-28/`
  - [ ] Count files: `find ~/analysis/ai_exports/claude_2025-11-28/ -type f | wc -l` (should be 111)

- [ ] **Copy CSV outputs:**
  ```bash
  rsync -av --progress ~/csv_outputs/ ~/analysis/csvs/
  ```
  - [ ] Verify: `ls -la ~/analysis/csvs/`
  - [ ] Count files: `find ~/analysis/csvs/ -type f | wc -l` (should be 630)

#### Step 1.2.3: Verification checkpoint

- [ ] **Verify total size:**
  ```bash
  echo "Original total:"
  du -sh ~/analysis_reports ~/claude_export_all_2025-11-28-csv ~/csv_outputs
  echo "New unified:"
  du -sh ~/analysis
  ```

- [ ] **Verify file counts:**
  ```bash
  echo "Original files: $(find ~/analysis_reports ~/claude_export_all_2025-11-28-csv ~/csv_outputs -type f | wc -l)"
  echo "New files: $(find ~/analysis -type f | wc -l)"
  ```

- [ ] **Log consolidation:**
  ```bash
  echo "ANALYSIS CONSOLIDATION: Copied 3 directories to ~/analysis/ at $(date)" >> ~/CONSOLIDATION_ROLLBACK_LOG.txt
  ```

#### Step 1.2.4: Archive originals

- [ ] **Rename originals with _OLD suffix:**
  ```bash
  mv ~/analysis_reports ~/analysis_reports_OLD
  mv ~/claude_export_all_2025-11-28-csv ~/claude_export_all_2025-11-28-csv_OLD
  mv ~/csv_outputs ~/csv_outputs_OLD
  ```

- [ ] **Test unified analysis works** (check file access)

- [ ] **Wait 24-48 hours** before final deletion

- [ ] **After 48 hours, if satisfied:**
  ```bash
  rm -rf ~/analysis_reports_OLD ~/claude_export_all_2025-11-28-csv_OLD ~/csv_outputs_OLD
  ```

---

### 1.3 Empty Directory Cleanup

**Directories to delete:**
- `ai-sites/` (0B)
- `gemini/` (0B)
- `tests/` (4K - likely empty/test files)

#### Step 1.3.1: Verify directories are truly empty

- [ ] **Check ai-sites:**
  ```bash
  ls -la ~/ai-sites/
  find ~/ai-sites -type f
  ```
  - [ ] Confirm no files exist

- [ ] **Check gemini:**
  ```bash
  ls -la ~/gemini/
  find ~/gemini -type f
  ```
  - [ ] Confirm no files exist

- [ ] **Check tests:**
  ```bash
  ls -la ~/tests/
  cat ~/tests/* 2>/dev/null
  ```
  - [ ] Review any files - confirm they're not important

#### Step 1.3.2: Delete empty directories

- [ ] **Delete ai-sites:**
  ```bash
  rmdir ~/ai-sites
  ```
  - [ ] Verify deleted: `ls -d ~/ai-sites 2>/dev/null` (should show "No such file")

- [ ] **Delete gemini:**
  ```bash
  rmdir ~/gemini
  ```
  - [ ] Verify deleted: `ls -d ~/gemini 2>/dev/null`

- [ ] **Delete tests (if confirmed empty):**
  ```bash
  rm -rf ~/tests
  ```
  - [ ] Verify deleted: `ls -d ~/tests 2>/dev/null`

- [ ] **Log deletion:**
  ```bash
  echo "EMPTY CLEANUP: Deleted ai-sites, gemini, tests at $(date)" >> ~/CONSOLIDATION_ROLLBACK_LOG.txt
  ```

---

## ⚠️ PHASE 2: MEDIUM PRIORITY CONSOLIDATIONS

### 2.1 QuantumForgeLabs Consolidation (2 → 1 directory)

**Directories:**
- `QuantumForgeLabs/` (496M) - main project
- `QuantumForgeLabs_Website__Strategic_Analysis/` (1.9M) - website analysis

#### Step 2.1.1: Review website analysis content

- [ ] **Examine website analysis:**
  ```bash
  ls -la ~/QuantumForgeLabs_Website__Strategic_Analysis/
  ```
  - [ ] List files: ___________________________________________
  - [ ] Determine if these are active documents or archived analysis

#### Step 2.1.2: Merge into main project

- [ ] **Copy website analysis into main project:**
  ```bash
  rsync -av --progress ~/QuantumForgeLabs_Website__Strategic_Analysis/ ~/QuantumForgeLabs/website_strategy_analysis/
  ```
  - [ ] Verify: `ls -la ~/QuantumForgeLabs/website_strategy_analysis/`

- [ ] **Verify merge:**
  ```bash
  diff -r ~/QuantumForgeLabs_Website__Strategic_Analysis/ ~/QuantumForgeLabs/website_strategy_analysis/
  ```

- [ ] **Archive original:**
  ```bash
  mv ~/QuantumForgeLabs_Website__Strategic_Analysis ~/QuantumForgeLabs_Website__Strategic_Analysis_OLD
  ```

- [ ] **Log consolidation:**
  ```bash
  echo "QUANTUMFORGE CONSOLIDATION: Merged website analysis at $(date)" >> ~/CONSOLIDATION_ROLLBACK_LOG.txt
  ```

- [ ] **Wait 7 days, then delete:**
  ```bash
  rm -rf ~/QuantumForgeLabs_Website__Strategic_Analysis_OLD
  ```

---

### 2.2 Utilities Consolidation (Optional - 3 → 1 directory)

**Directories:**
- `advanced_toolkit/` (11M) - strategy docs, implementation guides
- `intelligence/` (17M) - cleanup scripts, analysis tools
- `organize/` (72K) - organization utilities

#### Step 2.2.1: Decision point

- [ ] **Review each directory's purpose:**
  ```bash
  ls -la ~/advanced_toolkit/
  ls -la ~/intelligence/
  ls -la ~/organize/
  ```

- [ ] **DECISION:**
  - [ ] **Option A:** Keep separate (they serve distinct purposes)
  - [ ] **Option B:** Merge into `~/toolkit/` (they're all utilities)

#### Step 2.2.2: If merging (Option B selected)

- [ ] **Create toolkit structure:**
  ```bash
  mkdir -p ~/toolkit/{strategy,scripts,utilities}
  ```

- [ ] **Copy directories:**
  ```bash
  rsync -av --progress ~/advanced_toolkit/ ~/toolkit/strategy/
  rsync -av --progress ~/intelligence/ ~/toolkit/scripts/
  rsync -av --progress ~/organize/ ~/toolkit/utilities/
  ```

- [ ] **Verify all copied:**
  ```bash
  ls -la ~/toolkit/*/
  ```

- [ ] **Archive originals:**
  ```bash
  mv ~/advanced_toolkit ~/advanced_toolkit_OLD
  mv ~/intelligence ~/intelligence_OLD
  mv ~/organize ~/organize_OLD
  ```

- [ ] **Log consolidation:**
  ```bash
  echo "UTILITIES CONSOLIDATION: Merged into ~/toolkit/ at $(date)" >> ~/CONSOLIDATION_ROLLBACK_LOG.txt
  ```

---

## ✅ POST-CONSOLIDATION VERIFICATION

### Step 3.1: Final verification

- [ ] **Check directory count:**
  ```bash
  echo "Current home directories:"
  ls -d ~/*/ | wc -l
  ```
  Expected: ~17-19 directories (down from 24)

- [ ] **Check total space:**
  ```bash
  du -sh ~/docs_unified ~/analysis
  ```

- [ ] **Verify no broken links:**
  ```bash
  find ~ -maxdepth 1 -type l -exec test ! -e {} \; -print
  ```

### Step 3.2: Update documentation

- [ ] **Create README in consolidated directories:**
  ```bash
  cat > ~/docs_unified/README.md << 'EOF'
  # Unified Documentation System

  Consolidated from 7 documentation directories on 2025-11-30.

  ## Structure
  - master_index/ - Main documentation catalog
  - seo/ - SEO documentation
  - python_api/ - Python API documentation
  - sphinx_general/ - General Sphinx docs
  - _implementations/ - Different doc system templates
  EOF
  ```

- [ ] **Create README in analysis:**
  ```bash
  cat > ~/analysis/README.md << 'EOF'
  # Unified Analysis Directory

  Consolidated from 3 analysis/data directories on 2025-11-30.

  ## Structure
  - reports/ - Analysis reports
  - ai_exports/ - AI/Claude conversation exports
  - csvs/ - General CSV outputs
  EOF
  ```

### Step 3.3: Final cleanup (After 48 hours minimum)

- [ ] **Review rollback log:**
  ```bash
  cat ~/CONSOLIDATION_ROLLBACK_LOG.txt
  ```

- [ ] **Confirm all *_OLD directories can be deleted:**
  - [ ] Tested new locations work properly
  - [ ] No missing files reported
  - [ ] Applications/scripts updated with new paths (if any)

- [ ] **Delete all *_OLD directories:**
  ```bash
  rm -rf ~/*_OLD
  ```

- [ ] **Delete backup (optional - keep for 30 days):**
  ```bash
  # After 30 days:
  # rm ~/Documents/Backups/home_backup_20251130.tar.gz
  ```

---

## 🎯 SUCCESS CRITERIA

### Before/After Comparison

**BEFORE:**
- 24 directories in ~/
- 7 scattered documentation systems
- 3 separate analysis/data locations
- 2 empty directories

**AFTER:**
- ~17-19 directories in ~/
- 1 unified documentation system (~/docs_unified/)
- 1 unified analysis location (~/analysis/)
- 0 empty directories
- Optional: 1 unified toolkit (~/toolkit/)

### Quality Checks

- [ ] All files accessible in new locations
- [ ] No data loss (verified with checksums/diffs)
- [ ] Logical organization achieved
- [ ] Easy to find files now
- [ ] Backup exists and is verified

---

## 🚨 ROLLBACK PROCEDURES

### If something goes wrong:

**If files are missing:**
```bash
# Restore from *_OLD directories (if still exist)
rsync -av ~/docs_OLD/ ~/docs/
rsync -av ~/docs_docsify_OLD/ ~/docs_docsify/
# ... etc

# Or restore from backup
cd ~
tar -xzf Documents/Backups/home_backup_20251130.tar.gz
```

**If directories need to be restored:**
```bash
# Rename _OLD back to original
mv ~/docs_OLD ~/docs
mv ~/analysis_reports_OLD ~/analysis_reports
# ... etc
```

**If unified directories need to be removed:**
```bash
rm -rf ~/docs_unified
rm -rf ~/analysis
rm -rf ~/toolkit  # if created
```

---

## 📊 PROGRESS TRACKING

**Phase 1 Progress:**
- [ ] Documentation consolidation complete (1.1)
- [ ] Analysis consolidation complete (1.2)
- [ ] Empty directory cleanup complete (1.3)

**Phase 2 Progress:**
- [ ] QuantumForgeLabs consolidation (2.1)
- [ ] Utilities consolidation (2.2) - OPTIONAL

**Final Steps:**
- [ ] Post-consolidation verification complete (3.1)
- [ ] Documentation updated (3.2)
- [ ] Final cleanup after 48 hours (3.3)

**COMPLETION DATE:** _______________

**COMPLETED BY:** _______________

---

## 📝 NOTES & ISSUES

Use this section to document any issues encountered:

```
Date: __________ Issue: __________________________________ Resolution: __________________
Date: __________ Issue: __________________________________ Resolution: __________________
Date: __________ Issue: __________________________________ Resolution: __________________
```

---

**CHECKLIST COMPLETE** ✅
