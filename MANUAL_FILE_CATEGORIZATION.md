# Manual File Categorization Guide
## Files That Need Manual Review

**Date:** January 13, 2026  
**Purpose:** Guide for manually categorizing unmatched files

---

## 📋 Unmatched Files Analysis

### Category: Reports → `08_REPORTS/`
These files are analysis/report documents:

- `Handoff_Summary.md` → `08_REPORTS/`
- `REORGANIZATION_SUMMARY.md` → `08_REPORTS/`
- `SEO_AEO_Strategy_2026_Deep_Dive.md` → `08_REPORTS/`
- `Revenue_Strategy_Handoff_Simple.md` → `08_REPORTS/`
- `EXECUTIVE_SUMMARY.md` → `08_REPORTS/`
- `MCP_TEST_RESULTS.md` → `08_REPORTS/`
- `MCP_FIXES_APPLIED.md` → `08_REPORTS/`
- `EXPORT_CHECKLIST.md` → `08_REPORTS/`
- `QWEN_CURSOR_IMPROVEMENTS.md` → `08_REPORTS/` (already matched, but listed)

### Category: Documentation → `02_DOCUMENTATION/`
These are documentation files:

- `AI_CLI_TOOLS_RECOMMENDATIONS.md` → `02_DOCUMENTATION/`
- `EXPORT_INSTRUCTIONS.md` → `02_DOCUMENTATION/`
- `steven-bio.md` → `02_DOCUMENTATION/`
- `2025-12-24 13-26-11-AEO_SEO_Content_Optimization.md` → `02_DOCUMENTATION/` or `06_SEO_MARKETING/`

### Category: Web Files → `04_WEBSITES/`
These are website-related files:

- `styles.css` → `04_WEBSITES/` or keep in root if used by multiple sites
- `enhanced_script.js` → `04_WEBSITES/`
- `final_script.js` → `04_WEBSITES/`
- `application.js` → `04_WEBSITES/`
- `docs_system.html` → `04_WEBSITES/`
- `AI_Alchemy_Portfolio.html` → `04_WEBSITES/`

### Category: Data Files → `05_DATA/`
These are data or image files:

- `top-trending.png` → `05_DATA/images/` or `06_SEO_MARKETING/images/`
- `reorganization_report_*.json` → `05_DATA/` or `08_REPORTS/`
- `DEEP_ANALYSIS_*.json` → `05_DATA/` or `08_REPORTS/`
- `intelligent_declutter_plan.json` → `05_DATA/` or `08_REPORTS/`

### Category: Archives → `03_ARCHIVES/`
Archive files:

- `Revenue.zip` → `03_ARCHIVES/`

### Category: Scripts → `09_SCRIPTS/utilities/`
Utility scripts:

- `final_summary.sh` → `09_SCRIPTS/utilities/`

### Category: Keep in Root
Files that should stay in root:

- `REORGANIZATION_PLAN.md` - Reference document
- `README.md` - Main project readme

---

## 🔧 Quick Manual Move Commands

### Move Reports
```bash
cd ~/AVATARARTS
mv Handoff_Summary.md 08_REPORTS/
mv REORGANIZATION_SUMMARY.md 08_REPORTS/
mv SEO_AEO_Strategy_2026_Deep_Dive.md 08_REPORTS/
mv Revenue_Strategy_Handoff_Simple.md 08_REPORTS/
mv EXECUTIVE_SUMMARY.md 08_REPORTS/
mv MCP_TEST_RESULTS.md 08_REPORTS/
mv MCP_FIXES_APPLIED.md 08_REPORTS/
mv EXPORT_CHECKLIST.md 08_REPORTS/
```

### Move Documentation
```bash
mv AI_CLI_TOOLS_RECOMMENDATIONS.md 02_DOCUMENTATION/
mv EXPORT_INSTRUCTIONS.md 02_DOCUMENTATION/
mv steven-bio.md 02_DOCUMENTATION/
mv "2025-12-24 13-26-11-AEO_SEO_Content_Optimization.md" 02_DOCUMENTATION/
```

### Move Web Files
```bash
mkdir -p 04_WEBSITES/assets
mv styles.css 04_WEBSITES/assets/  # or keep in root if shared
mv enhanced_script.js 04_WEBSITES/
mv final_script.js 04_WEBSITES/
mv application.js 04_WEBSITES/
mv docs_system.html 04_WEBSITES/
mv AI_Alchemy_Portfolio.html 04_WEBSITES/
```

### Move Data Files
```bash
mkdir -p 05_DATA/images
mv top-trending.png 05_DATA/images/  # or 06_SEO_MARKETING/images/
mv reorganization_report_*.json 05_DATA/ 2>/dev/null
mv DEEP_ANALYSIS_*.json 05_DATA/ 2>/dev/null
mv intelligent_declutter_plan.json 05_DATA/
```

### Move Archives
```bash
mv Revenue.zip 03_ARCHIVES/
```

### Move Scripts
```bash
mv final_summary.sh 09_SCRIPTS/utilities/
```

---

## ✅ After Manual Moves

1. **Verify Structure**
   ```bash
   ls -1 | wc -l  # Should be < 20 files
   ```

2. **Check for Remaining Files**
   ```bash
   ls -1 *.md *.py *.sh *.html *.css *.js 2>/dev/null
   ```

3. **Update Script**
   - Add new patterns to reorganization script
   - Re-run to catch any missed files

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "Manual file categorization complete"
   ```

---

**Guide Created:** January 13, 2026  
**Status:** Ready for Manual Execution
