#!/usr/bin/env python3
"""
Reindex files with better sorting options
"""
from pathlib import Path
from collections import defaultdict
import csv

base_dir = Path.home() / "AVATARARTS/00_ACTIVE/BUSINESS/business-activation"

print("=" * 70)
print("REINDEX WITH SORTING")
print("=" * 70)

# Collect files
files = []
for f in base_dir.iterdir():
    if f.is_file():
        try:
            stat = f.stat()
            files.append({
                'name': f.name,
                'size': stat.st_size,
                'ext': f.suffix.lower() or 'no-ext',
                'path': str(f.relative_to(base_dir))
            })
        except:
            pass

print(f"Found {len(files)} files\n")

# Create sorted indexes
outputs = {
    'by_name': sorted(files, key=lambda x: x['name'].lower()),
    'by_size': sorted(files, key=lambda x: x['size'], reverse=True),
    'by_type': sorted(files, key=lambda x: (x['ext'], x['name']))
}

for sort_name, sorted_files in outputs.items():
    csv_file = base_dir / f"index_{sort_name}.csv"
    with open(csv_file, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=['name', 'path', 'size', 'ext'])
        writer.writeheader()
        for row in sorted_files:
            writer.writerow({
                'name': row['name'],
                'path': row['path'],
                'size': row['size'],
                'ext': row['ext']
            })
    print(f"✅ {csv_file.name}")

print("\n✅ Reindex complete")
