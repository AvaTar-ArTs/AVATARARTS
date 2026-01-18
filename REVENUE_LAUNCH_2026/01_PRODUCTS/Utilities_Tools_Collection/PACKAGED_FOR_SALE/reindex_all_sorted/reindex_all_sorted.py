#!/usr/bin/env python3
"""
Sort and reindex all of ~/AVATARARTS with better organization
"""
from pathlib import Path
from datetime import datetime
from collections import defaultdict
import csv

avatararts = Path.home() / "AVATARARTS"
output_dir = avatararts / "INDEXES"
output_dir.mkdir(parents=True, exist_ok=True)

print("=" * 70)
print("SORT AND REINDEX ALL OF AVATARARTS")
print("=" * 70)
print(f"Scanning: {avatararts}")
print(f"Output: {output_dir}\n")

if not avatararts.exists():
    print(f"❌ Directory not found: {avatararts}")
    exit(1)

print("🔍 Collecting all files (this may take a while)...")
all_files = []
file_types = defaultdict(int)
size_by_type = defaultdict(int)
size_by_dir = defaultdict(int)
total_size = 0
total_files = 0

for file_path in avatararts.rglob('*'):
    if file_path.is_file():
        try:
            stat = file_path.stat()
            size = stat.st_size
            rel_path = file_path.relative_to(avatararts)
            ext = file_path.suffix.lower() or '(no extension)'
            parent_dir = rel_path.parts[0] if len(rel_path.parts) > 1 else 'root'
            depth = len(rel_path.parts) - 1
            
            file_info = {
                'path': str(rel_path),
                'name': file_path.name,
                'directory': str(rel_path.parent) if rel_path.parent != Path('.') else 'root',
                'parent_dir': parent_dir,
                'size_bytes': size,
                'size_mb': size / (1024**2),
                'size_gb': size / (1024**3),
                'extension': ext,
                'depth': depth,
                'modified': datetime.fromtimestamp(stat.st_mtime).strftime('%Y-%m-%d %H:%M:%S')
            }
            
            all_files.append(file_info)
            file_types[ext] += 1
            size_by_type[ext] += size
            size_by_dir[parent_dir] += size
            total_size += size
            total_files += 1
            
            if total_files % 10000 == 0:
                print(f"   Processed {total_files:,} files ({total_size / (1024**3):.2f} GB)...")
        except:
            pass

print(f"\n✅ Collected {total_files:,} files")
print(f"💾 Total size: {total_size / (1024**3):.2f} GB\n")

# Create sorted indexes
print("📊 Creating sorted indexes...")

# 1. Index by name (alphabetical)
print("   Creating index_by_name.csv...")
sorted_by_name = sorted(all_files, key=lambda x: x['name'].lower())
name_index = output_dir / "index_by_name.csv"
with open(name_index, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['name', 'path', 'directory', 'parent_dir', 'size_bytes', 'size_mb', 'size_gb', 'extension', 'depth', 'modified'])
    writer.writeheader()
    for row in sorted_by_name:
        writer.writerow({
            'name': row['name'],
            'path': row['path'],
            'directory': row['directory'],
            'parent_dir': row['parent_dir'],
            'size_bytes': row['size_bytes'],
            'size_mb': f"{row['size_mb']:.2f}",
            'size_gb': f"{row['size_gb']:.4f}",
            'extension': row['extension'],
            'depth': row['depth'],
            'modified': row['modified']
        })
print(f"      ✅ {name_index.name}")

# 2. Index by size (largest first)
print("   Creating index_by_size.csv...")
sorted_by_size = sorted(all_files, key=lambda x: x['size_bytes'], reverse=True)
size_index = output_dir / "index_by_size.csv"
with open(size_index, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['name', 'path', 'directory', 'parent_dir', 'size_bytes', 'size_mb', 'size_gb', 'extension', 'depth', 'modified'])
    writer.writeheader()
    for row in sorted_by_size:
        writer.writerow({
            'name': row['name'],
            'path': row['path'],
            'directory': row['directory'],
            'parent_dir': row['parent_dir'],
            'size_bytes': row['size_bytes'],
            'size_mb': f"{row['size_mb']:.2f}",
            'size_gb': f"{row['size_gb']:.4f}",
            'extension': row['extension'],
            'depth': row['depth'],
            'modified': row['modified']
        })
print(f"      ✅ {size_index.name}")

# 3. Index by type (extension)
print("   Creating index_by_type.csv...")
sorted_by_type = sorted(all_files, key=lambda x: (x['extension'], x['name'].lower()))
type_index = output_dir / "index_by_type.csv"
with open(type_index, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['name', 'path', 'directory', 'parent_dir', 'size_bytes', 'size_mb', 'size_gb', 'extension', 'depth', 'modified'])
    writer.writeheader()
    for row in sorted_by_type:
        writer.writerow({
            'name': row['name'],
            'path': row['path'],
            'directory': row['directory'],
            'parent_dir': row['parent_dir'],
            'size_bytes': row['size_bytes'],
            'size_mb': f"{row['size_mb']:.2f}",
            'size_gb': f"{row['size_gb']:.4f}",
            'extension': row['extension'],
            'depth': row['depth'],
            'modified': row['modified']
        })
print(f"      ✅ {type_index.name}")

# 4. Index by directory
print("   Creating index_by_directory.csv...")
sorted_by_dir = sorted(all_files, key=lambda x: (x['parent_dir'], x['directory'], x['name'].lower()))
dir_index = output_dir / "index_by_directory.csv"
with open(dir_index, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['name', 'path', 'directory', 'parent_dir', 'size_bytes', 'size_mb', 'size_gb', 'extension', 'depth', 'modified'])
    writer.writeheader()
    for row in sorted_by_dir:
        writer.writerow({
            'name': row['name'],
            'path': row['path'],
            'directory': row['directory'],
            'parent_dir': row['parent_dir'],
            'size_bytes': row['size_bytes'],
            'size_mb': f"{row['size_mb']:.2f}",
            'size_gb': f"{row['size_gb']:.4f}",
            'extension': row['extension'],
            'depth': row['depth'],
            'modified': row['modified']
        })
print(f"      ✅ {dir_index.name}")

# 5. Index by date (newest first)
print("   Creating index_by_date.csv...")
sorted_by_date = sorted(all_files, key=lambda x: x['modified'], reverse=True)
date_index = output_dir / "index_by_date.csv"
with open(date_index, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['name', 'path', 'directory', 'parent_dir', 'size_bytes', 'size_mb', 'size_gb', 'extension', 'depth', 'modified'])
    writer.writeheader()
    for row in sorted_by_date:
        writer.writerow({
            'name': row['name'],
            'path': row['path'],
            'directory': row['directory'],
            'parent_dir': row['parent_dir'],
            'size_bytes': row['size_bytes'],
            'size_mb': f"{row['size_mb']:.2f}",
            'size_gb': f"{row['size_gb']:.4f}",
            'extension': row['extension'],
            'depth': row['depth'],
            'modified': row['modified']
        })
print(f"      ✅ {date_index.name}")

# Create summary
summary_file = output_dir / "INDEX_SUMMARY.md"
with open(summary_file, 'w', encoding='utf-8') as f:
    f.write("# AVATARARTS SORTED INDEX SUMMARY\n")
    f.write("=" * 70 + "\n\n")
    f.write(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
    
    f.write("## 📊 OVERALL STATISTICS\n\n")
    f.write(f"- **Total Files:** {total_files:,}\n")
    f.write(f"- **Total Size:** {total_size / (1024**3):.2f} GB\n")
    f.write(f"- **File Types:** {len(file_types)}\n")
    f.write(f"- **Top-level Directories:** {len(size_by_dir)}\n\n")
    
    f.write("## 📁 INDEXES CREATED\n\n")
    f.write("1. **index_by_name.csv** - Alphabetical by filename\n")
    f.write("2. **index_by_size.csv** - Largest files first\n")
    f.write("3. **index_by_type.csv** - Grouped by file extension\n")
    f.write("4. **index_by_directory.csv** - Organized by directory structure\n")
    f.write("5. **index_by_date.csv** - Newest files first\n\n")
    
    f.write("## 📄 TOP FILE TYPES\n\n")
    for ext, size in sorted(size_by_type.items(), key=lambda x: x[1], reverse=True)[:20]:
        count = file_types[ext]
        f.write(f"- `{ext}`: {count:,} files, {size / (1024**3):.2f} GB\n")
    
    f.write("\n## 📁 TOP DIRECTORIES\n\n")
    for dir_name, size in sorted(size_by_dir.items(), key=lambda x: x[1], reverse=True)[:20]:
        f.write(f"- `{dir_name}`: {size / (1024**3):.2f} GB\n")

print(f"\n✅ Summary: {summary_file.name}")

print("\n" + "=" * 70)
print("SORT AND REINDEX COMPLETE")
print("=" * 70)
print(f"\n📂 All indexes saved to: {output_dir}")
print(f"   - index_by_name.csv")
print(f"   - index_by_size.csv")
print(f"   - index_by_type.csv")
print(f"   - index_by_directory.csv")
print(f"   - index_by_date.csv")
print(f"   - INDEX_SUMMARY.md")
