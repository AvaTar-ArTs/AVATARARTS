#!/usr/bin/env python3
"""
Clean up empty folders after reorganization
Removes directories that contain no files
"""

import os
from pathlib import Path
from collections import defaultdict

def find_empty_directories(root_dir, dry_run=True):
    """Find and remove empty directories"""
    root = Path(root_dir)

    print("🧹 CLEANUP EMPTY FOLDERS")
    print("=" * 70)
    print(f"Directory: {root}")
    print(f"Mode: {'DRY RUN' if dry_run else 'LIVE'}")
    print()

    empty_dirs = []

    # Walk from deepest to shallowest (bottom-up)
    all_dirs = []
    for dirpath, dirnames, filenames in os.walk(root):
        # Skip .git and __pycache__
        if '.git' in dirpath or '__pycache__' in dirpath:
            dirnames[:] = []  # Don't descend
            continue

        # Filter out .git and __pycache__ from dirs to check
        dirnames[:] = [d for d in dirnames if d not in ('.git', '__pycache__')]

        all_dirs.append(Path(dirpath))

    # Sort by depth (deepest first) so we can remove nested empty dirs
    all_dirs.sort(key=lambda p: (len(p.parts), str(p)), reverse=True)

    for dir_path in all_dirs:
        try:
            # Skip root directory
            if dir_path == root:
                continue

            # Check if directory is empty
            items = list(dir_path.iterdir())

            # Filter out .DS_Store and other hidden files
            files = [f for f in items if f.is_file() and not f.name.startswith('.')]
            dirs_only = [d for d in items if d.is_dir()]

            # Check if all subdirectories are in our empty list
            empty_subdirs = all(d in empty_dirs for d in dirs_only)

            # Directory is empty if no files and all subdirs are empty (or no subdirs)
            if len(files) == 0 and (len(dirs_only) == 0 or empty_subdirs):
                empty_dirs.append(dir_path)
        except (PermissionError, OSError):
            continue

    # Filter to only show directories that aren't parents of other empty dirs
    # (since we'll remove nested empty dirs when removing parent)
    top_level_empty = []
    for dir_path in empty_dirs:
        # Check if this dir is a parent of any other empty dir
        is_parent = any(str(dir_path) in str(other) and dir_path != other for other in empty_dirs)
        if not is_parent:
            top_level_empty.append(dir_path)
        else:
            # Check if any children are not empty
            has_non_empty_child = False
            try:
                for item in dir_path.iterdir():
                    if item.is_dir() and item not in empty_dirs:
                        has_non_empty_child = True
                        break
            except:
                pass

            if not has_non_empty_child:
                top_level_empty.append(dir_path)

    # Show what will be removed
    print(f"📁 Found {len(empty_dirs)} empty directories")
    print(f"   ({len(top_level_empty)} top-level empty directories)")
    print()

    if top_level_empty:
        print("🗑️  Empty directories to remove:")
        print("-" * 70)
        for dir_path in sorted(top_level_empty)[:50]:
            rel_path = dir_path.relative_to(root)
            print(f"   {rel_path}")
        if len(top_level_empty) > 50:
            print(f"   ... and {len(top_level_empty) - 50} more")
        print()

    # Remove directories
    removed_count = 0
    error_count = 0

    if not dry_run:
        print("🗑️  Removing empty directories...")
        # Remove from deepest to shallowest
        for dir_path in sorted(empty_dirs, key=lambda p: (len(p.parts), str(p)), reverse=True):
            try:
                if dir_path.exists():
                    # Double check it's empty
                    items = list(dir_path.iterdir())
                    files = [f for f in items if f.is_file() and not f.name.startswith('.')]
                    if len(files) == 0:
                        dir_path.rmdir()
                        removed_count += 1
            except OSError:
                # Directory not empty or permission error
                error_count += 1
            except Exception as e:
                error_count += 1

    # Summary
    print("=" * 70)
    print("📊 SUMMARY:")
    if dry_run:
        print(f"   Empty directories found: {len(empty_dirs)}")
        print(f"   Would remove: {len(top_level_empty)} top-level directories")
        print(f"   (Nested empty dirs would be removed automatically)")
    else:
        print(f"   Empty directories removed: {removed_count}")
        print(f"   Errors: {error_count}")
    print("=" * 70)

    if dry_run:
        print("\n💡 Run with --execute to perform actual cleanup")

    return empty_dirs

def main():
    """Main execution"""
    import sys

    root_dir = sys.argv[1] if len(sys.argv) > 1 else "/Users/steven/pythons"
    dry_run = "--execute" not in sys.argv

    if dry_run:
        print("🔍 DRY RUN MODE - No directories will be removed\n")
    else:
        print("⚠️  LIVE MODE - Empty directories will be removed!\n")

    find_empty_directories(root_dir, dry_run=dry_run)

    if not dry_run:
        print("\n✅ Cleanup complete!")

if __name__ == "__main__":
    main()

