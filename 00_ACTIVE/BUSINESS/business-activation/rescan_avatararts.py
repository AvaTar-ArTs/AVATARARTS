#!/usr/bin/env python3
"""
Direct rescan of AVATARARTS - unlimited depth
"""
from pathlib import Path
from collections import defaultdict
import csv
import sys

avatararts = Path.home() / "AVATARARTS"
output_csv = avatararts / "00_ACTIVE" / "BUSINESS" / "business-activation" / "avatararts_complete_index.csv"

print("=" * 70)
print("AVATARARTS RESCAN - UNLIMITED DEPTH")
print("=" * 70)
print(f"Scanning: {avatararts}")
print(f"Output: {output_csv}\n")

if not avatararts.exists():
    print(f"❌ Not found: {avatararts}")
    sys.exit(1)

files_data = []
file_types = defaultdict(int)
size_by_dir = defaultdict(int)
total_size = 0
total_files = 0

print("🔍 Scanning...")

try:
    for file_path in avatararts.rglob('*'):
        if file_path.is_file():
            try:
                size = file_path.stat().st_size
                rel = file_path.relative_to(avatararts)
                ext = file_path.suffix.lower() or '(no extension)'
                parent = rel.parts[0] if len(rel.parts) > 1 else 'root'
                depth = len(rel.parts) - 1
                
                files_data.append({
                    'path': str(rel),
                    'name': file_path.name,
                    'directory': str(rel.parent) if rel.parent != Path('.') else 'root',
                    'parent_dir': parent,
                    'size_bytes': size,
                    'size_mb': size / (1024**2),
                    'size_gb': size / (1024**3),
                    'extension': ext,
                    'depth': depth
                })
                
                file_types[ext] += 1
                size_by_dir[parent] += size
                total_size += size
                total_files += 1
                
                if total_files % 10000 == 0:
                    print(f"   {total_files:,} files ({total_size / (1024**3):.2f} GB)...")
            except:
                pass
except KeyboardInterrupt:
    print(f"\n⚠️  Interrupted at {total_files:,} files")

print(f"\n✅ Scanned {total_files:,} files")
print(f"💾 Total: {total_size / (1024**3):.2f} GB\n")

# Write CSV
print("📄 Writing CSV...")
output_csv.parent.mkdir(parents=True, exist_ok=True)
with open(output_csv, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['path', 'name', 'directory', 'parent_dir', 'size_bytes', 'size_mb', 'size_gb', 'extension', 'depth'])
    writer.writeheader()
    for row in files_data:
        writer.writerow({
            'path': row['path'],
            'name': row['name'],
            'directory': row['directory'],
            'parent_dir': row['parent_dir'],
            'size_bytes': row['size_bytes'],
            'size_mb': f"{row['size_mb']:.2f}",
            'size_gb': f"{row['size_gb']:.4f}",
            'extension': row['extension'],
            'depth': row['depth']
        })

print(f"✅ Saved: {output_csv}")
print(f"   Rows: {len(files_data):,}")

# Quick stats
print(f"\n📊 Top directories:")
for dir_name, size in sorted(size_by_dir.items(), key=lambda x: x[1], reverse=True)[:10]:
    print(f"   {dir_name:40s} {size / (1024**3):7.2f} GB")

print(f"\n📄 Top file types:")
for ext, count in sorted(file_types.items(), key=lambda x: x[1], reverse=True)[:10]:
    print(f"   {ext:20s} {count:6,} files")

print("\n" + "=" * 70)
print("RESCAN COMPLETE")
print("=" * 70)
