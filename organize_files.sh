#!/bin/bash
# Organize root-level documentation files

cd /Users/steven/AVATARARTS

# Move research documents
mv COMPREHENSIVE_INCOME_RESEARCH_NARRATIVE.md MASTER_RESEARCH_NARRATIVE.md DEEP_RESCAN_NARRATIVE.md DOCUMENTATION/research/ 2>/dev/null

# Move analysis reports  
mv COMPREHENSIVE_REANALYSIS.md DEEP_MULTIDEPTH_RESCAN_REPORT.md VOLUMES_COMPREHENSIVE_BUSINESS_SCAN.md CHAT_REANALYSIS_AND_SUGGESTIONS.md DOCUMENTATION/analysis/ 2>/dev/null

# Move summaries
mv FINAL_COMPREHENSIVE_RESEARCH_SUMMARY.md DEEP_RESCAN_SUMMARY.md REANALYSIS_EXECUTIVE_SUMMARY.md VOLUMES_SCAN_SUMMARY.md DOCUMENTATION/summaries/ 2>/dev/null

# Move migration docs
mv BUSINESS_SYSTEMS_MIGRATION_COMPLETE.md MIGRATION_SUMMARY.md MIGRATION_COMPLETE.txt ALL_SYSTEMS_MIGRATED.txt DOCUMENTATION/migration/ 2>/dev/null

# Move other reports
mv *REPORT*.md DOCUMENTATION/reports/ 2>/dev/null
mv *SUMMARY*.md DOCUMENTATION/summaries/ 2>/dev/null 2>/dev/null

echo "Organization complete"
