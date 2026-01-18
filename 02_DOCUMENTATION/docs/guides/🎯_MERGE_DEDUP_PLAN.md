# 🎯 MERGE & DEDUPLICATION MASTER PLAN

**Generated**: 2025-11-01  
**Target**: /Users/steven/Documents/Archives  
**Current Size**: 1.5 GB  
**Potential Reduction**: 84% (1.26 GB)  

---

## 🚨 CRITICAL DISCOVERIES

### 1. old-configs/simple_simplify_backup IS NOT CONFIGS!

**What it actually contains**:
- 📹 Video files: 113 MB (vid 3.mp4 66MB, vid.mp4 31MB, output.mp4 16MB)
- 📊 Analysis JSON: 75 MB (intelligent_analysis.json 48MB, intelligent_file_analysis.json 15MB, functional_analysis.json 12MB)
- 💿 Software: 37 MB (ImageMagick installer)
- 📦 Archives: 20 MB (archives_zip_python-chatgpt-export-html.zip)
- 📑 CSV files: 27 MB (all_combined.csv 14MB, zip_contents_inventory.csv 13MB)
- 📁 Plus ~441 MB of other files (2,001 total files)

**Total**: 713 MB

**Misclassified**: This is NOT a config backup - it's a miscellaneous file dump!

**Recommendation**: 
1. Move to `Archives/miscellaneous_backup/` or dedicated location
2. Delete videos if not needed (save 113 MB)
3. Compress JSON/CSV files properly (save 50+ MB)
4. Delete ImageMagick installer (save 37 MB)

---

## 📊 MERGE MATRIX

### Group 1: simplegallery (7 files → 3 files)

| Action | File | Size | Reason |
|--------|------|------|--------|
| **KEEP** | simplegallery_template.zip | 5.1 MB | Master template (1,291 entries) |
| **KEEP** | simplegallery-Perfect.zip | 2.3 MB | Latest working (Oct 2025) |
| **KEEP** | simplegallery-FINAL.zip | 648 KB | Alternative stripped version |
| DELETE | simplegallery.zip | 2.3 MB | Superseded by template |
| DELETE | simplegallery_2025.zip | 2.3 MB | Duplicate of template era |
| DELETE | simplegallery-mine.zip | 2.3 MB | Superseded by Perfect |
| DELETE | simplegallery-fixed.zip | 624 KB | Superseded by FINAL |

**Result**: 15 MB → 8 MB | **Save 7.2 MB** | **Reduction: 48%**

---

### Group 2: ollama (6 files → 6 files OR 1 consolidated)

| File | Size | Status | Consolidate? |
|------|------|--------|--------------|
| ollama_categories_pack.zip | 4.8 KB | Keep | ✓ |
| ollama-setup-kit-Intel-macOS.zip | 3.4 KB | Keep | ✓ |
| ollama-main-only.zip | 2.9 KB | Keep | ✓ |
| ollama-menu-updated.zip | 2.6 KB | Keep | ✓ |
| ollama_menu_pack.zip | 2.5 KB | Keep | ✓ |
| ollama_cpu16gb_starter.zip | 1.3 KB | Keep | ✓ |

**Option A**: Keep all separate (current) - 20 KB  
**Option B**: Create `ollama-complete-toolkit.zip` - 20 KB (organized)  
**Option C**: Keep both individual + consolidated - 40 KB

**Recommendation**: **Option C** - Minimal space, maximum flexibility

**Result**: No deletion | **Save 0 KB** | **Gain: Better organization**

---

### Group 3: Notion Exports (18 files → 3-5 files)

| Keep/Delete | Date | Size | File |
|-------------|------|------|------|
| **KEEP** | Jan 5, 2025 | 1.4 MB | e15d9f79...zip |
| **KEEP** | Jan 5, 2025 | 86 KB | acfb1e5a...zip |
| **KEEP** | Jan 5, 2025 | 74 KB | d3a0b4a1...zip |
| MAYBE | Jan 4, 2025 | 1.8 MB × 3 | ddf360db...zip, 79be8cce...zip, 4b845bbc...zip |
| DELETE | Jan 3, 2025 | ~500 KB × 4 | Various |
| DELETE | Jan 1-2, 2025 | ~500 KB × 3 | Various |
| DELETE | Dec 13, 2024 | ~4 MB × 4 | Various (oldest) |

**Strategy**: Keep last 3-5 exports, archive rest

**Result**: 14 MB → 3.5 MB | **Save 10.5 MB** | **Reduction: 75%**

---

### Group 4: Repos .git folders (Strip for archival)

| Repository | .git Size | Source Size | Action |
|------------|-----------|-------------|--------|
| llama.cpp | 155 MB | ~50 MB | Strip .git, keep source |
| .harbor | 28 MB | ~15 MB | Strip .git, keep source |
| maigret | 14 MB | ~8 MB | Strip .git, keep source |
| Others | ~135 MB | ~62 MB | Strip .git, keep source |
| **TOTAL** | **197 MB** | **135 MB** | **Save 197 MB** |

**Justification**:
- These are **archived** repos, not active development
- Git history not needed for reference/backup purposes
- Source code preserved completely
- Can always re-clone from GitHub if needed

**Result**: 332 MB → 135 MB | **Save 197 MB** | **Reduction: 59%**

---

## 🗑️ DEDUPLICATION FINDINGS

### True Duplicates: **NONE**
- All simplegallery files have unique MD5 hashes
- All ollama files serve different purposes
- Notion exports are time-based snapshots

### Pseudo-Duplicates (Similar but Different)
1. **simplegallery family**: Same project, different iterations
2. **shorts**: `shorts_service.zip` vs `shorts-2024.zip` (different versions)
3. **TrashCat**: `TrashCat-Prompts-Epic.zip` vs `TrashCaT-notion.zip` (different content)

### Zero-Byte Files (DELETE IMMEDIATELY)
- `Archive_2.zip` - 0 bytes (empty)

---

## 🎬 EXECUTION PLANS

### Plan A: CONSERVATIVE (30 min, 221 MB saved, Low Risk)

```bash
#!/bin/bash
cd /Users/steven/Documents/Archives

# 1. Delete empty file (0 MB)
rm -f Archive_2.zip

# 2. Archive old simplegallery (save 7.2 MB)
mkdir -p _archived/simplegallery_old
mv simplegallery.zip simplegallery_2025.zip simplegallery-mine.zip simplegallery-fixed.zip _archived/simplegallery_old/

# 3. Archive old Notion exports (save 10.5 MB)
mkdir -p _archived/notion_old
ls -t *Export*.zip | tail -n +6 | xargs -I {} mv {} _archived/notion_old/

# 4. Strip .git from repos (save 197 MB)
cd repos
find . -name ".git" -type d -exec rm -rf {} +
cd ..

# 5. Create summary
echo "Conservative cleanup complete:"
echo "  - Saved: ~221 MB"
echo "  - Files archived: 19"
echo "  - Files deleted: 1"
```

**Savings**: 221 MB (15% reduction)  
**Risk**: Low  
**Time**: 30 minutes  

---

### Plan B: MODERATE (60 min, 431 MB saved, Medium Risk)

```bash
#!/bin/bash
cd /Users/steven/Documents/Archives

# Include all Plan A actions
# ... (Plan A script here) ...

# 5. Compress simple_simplify_backup (save 200-500 MB)
cd old-configs

# Delete obvious non-config files
rm -f simple_simplify_backup/*.mp4           # Videos: 113 MB
rm -f simple_simplify_backup/*.exe           # Installers: 37 MB
rm -f simple_simplify_backup/*.zip           # Archives: 20 MB

# Compress remaining files
tar -czf simple_simplify_compressed.tar.gz simple_simplify_backup/
# Expected: 100-200 MB compressed vs 543 MB original (after deletions)

# After verification, delete original
# rm -rf simple_simplify_backup/

cd ..

echo "Moderate cleanup complete:"
echo "  - Saved: ~431 MB"
echo "  - Compressed: old-configs"
```

**Savings**: 431 MB (29% reduction)  
**Risk**: Medium (verify backup before final deletion)  
**Time**: 60 minutes  

---

### Plan C: AGGRESSIVE (90 min, 738 MB saved, High Risk)

```bash
#!/bin/bash
cd /Users/steven/Documents/Archives

# Include all Plan B actions
# ... (Plan B script here) ...

# 6. Delete entire simple_simplify_backup (save 713 MB total)
rm -rf old-configs/simple_simplify_backup/

# 7. Delete all old Notion exports (save full 10.5 MB)
rm -f _archived/notion_old/*.zip

# 8. Compress old analysis
gzip analysis-2025-10.tar.gz  # May save 5-10 MB

echo "Aggressive cleanup complete:"
echo "  - Saved: ~738 MB"
echo "  - Major deletions performed"
echo "  - BACKUP CRITICAL!"
```

**Savings**: 738 MB (49% reduction)  
**Risk**: High (permanent deletion of backups)  
**Time**: 90 minutes  

---

### Plan D: MAXIMUM (2 hrs, 1.26 GB saved, VERY High Risk)

```bash
#!/bin/bash
cd /Users/steven/Documents/Archives

# Include all Plan C actions
# ... (Plan C script here) ...

# 9. Evaluate and potentially delete/move ai-sites.zip
# MANUAL STEP - requires investigation first!
# If not needed:
# rm -f ai-sites.zip  # Save 310 MB

# OR move to cloud:
# rclone copy ai-sites.zip remote:archives/
# rm -f ai-sites.zip

echo "Maximum cleanup complete:"
echo "  - Saved: ~1.26 GB"
echo "  - Archive reduced by 84%"
```

**Savings**: 1.26 GB (84% reduction)  
**Risk**: Very High  
**Time**: 2 hours  
**Prerequisites**: Full backup, investigation of ai-sites.zip

---

## 🔄 MERGE WORKFLOWS

### Workflow 1: Consolidate simplegallery

```bash
cd /Users/steven/Documents/Archives

# Step 1: Test that FINAL and Perfect versions work
unzip -t simplegallery-FINAL.zip
unzip -t simplegallery-Perfect.zip
unzip -t simplegallery_template.zip

# Step 2: Create archive of old versions
mkdir -p _archived/simplegallery_history_$(date +%Y%m%d)
cp simplegallery*.zip _archived/simplegallery_history_$(date +%Y%m%d)/

# Step 3: Keep only essential versions
mkdir -p simplegallery_current
mv simplegallery_template.zip simplegallery_current/
mv simplegallery-Perfect.zip simplegallery_current/
mv simplegallery-FINAL.zip simplegallery_current/

# Step 4: Delete old versions (after verification)
rm -f simplegallery.zip simplegallery_2025.zip
rm -f simplegallery-mine.zip simplegallery-fixed.zip

echo "✓ simplegallery consolidated: 7 files → 3 files"
```

---

### Workflow 2: Consolidate ollama

```bash
cd /Users/steven/Documents/Archives

# Option A: Create master toolkit
mkdir -p ollama_toolkit_temp
for f in ollama*.zip; do
  unzip -q "$f" -d "ollama_toolkit_temp/${f%.zip}"
done

# Create combined archive
cd ollama_toolkit_temp
zip -r ../ollama-complete-toolkit-$(date +%Y%m%d).zip .
cd ..

# Keep both individual and combined
mkdir -p ollama_archives
mv ollama*.zip ollama_archives/
mv ollama-complete-toolkit-*.zip ollama_archives/

echo "✓ ollama toolkit consolidated"
```

---

### Workflow 3: Organize Notion exports

```bash
cd /Users/steven/Documents/Archives

# Step 1: Create organized structure
mkdir -p Notion_Exports/{current,archive}

# Step 2: Move to organized folders
ls -t *Export*.zip | head -n 5 | xargs -I {} mv {} Notion_Exports/current/
ls *Export*.zip 2>/dev/null | xargs -I {} mv {} Notion_Exports/archive/ 2>/dev/null || true

# Step 3: Compress old exports
cd Notion_Exports/archive
tar -czf notion_exports_archive_2024-2025.tar.gz *.zip
rm -f *.zip  # After verification

echo "✓ Notion exports organized and archived"
```

---

### Workflow 4: Clean repos

```bash
cd /Users/steven/Documents/Archives/repos

# Step 1: Backup .git folders (optional)
mkdir -p ../_archived/repos_git_backups
find . -name ".git" -type d | while read gitdir; do
  repo=$(dirname "$gitdir" | sed 's/\.\///g' | tr '/' '_')
  tar -czf "../_archived/repos_git_backups/${repo}_git.tar.gz" "$gitdir"
done

# Step 2: Strip .git folders
find . -name ".git" -type d -exec rm -rf {} +

# Step 3: Verify source code intact
find . -name "*.py" -o -name "*.js" -o -name "*.cpp" | head -20

echo "✓ Repos cleaned: saved 197 MB"
```

---

## 📋 VERIFICATION CHECKLIST

### Before Cleanup
- [ ] Full disk backup of Archives directory
- [ ] Generate MD5 checksums: `find . -type f -exec md5 {} \; > checksums_before.txt`
- [ ] Disk space check: `df -h .`
- [ ] File count: `find . -type f | wc -l`

### During Cleanup
- [ ] Test archives before deletion: `unzip -t file.zip`
- [ ] Verify no active processes using files: `lsof +D .`
- [ ] Create _archived/ folder for moved files
- [ ] Document what's being deleted: Keep this plan!

### After Cleanup
- [ ] Generate new checksums: `find . -type f -exec md5 {} \; > checksums_after.txt`
- [ ] Compare file counts: `find . -type f | wc -l`
- [ ] Disk space saved: `df -h .`
- [ ] Test sample archives: Extract and verify
- [ ] Keep backup for 30 days before final deletion

---

## 🎯 RECOMMENDED EXECUTION ORDER

### Phase 1: Zero-Risk Cleanup (Do Today)
1. Delete `Archive_2.zip` (0 bytes)
2. Generate checksums of all files
3. Create backup directory structure

**Time**: 10 minutes  
**Savings**: 0 MB  
**Risk**: None  

### Phase 2: Low-Risk Cleanup (Do This Week)
1. Archive old simplegallery versions (7.2 MB)
2. Strip .git from repos (197 MB)
3. Organize Notion exports (10.5 MB)

**Time**: 30 minutes  
**Savings**: 215 MB  
**Risk**: Low  

### Phase 3: Medium-Risk Cleanup (Do After Verification)
1. Investigate simple_simplify_backup contents
2. Delete videos/installers from simple_simplify_backup (170 MB)
3. Compress remaining simple_simplify files (save 200+ MB)

**Time**: 60 minutes  
**Savings**: 370 MB  
**Risk**: Medium  

### Phase 4: High-Risk Cleanup (Optional, After Full Backup)
1. Investigate ai-sites.zip thoroughly
2. Move to cloud or delete if not needed (310 MB)
3. Delete old backups entirely (not just archive)

**Time**: 90 minutes  
**Savings**: 310+ MB  
**Risk**: High  

---

## 📊 FINAL COMPARISON TABLE

| Plan | Time | Savings | Files Deleted | Risk | Recommended For |
|------|------|---------|---------------|------|-----------------|
| **A: Conservative** | 30 min | 221 MB (15%) | 20 | Low | Everyone |
| **B: Moderate** | 60 min | 431 MB (29%) | 25 | Med | Space-conscious users |
| **C: Aggressive** | 90 min | 738 MB (49%) | 30+ | High | Space-critical situations |
| **D: Maximum** | 2 hrs | 1.26 GB (84%) | 40+ | Very High | Major cleanup needed |

---

## 🚀 QUICK START

### I want to clean up NOW! (Conservative Plan)

```bash
# Copy and paste this entire block
cd /Users/steven/Documents/Archives

# Create backup structure
mkdir -p _archived/{simplegallery_old,notion_old}

# Quick cleanup
rm -f Archive_2.zip
mv simplegallery.zip simplegallery_2025.zip simplegallery-mine.zip simplegallery-fixed.zip _archived/simplegallery_old/
ls -t *Export*.zip | tail -n +6 | xargs -I {} mv {} _archived/notion_old/

# Repos cleanup
cd repos && find . -name ".git" -type d -exec rm -rf {} + && cd ..

# Summary
echo "✓ Cleanup complete! Saved ~221 MB"
df -h .
```

### I want maximum space! (Maximum Plan - CAREFUL!)

**STOP!** First:
1. Investigate ai-sites.zip: `unzip -l ai-sites.zip | less`
2. Backup everything: `tar -czf ~/archives_full_backup_$(date +%Y%m%d).tar.gz .`
3. Verify backup: `tar -tzf ~/archives_full_backup_*.tar.gz | head`
4. Then proceed with caution!

---

## 📝 RETENTION POLICY (Recommended)

Going forward, establish this policy:

### Project Archives
- **Keep**: Latest version + template
- **Delete**: Intermediate iterations older than 6 months

### Notion Exports
- **Keep**: Latest 3 exports
- **Archive**: Previous 10 exports (compressed)
- **Delete**: Exports older than 6 months

### Git Repositories
- **Active**: Keep full .git history
- **Archived**: Strip .git, keep source only
- **Rule**: If not committed in 6 months → strip .git

### Backups
- **Config backups**: Keep 3 most recent
- **Project backups**: Keep if active, delete if >1 year old
- **Miscellaneous**: Review quarterly, delete aggressively

---

## ✅ SUCCESS CRITERIA

You'll know cleanup was successful when:
- [ ] Archives directory < 1 GB (from 1.5 GB)
- [ ] No duplicate files (verified by MD5)
- [ ] All remaining archives documented
- [ ] Backup of deleted files exists
- [ ] Can find any file in < 30 seconds
- [ ] Manifest file created and maintained

---

**Next Steps**:
1. Choose your plan (A, B, C, or D)
2. Create full backup
3. Execute cleanup script
4. Verify results
5. Establish retention policy

**Questions? Refer to**: 🔍_DEEP_DIVE_ANALYSIS.md

**Generated**: 2025-11-01  
**Confidence**: High  
**Ready to Execute**: YES (with appropriate backups)
