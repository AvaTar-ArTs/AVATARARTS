#!/usr/bin/env python3
"""
Export indexes to multiple formats
"""
from pathlib import Path
import csv
import json
from datetime import datetime

base_dir = Path.home() / "AVATARARTS/00_ACTIVE/BUSINESS/business-activation"
export_dir = base_dir / "exports"
export_dir.mkdir(exist_ok=True)

print("=" * 70)
print("EXPORT INDEXES")
print("=" * 70)
print(f"Export directory: {export_dir}\n")

# Export AVATARARTS index
avatararts_csv = base_dir / "avatararts_complete_index.csv"
if avatararts_csv.exists():
    print("📊 Exporting AVATARARTS index...")
    
    with open(avatararts_csv, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
    
    # Export as JSON
    json_file = export_dir / "avatararts_index.json"
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(rows, f, indent=2, ensure_ascii=False)
    print(f"   ✅ JSON: {json_file}")
    
    # Export summary
    summary_file = export_dir / "avatararts_index_summary.txt"
    with open(summary_file, 'w', encoding='utf-8') as f:
        f.write("AVATARARTS INDEX SUMMARY\n")
        f.write("=" * 70 + "\n\n")
        f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
        f.write(f"Total Files: {len(rows):,}\n\n")
        
        # Stats by directory
        from collections import defaultdict
        dirs = defaultdict(int)
        types = defaultdict(int)
        total_size = 0
        
        for row in rows:
            dirs[row.get('parent_dir', 'unknown')] += 1
            types[row.get('extension', 'unknown')] += 1
            total_size += float(row.get('size_gb', 0))
        
        f.write(f"Total Size: {total_size:.2f} GB\n\n")
        f.write("Top Directories:\n")
        for dir_name, count in sorted(dirs.items(), key=lambda x: x[1], reverse=True)[:20]:
            f.write(f"  {dir_name:40s} {count:6,} files\n")
        
        f.write("\nTop File Types:\n")
        for ext, count in sorted(types.items(), key=lambda x: x[1], reverse=True)[:20]:
            f.write(f"  {ext:20s} {count:6,} files\n")
    
    print(f"   ✅ Summary: {summary_file}")
    
    # Copy CSV to exports
    csv_export = export_dir / "avatararts_complete_index.csv"
    import shutil
    shutil.copy2(avatararts_csv, csv_export)
    print(f"   ✅ CSV: {csv_export}")
else:
    print("⚠️  AVATARARTS index not found")

print()

# Export AI-sites analysis
ai_sites_csv = base_dir / "ai-sites_analysis.csv"
if ai_sites_csv.exists():
    print("📊 Exporting AI-sites analysis...")
    
    with open(ai_sites_csv, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
    
    # Export as JSON
    json_file = export_dir / "ai-sites_analysis.json"
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(rows, f, indent=2, ensure_ascii=False)
    print(f"   ✅ JSON: {json_file}")
    
    # Export summary
    summary_file = export_dir / "ai-sites_summary.txt"
    with open(summary_file, 'w', encoding='utf-8') as f:
        f.write("AI-SITES ANALYSIS SUMMARY\n")
        f.write("=" * 70 + "\n\n")
        f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
        f.write(f"Total Files: {len(rows):,}\n\n")
        
        from collections import defaultdict
        dirs = defaultdict(int)
        types = defaultdict(int)
        total_size = 0
        
        for row in rows:
            dirs[row.get('parent_dir', 'unknown')] += 1
            types[row.get('extension', 'unknown')] += 1
            total_size += float(row.get('size_gb', 0))
        
        f.write(f"Total Size: {total_size:.2f} GB\n\n")
        f.write("Top Directories:\n")
        for dir_name, count in sorted(dirs.items(), key=lambda x: x[1], reverse=True)[:20]:
            f.write(f"  {dir_name:40s} {count:6,} files\n")
        
        f.write("\nTop File Types:\n")
        for ext, count in sorted(types.items(), key=lambda x: x[1], reverse=True)[:20]:
            f.write(f"  {ext:20s} {count:6,} files\n")
    
    print(f"   ✅ Summary: {summary_file}")
    
    # Copy CSV to exports
    csv_export = export_dir / "ai-sites_analysis.csv"
    import shutil
    shutil.copy2(ai_sites_csv, csv_export)
    print(f"   ✅ CSV: {csv_export}")
else:
    print("⚠️  AI-sites analysis not found")

# Create export manifest
manifest_file = export_dir / "EXPORT_MANIFEST.txt"
with open(manifest_file, 'w', encoding='utf-8') as f:
    f.write("EXPORT MANIFEST\n")
    f.write("=" * 70 + "\n\n")
    f.write(f"Export Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
    f.write("Exported Files:\n\n")
    
    for file_path in sorted(export_dir.glob("*")):
        if file_path.is_file() and file_path.name != "EXPORT_MANIFEST.txt":
            size = file_path.stat().st_size
            f.write(f"  {file_path.name:50s} {size / 1024:.1f} KB\n")

print(f"\n✅ Export manifest: {manifest_file}")

print("\n" + "=" * 70)
print("EXPORT COMPLETE")
print("=" * 70)
print(f"\n📂 All exports saved to: {export_dir}")
