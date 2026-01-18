# Drive Analysis and Merge Guide

## Overview
This guide provides a batch-based approach to analyze and merge two large external drives using CSV comparisons.

## Prerequisites
- Both drives must be mounted and accessible
- Sufficient disk space for analysis output (~1GB)
- Python 3 installed

## Step 1: Run Batch Analysis
When both drives are accessible, run:

```bash
/Users/steven/batch_drive_analysis.sh
```

This will create CSV files for each file type on both drives:
- `/Users/steven/drive_analysis_output/2T-Xx_*.csv`
- `/Users/steven/drive_analysis_output/DeVonDaTa_*.csv`

## Step 2: Compare Results
After the batch analysis completes, run:

```bash
python3 /Users/steven/compare_drive_csvs.py
```

This will generate:
- `/Users/steven/drive_analysis_comparison.csv` - Summary comparison
- `/Users/steven/duplicate_files_found.csv` - Detailed duplicate list

## Step 3: Review Results
Check the CSV files to understand:
- File counts by type on each drive
- Total sizes by file type
- Duplicate files found
- Merge recommendations

## Step 4: Execute Merge
Based on the analysis results, you can:
1. Use 2T-Xx as primary drive (larger capacity)
2. Move unique files from DeVonDaTa to 2T-Xx
3. Handle duplicates (keep 2T-Xx versions)
4. Organize by file type

## File Types Analyzed
- ZIP files (archives)
- MP4 files (videos)
- JPG/PNG files (images)
- MP3 files (audio)
- PDF files (documents)
- PSD files (design)

## Expected Output
The analysis will show:
- Total files by type on each drive
- File sizes and space usage
- Duplicate files between drives
- Recommended merge strategy

## Troubleshooting
- If drives are not accessible, check mounting status
- If analysis fails, check file permissions
- If CSV files are empty, verify drive paths

## Next Steps
After analysis, you can:
1. Create organized directory structure
2. Move files systematically
3. Remove duplicates
4. Verify merge results