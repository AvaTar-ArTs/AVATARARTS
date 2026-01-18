#!/usr/bin/env python3
"""
Directory Comparison Tool
Compares /Users/steven/avatararts.org, /Users/steven/ai-sites, and /Users/steven/AVATARARTS
"""

import os
import hashlib
import json
from pathlib import Path
from collections import defaultdict
from datetime import datetime

class DirectoryComparator:
    def __init__(self, dirs):
        self.dirs = {name: Path(d) for name, d in dirs.items()}
        self.file_registry = defaultdict(dict)  # hash -> {dir_name: [paths]}
        self.name_registry = defaultdict(dict)  # filename -> {dir_name: [paths]}
        self.stats = {
            'total_files': defaultdict(int),
            'total_size': defaultdict(int),
            'unique_files': defaultdict(int),
            'shared_files': defaultdict(int),
            'content_duplicates': 0,
            'name_duplicates': 0
        }

    def calculate_hash(self, filepath):
        """Calculate SHA256 hash of file content"""
        sha256 = hashlib.sha256()
        try:
            with open(filepath, 'rb') as f:
                for chunk in iter(lambda: f.read(4096), b''):
                    sha256.update(chunk)
            return sha256.hexdigest()
        except Exception as e:
            return None

    def scan_directory(self, dir_name, directory):
        """Scan directory and register all files"""
        print(f"📂 Scanning {dir_name} ({directory})...")
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

                        self.stats['total_files'][dir_name] += 1
                        self.stats['total_size'][dir_name] += size

                        # Register by name
                        rel_path = filepath.relative_to(directory)
                        if file not in self.name_registry:
                            self.name_registry[file] = {}
                        if dir_name not in self.name_registry[file]:
                            self.name_registry[file][dir_name] = []
                        self.name_registry[file][dir_name].append((filepath, rel_path, size, mtime))

                        # Register by content hash (for files < 100MB)
                        if size < 100 * 1024 * 1024:  # 100MB limit
                            file_hash = self.calculate_hash(filepath)
                            if file_hash:
                                if file_hash not in self.file_registry:
                                    self.file_registry[file_hash] = {}
                                if dir_name not in self.file_registry[file_hash]:
                                    self.file_registry[file_hash][dir_name] = []
                                self.file_registry[file_hash][dir_name].append((filepath, rel_path, size, mtime))

                        file_count += 1
                        if file_count % 500 == 0:
                            print(f"  Processed {file_count} files...")
                except Exception as e:
                    pass

        print(f"✅ Scanned {file_count} files from {dir_name}")
        return file_count

    def analyze(self):
        """Analyze the directories and generate comparison report"""
        print("\n🔍 Analyzing directories...")

        # Scan all directories
        for dir_name, directory in self.dirs.items():
            if directory.exists():
                self.scan_directory(dir_name, directory)
            else:
                print(f"⚠️  Directory not found: {directory}")

        # Analyze content duplicates
        content_dups = {h: paths for h, paths in self.file_registry.items() if len(paths) > 1}
        self.stats['content_duplicates'] = len(content_dups)

        # Analyze name duplicates
        name_dups = {name: paths for name, paths in self.name_registry.items() if len(paths) > 1}
        self.stats['name_duplicates'] = len(name_dups)

        # Find unique files per directory
        for dir_name in self.dirs.keys():
            unique_count = 0
            for file_hash, paths in self.file_registry.items():
                if dir_name in paths and len(paths[dir_name]) > 0:
                    # Check if this hash exists in other directories
                    other_dirs = [d for d in paths.keys() if d != dir_name]
                    if len(other_dirs) == 0:
                        unique_count += len(paths[dir_name])
            self.stats['unique_files'][dir_name] = unique_count

        # Find shared files
        for file_hash, paths in self.file_registry.items():
            dirs_with_file = list(paths.keys())
            if len(dirs_with_file) > 1:
                for dir_name in dirs_with_file:
                    self.stats['shared_files'][dir_name] = self.stats['shared_files'].get(dir_name, 0) + len(paths[dir_name])

    def generate_report(self):
        """Generate comparison report"""
        report = {
            'timestamp': datetime.now().isoformat(),
            'directories': {name: str(path) for name, path in self.dirs.items()},
            'statistics': {},
            'comparison': {}
        }

        # Convert stats to regular dict
        for key, value in self.stats.items():
            if isinstance(value, defaultdict):
                report['statistics'][key] = dict(value)
            else:
                report['statistics'][key] = value

        # Size formatting
        def format_size(size):
            for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
                if size < 1024.0:
                    return f"{size:.2f} {unit}"
                size /= 1024.0
            return f"{size:.2f} PB"

        # Print report
        print("\n" + "=" * 80)
        print("📊 DIRECTORY COMPARISON REPORT")
        print("=" * 80)

        print("\n📁 DIRECTORY STATISTICS:")
        for dir_name in self.dirs.keys():
            total_files = self.stats['total_files'].get(dir_name, 0)
            total_size = self.stats['total_size'].get(dir_name, 0)
            unique_files = self.stats['unique_files'].get(dir_name, 0)
            shared_files = self.stats['shared_files'].get(dir_name, 0)

            print(f"\n  {dir_name}:")
            print(f"    Total files: {total_files:,}")
            print(f"    Total size: {format_size(total_size)}")
            print(f"    Unique files: {unique_files:,}")
            print(f"    Shared files: {shared_files:,}")

        print(f"\n🔍 COMPARISON METRICS:")
        print(f"    Content duplicates (same content, different locations): {self.stats['content_duplicates']:,}")
        print(f"    Name duplicates (same filename, different locations): {self.stats['name_duplicates']:,}")

        # Find files only in each directory
        print(f"\n📋 FILES UNIQUE TO EACH DIRECTORY:")
        for dir_name in self.dirs.keys():
            unique_paths = []
            for file_hash, paths in self.file_registry.items():
                if dir_name in paths and len(paths) == 1:
                    unique_paths.extend([str(rel) for _, rel, _, _ in paths[dir_name]])

            print(f"\n  {dir_name}: {len(unique_paths):,} unique files")
            if len(unique_paths) > 0 and len(unique_paths) <= 20:
                for path in sorted(unique_paths)[:20]:
                    print(f"    - {path}")
            elif len(unique_paths) > 20:
                for path in sorted(unique_paths)[:10]:
                    print(f"    - {path}")
                print(f"    ... and {len(unique_paths) - 10} more")

        # Find files in all directories
        all_shared = []
        for file_hash, paths in self.file_registry.items():
            if len(paths) == len(self.dirs):
                all_shared.append(list(paths.values())[0][0][1])  # Get first relative path

        if all_shared:
            print(f"\n📋 FILES IN ALL DIRECTORIES ({len(all_shared):,}):")
            for path in sorted(all_shared)[:20]:
                print(f"    - {path}")
            if len(all_shared) > 20:
                print(f"    ... and {len(all_shared) - 20} more")

        return report

def main():
    dirs = {
        'avatararts.org': '/Users/steven/avatararts.org',
        'ai-sites': '/Users/steven/ai-sites',
        'AVATARARTS': '/Users/steven/AVATARARTS'
    }

    print("=" * 80)
    print("🔍 DIRECTORY COMPARISON TOOL")
    print("=" * 80)
    print(f"\n📁 Comparing directories:")
    for name, path in dirs.items():
        print(f"   - {name}: {path}")
    print("=" * 80)

    comparator = DirectoryComparator(dirs)
    comparator.analyze()
    report = comparator.generate_report()

    # Save report
    report_file = Path('/Users/steven/avatararts.org/COMPARISON_REPORT.json')
    with open(report_file, 'w') as f:
        json.dump(report, f, indent=2)
    print(f"\n💾 Full report saved to: {report_file}")

if __name__ == '__main__':
    main()
