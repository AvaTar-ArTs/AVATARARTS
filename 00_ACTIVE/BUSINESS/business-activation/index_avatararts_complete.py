#!/usr/bin/env python3
"""
Complete unlimited depth index of ~/AVATARARTS
"""
from pathlib import Path
from datetime import datetime
from collections import defaultdict
import csv
import sys

avatararts = Path.home() / "AVATARARTS"
output_csv = avatararts / "00_ACTIVE" / "BUSINESS" / "business-activation" / "avatararts_complete_index.csv"
summary_file = avatararts / "00_ACTIVE" / "BUSINESS" / "business-activation" / "avatararts_index_summary.md"

print("=" * 70)
print("AVATARARTS COMPLETE INDEX")
print("=" * 70)
print(f"Scanning: {avatararts}")
print(f"Unlimited depth scan...\n")

if not avatararts.exists():
    print(f"❌ Directory not found: {avatararts}")
    sys.exit(1)

# Data structures
files_data = []
file_types = defaultdict(int)
size_by_type = defaultdict(int)
size_by_dir = defaultdict(int)
size_by_depth = defaultdict(int)
dir_structure = defaultdict(lambda: {'files': 0, 'size': 0, 'subdirs': set()})
total_size = 0
total_files = 0
total_dirs = 0
errors = 0

print("🔍 Scanning files (this may take a while)...")

for file_path in avatararts.rglob('*'):
    if file_path.is_file():
        try:
            stat = file_path.stat()
            size = stat.st_size
            mtime = datetime.fromtimestamp(stat.st_mtime)
            
            rel_path = file_path.relative_to(avatararts)
            depth = len(rel_path.parts) - 1
            ext = file_path.suffix.lower() or '(no extension)'
            
            # Get parent directory structure
            if len(rel_path.parts) > 1:
                parent_dir = rel_path.parts[0]
                if len(rel_path.parts) > 2:
                    subdir = rel_path.parts[1]
                else:
                    subdir = ''
            else:
                parent_dir = 'root'
                subdir = ''
            
            # Full directory path
            dir_path = str(rel_path.parent) if rel_path.parent != Path('.') else 'root'
            
            files_data.append({
                'path': str(rel_path),
                'name': file_path.name,
                'directory': dir_path,
                'parent_dir': parent_dir,
                'subdir': subdir,
                'size_bytes': size,
                'size_mb': size / (1024**2),
                'size_gb': size / (1024**3),
                'extension': ext,
                'depth': depth,
                'modified': mtime.strftime('%Y-%m-%d %H:%M:%S'),
                'year': mtime.year,
                'month': mtime.month
            })
            
            # Statistics
            file_types[ext] += 1
            size_by_type[ext] += size
            size_by_dir[parent_dir] += size
            size_by_depth[depth] += size
            dir_structure[parent_dir]['files'] += 1
            dir_structure[parent_dir]['size'] += size
            if subdir:
                dir_structure[parent_dir]['subdirs'].add(subdir)
            
            total_size += size
            total_files += 1
            
            if total_files % 10000 == 0:
                print(f"   Processed {total_files:,} files...")
                
        except (PermissionError, OSError) as e:
            errors += 1
        except Exception as e:
            errors += 1
    elif file_path.is_dir():
        total_dirs += 1

print(f"\n✅ Scan complete!")
print(f"   Files: {total_files:,}")
print(f"   Directories: {total_dirs:,}")
print(f"   Total size: {total_size / (1024**3):.2f} GB")
print(f"   Errors: {errors:,}")

# Write CSV
print(f"\n📄 Writing CSV index...")
with open(output_csv, 'w', newline='', encoding='utf-8') as f:
    if files_data:
        fieldnames = ['path', 'name', 'directory', 'parent_dir', 'subdir', 'size_bytes', 
                     'size_mb', 'size_gb', 'extension', 'depth', 'modified', 'year', 'month']
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in files_data:
            writer.writerow({
                'path': row['path'],
                'name': row['name'],
                'directory': row['directory'],
                'parent_dir': row['parent_dir'],
                'subdir': row['subdir'],
                'size_bytes': row['size_bytes'],
                'size_mb': f"{row['size_mb']:.2f}",
                'size_gb': f"{row['size_gb']:.4f}",
                'extension': row['extension'],
                'depth': row['depth'],
                'modified': row['modified'],
                'year': row['year'],
                'month': row['month']
            })

print(f"   ✅ CSV saved: {output_csv}")

# Generate summary
print(f"\n📊 Generating summary report...")
with open(summary_file, 'w', encoding='utf-8') as f:
    f.write("# AVATARARTS COMPLETE INDEX SUMMARY\n")
    f.write("=" * 70 + "\n\n")
    f.write(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
    
    f.write("## 📊 OVERALL STATISTICS\n\n")
    f.write(f"- **Total Files:** {total_files:,}\n")
    f.write(f"- **Total Directories:** {total_dirs:,}\n")
    f.write(f"- **Total Size:** {total_size / (1024**3):.2f} GB ({total_size / (1024**2):,.0f} MB)\n")
    f.write(f"- **Errors:** {errors:,}\n\n")
    
    f.write("## 📁 DIRECTORY STRUCTURE\n\n")
    f.write(f"**Top-level directories:** {len(dir_structure)}\n\n")
    f.write("### By Size (Top 20):\n\n")
    for dir_name, info in sorted(dir_structure.items(), key=lambda x: x[1]['size'], reverse=True)[:20]:
        dir_size = info['size'] / (1024**3)
        f.write(f"**{dir_name}**\n")
        f.write(f"- Files: {info['files']:,}\n")
        f.write(f"- Size: {dir_size:.2f} GB\n")
        f.write(f"- Subdirectories: {len(info['subdirs'])}\n\n")
    
    f.write("## 📄 FILE TYPES\n\n")
    f.write("### By Count (Top 20):\n\n")
    sorted_by_count = sorted(file_types.items(), key=lambda x: x[1], reverse=True)[:20]
    for ext, count in sorted_by_count:
        f.write(f"- `{ext}`: {count:,} files\n")
    
    f.write("\n### By Size (Top 20):\n\n")
    sorted_by_size = sorted(size_by_type.items(), key=lambda x: x[1], reverse=True)[:20]
    for ext, size in sorted_by_size:
        size_gb = size / (1024**3)
        count = file_types[ext]
        f.write(f"- `{ext}`: {size_gb:.2f} GB ({count:,} files)\n")
    
    f.write("\n## 📊 DEPTH ANALYSIS\n\n")
    f.write("Files by directory depth:\n\n")
    for depth in sorted(size_by_depth.keys())[:15]:
        size_gb = size_by_depth[depth] / (1024**3)
        file_count = sum(1 for f in files_data if f['depth'] == depth)
        f.write(f"- Depth {depth}: {file_count:,} files, {size_gb:.2f} GB\n")
    
    f.write("\n## 📅 TEMPORAL ANALYSIS\n\n")
    f.write("Files by year:\n\n")
    years = defaultdict(int)
    for row in files_data:
        years[row['year']] += 1
    for year in sorted(years.keys(), reverse=True)[:10]:
        f.write(f"- {year}: {years[year]:,} files\n")
    
    f.write("\n## 📄 INDEX FILES\n\n")
    f.write(f"- **CSV Index:** `{output_csv.relative_to(avatararts)}`\n")
    f.write(f"- **Summary:** `{summary_file.relative_to(avatararts)}`\n")
    f.write(f"- **Total Rows:** {len(files_data):,}\n")

print(f"   ✅ Summary saved: {summary_file}")

print("\n" + "=" * 70)
print("INDEXING COMPLETE")
print("=" * 70)
print(f"\n📄 CSV Index: {output_csv}")
print(f"📊 Summary: {summary_file}")
print(f"\n✅ AVATARARTS fully indexed!")
