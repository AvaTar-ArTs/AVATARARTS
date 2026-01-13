#!/usr/bin/env python3
"""
Flexible file and directory renaming utility
"""
from pathlib import Path
import re
import sys

def rename_files(directory, pattern, replacement, dry_run=True):
    """
    Rename files matching pattern
    
    Args:
        directory: Directory to process
        pattern: Pattern to match (regex)
        replacement: Replacement string
        dry_run: If True, only show what would be renamed
    """
    dir_path = Path(directory)
    if not dir_path.exists():
        print(f"❌ Directory not found: {directory}")
        return
    
    print("=" * 70)
    print("FILE RENAMING")
    print("=" * 70)
    print(f"Directory: {dir_path}")
    print(f"Pattern: {pattern}")
    print(f"Replacement: {replacement}")
    print(f"Mode: {'DRY RUN' if dry_run else 'RENAME'}\n")
    
    matches = []
    for file_path in dir_path.iterdir():
        if file_path.is_file():
            if re.search(pattern, file_path.name):
                new_name = re.sub(pattern, replacement, file_path.name)
                if new_name != file_path.name:
                    matches.append((file_path, new_name))
    
    if not matches:
        print("No files match the pattern")
        return
    
    print(f"Found {len(matches)} files to rename:\n")
    for old_path, new_name in matches:
        print(f"  {old_path.name}")
        print(f"  → {new_name}\n")
    
    if not dry_run:
        print("Renaming files...")
        renamed = 0
        for old_path, new_name in matches:
            try:
                new_path = old_path.parent / new_name
                if new_path.exists():
                    print(f"  ⚠️  Skipping {old_path.name} (target exists)")
                else:
                    old_path.rename(new_path)
                    renamed += 1
                    print(f"  ✅ {old_path.name} → {new_name}")
            except Exception as e:
                print(f"  ❌ Error renaming {old_path.name}: {e}")
        print(f"\n✅ Renamed {renamed} files")
    else:
        print("\n💡 This is a DRY RUN. Use --execute to actually rename files.")

def standardize_names(directory, dry_run=True):
    """
    Standardize file names (lowercase, replace spaces with underscores)
    """
    dir_path = Path(directory)
    if not dir_path.exists():
        print(f"❌ Directory not found: {directory}")
        return
    
    print("=" * 70)
    print("STANDARDIZE FILE NAMES")
    print("=" * 70)
    print(f"Directory: {dir_path}\n")
    
    matches = []
    for file_path in dir_path.iterdir():
        if file_path.is_file():
            # Standardize: lowercase, replace spaces with underscores, remove special chars
            new_name = file_path.name.lower()
            new_name = re.sub(r'\s+', '_', new_name)
            new_name = re.sub(r'[^\w\.\-_]', '', new_name)
            new_name = re.sub(r'_+', '_', new_name)
            
            if new_name != file_path.name:
                matches.append((file_path, new_name))
    
    if not matches:
        print("No files need standardization")
        return
    
    print(f"Found {len(matches)} files to standardize:\n")
    for old_path, new_name in matches[:20]:
        print(f"  {old_path.name}")
        print(f"  → {new_name}\n")
    if len(matches) > 20:
        print(f"  ... and {len(matches) - 20} more\n")
    
    if not dry_run:
        print("Standardizing files...")
        renamed = 0
        for old_path, new_name in matches:
            try:
                new_path = old_path.parent / new_name
                if new_path.exists():
                    print(f"  ⚠️  Skipping {old_path.name} (target exists)")
                else:
                    old_path.rename(new_path)
                    renamed += 1
            except Exception as e:
                print(f"  ❌ Error: {old_path.name}: {e}")
        print(f"\n✅ Standardized {renamed} files")
    else:
        print("\n💡 This is a DRY RUN. Use --execute to actually rename files.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python3 rename_files.py <directory> [options]")
        print("\nOptions:")
        print("  --pattern <regex>     Pattern to match")
        print("  --replace <string>    Replacement string")
        print("  --standardize         Standardize file names")
        print("  --execute             Actually rename (default is dry run)")
        print("\nExamples:")
        print("  python3 rename_files.py ~/AVATARARTS/INDEXES --standardize")
        print("  python3 rename_files.py ~/AVATARARTS/ --pattern ' ' --replace '_' --execute")
        sys.exit(1)
    
    directory = sys.argv[1]
    dry_run = '--execute' not in sys.argv
    
    if '--standardize' in sys.argv:
        standardize_names(directory, dry_run)
    elif '--pattern' in sys.argv:
        try:
            idx = sys.argv.index('--pattern')
            pattern = sys.argv[idx + 1]
            replacement = sys.argv[sys.argv.index('--replace') + 1] if '--replace' in sys.argv else ''
            rename_files(directory, pattern, replacement, dry_run)
        except:
            print("❌ Error: --pattern requires a pattern and --replace requires a replacement")
    else:
        print("❌ Please specify --standardize or --pattern")
