#!/usr/bin/env python3
"""
Scan ~/ for scattered Python files at unlimited depth
Find .py, .pyw, .ipynb files outside of organized directories
"""

import os
from pathlib import Path
from collections import defaultdict
import json
from datetime import datetime

# Directories to skip
SKIP_DIRS = {
    '.git', '.svn', '.hg', '__pycache__', '.pytest_cache', '.mypy_cache',
    'node_modules', '.npm', '.yarn', 'venv', 'env', '.venv', 'env3',
    'Library', 'Applications', 'System', 'System Volume Information',
    'Pictures', 'Movies', 'Music', 'Downloads', 'Desktop', 'Documents',
    '.Trash', '.cache', '.local', '.config', 'pythons', 'pythons-sort',
    'analysis_reports', '.DS_Store'
}

# File extensions to look for
PYTHON_EXTENSIONS = {'.py', '.pyw', '.ipynb'}

def should_skip(path):
    """Check if path should be skipped"""
    parts = path.parts
    # Skip if any part is in SKIP_DIRS
    for part in parts:
        if part in SKIP_DIRS:
            return True
        # Skip hidden directories (except .config, .local which we skip explicitly)
        if part.startswith('.') and part not in ('.config', '.local'):
            if part != path.name:  # Don't skip if it's the filename itself
                return True
    return False

def scan_directory(root_dir, output_file=None):
    """
    Scan directory recursively for Python files
    """
    root = Path(root_dir).expanduser().resolve()

    print(f"🔍 Scanning: {root}")
    print(f"   Looking for: {', '.join(PYTHON_EXTENSIONS)}")
    print(f"   Skipping: {', '.join(sorted(list(SKIP_DIRS))[:10])}...")
    print("=" * 70)

    found_files = []
    by_directory = defaultdict(list)
    by_extension = defaultdict(int)
    errors = []

    total_scanned = 0

    for root_path, dirs, files in os.walk(root):
        # Filter out directories to skip
        dirs[:] = [d for d in dirs if not should_skip(Path(root_path) / d)]

        rel_root = Path(root_path).relative_to(root)

        # Skip the root directory itself if it's in skip list
        if should_skip(Path(root_path)):
            continue

        for file in files:
            total_scanned += 1
            file_path = Path(root_path) / file

            # Check extension
            if file_path.suffix.lower() in PYTHON_EXTENSIONS:
                try:
                    rel_path = file_path.relative_to(root)
                    size = file_path.stat().st_size

                    info = {
                        'path': str(file_path),
                        'relative_path': str(rel_path),
                        'size': size,
                        'extension': file_path.suffix.lower(),
                        'directory': str(rel_root) if str(rel_root) != '.' else '/',
                    }

                    found_files.append(info)
                    by_directory[str(rel_root) if str(rel_root) != '.' else '/'].append(info)
                    by_extension[file_path.suffix.lower()] += 1

                except Exception as e:
                    errors.append(f"Error processing {file_path}: {e}")

    # Print summary
    print(f"\n📊 SCAN SUMMARY")
    print("=" * 70)
    print(f"   Total files scanned:     {total_scanned:,}")
    print(f"   Python files found:      {len(found_files):,}")
    print(f"   Unique directories:      {len(by_directory)}")
    print(f"   Errors:                  {len(errors)}")
    print()

    print(f"📁 Files by extension:")
    for ext, count in sorted(by_extension.items(), key=lambda x: -x[1]):
        print(f"   {ext:8} {count:5,} files")
    print()

    # Show top directories with most Python files
    print(f"📂 Top directories (by file count):")
    top_dirs = sorted(by_directory.items(), key=lambda x: -len(x[1]))[:20]
    for dir_path, files in top_dirs:
        print(f"   {len(files):4} files  {dir_path}")
    print()

    # Show some example files
    print(f"📄 Sample files found (first 20):")
    for info in found_files[:20]:
        size_str = f"{info['size']:,} bytes" if info['size'] < 1024*1024 else f"{info['size']/(1024*1024):.1f} MB"
        print(f"   {info['relative_path']:60} ({size_str})")

    if len(found_files) > 20:
        print(f"   ... and {len(found_files) - 20} more files")
    print()

    # Save to JSON if output file specified
    if output_file:
        output_path = Path(output_file)
        output_data = {
            'scan_date': datetime.now().isoformat(),
            'root_directory': str(root),
            'summary': {
                'total_scanned': total_scanned,
                'python_files_found': len(found_files),
                'unique_directories': len(by_directory),
                'errors': len(errors),
            },
            'by_extension': dict(by_extension),
            'files': found_files,
            'errors': errors,
        }

        with open(output_path, 'w') as f:
            json.dump(output_data, f, indent=2)

        print(f"💾 Results saved to: {output_path}")

    return found_files, by_directory, by_extension

if __name__ == "__main__":
    import sys

    home_dir = Path.home()
    output_file = home_dir / "scattered_python_files_scan.json"

    if len(sys.argv) > 1:
        output_file = Path(sys.argv[1])

    print("🔍 SCATTERED PYTHON FILES SCANNER")
    print("=" * 70)
    print(f"Scanning: {home_dir}")
    print(f"Output:   {output_file}")
    print()

    found_files, by_directory, by_extension = scan_directory(home_dir, output_file)

    print("=" * 70)
    print("✅ Scan complete!")
    print(f"\n💡 Next steps:")
    print(f"   1. Review {output_file} for detailed results")
    print(f"   2. Check top directories for files to organize")
    print(f"   3. Consider moving files to ~/pythons/")

