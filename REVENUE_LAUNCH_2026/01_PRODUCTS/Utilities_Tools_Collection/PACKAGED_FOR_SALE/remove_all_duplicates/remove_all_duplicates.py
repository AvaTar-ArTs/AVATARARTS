#!/usr/bin/env python3
"""
Complete Duplicate Removal - Remove ALL instances of duplicate files
"""

import os
import hashlib
import shutil
from pathlib import Path
from typing import List, Dict
import json

class CompleteDuplicateRemover:
    def __init__(self, base_path: str, dry_run: bool = True):
        self.base_path = Path(base_path)
        self.worktrees = ['anf', 'bdf', 'hgz', 'orf', 'vef']
        self.dry_run = dry_run
        self.backup_dir = self.base_path / 'COMPLETE_DUPLICATE_BACKUP'
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

    def find_all_instances(self, rel_path: str) -> List[Path]:
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

    def remove_all_instances(self, file_paths: List[Path]) -> int:
        """Remove ALL instances of the duplicate files."""
        removed_count = 0

        for file_path in file_paths:
            if self.verify_file_integrity(file_path):
                if self.dry_run:
                    print(f"Would remove: {file_path}")
                else:
                    # Backup first
                    if self.backup_file(file_path):
                        try:
                            file_path.unlink()
                            print(f"Removed: {file_path}")
                            removed_count += 1
                            self.removed_files.append({
                                'file': str(file_path),
                                'size': file_path.stat().st_size
                            })
                        except Exception as e:
                            print(f"Error removing {file_path}: {e}")
                    else:
                        print(f"Skipping {file_path} - backup failed")
            else:
                print(f"Skipping {file_path} - integrity check failed")

        return removed_count

    def process_file_group(self, rel_path: str) -> Dict:
        """Process a group of duplicate files - remove ALL."""
        file_paths = self.find_all_instances(rel_path)

        if len(file_paths) < 2:
            return {'status': 'insufficient_copies', 'files': len(file_paths)}

        if not self.verify_all_identical(file_paths):
            return {'status': 'different_content', 'files': len(file_paths)}

        # All files are identical - remove ALL instances
        removed_count = self.remove_all_instances(file_paths)

        return {
            'status': 'completely_removed',
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

    print("⚠️  COMPLETE DUPLICATE REMOVAL - DRY RUN")
    print("=" * 60)
    print("This will REMOVE ALL COPIES of duplicate files across all worktrees!")
    print("Files will be backed up to: COMPLETE_DUPLICATE_BACKUP/")
    print()

    remover = CompleteDuplicateRemover('/Users/steven/.cursor/worktrees/Revenue', dry_run=True)

    results = []
    total_space_saved = 0

    for file_path in identical_files:
        result = remover.process_file_group(file_path)
        results.append({'file': file_path, **result})

        if result['status'] == 'completely_removed':
            # Estimate space saved (all copies)
            for worktree in remover.worktrees:
                test_path = remover.base_path / worktree / file_path
                if test_path.exists():
                    total_space_saved += test_path.stat().st_size

        print(f"{result['status'].upper()}: {file_path}")
        if result['status'] == 'completely_removed':
            print(f"  Would remove: {result['removed_count']} total copies")

    print(f"\nDRY RUN COMPLETE")
    print(f"Total files that would be completely removed: {len([r for r in results if r['status'] == 'completely_removed'])}")
    print(f"Estimated space savings: {total_space_saved / (1024*1024):.1f} MB")

    # Save dry run results
    with open('/Users/steven/.cursor/worktrees/Revenue/complete_removal_dry_run.json', 'w') as f:
        json.dump(results, f, indent=2)

    print("\nDry run results saved to: complete_removal_dry_run.json")

    response = input("\n⚠️  Proceed with COMPLETE REMOVAL of ALL duplicate copies? (yes/no): ").lower().strip()

    if response == 'yes':
        print("\n🗑️  EXECUTING COMPLETE REMOVAL...")
        print("=" * 60)

        remover = CompleteDuplicateRemover('/Users/steven/.cursor/worktrees/Revenue', dry_run=False)

        actual_results = []
        for file_path in identical_files:
            result = remover.process_file_group(file_path)
            actual_results.append({'file': file_path, **result})

        # Save final results
        with open('/Users/steven/.cursor/worktrees/Revenue/complete_removal_results.json', 'w') as f:
            json.dump({
                'timestamp': str(Path(__file__).stat().st_mtime),
                'results': actual_results,
                'removed_files': remover.removed_files,
                'backup_location': str(remover.backup_dir)
            }, f, indent=2)

        print(f"\n✅ COMPLETE REMOVAL FINISHED!")
        print(f"Backup location: {remover.backup_dir}")
        print(f"Results saved to: complete_removal_results.json")
        print(f"Total files removed: {len(remover.removed_files)}")

        total_space = sum(f['size'] for f in remover.removed_files)
        print(f"Space saved: {total_space / (1024*1024):.1f} MB")
    else:
        print("Complete removal cancelled. No files were removed.")

if __name__ == '__main__':
    main()