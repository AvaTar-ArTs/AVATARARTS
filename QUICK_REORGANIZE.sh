#!/bin/bash
# AVATARARTS Quick Reorganization Script
# Combines multiple reorganization approaches for comprehensive cleanup
# Date: January 13, 2026

set -e  # Exit on error

echo "=== AVATARARTS Quick Reorganization Script ==="
echo "Date: $(date)"
echo ""

# Check git status first
echo "Checking git status..."
if command -v git &> /dev/null && [ -d ".git" ]; then
    git_status=$(git status --porcelain)
    if [ -n "$git_status" ]; then
        echo "⚠️  Warning: You have uncommitted changes in git."
        echo "Consider committing or stashing them before proceeding."
        echo "Continuing with reorganization..."
    fi
else
    echo "⚠️  Not in a git repository or git not found."
fi

echo ""
echo "=== DRY RUN MODE ==="
echo "This will show what would be moved without actually moving files."
echo ""

# Create necessary directories
echo "Creating necessary directories..."
mkdir -p 03_ARCHIVES
mkdir -p 04_WEBSITES
mkdir -p 05_DATA
mkdir -p 08_REPORTS
mkdir -p 09_SCRIPTS/setup
mkdir -p 09_SCRIPTS/organization
mkdir -p 09_SCRIPTS/utilities
mkdir -p 01_TOOLS/scripts/utilities
mkdir -p 05_DATA/images

echo ""
echo "=== FILE CATEGORIZATION PREVIEW ==="

# Count files that would be moved to each category
echo "Files that would be moved to 08_REPORTS/:"
find . -maxdepth 1 \( -name "*ANALYSIS*.md" -o -name "*ANALYSIS*.html" -o -name "*ANALYSIS*.csv" \
    -o -name "*REPORT*.md" -o -name "*REPORT*.csv" \
    -o -name "*HANDOFF*.md" -o -name "*HANDOFF*.txt" \
    -o -name "*REVIEW*.md" -o -name "*SCAN*.md" \
    -o -name "*DECLUTTER*.md" -o -name "*DECLUTTER*.csv" \
    -o -name "cursor_revenue_trend_pulse_analysis.md" \
    -o -name "comprehensive_improvements_suggestions.html" \
    -o -name "pythons_duplicates_report.md" \
    -o -name "INTELLIGENT_DECLUTTER_ARCHIVED_FILES.csv" \
    -o -name "*SUMMARY*.md" -o -name "*SUMMARY*.txt" \
    -o -name "*STRATEGY*.md" \
    -o -name "*EXPORT*.md" \
    -o -name "*EXECUTIVE*.md" \
    -o -name "*CHECKLIST*.md" \
    -o -name "*TEST*.md" -o -name "*FIXES*.md" \
    -o -name "*RECOMMENDATIONS*.md" \
    -o -name "*INSTRUCTIONS*.md" \
    -o -name "REORGANIZATION_*.md" \
    -o -name "MCP_*.md" \
    -o -name "Handoff_Summary.md" \
    -o -name "Revenue_Strategy_Handoff_Simple.md" \
    -o -name "SEO_AEO_Strategy_*.md" \
    -o -name "QWEN_CURSOR_IMPROVEMENTS.md" \) -type f | wc -l

echo "Files that would be moved to 09_SCRIPTS/setup/:"
find . -maxdepth 1 \( -name "setup_*.py" -o -name "setup_*.sh" \
    -o -name "scan_and_add_to_avatararts.py" \
    -o -name "avatararts_org_summary.sh" \) -type f | wc -l

echo "Files that would be moved to 09_SCRIPTS/organization/:"
find . -maxdepth 1 \( -name "reorganize*.py" -o -name "reorganize*.sh" \
    -o -name "organize*.sh" -o -name "organize*.py" \
    -o -name "declutter*.sh" -o -name "declutter*.py" \
    -o -name "rename*.py" -o -name "reindex*.py" \) -type f | wc -l

echo "Files that would be moved to 02_DOCUMENTATION/:"
find . -maxdepth 1 \( -name "README.md" -o -name "QUICK_*.md" -o -name "WORKFLOW*.md" \
    -o -name "EVOLUTION*.md" -o -name "DAILY_*.md" \
    -o -name "*HANDOFF*.md" -o -name "*INDEX*.md" \
    -o -name "*GUIDE*.md" -o -name "*CONTEXT*.md" \
    -o -name "python-automation-repo.md" \
    -o -name "GROK.md" -o -name "ZSH_*.md" \
    -o -name "steven-bio.md" \
    -o -name "AI_CLI_TOOLS_*.md" \) -type f | wc -l

echo "Files that would be moved to 01_TOOLS/scripts/utilities/:"
find . -maxdepth 1 \( -name "compare_*.py" -o -name "create_*.py" \
    -o -name "flatten_*.py" -o -name "generate_*.py" \
    -o -name "open_*.py" -o -name "deep_*.py" \
    -o -name "advanced_*.py" \) -type f | wc -l

echo "Files that would be moved to 05_DATA/:"
find . -maxdepth 1 \( -name "*.txt" -o -name "*.csv" \
    -o -name "git-node-pytest.txt" \
    -o -name "git status --porcelain.txt" \
    -o -name "*.json" \
    -o -name "reorganization_report_*.json" \
    -o -name "DEEP_ANALYSIS_*.json" \
    -o -name "intelligent_declutter_plan.json" \) -type f | grep -v "\.gitignore\|README\.md" | wc -l

echo "Files that would be moved to 04_WEBSITES/:"
find . -maxdepth 1 \( -name "*.html" -o -name "*.css" -o -name "*.js" \
    -o -name "styles.css" \
    -o -name "enhanced_script.js" \
    -o -name "final_script.js" \
    -o -name "application.js" \
    -o -name "docs_system.html" \
    -o -name "AI_Alchemy_Portfolio.html" \) -type f | wc -l

echo "Files that would be moved to 05_DATA/images/:"
find . -maxdepth 1 \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \
    -o -name "*.gif" -o -name "*.svg" \
    -o -name "top-trending.png" \) -type f | wc -l

echo "Files that would be moved to 03_ARCHIVES/:"
find . -maxdepth 1 \( -name "*.zip" \
    -o -name "Revenue.zip" \
    -o -name "pythons_reorganized" \) -type f | wc -l

echo ""
read -p "Proceed with actual reorganization? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborting reorganization."
    exit 1
fi

echo ""
echo "=== EXECUTING REORGANIZATION ==="

# Actually move the files
echo "Moving files to 08_REPORTS/..."
find . -maxdepth 1 \( -name "*ANALYSIS*.md" -o -name "*ANALYSIS*.html" -o -name "*ANALYSIS*.csv" \
    -o -name "*REPORT*.md" -o -name "*REPORT*.csv" \
    -o -name "*HANDOFF*.md" -o -name "*HANDOFF*.txt" \
    -o -name "*REVIEW*.md" -o -name "*SCAN*.md" \
    -o -name "*DECLUTTER*.md" -o -name "*DECLUTTER*.csv" \
    -o -name "cursor_revenue_trend_pulse_analysis.md" \
    -o -name "comprehensive_improvements_suggestions.html" \
    -o -name "pythons_duplicates_report.md" \
    -o -name "INTELLIGENT_DECLUTTER_ARCHIVED_FILES.csv" \
    -o -name "*SUMMARY*.md" -o -name "*SUMMARY*.txt" \
    -o -name "*STRATEGY*.md" \
    -o -name "*EXPORT*.md" \
    -o -name "*EXECUTIVE*.md" \
    -o -name "*CHECKLIST*.md" \
    -o -name "*TEST*.md" -o -name "*FIXES*.md" \
    -o -name "*RECOMMENDATIONS*.md" \
    -o -name "*INSTRUCTIONS*.md" \
    -o -name "REORGANIZATION_*.md" \
    -o -name "MCP_*.md" \
    -o -name "Handoff_Summary.md" \
    -o -name "Revenue_Strategy_Handoff_Simple.md" \
    -o -name "SEO_AEO_Strategy_*.md" \
    -o -name "QWEN_CURSOR_IMPROVEMENTS.md" \) -type f -exec mv {} 08_REPORTS/ \;

echo "Moving files to 09_SCRIPTS/setup/..."
find . -maxdepth 1 \( -name "setup_*.py" -o -name "setup_*.sh" \
    -o -name "scan_and_add_to_avatararts.py" \
    -o -name "avatararts_org_summary.sh" \) -type f -exec mv {} 09_SCRIPTS/setup/ \;

echo "Moving files to 09_SCRIPTS/organization/..."
find . -maxdepth 1 \( -name "reorganize*.py" -o -name "reorganize*.sh" \
    -o -name "organize*.sh" -o -name "organize*.py" \
    -o -name "declutter*.sh" -o -name "declutter*.py" \
    -o -name "rename*.py" -o -name "reindex*.py" \) -type f -exec mv {} 09_SCRIPTS/organization/ \;

echo "Moving files to 02_DOCUMENTATION/..."
find . -maxdepth 1 \( -name "README.md" -o -name "QUICK_*.md" -o -name "WORKFLOW*.md" \
    -o -name "EVOLUTION*.md" -o -name "DAILY_*.md" \
    -o -name "*HANDOFF*.md" -o -name "*INDEX*.md" \
    -o -name "*GUIDE*.md" -o -name "*CONTEXT*.md" \
    -o -name "python-automation-repo.md" \
    -o -name "GROK.md" -o -name "ZSH_*.md" \
    -o -name "steven-bio.md" \
    -o -name "AI_CLI_TOOLS_*.md" \) -type f -exec mv {} 02_DOCUMENTATION/ \;

echo "Moving files to 01_TOOLS/scripts/utilities/..."
find . -maxdepth 1 \( -name "compare_*.py" -o -name "create_*.py" \
    -o -name "flatten_*.py" -o -name "generate_*.py" \
    -o -name "open_*.py" -o -name "deep_*.py" \
    -o -name "advanced_*.py" \) -type f -exec mv {} 01_TOOLS/scripts/utilities/ \;

echo "Moving files to 05_DATA/..."
find . -maxdepth 1 \( -name "*.txt" -o -name "*.csv" \
    -o -name "git-node-pytest.txt" \
    -o -name "git status --porcelain.txt" \
    -o -name "*.json" \
    -o -name "reorganization_report_*.json" \
    -o -name "DEEP_ANALYSIS_*.json" \
    -o -name "intelligent_declutter_plan.json" \) -type f -not -name ".gitignore" -not -name "README.md" -exec mv {} 05_DATA/ \;

echo "Moving files to 04_WEBSITES/..."
find . -maxdepth 1 \( -name "*.html" -o -name "*.css" -o -name "*.js" \
    -o -name "styles.css" \
    -o -name "enhanced_script.js" \
    -o -name "final_script.js" \
    -o -name "application.js" \
    -o -name "docs_system.html" \
    -o -name "AI_Alchemy_Portfolio.html" \) -type f -exec mv {} 04_WEBSITES/ \;

echo "Moving files to 05_DATA/images/..."
find . -maxdepth 1 \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \
    -o -name "*.gif" -o -name "*.svg" \
    -o -name "top-trending.png" \) -type f -exec mv {} 05_DATA/images/ \;

echo "Moving files to 03_ARCHIVES/..."
find . -maxdepth 1 \( -name "*.zip" \
    -o -name "Revenue.zip" \
    -o -name "pythons_reorganized" \) -type f -exec mv {} 03_ARCHIVES/ \;

# Also run the existing reorganization script for directory consolidation
if [ -f "Sorted/reorganize_avatararts.sh" ]; then
    echo "Running additional directory consolidation from Sorted/..."
    bash Sorted/reorganize_avatararts.sh
fi

echo ""
echo "=== REORGANIZATION COMPLETE ==="
echo "Summary of changes:"
echo "- Created missing numbered directories (03-09)"
echo "- Moved analysis and report files to 08_REPORTS/"
echo "- Moved scripts to appropriate 09_SCRIPTS/ subdirectories"
echo "- Moved documentation to 02_DOCUMENTATION/"
echo "- Moved web files to 04_WEBSITES/"
echo "- Moved data files to 05_DATA/"
echo "- Moved images to 05_DATA/images/"
echo "- Moved archives to 03_ARCHIVES/"
echo ""
echo "Remaining files in root directory:"
ls -la | grep "^-" | wc -l
echo ""
echo "Root directory now contains only essential files and numbered directories."

# Generate structure report
echo "# AVATARARTS Directory Structure Report" > DIRECTORY_STRUCTURE_REPORT_POST_REORG.md
echo "" >> DIRECTORY_STRUCTURE_REPORT_POST_REORG.md
echo "Generated: $(date)" >> DIRECTORY_STRUCTURE_REPORT_POST_REORG.md
echo "" >> DIRECTORY_STRUCTURE_REPORT_POST_REORG.md
echo "## Root Directory Contents:" >> DIRECTORY_STRUCTURE_REPORT_POST_REORG.md
ls -la | grep "^-" | awk '{print "- " $9}' >> DIRECTORY_STRUCTURE_REPORT_POST_REORG.md
echo "" >> DIRECTORY_STRUCTURE_REPORT_POST_REORG.md
echo "## Numbered Directories:" >> DIRECTORY_STRUCTURE_REPORT_POST_REORG.md
for dir in {00..09}_*; do
    if [ -d "$dir" ]; then
        echo "- $dir" >> DIRECTORY_STRUCTURE_REPORT_POST_REORG.md
        count=$(find "$dir" -type f | wc -l)
        echo "  - Files: $count" >> DIRECTORY_STRUCTURE_REPORT_POST_REORG.md
    fi
done

echo "Structure report saved to: DIRECTORY_STRUCTURE_REPORT_POST_REORG.md"