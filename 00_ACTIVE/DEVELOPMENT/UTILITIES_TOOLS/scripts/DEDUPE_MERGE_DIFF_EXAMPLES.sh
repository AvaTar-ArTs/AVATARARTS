#!/bin/bash
# Example usage scripts for dedupe_merge_diff_tool.py

echo "=== Dedupe, Merge, Diff, and Du Tool Examples ==="
echo ""

# 1. Find duplicates (dry-run)
echo "1. Finding duplicates in AVATARARTS..."
python3 dedupe_merge_diff_tool.py find --max-size 50 --report duplicates_report.md

# 2. Show disk usage
echo ""
echo "2. Showing disk usage for Downloads..."
python3 dedupe_merge_diff_tool.py du --path ~/Downloads --depth 2 --sort size

# 3. Compare two directories
echo ""
echo "3. Comparing directories..."
python3 dedupe_merge_diff_tool.py diff --dirs ~/AVATARARTS/ai-sites ~/AVATARARTS/archive --output diff_report.json

# 4. Dedupe (dry-run)
echo ""
echo "4. Dry-run dedupe..."
python3 dedupe_merge_diff_tool.py dedupe --strategy newest --max-size 50

# 5. Actually dedupe (uncomment to execute)
# echo ""
# echo "5. Executing dedupe..."
# python3 dedupe_merge_diff_tool.py dedupe --strategy newest --max-size 50 --execute

echo ""
echo "=== Examples complete ==="
