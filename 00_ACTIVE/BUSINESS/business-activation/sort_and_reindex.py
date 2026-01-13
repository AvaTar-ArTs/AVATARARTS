#!/usr/bin/env python3
"""
Sort and reindex files for better organization
"""
from pathlib import Path
from datetime import datetime
from collections import defaultdict
import csv
import shutil

base_dir = Path.home() / "AVATARARTS/00_ACTIVE/BUSINESS/business-activation"
output_dir = base_dir / "sorted_index"

print("=" * 70)
print("SORT AND REINDEX")
print("=" * 70)
print(f"Directory: {base_dir}\n")

if not base_dir.exists():
    print(f"❌ Directory not found: {base_dir}")
    exit(1)

# Collect all files
print("🔍 Collecting files...")
all_files = []
file_categories = defaultdict(list)

for file_path in base_dir.rglob('*'):
    if file_path.is_file():
        try:
            stat = file_path.stat()
            ext = file_path.suffix.lower() or 'no-extension'
            rel_path = file_path.relative_to(base_dir)
            
            file_info = {
                'path': str(rel_path),
                'name': file_path.name,
                'size_bytes': stat.st_size,
                'size_mb': stat.st_size / (1024**2),
                'size_gb': stat.st_size / (1024**3),
                'extension': ext,
                'modified': datetime.fromtimestamp(stat.st_mtime).strftime('%Y-%m-%d %H:%M:%S'),
                'full_path': str(file_path)
            }
            
            all_files.append(file_info)
            
            # Categorize
            if ext in ['.py']:
                file_categories['scripts'].append(file_info)
            elif ext in ['.csv']:
                file_categories['data'].append(file_info)
            elif ext in ['.md', '.txt']:
                file_categories['docs'].append(file_info)
            elif ext in ['.json']:
                file_categories['json'].append(file_info)
            else:
                file_categories['other'].append(file_info)
                
        except:
            pass

print(f"✅ Found {len(all_files)} files\n")

# Sort by different criteria
print("📊 Sorting files...")

# Sort by size
sorted_by_size = sorted(all_files, key=lambda x: x['size_bytes'], reverse=True)

# Sort by type
sorted_by_type = sorted(all_files, key=lambda x: (x['extension'], x['name']))

# Sort by date
sorted_by_date = sorted(all_files, key=lambda x: x['modified'], reverse=True)

# Sort by name
sorted_by_name = sorted(all_files, key=lambda x: x['name'].lower())

# Create sorted index
output_dir.mkdir(parents=True, exist_ok=True)

# Index by size
size_index = output_dir / "index_by_size.csv"
with open(size_index, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['path', 'name', 'size_bytes', 'size_mb', 'size_gb', 'extension', 'modified'])
    writer.writeheader()
    for row in sorted_by_size:
        writer.writerow({
            'path': row['path'],
            'name': row['name'],
            'size_bytes': row['size_bytes'],
            'size_mb': f"{row['size_mb']:.2f}",
            'size_gb': f"{row['size_gb']:.4f}",
            'extension': row['extension'],
            'modified': row['modified']
        })
print(f"   ✅ Index by size: {size_index.name}")

# Index by type
type_index = output_dir / "index_by_type.csv"
with open(type_index, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['path', 'name', 'size_bytes', 'size_mb', 'size_gb', 'extension', 'modified'])
    writer.writeheader()
    for row in sorted_by_type:
        writer.writerow({
            'path': row['path'],
            'name': row['name'],
            'size_bytes': row['size_bytes'],
            'size_mb': f"{row['size_mb']:.2f}",
            'size_gb': f"{row['size_gb']:.4f}",
            'extension': row['extension'],
            'modified': row['modified']
        })
print(f"   ✅ Index by type: {type_index.name}")

# Index by date
date_index = output_dir / "index_by_date.csv"
with open(date_index, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['path', 'name', 'size_bytes', 'size_mb', 'size_gb', 'extension', 'modified'])
    writer.writeheader()
    for row in sorted_by_date:
        writer.writerow({
            'path': row['path'],
            'name': row['name'],
            'size_bytes': row['size_bytes'],
            'size_mb': f"{row['size_mb']:.2f}",
            'size_gb': f"{row['size_gb']:.4f}",
            'extension': row['extension'],
            'modified': row['modified']
        })
print(f"   ✅ Index by date: {date_index.name}")

# Index by name
name_index = output_dir / "index_by_name.csv"
with open(name_index, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['path', 'name', 'size_bytes', 'size_mb', 'size_gb', 'extension', 'modified'])
    writer.writeheader()
    for row in sorted_by_name:
        writer.writerow({
            'path': row['path'],
            'name': row['name'],
            'size_bytes': row['size_bytes'],
            'size_mb': f"{row['size_mb']:.2f}",
            'size_gb': f"{row['size_gb']:.4f}",
            'extension': row['extension'],
            'modified': row['modified']
        })
print(f"   ✅ Index by name: {name_index.name}")

# Category summary
summary_file = output_dir / "category_summary.md"
with open(summary_file, 'w', encoding='utf-8') as f:
    f.write("# FILE CATEGORY SUMMARY\n\n")
    f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
    
    for category, files in file_categories.items():
        total_size = sum(f['size_bytes'] for f in files)
        f.write(f"## {category.upper()}\n\n")
        f.write(f"- Files: {len(files)}\n")
        f.write(f"- Total Size: {total_size / (1024**3):.2f} GB\n\n")
        
        f.write("Files:\n")
        for file_info in sorted(files, key=lambda x: x['name'])[:20]:
            f.write(f"- `{file_info['name']}` ({file_info['size_mb']:.2f} MB)\n")
        if len(files) > 20:
            f.write(f"- ... and {len(files) - 20} more\n")
        f.write("\n")

print(f"   ✅ Category summary: {summary_file.name}")

print(f"\n✅ Sorted indexes created in: {output_dir}")
print("\n" + "=" * 70)
print("SORT AND REINDEX COMPLETE")
print("=" * 70)
