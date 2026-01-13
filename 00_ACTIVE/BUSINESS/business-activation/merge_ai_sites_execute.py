#!/usr/bin/env python3
"""
Execute merge: /Users/steven/ai-sites -> /Users/steven/AVATARARTS/04_WEBSITES/ai-sites
"""
from pathlib import Path
import shutil
from datetime import datetime
from collections import defaultdict
import csv

ai_sites = Path("/Users/steven/ai-sites")
target = Path("/Users/steven/AVATARARTS/04_WEBSITES/ai-sites")

print("=" * 70)
print("AI-SITES MERGE TO AVATARARTS")
print("=" * 70)
print(f"Source: {ai_sites}")
print(f"Target: {target}\n")

# Step 1: Analyze
print("📊 Step 1: Analyzing source...")
files_data = []
dir_structure = defaultdict(lambda: {'files': 0, 'size': 0})
total_size = 0
total_files = 0

for file_path in ai_sites.rglob('*'):
    if file_path.is_file():
        try:
            rel = file_path.relative_to(ai_sites)
            # Skip .git files
            if '.git' not in str(rel) and not rel.name.startswith('.'):
                size = file_path.stat().st_size
                parent_dir = rel.parts[0] if len(rel.parts) > 1 else 'root'
                
                files_data.append({
                    'source': file_path,
                    'rel_path': rel,
                    'parent_dir': parent_dir,
                    'size': size
                })
                
                dir_structure[parent_dir]['files'] += 1
                dir_structure[parent_dir]['size'] += size
                total_size += size
                total_files += 1
        except:
            pass

print(f"   Found {total_files:,} files ({total_size / (1024**3):.2f} GB)")

# Step 2: Check conflicts
print("\n🔍 Step 2: Checking for conflicts...")
conflicts = []
if target.exists():
    existing = {f.relative_to(target) for f in target.rglob('*') if f.is_file()}
    source = {row['rel_path'] for row in files_data}
    conflicts = list(existing & source)
    print(f"   Found {len(conflicts)} existing files")
    if conflicts:
        print(f"   ⚠️  Will skip existing files (use --overwrite to replace)")
else:
    print(f"   ✅ Target doesn't exist - will create")

# Step 3: Copy files
print(f"\n🔄 Step 3: Copying files...")
target.mkdir(parents=True, exist_ok=True)

copied = 0
skipped = 0
errors = 0

for row in files_data:
    source_file = row['source']
    dest_file = target / row['rel_path']
    
    # Skip if exists (unless overwrite)
    if dest_file.exists() and row['rel_path'] in conflicts:
        skipped += 1
        continue
    
    try:
        dest_file.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source_file, dest_file)
        copied += 1
        if copied % 500 == 0:
            print(f"   Progress: {copied:,} / {total_files:,} files...")
    except Exception as e:
        errors += 1
        if errors < 10:
            print(f"   ⚠️  Error: {row['rel_path']} - {e}")

print(f"\n✅ Merge complete!")
print(f"   Copied: {copied:,} files")
print(f"   Skipped: {skipped:,} files (already exist)")
print(f"   Errors: {errors:,} files")
print(f"   Target: {target}")

# Save summary
summary_file = Path(__file__).parent / "ai-sites_merge_summary.md"
with open(summary_file, 'w') as f:
    f.write("# AI-SITES MERGE SUMMARY\n\n")
    f.write(f"**Date:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
    f.write(f"- **Files Copied:** {copied:,}\n")
    f.write(f"- **Files Skipped:** {skipped:,}\n")
    f.write(f"- **Errors:** {errors:,}\n")
    f.write(f"- **Target:** {target}\n")

print(f"\n📄 Summary saved to: {summary_file}")
