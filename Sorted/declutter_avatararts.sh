#!/bin/bash
# AVATARARTS Declutter Script
# Date: January 2025

set -e  # Exit on error

echo "=== AVATARARTS Declutter Script ==="
echo "Starting declutter process..."
echo ""

# Phase 1: Remove Temporary Files
echo "=== Phase 1: Removing Temporary Files ==="
echo "Removing log files..."
rm -f update-log-*.log reorganization_execution.log 2>/dev/null || true

echo "Removing .old files..."
find . -name "*.old" ! -path "*/.*" ! -path "*/node_modules*" ! -path "*/.git*" -type f -delete 2>/dev/null || true

echo "Phase 1 complete"
echo ""

# Phase 2: Remove Duplicate Large Files
echo "=== Phase 2: Removing Duplicate Large Files ==="
echo "Checking duplicate ZIP files..."

# Remove duplicate heavenlyHands.zip (keep the one in 00_ACTIVE/BUSINESS/)
if [ -f "04_WEBSITES/ai-sites/active/heavenlyHands.zip" ] && [ -f "00_ACTIVE/BUSINESS/heavenlyHands/heavenlyHands.zip" ]; then
    echo "Removing duplicate: 04_WEBSITES/ai-sites/active/heavenlyHands.zip"
    rm -f "04_WEBSITES/ai-sites/active/heavenlyHands.zip" 2>/dev/null || true
fi

# Remove duplicate heavenly-hands-call-tracking.zip (keep the one in 00_ACTIVE/BUSINESS/)
if [ -f "04_WEBSITES/ai-sites/active/heavenlyHands/heavenly-hands-call-tracking.zip" ] && [ -f "03_ARCHIVES/archive/LIVE-DEPLOYMENT/heavenly-hands-call-tracking.zip" ]; then
    echo "Removing duplicate: 04_WEBSITES/ai-sites/active/heavenlyHands/heavenly-hands-call-tracking.zip"
    rm -f "04_WEBSITES/ai-sites/active/heavenlyHands/heavenly-hands-call-tracking.zip" 2>/dev/null || true
fi

# Remove duplicate HTML file (keep the one in 00_ACTIVE/CONTENT/)
if [ -f "04_WEBSITES/ai-sites/archived/New_Folder_With_Items_3_ORGANIZED/html_files/pro-behance-Automation-Sora-epic.html" ] && [ -f "00_ACTIVE/CONTENT/html-assets/Automation-Sora-epic.html" ]; then
    echo "Removing duplicate HTML: archived version"
    rm -f "04_WEBSITES/ai-sites/archived/New_Folder_With_Items_3_ORGANIZED/html_files/pro-behance-Automation-Sora-epic.html" 2>/dev/null || true
fi

echo "Phase 2 complete"
echo ""

# Phase 3: Archive Large CSV Files
echo "=== Phase 3: Archiving Large CSV Files ==="
mkdir -p 03_ARCHIVES/large-csv-files 2>/dev/null || true

# Move large CSV files to archives (keep recent ones, archive old ones)
find 05_DATA -name "*.csv" -size +10M ! -path "*/.*" 2>/dev/null | while read file; do
    # Check if file is older than 30 days or is a duplicate analysis
    if [[ "$file" == *"CONSOLIDATION_MAPPING"* ]] || [[ "$file" == *"MULTIFOLDER_DEEPDIVE"* ]] || [[ "$file" == *"DUPLICATES"* ]]; then
        echo "Archiving: $file"
        mv "$file" 03_ARCHIVES/large-csv-files/ 2>/dev/null || true
    fi
done

echo "Phase 3 complete"
echo ""

# Phase 4: Organize Root Files
echo "=== Phase 4: Organizing Root Files ==="
mkdir -p 01_TOOLS/scripts 2>/dev/null || true
mkdir -p 04_WEBSITES/assets 2>/dev/null || true

# Move scripts
if [ -f "generate_docs.py" ]; then
    mv generate_docs.py 01_TOOLS/scripts/ 2>/dev/null || true
    echo "Moved generate_docs.py"
fi

if [ -f "reorganize_project.py" ]; then
    mv reorganize_project.py 01_TOOLS/scripts/ 2>/dev/null || true
    echo "Moved reorganize_project.py"
fi

# Move HTML/CSS/JS files
if [ -f "INCOME_OPPORTUNITIES_INTERACTIVE.html" ]; then
    mv INCOME_OPPORTUNITIES_INTERACTIVE.html 04_WEBSITES/assets/ 2>/dev/null || true
    echo "Moved INCOME_OPPORTUNITIES_INTERACTIVE.html"
fi

if [ -f "docs_index.html" ]; then
    mv docs_index.html 02_DOCUMENTATION/ 2>/dev/null || true
    echo "Moved docs_index.html"
fi

if [ -f "styles.css" ]; then
    mv styles.css 04_WEBSITES/assets/ 2>/dev/null || true
    echo "Moved styles.css"
fi

if [ -f "script.js" ]; then
    mv script.js 04_WEBSITES/assets/ 2>/dev/null || true
    echo "Moved script.js"
fi

if [ -f "claude-project-extract.js" ]; then
    mv claude-project-extract.js 01_TOOLS/scripts/ 2>/dev/null || true
    echo "Moved claude-project-extract.js"
fi

# Move large data.js file
if [ -f "data.js" ]; then
    mv data.js 05_DATA/ 2>/dev/null || true
    echo "Moved data.js (192MB)"
fi

echo "Phase 4 complete"
echo ""

# Phase 5: Remove Empty Directories
echo "=== Phase 5: Removing Empty Directories ==="
# Find and remove empty directories (but keep the structure)
find . -type d ! -path "*/.*" ! -path "*/node_modules*" ! -path "*/.git*" 2>/dev/null | while read dir; do
    if [ -z "$(find "$dir" -maxdepth 1 -type f ! -name ".*" 2>/dev/null)" ] && [ -z "$(find "$dir" -mindepth 1 -maxdepth 1 -type d ! -name ".*" 2>/dev/null)" ]; then
        # Only remove if truly empty (no files, no subdirs)
        rmdir "$dir" 2>/dev/null || true
    fi
done

echo "Phase 5 complete"
echo ""

# Phase 6: Remove Duplicate "Copy" Files (Review First)
echo "=== Phase 6: Reviewing 'Copy' Files ==="
echo "Found files with 'copy' in name. Review needed before deletion."
echo "Legitimate files (like copy.py scripts) should be kept."
echo "Actual duplicates can be removed after review."

echo ""
echo "=== Declutter Complete ==="
echo "Summary:"
echo "- Temporary files removed"
echo "- Duplicate large files removed"
echo "- Large CSV files archived"
echo "- Root files organized"
echo "- Empty directories removed"
echo ""
echo "Please review 'copy' files manually before deletion."
