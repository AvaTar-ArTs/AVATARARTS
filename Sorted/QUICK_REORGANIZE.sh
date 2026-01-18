#!/bin/bash
# Quick Reorganization Script for AVATARARTS
# Safe execution with backup and verification

set -e  # Exit on error

ROOT_DIR="/Users/steven/AVATARARTS"
cd "$ROOT_DIR"

echo "=========================================="
echo "AVATARARTS Reorganization"
echo "=========================================="
echo ""

# Step 1: Check git status
echo "Step 1: Checking git status..."
if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "⚠️  WARNING: You have uncommitted changes!"
    echo "   Consider committing or stashing before proceeding."
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Step 2: Dry run
echo ""
echo "Step 2: Running dry-run..."
python3 reorganize_avatararts_complete.py --dry-run > /tmp/reorg_preview.txt 2>&1
cat /tmp/reorg_preview.txt | tail -20

echo ""
read -p "Review the preview above. Continue with reorganization? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Reorganization cancelled."
    exit 0
fi

# Step 3: Execute
echo ""
echo "Step 3: Executing reorganization..."
python3 reorganize_avatararts_complete.py --execute

# Step 4: Generate report
echo ""
echo "Step 4: Generating structure report..."
python3 reorganize_avatararts_complete.py --execute --report

# Step 5: Show results
echo ""
echo "=========================================="
echo "Reorganization Complete!"
echo "=========================================="
echo ""
echo "Root directory file count:"
ls -1 | wc -l
echo ""
echo "New directories created:"
ls -1d 08_REPORTS 09_SCRIPTS 2>/dev/null || echo "  (check if created)"
echo ""
echo "Next steps:"
echo "1. Review unmatched files in MANUAL_FILE_CATEGORIZATION.md"
echo "2. Manually move any remaining files"
echo "3. Verify key scripts still work"
echo "4. Commit changes: git add . && git commit -m 'Reorganized directory structure'"
echo ""
