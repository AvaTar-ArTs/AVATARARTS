#!/usr/bin/env python3
"""
Compare /Users/steven/Music/nocTurneMeLoDieS with archives and AVATARARTS
"""
from pathlib import Path
from datetime import datetime
from collections import defaultdict
import csv

music_dir = Path("/Users/steven/Music/nocTurneMeLoDieS")
output_dir = Path.home() / "AVATARARTS/00_ACTIVE/BUSINESS/business-activation"
comparison_file = output_dir / "music_directory_comparison.md"

print("=" * 70)
print("MUSIC DIRECTORY COMPARISON")
print("=" * 70)
print(f"Analyzing: {music_dir}\n")

if not music_dir.exists():
    print(f"❌ Directory not found: {music_dir}")
    exit(1)

# Analyze music directory
print("🔍 Analyzing music directory...")
files_data = []
file_types = defaultdict(int)
size_by_type = defaultdict(int)
total_size = 0
total_files = 0

for file_path in music_dir.rglob('*'):
    if file_path.is_file():
        try:
            size = file_path.stat().st_size
            mtime = datetime.fromtimestamp(file_path.stat().st_mtime)
            rel_path = file_path.relative_to(music_dir)
            ext = file_path.suffix.lower() or '(no extension)'
            
            files_data.append({
                'path': str(rel_path),
                'name': file_path.name,
                'size_bytes': size,
                'size_mb': size / (1024**2),
                'size_gb': size / (1024**3),
                'extension': ext,
                'modified': mtime.strftime('%Y-%m-%d %H:%M:%S')
            })
            
            file_types[ext] += 1
            size_by_type[ext] += size
            total_size += size
            total_files += 1
        except:
            pass

print(f"✅ Found {total_files:,} files")
print(f"💾 Total size: {total_size / (1024**3):.2f} GB\n")

# Check for archives mentioned earlier
print("🔍 Checking for related archives...")
archive_files = [
    Path("/Users/steven/Music/nocturnemelodies"),
    Path("/Users/steven/nocTurneMeLoDieS_BEFORE_CLEANUP_20251226_102542.tar.gz"),
    Path("/Users/steven/NocTurnE-meLoDieS-20251225T050332Z-3-002.zip"),
]

found_archives = []
for archive in archive_files:
    if archive.exists():
        if archive.is_dir():
            size = sum(f.stat().st_size for f in archive.rglob('*') if f.is_file())
            found_archives.append({
                'path': str(archive),
                'type': 'directory',
                'size_gb': size / (1024**3),
                'files': sum(1 for f in archive.rglob('*') if f.is_file())
            })
        else:
            size = archive.stat().st_size
            found_archives.append({
                'path': str(archive),
                'type': 'archive',
                'size_gb': size / (1024**3),
                'files': 'unknown'
            })

# Generate comparison report
print("📄 Generating comparison report...")
output_dir.mkdir(parents=True, exist_ok=True)

with open(comparison_file, 'w', encoding='utf-8') as f:
    f.write("# MUSIC DIRECTORY COMPARISON\n")
    f.write("=" * 70 + "\n\n")
    f.write(f"**Date:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
    
    f.write("## 📁 ANALYZED DIRECTORY\n\n")
    f.write(f"**Path:** `{music_dir}`\n\n")
    f.write(f"- **Total Files:** {total_files:,}\n")
    f.write(f"- **Total Size:** {total_size / (1024**3):.2f} GB\n")
    f.write(f"- **File Types:** {len(file_types)}\n\n")
    
    f.write("## 📊 FILE TYPES\n\n")
    f.write("### By Count:\n\n")
    for ext, count in sorted(file_types.items(), key=lambda x: x[1], reverse=True)[:15]:
        f.write(f"- `{ext}`: {count:,} files\n")
    
    f.write("\n### By Size:\n\n")
    for ext, size in sorted(size_by_type.items(), key=lambda x: x[1], reverse=True)[:15]:
        size_gb = size / (1024**3)
        f.write(f"- `{ext}`: {size_gb:.2f} GB ({file_types[ext]:,} files)\n")
    
    f.write("\n## 📦 RELATED ARCHIVES\n\n")
    if found_archives:
        for archive in found_archives:
            f.write(f"### {Path(archive['path']).name}\n")
            f.write(f"- **Path:** `{archive['path']}`\n")
            f.write(f"- **Type:** {archive['type']}\n")
            f.write(f"- **Size:** {archive['size_gb']:.2f} GB\n")
            if archive['files'] != 'unknown':
                f.write(f"- **Files:** {archive['files']:,}\n")
            f.write("\n")
    else:
        f.write("No related archives found in expected locations.\n\n")
    
    f.write("## 📋 SAMPLE FILES\n\n")
    f.write("First 20 files:\n\n")
    for i, file_info in enumerate(files_data[:20]):
        f.write(f"{i+1}. `{file_info['path']}` ({file_info['size_mb']:.2f} MB)\n")
    
    f.write("\n## 🔄 COMPARISON NOTES\n\n")
    f.write("- Current directory: `/Users/steven/Music/nocTurneMeLoDieS`\n")
    f.write("- Compare with archives to find duplicates\n")
    f.write("- Check AVATARARTS for music files\n")
    f.write("- Verify file integrity\n\n")

# Save CSV
csv_file = output_dir / "music_directory_analysis.csv"
with open(csv_file, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['path', 'name', 'size_bytes', 'size_mb', 'size_gb', 'extension', 'modified'])
    writer.writeheader()
    for row in files_data:
        writer.writerow({
            'path': row['path'],
            'name': row['name'],
            'size_bytes': row['size_bytes'],
            'size_mb': f"{row['size_mb']:.2f}",
            'size_gb': f"{row['size_gb']:.4f}",
            'extension': row['extension'],
            'modified': row['modified']
        })

print(f"✅ Comparison report: {comparison_file}")
print(f"✅ Analysis CSV: {csv_file}")

print("\n" + "=" * 70)
print("COMPARISON COMPLETE")
print("=" * 70)
