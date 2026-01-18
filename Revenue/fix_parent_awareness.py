#!/usr/bin/env python3
"""
Parent-Folder Awareness Check and Fix
Identifies and handles parent-child directory relationships properly.
"""

import os
from pathlib import Path

def is_parent_path(parent, child):
    """Check if parent is actually a parent directory of child (not just substring)."""
    parent = os.path.normpath(parent)
    child = os.path.normpath(child)
    
    # Must be a true path prefix
    try:
        parent_path = Path(parent)
        child_path = Path(child)
        return parent_path in child_path.parents or parent_path == child_path
    except:
        return False

def filter_parent_directories(directories):
    """Remove child directories if their parent is also in the list."""
    directories = [os.path.normpath(d) for d in directories]
    
    # Sort by path length (shorter = potential parent)
    directories.sort(key=len)
    
    filtered = []
    for dir_path in directories:
        # Check if this directory is a child of any already in filtered list
        is_child = False
        for parent in filtered:
            if is_parent_path(parent, dir_path):
                is_child = True
                print(f"  ⊘ Skipping child: {dir_path} (parent: {parent})")
                break
        
        if not is_child:
            filtered.append(dir_path)
    
    return filtered

def analyze_parent_relationships(directories):
    """Analyze parent-child relationships in directory list."""
    print("=" * 80)
    print("PARENT-FOLDER AWARENESS ANALYSIS")
    print("=" * 80)
    
    print(f"\nOriginal directories: {len(directories)}")
    
    # Find all parent-child relationships
    relationships = []
    for i, dir1 in enumerate(directories):
        for j, dir2 in enumerate(directories):
            if i != j:
                if is_parent_path(dir1, dir2):
                    relationships.append((dir1, dir2, 'parent'))
                elif is_parent_path(dir2, dir1):
                    relationships.append((dir1, dir2, 'child'))
    
    if relationships:
        print(f"\n⚠️  Found {len(relationships)} parent-child relationships:")
        for dir1, dir2, rel in relationships:
            if rel == 'parent':
                print(f"  {dir1} is PARENT of {dir2}")
            else:
                print(f"  {dir1} is CHILD of {dir2}")
    else:
        print("\n✓ No parent-child relationships found")
    
    # Filter to remove children
    print(f"\nFiltering directories...")
    filtered = filter_parent_directories(directories)
    
    print(f"\nFiltered directories: {len(filtered)}")
    print(f"Removed: {len(directories) - len(filtered)} child directories")
    
    return filtered, relationships

if __name__ == "__main__":
    # Test with the directories from analysis
    test_dirs = [
        '/Users/steven/.raycast',
        '/Users/steven/.raycast/scripts',
        '/Users/steven/.raycast/scripts/model-picker.applescript',
        '/Users/steven/.cache',
        '/Users/steven/.npm',
        '/Users/steven/.gem',
        '/Users/steven/.gemini',  # This should NOT be filtered (not a child of .gem)
        '/Users/steven/.bun',
        '/Users/steven/.bundle',  # This should NOT be filtered (not a child of .bun)
    ]
    
    filtered, relationships = analyze_parent_relationships(test_dirs)
    
    print("\n" + "=" * 80)
    print("FILTERED DIRECTORY LIST (Parent-aware)")
    print("=" * 80)
    for d in filtered:
        print(f"  ✓ {d}")
