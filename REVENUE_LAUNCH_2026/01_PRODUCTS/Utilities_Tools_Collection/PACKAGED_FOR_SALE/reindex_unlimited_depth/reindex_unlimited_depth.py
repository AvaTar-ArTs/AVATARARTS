#!/usr/bin/env python3
"""
Unlimited Depth Reindexing for AVATARARTS
Comprehensive indexing of entire directory structure with no depth limits
"""

import os
import hashlib
import json
import csv
from pathlib import Path
from datetime import datetime
from collections import defaultdict, Counter
import mimetypes

class UnlimitedDepthReindexer:
    def __init__(self, root_dir):
        self.root_dir = Path(root_dir)
        self.timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.output_dir = self.root_dir / "INDEXES" / "unlimited_depth"
        self.output_dir.mkdir(parents=True, exist_ok=True)

        self.stats = {
            'total_files': 0,
            'total_dirs': 0,
            'total_size': 0,
            'max_depth': 0,
            'by_extension': Counter(),
            'by_directory': defaultdict(lambda: {'count': 0, 'size': 0}),
            'by_depth': defaultdict(int),
            'large_files': [],
            'recent_files': [],
            'old_files': []
        }

        self.file_index = []
        self.dir_index = []

        # Exclude patterns (but no depth limit)
        self.exclude_patterns = [
            'node_modules', '.git', '__pycache__', '.venv', 'venv',
            '.next', 'dist', 'build', '.cache', '.DS_Store',
            '.pytest_cache', '.mypy_cache', '.tox', '.idea', '.vscode'
        ]

    def should_exclude(self, path):
        """Check if path should be excluded"""
        path_str = str(path)
        return any(pattern in path_str for pattern in self.exclude_patterns)

    def calculate_hash(self, filepath, max_size=100*1024*1024):
        """Calculate SHA256 hash of file"""
        try:
            size = filepath.stat().st_size
            if size > max_size:
                return f"LARGE_{size}"

            sha256 = hashlib.sha256()
            with open(filepath, 'rb') as f:
                for chunk in iter(lambda: f.read(4096), b''):
                    sha256.update(chunk)
            return sha256.hexdigest()
        except:
            return None

    def scan_unlimited_depth(self):
        """Scan entire directory structure with unlimited depth"""
        print("=" * 80)
        print("🔍 UNLIMITED DEPTH REINDEXING")
        print("=" * 80)
        print(f"Root: {self.root_dir}")
        print(f"Output: {self.output_dir}")
        print(f"Timestamp: {self.timestamp}")
        print("=" * 80)
        print("\n📂 Scanning with UNLIMITED DEPTH...\n")

        # Use rglob for unlimited depth traversal
        all_paths = list(self.root_dir.rglob('*'))
        total_paths = len(all_paths)

        print(f"Found {total_paths:,} paths to process...\n")

        for idx, path in enumerate(all_paths):
            if idx % 10000 == 0 and idx > 0:
                print(f"   Processed {idx:,}/{total_paths:,} paths ({self.stats['total_files']:,} files)...")

            if self.should_exclude(path):
                continue

            try:
                if path.is_file():
                    self.index_file(path)
                elif path.is_dir():
                    self.index_directory(path)
            except Exception as e:
                pass

        print(f"\n✅ Scan complete!")
        print(f"   Files: {self.stats['total_files']:,}")
        print(f"   Directories: {self.stats['total_dirs']:,}")
        print(f"   Total size: {self.stats['total_size'] / (1024**3):.2f} GB")
        print(f"   Max depth: {self.stats['max_depth']}")

    def index_file(self, filepath):
        """Index a single file"""
        try:
            stat = filepath.stat()
            size = stat.st_size
            rel_path = filepath.relative_to(self.root_dir)
            depth = len(rel_path.parts) - 1

            # Update max depth
            if depth > self.stats['max_depth']:
                self.stats['max_depth'] = depth

            ext = filepath.suffix.lower() or '(no extension)'
            mime_type, _ = mimetypes.guess_type(str(filepath))

            file_hash = self.calculate_hash(filepath)

            file_info = {
                'path': str(rel_path),
                'absolute_path': str(filepath),
                'name': filepath.name,
                'directory': str(rel_path.parent) if rel_path.parent != Path('.') else 'root',
                'parent_dir': rel_path.parts[0] if len(rel_path.parts) > 1 else 'root',
                'size_bytes': size,
                'size_mb': size / (1024**2),
                'size_gb': size / (1024**3),
                'extension': ext,
                'mime_type': mime_type or 'unknown',
                'depth': depth,
                'modified': datetime.fromtimestamp(stat.st_mtime).isoformat(),
                'created': datetime.fromtimestamp(stat.st_ctime).isoformat(),
                'hash': file_hash,
                'is_large': size > 100 * 1024 * 1024,
                'is_recent': (datetime.now().timestamp() - stat.st_mtime) < 7 * 24 * 3600,
                'is_old': (datetime.now().timestamp() - stat.st_mtime) > 365 * 24 * 3600
            }

            self.file_index.append(file_info)

            # Update statistics
            self.stats['total_files'] += 1
            self.stats['total_size'] += size
            self.stats['by_extension'][ext] += 1
            self.stats['by_directory'][file_info['parent_dir']]['count'] += 1
            self.stats['by_directory'][file_info['parent_dir']]['size'] += size
            self.stats['by_depth'][depth] += 1

            if size > 100 * 1024 * 1024:  # > 100MB
                self.stats['large_files'].append(file_info)

            if file_info['is_recent']:
                self.stats['recent_files'].append(file_info)

            if file_info['is_old']:
                self.stats['old_files'].append(file_info)

        except Exception as e:
            pass

    def index_directory(self, dirpath):
        """Index a single directory"""
        try:
            rel_path = dirpath.relative_to(self.root_dir)
            depth = len(rel_path.parts) - 1

            if depth > self.stats['max_depth']:
                self.stats['max_depth'] = depth

            dir_info = {
                'path': str(rel_path),
                'absolute_path': str(dirpath),
                'name': dirpath.name,
                'parent_dir': rel_path.parts[0] if len(rel_path.parts) > 1 else 'root',
                'depth': depth,
                'modified': datetime.fromtimestamp(dirpath.stat().st_mtime).isoformat()
            }

            self.dir_index.append(dir_info)
            self.stats['total_dirs'] += 1
            self.stats['by_depth'][depth] += 1

        except Exception as e:
            pass

    def generate_csv_indexes(self):
        """Generate CSV indexes"""
        print("\n📊 Generating CSV indexes...")

        # 1. Complete file index
        files_csv = self.output_dir / f"files_index_{self.timestamp}.csv"
        print(f"   Creating {files_csv.name}...")
        with open(files_csv, 'w', newline='', encoding='utf-8') as f:
            if self.file_index:
                writer = csv.DictWriter(f, fieldnames=self.file_index[0].keys())
                writer.writeheader()
                writer.writerows(self.file_index)
        print(f"      ✅ {len(self.file_index):,} files indexed")

        # 2. Directory index
        dirs_csv = self.output_dir / f"directories_index_{self.timestamp}.csv"
        print(f"   Creating {dirs_csv.name}...")
        with open(dirs_csv, 'w', newline='', encoding='utf-8') as f:
            if self.dir_index:
                writer = csv.DictWriter(f, fieldnames=self.dir_index[0].keys())
                writer.writeheader()
                writer.writerows(self.dir_index)
        print(f"      ✅ {len(self.dir_index):,} directories indexed")

        # 3. By name
        name_csv = self.output_dir / f"index_by_name_{self.timestamp}.csv"
        print(f"   Creating {name_csv.name}...")
        sorted_by_name = sorted(self.file_index, key=lambda x: x['name'].lower())
        with open(name_csv, 'w', newline='', encoding='utf-8') as f:
            if sorted_by_name:
                writer = csv.DictWriter(f, fieldnames=sorted_by_name[0].keys())
                writer.writeheader()
                writer.writerows(sorted_by_name)
        print(f"      ✅ Sorted by name")

        # 4. By size
        size_csv = self.output_dir / f"index_by_size_{self.timestamp}.csv"
        print(f"   Creating {size_csv.name}...")
        sorted_by_size = sorted(self.file_index, key=lambda x: x['size_bytes'], reverse=True)
        with open(size_csv, 'w', newline='', encoding='utf-8') as f:
            if sorted_by_size:
                writer = csv.DictWriter(f, fieldnames=sorted_by_size[0].keys())
                writer.writeheader()
                writer.writerows(sorted_by_size)
        print(f"      ✅ Sorted by size")

        # 5. By depth
        depth_csv = self.output_dir / f"index_by_depth_{self.timestamp}.csv"
        print(f"   Creating {depth_csv.name}...")
        sorted_by_depth = sorted(self.file_index, key=lambda x: (x['depth'], x['path']))
        with open(depth_csv, 'w', newline='', encoding='utf-8') as f:
            if sorted_by_depth:
                writer = csv.DictWriter(f, fieldnames=sorted_by_depth[0].keys())
                writer.writeheader()
                writer.writerows(sorted_by_depth)
        print(f"      ✅ Sorted by depth")

        return files_csv, dirs_csv, name_csv, size_csv, depth_csv

    def generate_json_index(self):
        """Generate JSON index"""
        print("\n📄 Generating JSON index...")
        json_file = self.output_dir / f"complete_index_{self.timestamp}.json"

        index_data = {
            'metadata': {
                'timestamp': self.timestamp,
                'root_directory': str(self.root_dir),
                'total_files': self.stats['total_files'],
                'total_dirs': self.stats['total_dirs'],
                'total_size_bytes': self.stats['total_size'],
                'total_size_gb': self.stats['total_size'] / (1024**3),
                'max_depth': self.stats['max_depth']
            },
            'statistics': {
                'by_extension': dict(self.stats['by_extension']),
                'by_directory': {k: dict(v) for k, v in self.stats['by_directory'].items()},
                'by_depth': dict(self.stats['by_depth']),
                'large_files_count': len(self.stats['large_files']),
                'recent_files_count': len(self.stats['recent_files']),
                'old_files_count': len(self.stats['old_files'])
            },
            'files': self.file_index,
            'directories': self.dir_index
        }

        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(index_data, f, indent=2, ensure_ascii=False)

        print(f"      ✅ {json_file.name} ({len(self.file_index):,} files)")
        return json_file

    def generate_report(self):
        """Generate markdown report"""
        print("\n📋 Generating report...")
        report_file = self.output_dir / f"REINDEX_REPORT_{self.timestamp}.md"

        with open(report_file, 'w', encoding='utf-8') as f:
            f.write("# AVATARARTS Unlimited Depth Reindex Report\n")
            f.write("=" * 80 + "\n\n")
            f.write(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"**Timestamp:** {self.timestamp}\n\n")

            f.write("## 📊 Overall Statistics\n\n")
            f.write(f"- **Total Files:** {self.stats['total_files']:,}\n")
            f.write(f"- **Total Directories:** {self.stats['total_dirs']:,}\n")
            f.write(f"- **Total Size:** {self.stats['total_size'] / (1024**3):.2f} GB\n")
            f.write(f"- **Maximum Depth:** {self.stats['max_depth']} levels\n")
            f.write(f"- **File Types:** {len(self.stats['by_extension'])}\n")
            f.write(f"- **Top-level Directories:** {len(self.stats['by_directory'])}\n\n")

            f.write("## 📁 Depth Distribution\n\n")
            for depth in sorted(self.stats['by_depth'].keys()):
                count = self.stats['by_depth'][depth]
                f.write(f"- **Depth {depth}:** {count:,} items\n")
            f.write("\n")

            f.write("## 📄 Top File Extensions\n\n")
            for ext, count in self.stats['by_extension'].most_common(20):
                size = sum(f['size_bytes'] for f in self.file_index if f['extension'] == ext)
                f.write(f"- `{ext}`: {count:,} files ({size / (1024**3):.2f} GB)\n")
            f.write("\n")

            f.write("## 📂 Top Directories by Size\n\n")
            sorted_dirs = sorted(self.stats['by_directory'].items(),
                               key=lambda x: x[1]['size'], reverse=True)[:20]
            for dir_name, data in sorted_dirs:
                f.write(f"- `{dir_name}`: {data['count']:,} files ({data['size'] / (1024**3):.2f} GB)\n")
            f.write("\n")

            f.write("## 🔍 Special Files\n\n")
            f.write(f"- **Large Files (>100MB):** {len(self.stats['large_files']):,}\n")
            f.write(f"- **Recent Files (<7 days):** {len(self.stats['recent_files']):,}\n")
            f.write(f"- **Old Files (>1 year):** {len(self.stats['old_files']):,}\n\n")

            f.write("## 📋 Generated Indexes\n\n")
            f.write("All indexes are saved in the `INDEXES/unlimited_depth/` directory:\n\n")
            f.write("- Complete file index (CSV)\n")
            f.write("- Directory index (CSV)\n")
            f.write("- Index by name (CSV)\n")
            f.write("- Index by size (CSV)\n")
            f.write("- Index by depth (CSV)\n")
            f.write("- Complete JSON index\n")
            f.write("- This markdown report\n")

        print(f"      ✅ {report_file.name}")
        return report_file

def main():
    root_dir = Path("/Users/steven/AVATARARTS")

    if not root_dir.exists():
        print(f"❌ Directory not found: {root_dir}")
        return

    reindexer = UnlimitedDepthReindexer(root_dir)

    # Scan with unlimited depth
    reindexer.scan_unlimited_depth()

    # Generate indexes
    print("\n" + "=" * 80)
    print("📊 GENERATING INDEXES")
    print("=" * 80)

    csv_files = reindexer.generate_csv_indexes()
    json_file = reindexer.generate_json_index()
    report = reindexer.generate_report()

    print("\n" + "=" * 80)
    print("✅ UNLIMITED DEPTH REINDEXING COMPLETE")
    print("=" * 80)
    print(f"\n📂 All indexes saved to: {reindexer.output_dir}")
    print(f"\n📊 Summary:")
    print(f"   - Files indexed: {reindexer.stats['total_files']:,}")
    print(f"   - Directories indexed: {reindexer.stats['total_dirs']:,}")
    print(f"   - Maximum depth: {reindexer.stats['max_depth']} levels")
    print(f"   - Total size: {reindexer.stats['total_size'] / (1024**3):.2f} GB")
    print()

if __name__ == '__main__':
    main()
