#!/usr/bin/env python3
"""
Revenue Worktrees Duplicate File Analysis and Merger
Analyzes duplicate files across worktrees (anf, bdf, hgz, orf, vef) and provides merge recommendations.
"""

import os
import hashlib
import json
from pathlib import Path
from collections import defaultdict
from typing import Dict, List, Set, Tuple

class DuplicateAnalyzer:
    def __init__(self, base_path: str):
        self.base_path = Path(base_path)
        self.worktrees = ['anf', 'bdf', 'hgz', 'orf', 'vef']
        self.file_hashes: Dict[str, List[Path]] = defaultdict(list)
        self.duplicate_groups: List[List[Path]] = []

    def calculate_file_hash(self, file_path: Path) -> str:
        """Calculate MD5 hash of file contents."""
        try:
            with open(file_path, 'rb') as f:
                return hashlib.md5(f.read()).hexdigest()
        except (OSError, IOError):
            return None

    def scan_worktrees(self):
        """Scan all worktrees and group files by hash."""
        print("Scanning worktrees for duplicate files...")

        for worktree in self.worktrees:
            worktree_path = self.base_path / worktree
            if not worktree_path.exists():
                print(f"Warning: Worktree {worktree} not found at {worktree_path}")
                continue

            print(f"Scanning {worktree}...")
            for file_path in worktree_path.rglob('*'):
                if file_path.is_file() and not self.is_ignored_file(file_path):
                    file_hash = self.calculate_file_hash(file_path)
                    if file_hash:
                        self.file_hashes[file_hash].append(file_path)

    def is_ignored_file(self, file_path: Path) -> bool:
        """Check if file should be ignored (git files, temp files, etc.)."""
        ignored_patterns = {
            '.git', '__pycache__', '.DS_Store', '.gitignore',
            'node_modules', '.pytest_cache', '*.pyc', '*.pyo'
        }

        # Check if any part of the path matches ignored patterns
        for part in file_path.parts:
            if part in ignored_patterns or part.startswith('.'):
                return True

        # Check file extensions
        if file_path.suffix in ['.pyc', '.pyo', '.tmp', '.log']:
            return True

        return False

    def identify_duplicates(self):
        """Identify actual duplicate files (same hash)."""
        print("Identifying duplicate files...")
        self.duplicate_groups = [
            paths for paths in self.file_hashes.values()
            if len(paths) > 1
        ]

        # Sort by number of duplicates (most duplicated first)
        self.duplicate_groups.sort(key=len, reverse=True)

    def analyze_file_names(self) -> Dict[str, List[Path]]:
        """Group files by name across worktrees."""
        name_groups: Dict[str, List[Path]] = defaultdict(list)

        for worktree in self.worktrees:
            worktree_path = self.base_path / worktree
            if not worktree_path.exists():
                continue

            for file_path in worktree_path.rglob('*'):
                if file_path.is_file() and not self.is_ignored_file(file_path):
                    # Get relative path from worktree
                    rel_path = file_path.relative_to(worktree_path)
                    name_groups[str(rel_path)].append(file_path)

        # Filter to only files that exist in multiple worktrees
        return {name: paths for name, paths in name_groups.items() if len(paths) > 1}

    def generate_report(self):
        """Generate comprehensive duplicate analysis report."""
        print("\n" + "="*80)
        print("DUPLICATE FILE ANALYSIS REPORT")
        print("="*80)

        # Content-based duplicates
        print(f"\n1. CONTENT-BASED DUPLICATES (Same hash): {len(self.duplicate_groups)} groups")

        total_duplicate_files = sum(len(group) for group in self.duplicate_groups)
        print(f"   Total duplicate files: {total_duplicate_files}")

        for i, group in enumerate(self.duplicate_groups[:20]):  # Show first 20 groups
            print(f"\n   Group {i+1} ({len(group)} files):")
            for path in group:
                print(f"     - {path}")

        if len(self.duplicate_groups) > 20:
            print(f"   ... and {len(self.duplicate_groups) - 20} more groups")

        # Name-based duplicates
        name_duplicates = self.analyze_file_names()
        print(f"\n2. NAME-BASED DUPLICATES (Same relative path): {len(name_duplicates)} groups")

        total_name_dupes = sum(len(paths) for paths in name_duplicates.values())
        print(f"   Total files with same names: {total_name_dupes}")

        print("\n   Top duplicate file names:")
        sorted_names = sorted(name_duplicates.items(), key=lambda x: len(x[1]), reverse=True)

        for name, paths in sorted_names[:15]:  # Show top 15
            print(f"   - {name} ({len(paths)} copies):")
            for path in paths:
                worktree = path.parent.parent.name if path.parent.name == 'Revenue' else path.parts[-3]
                print(f"       {worktree}: {path}")

        print("\n3. RECOMMENDATIONS:")

        if self.duplicate_groups:
            space_saved = sum((len(group) - 1) * self.get_file_size(group[0])
                            for group in self.duplicate_groups)
            print(f"   - Can save ~{self.format_bytes(space_saved)} by removing duplicate files")

        if name_duplicates:
            print("   - Consider consolidating worktrees - many files have identical names")
            print("   - Check if worktrees serve different purposes or can be merged")

        print("\n4. WORKTREE OVERVIEW:")
        for worktree in self.worktrees:
            worktree_path = self.base_path / worktree
            if worktree_path.exists():
                file_count = sum(1 for _ in worktree_path.rglob('*') if _.is_file())
                dir_count = sum(1 for _ in worktree_path.rglob('*') if _.is_dir())
                size = sum(f.stat().st_size for f in worktree_path.rglob('*') if f.is_file())
                print(f"   - {worktree}: {file_count} files, {dir_count} dirs, {self.format_bytes(size)}")
            else:
                print(f"   - {worktree}: NOT FOUND")

    def get_file_size(self, file_path: Path) -> int:
        """Get file size in bytes."""
        try:
            return file_path.stat().st_size
        except OSError:
            return 0

    def format_bytes(self, size: int) -> str:
        """Format bytes to human readable format."""
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024.0:
                return f"{size:.1f}{unit}"
            size /= 1024.0
        return f"{size:.1f}TB"

    def create_merge_plan(self) -> Dict:
        """Create a merge plan for consolidating duplicates."""
        plan = {
            'content_duplicates': [],
            'name_duplicates': [],
            'merge_actions': []
        }

        # Content-based merge plan
        for group in self.duplicate_groups:
            canonical = min(group, key=lambda p: str(p))  # Choose lexicographically first
            to_remove = [p for p in group if p != canonical]

            plan['content_duplicates'].append({
                'canonical_file': str(canonical),
                'duplicates': [str(p) for p in to_remove],
                'file_size': self.get_file_size(canonical)
            })

            for dup in to_remove:
                plan['merge_actions'].append({
                    'action': 'remove_duplicate',
                    'file': str(dup),
                    'reason': 'identical_content'
                })

        # Name-based analysis
        name_duplicates = self.analyze_file_names()
        for name, paths in name_duplicates.items():
            # Check if they're actually identical
            hashes = [self.calculate_file_hash(p) for p in paths]
            if len(set(hashes)) == 1:  # All identical
                canonical = min(paths, key=lambda p: str(p))
                to_remove = [p for p in paths if p != canonical]
                plan['name_duplicates'].append({
                    'filename': name,
                    'canonical_file': str(canonical),
                    'duplicates': [str(p) for p in to_remove],
                    'status': 'identical'
                })
            else:
                # Different content, need manual review
                plan['name_duplicates'].append({
                    'filename': name,
                    'files': [str(p) for p in paths],
                    'hashes': hashes,
                    'status': 'needs_review'
                })

        return plan

def main():
    analyzer = DuplicateAnalyzer('/Users/steven/.cursor/worktrees/Revenue')

    print("Starting duplicate analysis...")
    analyzer.scan_worktrees()
    analyzer.identify_duplicates()
    analyzer.generate_report()

    print("\nGenerating merge plan...")
    merge_plan = analyzer.create_merge_plan()

    # Save merge plan
    output_file = '/Users/steven/.cursor/worktrees/Revenue/merge_plan.json'
    with open(output_file, 'w') as f:
        json.dump(merge_plan, f, indent=2)

    print(f"Merge plan saved to: {output_file}")
    print("\nAnalysis complete!")

if __name__ == '__main__':
    main()