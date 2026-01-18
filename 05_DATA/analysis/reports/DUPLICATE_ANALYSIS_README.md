# Duplicate Analysis & Merge Plan

## Files Created

1. **`duplicate_analysis/duplicates_report.csv`** - Full duplicate report (all files)
2. **`create_merge_plan.py`** - Script to generate actionable merge plan
3. **`run_analysis.sh`** - Quick runner script

## How to Generate Merge Plan

Run the analysis script to create a filtered, actionable merge plan:

```bash
cd /Users/steven/Documents/Archives
python3 create_merge_plan.py
```

This will create:
- **`duplicate_analysis/merge_plan.csv`** - Filtered CSV with only important duplicates
- **`duplicate_analysis/merge_summary.txt`** - Human-readable summary

## What Gets Filtered

The script filters out:
- System files (`.DS_Store`, `.pyc`, `__pycache__`)
- Config files (`.gitignore`, `.env`, `README.md`)
- Python package metadata (`.dist-info`, `METADATA`, `RECORD`)
- Virtual environment files (`.venv`)

## What Gets Included

The merge plan focuses on:
- Archive files (`.zip`, `.tar`, `.gz`, etc.)
- Large files (>1MB)
- Executables (`.dmg`, `.pkg`, `.app`, `.exe`)

## Next Steps

1. Run `python3 create_merge_plan.py`
2. Review `merge_plan.csv` and `merge_summary.txt`
3. Decide which files to keep/remove
4. Execute the merge (manually or with a cleanup script)

## Example Output

The merge plan will show:
- **group_id**: Unique identifier for duplicate group
- **keep_file**: File to keep (newest/largest)
- **remove_files**: Files to remove
- **size_savings_mb**: Space that will be freed
