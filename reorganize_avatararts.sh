#!/bin/bash
# AVATARARTS Reorganization Script
# Date: January 2025

set -e  # Exit on error

echo "=== AVATARARTS Reorganization Script ==="
echo "Starting reorganization..."
echo ""

# Create necessary directories
echo "Creating necessary directories..."
mkdir -p 02_DOCUMENTATION/docs
mkdir -p 02_DOCUMENTATION/sphinx
mkdir -p 05_DATA/analytics
mkdir -p 05_DATA/databases
mkdir -p 00_ACTIVE/BUSINESS/revenue-dashboard
mkdir -p 03_ARCHIVES/backups
mkdir -p 03_ARCHIVES/disco

# Phase 1: Consolidate Documentation
echo ""
echo "=== Phase 1: Consolidating Documentation ==="
if [ -d "docs" ] && [ "$(ls -A docs 2>/dev/null)" ]; then
    echo "Moving docs/ to 02_DOCUMENTATION/docs/"
    mv docs/* 02_DOCUMENTATION/docs/ 2>/dev/null || true
    rmdir docs 2>/dev/null || true
fi

if [ -d "Master_Documentation_Index" ] && [ "$(ls -A Master_Documentation_Index 2>/dev/null)" ]; then
    echo "Moving Master_Documentation_Index/ to 02_DOCUMENTATION/"
    mv Master_Documentation_Index/* 02_DOCUMENTATION/ 2>/dev/null || true
    rmdir Master_Documentation_Index 2>/dev/null || true
fi

if [ -d "DOCUMENTATION" ] && [ "$(ls -A DOCUMENTATION 2>/dev/null)" ]; then
    echo "Moving DOCUMENTATION/ to 02_DOCUMENTATION/"
    mv DOCUMENTATION/* 02_DOCUMENTATION/ 2>/dev/null || true
    rmdir DOCUMENTATION 2>/dev/null || true
fi

if [ -d "docs-sphinx" ] && [ "$(ls -A docs-sphinx 2>/dev/null)" ]; then
    echo "Moving docs-sphinx/ to 02_DOCUMENTATION/sphinx/"
    mv docs-sphinx/* 02_DOCUMENTATION/sphinx/ 2>/dev/null || true
    rmdir docs-sphinx 2>/dev/null || true
fi

# Phase 2: Consolidate Data Directories
echo ""
echo "=== Phase 2: Consolidating Data Directories ==="
if [ -d "DATA_ANALYTICS" ] && [ "$(ls -A DATA_ANALYTICS 2>/dev/null)" ]; then
    echo "Moving DATA_ANALYTICS/ to 05_DATA/analytics/"
    mv DATA_ANALYTICS/* 05_DATA/analytics/ 2>/dev/null || true
    rmdir DATA_ANALYTICS 2>/dev/null || true
fi

if [ -d "DATABASES" ] && [ "$(ls -A DATABASES 2>/dev/null)" ]; then
    echo "Moving DATABASES/ to 05_DATA/databases/"
    mv DATABASES/* 05_DATA/databases/ 2>/dev/null || true
    rmdir DATABASES 2>/dev/null || true
fi

# Phase 3: Move Business Projects
echo ""
echo "=== Phase 3: Moving Business Projects ==="
if [ -d "revenue-dashboard" ] && [ "$(ls -A revenue-dashboard 2>/dev/null)" ]; then
    echo "Moving revenue-dashboard/ to 00_ACTIVE/BUSINESS/"
    mv revenue-dashboard 00_ACTIVE/BUSINESS/ 2>/dev/null || true
fi

# Phase 4: Archive Directories
echo ""
echo "=== Phase 4: Archiving Directories ==="
if [ -d "disco" ] && [ "$(ls -A disco 2>/dev/null)" ]; then
    echo "Moving disco/ to 03_ARCHIVES/"
    mv disco 03_ARCHIVES/ 2>/dev/null || true
fi

# Phase 5: Move Backup Files
echo ""
echo "=== Phase 5: Moving Backup Files ==="
if ls AVATARARTS_backup_*.tar.gz 1> /dev/null 2>&1; then
    echo "Moving backup files to 03_ARCHIVES/backups/"
    mv AVATARARTS_backup_*.tar.gz 03_ARCHIVES/backups/ 2>/dev/null || true
fi

# Phase 6: Remove Empty ai-sites if it exists and is empty
echo ""
echo "=== Phase 6: Cleaning Up Empty Directories ==="
if [ -d "ai-sites" ]; then
    file_count=$(find ai-sites -type f 2>/dev/null | wc -l | tr -d ' ')
    if [ "$file_count" -eq 0 ]; then
        echo "Removing empty ai-sites/ directory (files are in 04_WEBSITES/ai-sites/)"
        rm -rf ai-sites 2>/dev/null || true
    else
        echo "WARNING: ai-sites/ contains $file_count files - NOT removing"
    fi
fi

# Phase 7: Move Root Files to Documentation
echo ""
echo "=== Phase 7: Organizing Root Files ==="
# Move index and documentation files from root
for file in MASTER_INDEX.md INDEX.md index.html SYSTEM_ARCHITECTURE_MAP.md QUICK_START_GUIDE.md; do
    if [ -f "$file" ]; then
        echo "Moving $file to 02_DOCUMENTATION/"
        mv "$file" 02_DOCUMENTATION/ 2>/dev/null || true
    fi
done

# Move CSV files from root to data
for file in *.csv; do
    if [ -f "$file" ] && [ "$file" != "*.csv" ]; then
        echo "Moving $file to 05_DATA/"
        mv "$file" 05_DATA/ 2>/dev/null || true
    fi
done

echo ""
echo "=== Reorganization Complete ==="
echo "Summary of changes:"
echo "- Documentation consolidated to 02_DOCUMENTATION/"
echo "- Data directories consolidated to 05_DATA/"
echo "- Business projects moved to 00_ACTIVE/BUSINESS/"
echo "- Backup files moved to 03_ARCHIVES/backups/"
echo "- Root directory cleaned up"
echo ""
echo "Please review the changes and verify the structure."
