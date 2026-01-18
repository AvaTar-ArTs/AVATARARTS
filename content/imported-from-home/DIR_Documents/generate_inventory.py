#!/usr/bin/env python3
"""
Generate comprehensive CSV inventory of Documents directory.
Follows AVATARARTS inventory pattern.
"""
import csv
import os
from datetime import datetime
from pathlib import Path

def get_file_info(file_path):
    """Extract file information for inventory."""
    try:
        stat = file_path.stat()
        return {
            'path': str(file_path),
            'name': file_path.name,
            'extension': file_path.suffix.lower(),
            'size_bytes': stat.st_size,
            'size_mb': round(stat.st_size / (1024 * 1024), 2),
            'modified': datetime.fromtimestamp(stat.st_mtime).strftime('%Y-%m-%d %H:%M:%S'),
            'directory': str(file_path.parent),
            'is_hidden': file_path.name.startswith('.'),
        }
    except (PermissionError, OSError) as e:
        return None

def generate_inventory(root_dir, output_file):
    """Generate comprehensive file inventory."""
    root_path = Path(root_dir)
    files_data = []

    print(f"Scanning {root_dir}...")

    # Walk directory tree
    for file_path in root_path.rglob('*'):
        if file_path.is_file():
            info = get_file_info(file_path)
            if info:
                files_data.append(info)

    # Sort by size (largest first)
    files_data.sort(key=lambda x: x['size_bytes'], reverse=True)

    # Write CSV
    print(f"Writing {len(files_data)} files to {output_file}...")

    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        fieldnames = ['path', 'name', 'extension', 'size_bytes', 'size_mb',
                      'modified', 'directory', 'is_hidden']
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(files_data)

    # Print summary
    total_size = sum(f['size_bytes'] for f in files_data)
    print(f"\nInventory complete!")
    print(f"Total files: {len(files_data):,}")
    print(f"Total size: {total_size / (1024**3):.2f} GB")
    print(f"Output: {output_file}")

    # Print top 10 largest files
    print("\nTop 10 largest files:")
    for i, f in enumerate(files_data[:10], 1):
        print(f"{i}. {f['name']} - {f['size_mb']:.2f} MB")

if __name__ == '__main__':
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    root_dir = '/Users/steven/Documents'
    output_file = f'/Users/steven/Documents/DOCUMENTS_INVENTORY_{timestamp}.csv'

    generate_inventory(root_dir, output_file)
