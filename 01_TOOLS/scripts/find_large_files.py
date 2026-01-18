#!/usr/bin/env python3
"""
Find Large Files - Comprehensive Large File Discovery Tool
Finds and reports large files in the workspace
"""

import os
import sys
from pathlib import Path
from collections import defaultdict
from datetime import datetime

def format_size(size_bytes):
    """Format bytes to human readable"""
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.2f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.2f} PB"

def get_file_size(filepath):
    """Get file size, return 0 if error"""
    try:
        return os.path.getsize(filepath)
    except:
        return 0

def find_large_files(root_path, min_size_mb=10, max_results=100):
    """Find all large files"""
    root = Path(root_path).resolve()
    large_files = []
    skipped_dirs = {'.git', '__pycache__', 'node_modules', '.venv', 'venv', '.cache'}

    print(f"🔍 Searching for files larger than {min_size_mb} MB in: {root}")
    print("   This may take a while...\n")

    min_size_bytes = min_size_mb * 1024 * 1024
    file_types = defaultdict(list)

    for root_dir, dirs, files in os.walk(root):
        # Skip certain directories
        dirs[:] = [d for d in dirs if d not in skipped_dirs and not d.startswith('.')]

        for file in files:
            filepath = Path(root_dir) / file

            # Skip hidden files
            if file.startswith('.'):
                continue

            try:
                size = get_file_size(filepath)
                if size >= min_size_bytes:
                    relative_path = filepath.relative_to(root)
                    suffix = filepath.suffix.lower()

                    large_files.append({
                        'path': str(relative_path),
                        'full_path': str(filepath),
                        'size': size,
                        'size_mb': round(size / (1024 * 1024), 2),
                        'type': suffix or 'no extension'
                    })

                    file_types[suffix or 'no extension'].append(size)

                    if len(large_files) % 100 == 0:
                        print(f"   Found {len(large_files)} large files so far...")

            except Exception as e:
                pass

    # Sort by size
    large_files.sort(key=lambda x: x['size'], reverse=True)

    return large_files[:max_results], file_types

def print_report(large_files, file_types, min_size_mb):
    """Print formatted report"""
    print("\n" + "="*80)
    print(f"📊 LARGE FILES REPORT (>{min_size_mb} MB)")
    print("="*80)

    total_size = sum(f['size'] for f in large_files)
    print(f"\n📁 SUMMARY:")
    print(f"   Total Large Files Found: {len(large_files):,}")
    print(f"   Total Size: {format_size(total_size)}")
    print(f"   Average Size: {format_size(total_size / len(large_files) if large_files else 0)}")

    print(f"\n📄 BY FILE TYPE:")
    type_totals = {}
    for ftype, sizes in file_types.items():
        type_totals[ftype] = sum(sizes)

    sorted_types = sorted(type_totals.items(), key=lambda x: x[1], reverse=True)[:15]
    for ftype, total_size in sorted_types:
        count = len(file_types[ftype])
        print(f"   {ftype:15} {count:>4} files, {format_size(total_size):>10} total")

    print(f"\n📦 LARGEST FILES (Top 50):")
    print(f"   {'Size':>12} {'Type':>10} {'Path'}")
    print("   " + "-"*76)

    for i, file_info in enumerate(large_files[:50], 1):
        size_str = format_size(file_info['size'])
        ftype = file_info['type'][:10]
        path = file_info['path']

        # Truncate long paths
        if len(path) > 60:
            path = "..." + path[-57:]

        print(f"   {i:2}. {size_str:>12} {ftype:>10} {path}")

    print("\n" + "="*80 + "\n")

def save_report(large_files, file_types, output_file, min_size_mb):
    """Save report to file"""
    with open(output_file, 'w') as f:
        f.write(f"# Large Files Report\n\n")
        f.write(f"**Generated:** {datetime.now().isoformat()}\n")
        f.write(f"**Minimum Size:** {min_size_mb} MB\n")
        f.write(f"**Total Files:** {len(large_files)}\n\n")

        total_size = sum(f['size'] for f in large_files)
        f.write(f"**Total Size:** {format_size(total_size)}\n\n")

        f.write("## Largest Files\n\n")
        f.write("| Rank | Size | Type | Path |\n")
        f.write("|------|------|------|------|\n")

        for i, file_info in enumerate(large_files[:100], 1):
            size_str = format_size(file_info['size'])
            ftype = file_info['type']
            path = file_info['path']
            f.write(f"| {i} | {size_str} | {ftype} | `{path}` |\n")

        f.write("\n## By File Type\n\n")
        type_totals = {}
        for ftype, sizes in file_types.items():
            type_totals[ftype] = sum(sizes)

        sorted_types = sorted(type_totals.items(), key=lambda x: x[1], reverse=True)
        f.write("| Type | Count | Total Size |\n")
        f.write("|------|-------|-----------|\n")

        for ftype, total_size in sorted_types:
            count = len(file_types[ftype])
            f.write(f"| {ftype} | {count} | {format_size(total_size)} |\n")

    print(f"📄 Report saved to: {output_file}")

def main():
    root_path = '/Users/steven/AVATARARTS'
    min_size_mb = 10

    if len(sys.argv) > 1:
        root_path = sys.argv[1]
    if len(sys.argv) > 2:
        min_size_mb = int(sys.argv[2])

    large_files, file_types = find_large_files(root_path, min_size_mb, max_results=200)

    print_report(large_files, file_types, min_size_mb)

    # Save report
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = Path(root_path) / f"LARGE_FILES_REPORT_{timestamp}.md"
    save_report(large_files, file_types, output_file, min_size_mb)

    return 0

if __name__ == '__main__':
    sys.exit(main())
