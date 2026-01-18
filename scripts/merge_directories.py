#!/usr/bin/env python3
"""
Intelligent Directory Merger and Deduplicator
Merges /Users/steven/ai-sites, /Users/steven/AVATARARTS, and /Users/steven/avatararts.org
"""

import os
import hashlib
import shutil
import json
from pathlib import Path
from collections import defaultdict
from datetime import datetime

class DirectoryMerger:
    def __init__(self, source_dirs, target_dir):
        self.source_dirs = [Path(d) for d in source_dirs]
        self.target_dir = Path(target_dir)
        self.file_registry = defaultdict(list)  # hash -> [(path, size, mtime), ...]
        self.name_registry = defaultdict(list)   # filename -> [paths, ...]
        self.duplicates = []
        self.unique_files = []
        self.merged_files = []
        self.conflicts = []

    def calculate_hash(self, filepath):
        """Calculate SHA256 hash of file content"""
        sha256 = hashlib.sha256()
        try:
            with open(filepath, 'rb') as f:
                for chunk in iter(lambda: f.read(4096), b''):
                    sha256.update(chunk)
            return sha256.hexdigest()
        except Exception as e:
            print(f"Error hashing {filepath}: {e}")
            return None

    def scan_directory(self, directory):
        """Scan directory and register all files"""
        print(f"📂 Scanning {directory}...")
        file_count = 0

        for root, dirs, files in os.walk(directory):
            # Skip hidden directories and common ignore patterns
            dirs[:] = [d for d in dirs if not d.startswith('.') and d not in ['node_modules', '__pycache__', '.git']]

            for file in files:
                if file.startswith('.'):
                    continue

                filepath = Path(root) / file
                try:
                    if filepath.is_file():
                        stat = filepath.stat()
                        size = stat.st_size
                        mtime = stat.st_mtime

                        # Register by name
                        rel_path = filepath.relative_to(directory)
                        self.name_registry[file].append((filepath, rel_path, size, mtime))

                        # Register by content hash (for files < 100MB)
                        if size < 100 * 1024 * 1024:  # 100MB limit
                            file_hash = self.calculate_hash(filepath)
                            if file_hash:
                                self.file_registry[file_hash].append((filepath, rel_path, size, mtime))

                        file_count += 1
                        if file_count % 100 == 0:
                            print(f"  Processed {file_count} files...")
                except Exception as e:
                    print(f"  ⚠️  Error processing {filepath}: {e}")

        print(f"✅ Scanned {file_count} files from {directory}")
        return file_count

    def analyze_duplicates(self):
        """Identify duplicate files by content and name"""
        print("\n🔍 Analyzing duplicates...")

        # Find duplicates by content hash
        content_duplicates = {h: paths for h, paths in self.file_registry.items() if len(paths) > 1}

        # Find duplicates by filename
        name_duplicates = {name: paths for name, paths in self.name_registry.items() if len(paths) > 1}

        print(f"📊 Found {len(content_duplicates)} sets of content duplicates")
        print(f"📊 Found {len(name_duplicates)} sets of name duplicates")

        return content_duplicates, name_duplicates

    def determine_best_source(self, file_paths):
        """Determine which file to keep based on priority and recency"""
        # Priority: AVATARARTS (MAIN) > avatararts.org > ai-sites
        priority = {
            'AVATARARTS': 3,  # MAIN directory - highest priority
            'avatararts.org': 2,
            'ai-sites': 1
        }

        scored = []
        for filepath, rel_path, size, mtime in file_paths:
            source_dir = None
            for src in self.source_dirs:
                try:
                    if filepath.is_relative_to(src):
                        source_dir = src.name
                        break
                except:
                    if str(filepath).startswith(str(src)):
                        source_dir = src.name
                        break

            score = priority.get(source_dir, 0)
            scored.append((score, mtime, size, filepath, rel_path))

        # Sort by priority (desc), then mtime (desc - most recent), then size (desc - largest)
        scored.sort(reverse=True)
        return scored[0][3], scored[0][4]  # Return best filepath and rel_path

    def generate_merge_plan(self):
        """Generate a plan for merging files"""
        print("\n📋 Generating merge plan...")

        content_dups, name_dups = self.analyze_duplicates()

        plan = {
            'content_duplicates': [],
            'name_duplicates': [],
            'unique_files': [],
            'target_directory': str(self.target_dir)
        }

        # Process content duplicates
        for file_hash, file_paths in content_dups.items():
            best_file, best_rel = self.determine_best_source(file_paths)
            duplicates = [p for p, _, _, _ in file_paths if p != best_file]

            plan['content_duplicates'].append({
                'keep': str(best_file),
                'keep_relative': str(best_rel),
                'duplicates': [str(p) for p in duplicates],
                'hash': file_hash
            })

        # Process name duplicates - compare content to see if same
        # First, get all content duplicate hashes to skip
        content_dup_hashes = set()
        for dup in plan['content_duplicates']:
            content_dup_hashes.add(dup['hash'])

        for filename, file_paths in name_dups.items():
            # Calculate hashes for all files with this name
            file_info = {}  # hash -> [(filepath, rel_path, size, mtime), ...]
            unhashed_files = []  # Files that couldn't be hashed

            for filepath, rel_path, size, mtime in file_paths:
                if size < 100 * 1024 * 1024:  # Only hash files < 100MB
                    file_hash = self.calculate_hash(filepath)
                    if file_hash:
                        # Skip if already handled as content duplicate
                        if file_hash in content_dup_hashes:
                            continue
                        if file_hash not in file_info:
                            file_info[file_hash] = []
                        file_info[file_hash].append((filepath, rel_path, size, mtime))
                    else:
                        unhashed_files.append((filepath, rel_path, size, mtime))
                else:
                    # Large files - add to unhashed
                    unhashed_files.append((filepath, rel_path, size, mtime))

            # Check if all remaining files have the same content
            if len(file_info) == 1 and len(unhashed_files) == 0:
                # All files have same content - keep best one
                file_hash, paths = next(iter(file_info.items()))
                if len(paths) > 1:
                    best_file, best_rel = self.determine_best_source(paths)
                    duplicates = [p for p, _, _, _ in paths if p != best_file]

                    plan['name_duplicates'].append({
                        'filename': filename,
                        'keep': str(best_file),
                        'keep_relative': str(best_rel),
                        'duplicates': [str(p) for p in duplicates],
                        'hash': file_hash,
                        'same_content': True
                    })
            elif len(file_info) > 1 or (len(file_info) > 0 and len(unhashed_files) > 0):
                # Different content - keep the best file overall
                all_paths = []
                for paths in file_info.values():
                    all_paths.extend(paths)
                all_paths.extend(unhashed_files)

                if len(all_paths) > 1:
                    best_file, best_rel = self.determine_best_source(all_paths)
                    duplicates = [p for p, _, _, _ in all_paths if p != best_file]

                    plan['name_duplicates'].append({
                        'filename': filename,
                        'keep': str(best_file),
                        'keep_relative': str(best_rel),
                        'duplicates': [str(p) for p in duplicates],
                        'hash': 'MIXED',
                        'same_content': False
                    })

        # Find unique files (not in target directory)
        target_paths = set()
        if self.target_dir.exists():
            for root, dirs, files in os.walk(self.target_dir):
                dirs[:] = [d for d in dirs if not d.startswith('.')]
                for file in files:
                    if not file.startswith('.'):
                        target_paths.add(Path(root) / file)

        for src_dir in self.source_dirs:
            if src_dir == self.target_dir:
                continue

            for root, dirs, files in os.walk(src_dir):
                dirs[:] = [d for d in dirs if not d.startswith('.')]
                for file in files:
                    if file.startswith('.'):
                        continue
                    filepath = Path(root) / file
                    rel_path = filepath.relative_to(src_dir)
                    # Merge directly into target, preserving relative path structure
                    target_path = self.target_dir / rel_path

                    # Check if already in target
                    if target_path not in target_paths:
                        plan['unique_files'].append({
                            'source': str(filepath),
                            'target': str(target_path),
                            'relative': str(rel_path)
                        })

        return plan

    def execute_merge(self, plan, dry_run=True):
        """Execute the merge plan"""
        mode = "DRY RUN" if dry_run else "EXECUTING"
        print(f"\n🚀 {mode} merge operation...")

        stats = {
            'content_duplicates_removed': 0,
            'name_duplicates_removed': 0,
            'unique_files_copied': 0,
            'files_deleted': 0,
            'errors': []
        }

        # Ensure target directory exists
        if not dry_run:
            self.target_dir.mkdir(parents=True, exist_ok=True)

        # Process content duplicates (keep best, remove others)
        for dup in plan['content_duplicates']:
            keep_path = Path(dup['keep'])
            # Merge directly into target, preserving relative path
            target_path = self.target_dir / dup['keep_relative']

            # Count duplicates that would be removed (not in AVATARARTS)
            duplicates_to_remove = []
            for dup_path_str in dup['duplicates']:
                dup_path = Path(dup_path_str)
                # Only delete if not in AVATARARTS (main directory)
                is_in_avatararts = any(str(dup_path).startswith(str(src_dir)) for src_dir in self.source_dirs if 'AVATARARTS' in str(src_dir))
                if dup_path.exists() and not is_in_avatararts:
                    duplicates_to_remove.append(dup_path)

            if not dry_run:
                try:
                    target_path.parent.mkdir(parents=True, exist_ok=True)
                    if not target_path.exists():
                        shutil.copy2(keep_path, target_path)

                    # Remove duplicate files from source directories
                    for dup_path in duplicates_to_remove:
                        try:
                            dup_path.unlink()
                            stats['files_deleted'] += 1
                        except Exception as e:
                            stats['errors'].append(f"Error deleting {dup_path}: {e}")

                    stats['content_duplicates_removed'] += len(dup['duplicates'])
                except Exception as e:
                    stats['errors'].append(f"Error copying {keep_path}: {e}")
            else:
                print(f"  ✓ Would keep: {dup['keep_relative']}")
                print(f"    Would remove: {len(duplicates_to_remove)} duplicates (from ai-sites/avatararts.org)")
                stats['content_duplicates_removed'] += len(dup['duplicates'])
                stats['files_deleted'] += len(duplicates_to_remove)

        # Process name duplicates (compare content, keep best, remove others)
        for dup in plan['name_duplicates']:
            keep_path = Path(dup['keep'])
            # Merge directly into target, preserving relative path
            target_path = self.target_dir / dup['keep_relative']

            duplicates_count = len(dup.get('duplicates', []))

            # Count duplicates that would be removed (not in AVATARARTS)
            duplicates_to_remove = []
            for dup_path_str in dup.get('duplicates', []):
                dup_path = Path(dup_path_str)
                # Only delete if not in AVATARARTS (main directory)
                is_in_avatararts = any(str(dup_path).startswith(str(src_dir)) for src_dir in self.source_dirs if 'AVATARARTS' in str(src_dir))
                if dup_path.exists() and not is_in_avatararts:
                    duplicates_to_remove.append(dup_path)

            if not dry_run:
                try:
                    target_path.parent.mkdir(parents=True, exist_ok=True)
                    if not target_path.exists():
                        shutil.copy2(keep_path, target_path)

                    # Remove duplicate files from source directories
                    for dup_path in duplicates_to_remove:
                        try:
                            dup_path.unlink()
                            stats['files_deleted'] += 1
                        except Exception as e:
                            stats['errors'].append(f"Error deleting {dup_path}: {e}")

                    if duplicates_count > 0:
                        stats['name_duplicates_removed'] += duplicates_count
                except Exception as e:
                    stats['errors'].append(f"Error copying {keep_path}: {e}")
            else:
                if duplicates_count > 0:
                    content_note = "same content" if dup.get('same_content') else "different content"
                    print(f"  ✓ Would keep: {dup['keep_relative']} ({content_note}, would remove {len(duplicates_to_remove)} duplicates)")
                    stats['name_duplicates_removed'] += duplicates_count
                    stats['files_deleted'] += len(duplicates_to_remove)
                else:
                    print(f"  ✓ Would keep: {dup['keep_relative']} (unique)")

        # Process unique files
        for item in plan['unique_files']:
            source_path = Path(item['source'])
            target_path = Path(item['target'])

            if not dry_run:
                try:
                    target_path.parent.mkdir(parents=True, exist_ok=True)
                    if not target_path.exists():
                        shutil.copy2(source_path, target_path)
                        stats['unique_files_copied'] += 1
                except Exception as e:
                    stats['errors'].append(f"Error copying {source_path}: {e}")
            else:
                print(f"  ✓ Would copy: {item['relative']}")
                stats['unique_files_copied'] += 1

        return stats

def main():
    import sys

    source_dirs = [
        '/Users/steven/ai-sites',
        '/Users/steven/AVATARARTS'
    ]
    target_dir = '/Users/steven/avatararts.org'

    execute = '--execute' in sys.argv

    print("=" * 80)
    print("🔀 INTELLIGENT DIRECTORY MERGER & DEDUPLICATOR")
    print("=" * 80)
    print(f"\n📁 Source directories:")
    for d in source_dirs:
        print(f"   - {d}")
    print(f"\n🎯 Target directory: {target_dir}")
    print("=" * 80)

    merger = DirectoryMerger(source_dirs, target_dir)

    # Check if plan already exists
    plan_file = Path(target_dir) / 'MERGE_PLAN.json'
    if plan_file.exists() and execute:
        print(f"\n📋 Loading existing merge plan from: {plan_file}")
        with open(plan_file, 'r') as f:
            plan = json.load(f)
    else:
        # Scan all directories
        total_files = 0
        for src_dir in source_dirs:
            if Path(src_dir).exists():
                total_files += merger.scan_directory(src_dir)
            else:
                print(f"⚠️  Directory not found: {src_dir}")

        # Generate merge plan
        plan = merger.generate_merge_plan()

        # Save plan to JSON
        with open(plan_file, 'w') as f:
            json.dump(plan, f, indent=2)
        print(f"\n💾 Merge plan saved to: {plan_file}")

    if execute:
        # Execute actual merge
        print("\n" + "=" * 80)
        print("🚀 EXECUTING MERGE OPERATION")
        print("=" * 80)
        merge_stats = merger.execute_merge(plan, dry_run=False)

        # Print summary
        print("\n" + "=" * 80)
        print("✅ MERGE COMPLETE!")
        print("=" * 80)
        print(f"Content duplicates removed: {merge_stats['content_duplicates_removed']}")
        print(f"Name duplicates removed: {merge_stats['name_duplicates_removed']}")
        print(f"Unique files copied: {merge_stats['unique_files_copied']}")
        print(f"Total files deleted: {merge_stats.get('files_deleted', 0)}")
        if merge_stats['errors']:
            print(f"\n⚠️  Errors encountered: {len(merge_stats['errors'])}")
            for error in merge_stats['errors'][:10]:  # Show first 10 errors
                print(f"   - {error}")
            if len(merge_stats['errors']) > 10:
                print(f"   ... and {len(merge_stats['errors']) - 10} more errors")
    else:
        # Execute dry run
        print("\n" + "=" * 80)
        print("🔍 DRY RUN - Preview of merge operations")
        print("=" * 80)
        dry_run_stats = merger.execute_merge(plan, dry_run=True)

        # Print summary
        print("\n" + "=" * 80)
        print("📊 DRY RUN SUMMARY")
        print("=" * 80)
        print(f"Content duplicates to remove: {dry_run_stats['content_duplicates_removed']}")
        print(f"Name duplicates to remove: {dry_run_stats['name_duplicates_removed']}")
        print(f"Unique files to copy: {dry_run_stats['unique_files_copied']}")
        print(f"Total files that would be deleted: {dry_run_stats.get('files_deleted', 0)}")
        print(f"\n💾 Full plan saved to: {plan_file}")
        print("\n⚠️  Review the plan, then run with --execute to perform the merge")

if __name__ == '__main__':
    import sys
    main()
