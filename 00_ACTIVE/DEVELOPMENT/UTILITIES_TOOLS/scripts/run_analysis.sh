#!/bin/bash
# Run duplicate analysis and create merge plan

cd /Users/steven/Documents/Archives

echo "🔍 Running duplicate analysis..."
python3 create_merge_plan.py

echo ""
echo "📊 Review the generated files:"
echo "   - duplicate_analysis/merge_plan.csv"
echo "   - duplicate_analysis/merge_summary.txt"
