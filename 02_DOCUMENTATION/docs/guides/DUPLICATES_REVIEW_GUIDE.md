# 🔍 DUPLICATES REVIEW GUIDE
## Analyzing Different-Size Duplicates

**Review Date:** January 1, 2026
**Total Duplicates to Review:** ~49 pairs

---

## 📊 REVIEW SUMMARY

### Categories

1. **Keep html-assets (larger)** - html-assets version is larger, likely more complete
2. **Review - duplicate is larger** - Duplicate version is larger, may be updated
3. **Review - neither in html-assets** - Both versions outside html-assets, need decision

---

## 🎯 REVIEW STRATEGY

### Priority 1: Large Size Differences (>1 MB)

**Action:** Review these first - largest differences indicate significant content changes.

**How to Review:**
1. Open both files in browser or text editor
2. Compare content visually
3. Check modification dates (newer may be updated)
4. Check file paths (project-specific vs general)
5. Decide which version to keep

### Priority 2: Medium Size Differences (100 KB - 1 MB)

**Action:** Review if time permits, or use modification date as guide.

**Quick Decision:**
- If duplicate is newer → May be updated version
- If duplicate is in project-specific folder → May be project-specific version
- If html-assets is newer → Keep html-assets

### Priority 3: Small Size Differences (<100 KB)

**Action:** Usually minor differences (comments, whitespace, small updates).

**Quick Decision:**
- Keep html-assets version (consolidated location)
- Or keep newer version if significantly newer

---

## 🔧 REVIEW TOOLS

### 1. Compare Files Visually
```bash
# Open both files
open html-assets/filename.html
open path/to/duplicate.html
```

### 2. Compare File Sizes and Dates
```bash
# Check file info
ls -lh html-assets/filename.html path/to/duplicate.html
```

### 3. Use Diff Tool
```bash
# Text diff (if HTML is readable)
diff html-assets/filename.html path/to/duplicate.html

# Or use dedupe tool
python3 dedupe_merge_diff_tool.py diff --files file1.html file2.html
```

### 4. Check File Content
```bash
# View first few lines
head -20 html-assets/filename.html
head -20 path/to/duplicate.html
```

---

## 📋 DECISION MATRIX

| Scenario | Recommendation |
|----------|---------------|
| **html-assets larger + newer** | ✅ Keep html-assets, remove duplicate |
| **html-assets larger + older** | ⚠️ Review - duplicate may have updates |
| **Duplicate larger + newer** | ⚠️ Review - may be updated version |
| **Duplicate larger + older** | ✅ Keep html-assets (likely more complete) |
| **Both same age, html-assets larger** | ✅ Keep html-assets |
| **Both same age, duplicate larger** | ⚠️ Review content |
| **Neither in html-assets** | ⚠️ Decide which to keep, consider moving to html-assets |

---

## 🎯 QUICK REVIEW PROCESS

### Step 1: Load Review CSV
```bash
# Open the review CSV
open DUPLICATES_DIFFERENT_SIZES_REVIEW_*.csv
```

### Step 2: Sort by Size Difference
- Sort by `size_diff_mb` column (largest first)
- Focus on files with >1 MB difference

### Step 3: Review Each File
1. Check file paths (location context)
2. Check modification dates
3. Compare file sizes
4. Open and compare content if needed

### Step 4: Make Decision
- Keep one version
- Remove duplicate
- Or move better version to html-assets

### Step 5: Document Decision
- Update CSV with decision
- Or create action list

---

## 💡 COMMON SCENARIOS

### Scenario 1: Project-Specific vs General
**Example:** `grouped_gallery.html` in `html-assets/` (2.3 MB) vs `ai-sites/disco/` (77 KB)

**Decision:**
- If disco version is project-specific → Keep both
- If disco version is outdated → Remove duplicate

### Scenario 2: Updated Version
**Example:** Duplicate is newer and larger

**Decision:**
- Review content
- If duplicate has updates → Move to html-assets, remove old
- If duplicate is just bloated → Keep html-assets

### Scenario 3: Different Purposes
**Example:** Same filename, different content

**Decision:**
- Rename one to avoid conflict
- Or keep both in different locations

---

## 🚀 AUTOMATED REVIEW OPTIONS

### Option A: Keep html-assets (Conservative)
```bash
# If html-assets is larger, keep it
# Remove duplicates that are smaller
```

### Option B: Keep Newer (Aggressive)
```bash
# Keep whichever version is newer
# Remove older versions
```

### Option C: Manual Review (Recommended)
```bash
# Review each file individually
# Make informed decisions
```

---

## 📊 REVIEW CHECKLIST

For each duplicate pair:

- [ ] Check file paths (context)
- [ ] Compare file sizes
- [ ] Compare modification dates
- [ ] Review file content (if needed)
- [ ] Make decision
- [ ] Document decision
- [ ] Remove duplicate (if decided)

---

## 🎯 RECOMMENDED APPROACH

### Phase 1: Quick Wins (30 min)
1. Review top 10 largest differences
2. Make obvious decisions
3. Remove clear duplicates

### Phase 2: Systematic Review (1-2 hours)
1. Review all files with >100 KB difference
2. Compare content for important files
3. Make informed decisions

### Phase 3: Cleanup (30 min)
1. Remove decided duplicates
2. Move better versions to html-assets if needed
3. Update documentation

---

## 📁 FILES GENERATED

1. **`DUPLICATES_DIFFERENT_SIZES_REVIEW_*.csv`** - Complete review data
2. **`DUPLICATES_REVIEW_GUIDE.md`** - This guide

---

## 💡 TIPS

1. **Start with largest differences** - Most important to review
2. **Use modification dates** - Newer often means updated
3. **Check file paths** - Context matters (project-specific vs general)
4. **When in doubt, keep html-assets** - It's the consolidated location
5. **Document decisions** - Helps future reviews

---

*Review guide created: January 1, 2026*
*Total duplicates to review: ~49 pairs*
*CSV report: DUPLICATES_DIFFERENT_SIZES_REVIEW_*.csv*

