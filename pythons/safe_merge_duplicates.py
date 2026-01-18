#!/usr/bin/env python3
"""
Safe Duplicate File Merger for Revenue Worktrees
Consolidates identical files across worktrees, keeping one canonical copy.
"""

import os
import hashlib
import shutil
from pathlib import Path
from typing import List, Dict
import json

class SafeDuplicateMerger:
    def __init__(self, base_path: str, dry_run: bool = True):
        self.base_path = Path(base_path)
        self.worktrees = ['anf', 'bdf', 'hgz', 'orf', 'vef']
        self.dry_run = dry_run
        self.backup_dir = self.base_path / 'DUPLICATE_BACKUP'
        self.removed_files: List[Dict] = []

    def calculate_hash(self, file_path: Path) -> str:
        """Calculate MD5 hash of file contents."""
        try:
            with open(file_path, 'rb') as f:
                return hashlib.md5(f.read()).hexdigest()
        except (OSError, IOError):
            return None

    def verify_file_integrity(self, file_path: Path) -> bool:
        """Verify file exists and is readable."""
        if not file_path.exists():
            return False
        try:
            with open(file_path, 'rb') as f:
                f.read(1)  # Try to read first byte
            return True
        except:
            return False

    def backup_file(self, file_path: Path) -> bool:
        """Backup file before removal."""
        if not self.backup_dir.exists():
            self.backup_dir.mkdir(parents=True)

        # Create relative path structure in backup
        rel_path = file_path.relative_to(self.base_path)
        backup_path = self.backup_dir / rel_path

        # Ensure backup directory exists
        backup_path.parent.mkdir(parents=True, exist_ok=True)

        try:
            if file_path.is_file():
                shutil.copy2(file_path, backup_path)
            return True
        except Exception as e:
            print(f"Warning: Failed to backup {file_path}: {e}")
            return False

    def get_canonical_worktree(self) -> str:
        """Determine which worktree should be the canonical source."""
        # Prefer 'anf' as canonical, then others in alphabetical order
        return 'anf' if 'anf' in self.worktrees else sorted(self.worktrees)[0]

    def find_identical_files(self, rel_path: str) -> List[Path]:
        """Find all instances of a file across worktrees."""
        found_files = []

        for worktree in self.worktrees:
            worktree_path = self.base_path / worktree
            full_path = worktree_path / rel_path

            if full_path.exists() and full_path.is_file():
                found_files.append(full_path)

        return found_files

    def verify_all_identical(self, file_paths: List[Path]) -> bool:
        """Verify all files in list have identical content."""
        if len(file_paths) < 2:
            return False

        hashes = []
        for path in file_paths:
            file_hash = self.calculate_hash(path)
            if file_hash is None:
                return False
            hashes.append(file_hash)

        return len(set(hashes)) == 1  # All hashes identical

    def remove_duplicate(self, file_path: Path) -> bool:
        """Safely remove a duplicate file."""
        if not self.verify_file_integrity(file_path):
            print(f"Warning: Cannot verify integrity of {file_path}, skipping")
            return False

        if not self.dry_run:
            # Backup first
            if not self.backup_file(file_path):
                print(f"Warning: Backup failed for {file_path}, skipping removal")
                return False

            try:
                file_path.unlink()
                print(f"Removed: {file_path}")
                return True
            except Exception as e:
                print(f"Error removing {file_path}: {e}")
                return False
        else:
            print(f"Would remove: {file_path}")
            return True

    def process_file_group(self, rel_path: str) -> Dict:
        """Process a group of potentially duplicate files."""
        file_paths = self.find_identical_files(rel_path)

        if len(file_paths) < 2:
            return {'status': 'unique_or_missing', 'files': len(file_paths)}

        if not self.verify_all_identical(file_paths):
            return {'status': 'different_content', 'files': len(file_paths)}

        # All files are identical - proceed with merge
        canonical_worktree = self.get_canonical_worktree()
        canonical_path = None

        for path in file_paths:
            worktree_name = path.parent.name
            if worktree_name == canonical_worktree:
                canonical_path = path
                break

        if not canonical_path:
            # No canonical copy exists, use first one as canonical
            canonical_path = file_paths[0]
            canonical_worktree = canonical_path.parent.name

        # Remove duplicates
        removed_count = 0
        for path in file_paths:
            if path != canonical_path:
                if self.remove_duplicate(path):
                    removed_count += 1
                    self.removed_files.append({
                        'file': str(path),
                        'canonical': str(canonical_path),
                        'size': path.stat().st_size
                    })

        return {
            'status': 'merged',
            'canonical_worktree': canonical_worktree,
            'canonical_file': str(canonical_path),
            'removed_count': removed_count,
            'total_files': len(file_paths)
        }

def main():
    # Files that are identical across all worktrees (from our analysis)
    identical_files = [
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

    # First do a dry run
    print("DRY RUN - Analyzing duplicate removal plan...")
    print("=" * 80)

    merger = SafeDuplicateMerger('/Users/steven/.cursor/worktrees/Revenue', dry_run=True)

    results = []
    total_space_saved = 0

    for file_path in identical_files:
        result = merger.process_file_group(file_path)
        results.append({'file': file_path, **result})

        if result['status'] == 'merged':
            # Estimate space saved (rough calculation)
            if merger.removed_files:
                for removed in merger.removed_files[-result['removed_count']:]:
                    total_space_saved += removed['size']

        print(f"{result['status'].upper()}: {file_path}")
        if result['status'] == 'merged':
            print(f"  Kept in: {result['canonical_worktree']}")
            print(f"  Removed: {result['removed_count']} duplicates")

    print(f"\nDRY RUN COMPLETE")
    print(f"Total files that would be processed: {len([r for r in results if r['status'] == 'merged'])}")
    print(f"Estimated space savings: {total_space_saved / (1024*1024):.1f} MB")

    # Save dry run results
    with open('/Users/steven/.cursor/worktrees/Revenue/dry_run_results.json', 'w') as f:
        json.dump(results, f, indent=2)

    print("\nDry run results saved to: dry_run_results.json")

    # Ask user if they want to proceed with actual merge
    response = input("\nProceed with actual file removal? (yes/no): ").lower().strip()

    if response == 'yes':
        print("\nEXECUTING ACTUAL MERGE...")
        print("=" * 80)

        merger = SafeDuplicateMerger('/Users/steven/.cursor/worktrees/Revenue', dry_run=False)

        actual_results = []
        for file_path in identical_files:
            result = merger.process_file_group(file_path)
            actual_results.append({'file': file_path, **result})

        # Save final results
        with open('/Users/steven/.cursor/worktrees/Revenue/merge_results.json', 'w') as f:
            json.dump({
                'timestamp': str(Path(__file__).stat().st_mtime),
                'results': actual_results,
                'removed_files': merger.removed_files,
                'backup_location': str(merger.backup_dir)
            }, f, indent=2)

        print(f"\nMERGE COMPLETE!")
        print(f"Backup location: {merger.backup_dir}")
        print(f"Results saved to: merge_results.json")
        print(f"Total files removed: {len(merger.removed_files)}")

        total_space = sum(f['size'] for f in merger.removed_files)
        print(f"Space saved: {total_space / (1024*1024):.1f} MB")
    else:
        print("Merge cancelled. No files were removed.")

if __name__ == '__main__':
    main()