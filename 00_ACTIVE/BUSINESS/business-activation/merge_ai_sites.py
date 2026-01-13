#!/usr/bin/env python3
"""
Merge /Users/steven/ai-sites into /Users/steven/AVATARARTS
"""
from pathlib import Path
import shutil
from datetime import datetime
from collections import defaultdict
import csv

ai_sites = Path("/Users/steven/ai-sites")
avatararts = Path("/Users/steven/AVATARARTS")
target = avatararts / "04_WEBSITES" / "ai-sites"

print("=" * 70)
print("AI-SITES TO AVATARARTS MERGE")
print("=" * 70)

# Step 1: Analyze source
print("\n📊 Step 1: Analyzing ai-sites...")
files_data = []
dir_structure = defaultdict(lambda: {'files': 0, 'size': 0})
total_size = 0
total_files = 0

for file_path in ai_sites.rglob('*'):
    if file_path.is_file():
        try:
            stat = file_path.stat()
            size = stat.st_size
            rel_path = file_path.relative_to(ai_sites)
            parent_dir = rel_path.parts[0] if len(rel_path.parts) > 1 else 'root'
            
            files_data.append({
                'source': str(file_path),
                'rel_path': str(rel_path),
                'parent_dir': parent_dir,
                'size': size
            })
            
            dir_structure[parent_dir]['files'] += 1
            dir_structure[parent_dir]['size'] += size
            total_size += size
            total_files += 1
        except Exception:
            pass

print(f"   Found {total_files:,} files ({total_size / (1024**3):.2f} GB)")
print(f"   Top-level directories: {len(dir_structure)}")

# Step 2: Check for conflicts
print("\n🔍 Step 2: Checking for conflicts...")
conflicts = []
if target.exists():
    existing_files = {f.relative_to(target) for f in target.rglob('*') if f.is_file()}
    source_files = {Path(f['rel_path']) for f in files_data}
    conflicts = list(existing_files & source_files)
    
    if conflicts:
        print(f"   ⚠️  Found {len(conflicts)} potential conflicts")
        for conflict in list(conflicts)[:10]:
            print(f"      - {conflict}")
        if len(conflicts) > 10:
            print(f"      ... and {len(conflicts) - 10} more")
    else:
        print(f"   ✅ No conflicts detected")
else:
    print(f"   ✅ Target directory doesn't exist - will create")

# Step 3: Create merge plan
print("\n📋 Step 3: Creating merge plan...")
plan_file = avatararts / "00_ACTIVE" / "BUSINESS" / "business-activation" / "ai-sites_merge_plan.md"

with open(plan_file, 'w') as f:
    f.write("# AI-SITES MERGE PLAN\n")
    f.write("=" * 70 + "\n\n")
    f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
    f.write(f"## Analysis\n\n")
    f.write(f"- **Total Files:** {total_files:,}\n")
    f.write(f"- **Total Size:** {total_size / (1024**3):.2f} GB\n")
    f.write(f"- **Top-level Directories:** {len(dir_structure)}\n")
    f.write(f"- **Conflicts:** {len(conflicts)}\n\n")
    
    f.write("## Directory Structure\n\n")
    for dir_name, info in sorted(dir_structure.items(), key=lambda x: x[1]['size'], reverse=True):
        f.write(f"### {dir_name}\n")
        f.write(f"- Files: {info['files']:,}\n")
        f.write(f"- Size: {info['size'] / (1024**3):.2f} GB\n\n")
    
    f.write("## Merge Strategy\n\n")
    f.write("**Target:** `~/AVATARARTS/04_WEBSITES/ai-sites/`\n\n")
    f.write("### Options:\n\n")
    f.write("1. **Direct Copy** - Copy everything as-is\n")
    f.write("2. **Smart Merge** - Handle conflicts, rename duplicates\n")
    f.write("3. **Selective Merge** - Choose which directories to merge\n\n")

print(f"   ✅ Merge plan saved to: {plan_file}")

# Step 4: Show summary
print("\n📊 Summary:")
print(f"   Source: {ai_sites}")
print(f"   Target: {target}")
print(f"   Files to merge: {total_files:,}")
print(f"   Total size: {total_size / (1024**3):.2f} GB")
print(f"   Conflicts: {len(conflicts)}")

print("\n" + "=" * 70)
print("Ready to merge! Run merge script to proceed.")
print("=" * 70)
