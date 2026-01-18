# n8n Files Collection
## Organized and Deduplicated

**Date:** January 13, 2026  
**Status:** Organized

---

## 📊 Summary

### Files Analyzed
- **Total:** 9 files
- **Found:** 9 files
- **Duplicates:** 1 pair (2 files)
- **Unique files:** 8 files

### File Types
- **JSON:** 4 files (workflows/API)
- **CSV:** 5 files (templates/data)

### Total Size
- **JSON files:** 0.18 MB
- **CSV files:** 23.38 MB
- **Total:** ~23.56 MB

---

## 📁 Directory Structure

```
n8n/
├── README.md (this file)
├── analyze_n8n_files.py
├── dedupe_and_organize.py
├── analysis_report.md
├── file_summary.json
│
├── api/
│   └── n8n-public-api.json
│
├── workflows/
│   ├── n8n_ai_agent_templates.json
│   ├── n8n_social_media_automation.json
│   └── n8n_automation_workflows.json
│
├── templates/
│   ├── n8n_templates_enriched_with_links.csv
│   ├── n8n_templates_cleaned_view.csv
│   ├── dataset_n8n-template-scraper_2025-12-04_18-51-25-722.csv
│   └── dataset_n8n-template-scraper_2025-12-03_04-11-52-840.csv
│
├── data/
├── documentation/
└── duplicates/
```

---

## 🔍 Duplicates Found

### Duplicate Group
- `dataset_n8n-template-scraper_2025-12-03_04-11-52-840.csv`
- `dataset_n8n-template-scraper_2025-12-03_04-11-52-840(1).csv`

**Action:** Only the first file was copied. The duplicate was skipped.

---

## 📝 Files by Category

### API Files
- `n8n-public-api.json` (46.96 KB) → `api/`

### Workflow Files
- `n8n_ai_agent_templates.json` (35.53 KB) → `workflows/`
- `n8n_social_media_automation.json` (53.51 KB) → `workflows/`
- `n8n_automation_workflows.json` (51.88 KB) → `workflows/`

### Template Data Files
- `n8n_templates_enriched_with_links.csv` (10.9 MB) → `templates/`
- `n8n_templates_cleaned_view.csv` (1.4 MB) → `templates/`
- `dataset_n8n-template-scraper_2025-12-04_18-51-25-722.csv` (8.3 MB) → `templates/`
- `dataset_n8n-template-scraper_2025-12-03_04-11-52-840.csv` (1.7 MB) → `templates/`

---

## 🛠️ Tools

### Analysis Script
```bash
python3 analyze_n8n_files.py
```
- Analyzes all n8n files
- Calculates file hashes
- Identifies duplicates
- Generates report

### Deduplication Script
```bash
# Dry run
python3 dedupe_and_organize.py

# Execute
python3 dedupe_and_organize.py --execute
```
- Deduplicates files
- Organizes by category
- Copies to organized structure

---

## 📈 Statistics

### Before Organization
- Files scattered across multiple volumes
- 1 duplicate pair
- No clear organization

### After Organization
- 8 unique files organized
- Clear directory structure
- Duplicates identified and skipped
- Easy to navigate

---

## 🔗 Source Locations

Files were collected from:
- `/Volumes/2T-Xx/ai-sites/n8n/`
- `/Volumes/2T-Xx/Documents/`
- `/Volumes/DeVonDaTa/gDrive/`

---

## ✅ Next Steps

1. Review organized files
2. Use workflows in `workflows/` directory
3. Analyze template data in `templates/` directory
4. Reference API documentation in `api/` directory

---

**Created:** January 13, 2026  
**Status:** Organized and Ready
