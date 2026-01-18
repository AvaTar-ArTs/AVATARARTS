#!/usr/bin/env python3
"""
Targeted duplicate check for specific files mentioned in user's query
"""

import os
import hashlib
from pathlib import Path

def calculate_hash(file_path):
    """Calculate MD5 hash of file."""
    try:
        with open(file_path, 'rb') as f:
            return hashlib.md5(f.read()).hexdigest()
    except:
        return None

def check_file_duplicates(file_rel_path):
    """Check if a file exists in multiple worktrees and compare hashes."""
    base_path = Path('/Users/steven/.cursor/worktrees/Revenue')
    worktrees = ['anf', 'bdf', 'hgz', 'orf', 'vef']

    existing_files = []
    hashes = []

    for worktree in worktrees:
        full_path = base_path / worktree / file_rel_path
        if full_path.exists():
            file_hash = calculate_hash(full_path)
            existing_files.append((worktree, full_path, file_hash))
            hashes.append(file_hash)

    if len(existing_files) > 1:
        unique_hashes = set(h for h in hashes if h is not None)
        if len(unique_hashes) == 1:
            print(f"✓ IDENTICAL: {file_rel_path} ({len(existing_files)} copies)")
            for worktree, path, _ in existing_files[1:]:
                print(f"  - Can remove: {worktree}:{file_rel_path}")
        else:
            print(f"⚠ DIFFERENT: {file_rel_path} ({len(existing_files)} copies, {len(unique_hashes)} unique versions)")
            for worktree, path, file_hash in existing_files:
                print(f"  - {worktree}: {file_hash[:8]}...")
    elif len(existing_files) == 1:
        print(f"✗ UNIQUE: {file_rel_path} (only in {existing_files[0][0]})")
    else:
        print(f"✗ MISSING: {file_rel_path}")

# Files mentioned in user's query
target_files = [
    "ADVANCED_DECLUTTER_ANALYSIS.md",
    "AI_CLI_TOOLS_RECOMMENDATIONS.md",
    "AI_CLI_TOOLS_USAGE_GUIDE.md",
    "AVATARARTS_FINAL_INDEX.md",
    "avatararts_org_summary.sh",
    "DECLUTTER_COMPLETE_SUMMARY.md",
    "DECLUTTER_COMPLETE.md",
    "DECLUTTER_FINAL_COMPLETE.md",
    "DECLUTTER_FINAL_REPORT.md",
    "DECLUTTER_PLAN.md",
    "DETAILED_HANDOFF.md",
    "ENHANCED_PROFILE_CONTEXT.md",
    "EVOLUTION_ROADMAP.md",
    "EXECUTIVE_SUMMARY.md",
    "EXPORT_INSTRUCTIONS.md",
    "EXPORT_PACKAGE_README.txt",
    "Handoff_Summary.md",
    "INTELLIGENT_DECLUTTER_ARCHIVED_FILES.csv",
    "INTELLIGENT_DECLUTTER_COMPLETE_FINAL.md",
    "INTELLIGENT_DECLUTTER_CONTINUED.md",
    "INTELLIGENT_DECLUTTER_CSV_README.md",
    "INTELLIGENT_DECLUTTER_DETAILED.csv",
    "INTELLIGENT_DECLUTTER_FINAL_REPORT.md",
    "INTELLIGENT_DECLUTTER_HANDOFF.md",
    "MCP_API_KEYS_ANALYSIS.md",
    "MCP_COMPLETE_ANALYSIS_2026.md",
    "ml_categorization_output",
    "Obsidian-plugins-mine",
    "open_csv_to_sheets_direct.py",
    "open_csv_to_sheets.py",
    "organize_files.sh",
    "PYTHONS_SCRIPTS_REVIEW.md",
    "QWEN_CURSOR_IMPROVEMENTS.md",
    "README.md",
    "reindex_all_sorted.py",
    "rename_files.py",
    "REORGANIZATION_SUMMARY.md",
    "reorganize_avatararts.sh",
    "reorganize_by_categories.py",
    "RESCAN_SUMMARY.md",
    "scan_and_add_to_avatararts.py",
    "setup_avatararts_org.py",
    "setup_avatararts_website.py",
    "styles.css",
    "WORKSPACE_ANALYSIS.md",
    "ZSH_ENV_SYSTEM_RECOMMENDATIONS.md"
]

print("Checking targeted files for duplicates...")
print("=" * 80)

for file_path in target_files:
    check_file_duplicates(file_path)

print("\nDone!")