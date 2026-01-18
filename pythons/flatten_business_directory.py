#!/usr/bin/env python3
"""
Flatten directory structure:
~/AVATARARTS/00_ACTIVE/BUSINESS/business-activation -> ~/AVATARARTS/BUSINESS
"""
from pathlib import Path
import shutil
from datetime import datetime

source = Path.home() / "AVATARARTS/00_ACTIVE/BUSINESS/business-activation"
target = Path.home() / "AVATARARTS/BUSINESS"

print("=" * 70)
print("FLATTEN DIRECTORY STRUCTURE")
print("=" * 70)
print(f"Source: {source}")
print(f"Target: {target}\n")

if not source.exists():
    print(f"❌ Source directory not found: {source}")
    exit(1)

# Create target directory
target.mkdir(parents=True, exist_ok=True)
print(f"✅ Target directory: {target}\n")

# Get all files to move
files_to_move = []
for item in source.iterdir():
    if item.is_file():
        files_to_move.append(item)

print(f"📊 Found {len(files_to_move)} files to move\n")

# Check for conflicts
conflicts = []
for item in files_to_move:
    target_file = target / item.name
    if target_file.exists():
        conflicts.append(item.name)

if conflicts:
    print(f"⚠️  Found {len(conflicts)} potential conflicts:")
    for name in conflicts[:10]:
        print(f"   - {name}")
    if len(conflicts) > 10:
        print(f"   ... and {len(conflicts) - 10} more")
    print()

# Move files
print("🔄 Moving files...")
moved = 0
skipped = 0
errors = 0

for source_file in files_to_move:
    target_file = target / source_file.name
    
    if target_file.exists():
        print(f"   ⚠️  Skipping {source_file.name} (already exists)")
        skipped += 1
        continue
    
    try:
        shutil.move(str(source_file), str(target_file))
        moved += 1
        if moved % 10 == 0:
            print(f"   Moved {moved} files...")
    except Exception as e:
        print(f"   ❌ Error moving {source_file.name}: {e}")
        errors += 1

print(f"\n✅ Move complete!")
print(f"   Moved: {moved:,} files")
print(f"   Skipped: {skipped:,} files (conflicts)")
print(f"   Errors: {errors:,} files")

# Check if source is now empty (except subdirectories)
remaining_files = [f for f in source.iterdir() if f.is_file()]
if not remaining_files:
    print(f"\n📁 Source directory is empty of files")
    print(f"   Subdirectories may remain: {[d.name for d in source.iterdir() if d.is_dir()]}")

print(f"\n📂 Files now in: {target}")
print("\n" + "=" * 70)
print("FLATTENING COMPLETE")
print("=" * 70)
