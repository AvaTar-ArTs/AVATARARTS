#!/usr/bin/env python3
"""
Deep Library Cache Cleanup
Finds and cleans cache directories within Library subdirectories with parent-folder awareness.
"""

import os
import shutil
from datetime import datetime
from pathlib import Path

LIBRARY_DIR = os.path.expanduser("~/Library")

# Cache patterns to look for
CACHE_PATTERNS = ['cache', 'Cache', 'caches', 'Caches', 'tmp', 'temp', 'Temp', 'TMP']

# Directories to search for caches
SEARCH_DIRS = [
    'Application Support',
    'Containers',
    'Group Containers',
    'Caches',  # Top-level caches
    'Logs',    # Top-level logs
    'Saved Application State',
]

def is_parent_path(parent, child):
    """Check if parent is actually a parent directory of child."""
    parent = os.path.normpath(parent)
    child = os.path.normpath(child)
    try:
        parent_path = Path(parent)
        child_path = Path(child)
        return parent_path in child_path.parents or parent_path == child_path
    except:
        return False

def find_cache_directories(search_root, max_depth=3, current_depth=0):
    """Recursively find cache directories."""
    cache_dirs = []
    
    if current_depth >= max_depth or not os.path.exists(search_root):
        return cache_dirs
    
    try:
        for item in os.listdir(search_root):
            item_path = os.path.join(search_root, item)
            
            if not os.path.isdir(item_path) or item.startswith('.'):
                continue
            
            item_lower = item.lower()
            
            # Check if this directory matches cache patterns
            if any(pattern.lower() in item_lower for pattern in CACHE_PATTERNS):
                cache_dirs.append(item_path)
            else:
                # Recursively search subdirectories
                cache_dirs.extend(find_cache_directories(item_path, max_depth, current_depth + 1))
    
    except (PermissionError, OSError):
        pass
    
    return cache_dirs

def get_directory_size(directory):
    """Get total size of directory."""
    total = 0
    file_count = 0
    try:
        for root, dirs, files in os.walk(directory):
            for filename in files:
                if filename.startswith('.'):
                    continue
                filepath = os.path.join(root, filename)
                try:
                    total += os.path.getsize(filepath)
                    file_count += 1
                except:
                    pass
    except:
        pass
    return total, file_count

def filter_parent_directories(directories):
    """Remove child directories if their parent is also in the list."""
    directories = [os.path.normpath(d) for d in directories]
    directories.sort(key=len)  # Sort by path length
    
    filtered = []
    for dir_path in directories:
        is_child = False
        for parent in filtered:
            if is_parent_path(parent, dir_path):
                is_child = True
                break
        
        if not is_child:
            filtered.append(dir_path)
    
    return filtered

def analyze_library_caches():
    """Find all cache directories in Library."""
    print("=" * 80)
    print("DEEP LIBRARY CACHE ANALYSIS")
    print("=" * 80)
    print(f"Searching in: {LIBRARY_DIR}\n")
    
    all_cache_dirs = []
    
    for search_dir in SEARCH_DIRS:
        search_path = os.path.join(LIBRARY_DIR, search_dir)
        if not os.path.exists(search_path):
            continue
        
        print(f"Searching in {search_dir}...")
        cache_dirs = find_cache_directories(search_path, max_depth=4)
        all_cache_dirs.extend(cache_dirs)
        print(f"  Found {len(cache_dirs)} cache directories")
    
    # Filter out parent-child duplicates
    print(f"\nFiltering parent-child duplicates...")
    print(f"  Before filtering: {len(all_cache_dirs)} directories")
    filtered_dirs = filter_parent_directories(all_cache_dirs)
    print(f"  After filtering: {len(filtered_dirs)} directories")
    
    # Get sizes
    print(f"\nCalculating sizes...")
    cache_info = []
    total_size = 0
    
    for cache_dir in filtered_dirs:
        size, files = get_directory_size(cache_dir)
        if size > 0:  # Only include non-empty
            size_mb = round(size / (1024 * 1024), 2)
            cache_info.append({
                'path': cache_dir,
                'size_bytes': size,
                'size_mb': size_mb,
                'file_count': files
            })
            total_size += size
    
    # Sort by size
    cache_info.sort(key=lambda x: x['size_bytes'], reverse=True)
    
    print(f"\n{'='*80}")
    print("SUMMARY")
    print(f"{'='*80}")
    print(f"Total cache directories found: {len(cache_info)}")
    print(f"Total cache size: {round(total_size / (1024 * 1024), 2):.2f} MB")
    
    # Show top 30
    print(f"\n{'='*80}")
    print("TOP 30 LARGEST CACHE DIRECTORIES")
    print(f"{'='*80}")
    for i, info in enumerate(cache_info[:30], 1):
        rel_path = os.path.relpath(info['path'], LIBRARY_DIR)
        print(f"{i:2d}. {rel_path[:65]:65} {info['size_mb']:8.2f} MB ({info['file_count']:5d} files)")
    
    return cache_info

def clean_library_caches(cache_info, dry_run=True):
    """Clean library cache directories."""
    log_dir = "/Users/steven/AVATARARTS/Revenue"
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    mode = "DRY_RUN" if dry_run else "EXECUTED"
    log_file_path = os.path.join(log_dir, f"library_cache_cleanup_{mode}_{timestamp}.log")
    
    stats = {
        'directories_processed': 0,
        'directories_cleaned': 0,
        'directories_skipped': 0,
        'errors': 0,
        'space_freed_bytes': 0
    }
    
    print(f"\n{'='*80}")
    print(f"LIBRARY CACHE CLEANUP {'(DRY RUN)' if dry_run else '(EXECUTING)'}")
    print(f"{'='*80}")
    print(f"Log file: {log_file_path}\n")
    
    with open(log_file_path, 'w') as log_file:
        log_file.write(f"Library Cache Cleanup {mode}\n")
        log_file.write(f"Started: {datetime.now().isoformat()}\n")
        log_file.write(f"Directories to process: {len(cache_info)}\n\n")
        
        for cache_item in cache_info:
            cache_dir = cache_item['path']
            stats['directories_processed'] += 1
            
            rel_path = os.path.relpath(cache_dir, LIBRARY_DIR)
            print(f"[{stats['directories_processed']}/{len(cache_info)}] {rel_path[:60]}...")
            
            if not os.path.exists(cache_dir):
                stats['directories_skipped'] += 1
                log_file.write(f"[SKIPPED] {cache_dir} (not found)\n")
                continue
            
            try:
                if dry_run:
                    log_file.write(f"[DRY RUN] Would clean: {cache_dir} ({cache_item['file_count']} files, {cache_item['size_mb']:.2f} MB)\n")
                    stats['directories_cleaned'] += 1
                    stats['space_freed_bytes'] += cache_item['size_bytes']
                    print(f"  ✓ Would clean ({cache_item['file_count']} files, {cache_item['size_mb']:.2f} MB)")
                else:
                    shutil.rmtree(cache_dir)
                    log_file.write(f"[CLEANED] {cache_dir} ({cache_item['file_count']} files, {cache_item['size_mb']:.2f} MB)\n")
                    stats['directories_cleaned'] += 1
                    stats['space_freed_bytes'] += cache_item['size_bytes']
                    print(f"  ✓ Cleaned ({cache_item['file_count']} files, {cache_item['size_mb']:.2f} MB)")
            except PermissionError:
                stats['errors'] += 1
                log_file.write(f"[ERROR] {cache_dir} (permission denied)\n")
                print(f"  ✗ Error (permission denied)")
            except Exception as e:
                stats['errors'] += 1
                log_file.write(f"[ERROR] {cache_dir} ({str(e)})\n")
                print(f"  ✗ Error ({str(e)})")
        
        stats['space_freed_mb'] = round(stats['space_freed_bytes'] / (1024 * 1024), 2)
        
        log_file.write(f"\n--- Summary ---\n")
        log_file.write(f"Directories processed: {stats['directories_processed']}\n")
        log_file.write(f"Directories {'would be cleaned' if dry_run else 'cleaned'}: {stats['directories_cleaned']}\n")
        log_file.write(f"Directories skipped: {stats['directories_skipped']}\n")
        log_file.write(f"Errors: {stats['errors']}\n")
        log_file.write(f"Space {'would be freed' if dry_run else 'freed'}: {stats['space_freed_mb']:.2f} MB\n")
        log_file.write(f"Completed: {datetime.now().isoformat()}\n")
    
    print(f"\n{'='*80}")
    print("SUMMARY")
    print(f"{'='*80}")
    print(f"Directories processed: {stats['directories_processed']}")
    print(f"Directories {'would be cleaned' if dry_run else 'cleaned'}: {stats['directories_cleaned']}")
    print(f"Directories skipped: {stats['directories_skipped']}")
    print(f"Errors: {stats['errors']}")
    print(f"Space {'would be freed' if dry_run else 'freed'}: {stats['space_freed_mb']:.2f} MB")
    print(f"\nLog file: {log_file_path}")
    
    return stats, log_file_path

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Deep clean Library cache directories')
    parser.add_argument('--execute', action='store_true', help='Actually clean caches (default is dry-run)')
    parser.add_argument('--analyze-only', action='store_true', help='Only analyze, do not clean')
    
    args = parser.parse_args()
    
    try:
        cache_info = analyze_library_caches()
        
        if not args.analyze_only:
            if not args.execute:
                print("\n⚠️  DRY RUN MODE - No files will be deleted")
                print("   Use --execute flag to actually clean caches\n")
            
            stats, log_file = clean_library_caches(cache_info, dry_run=not args.execute)
            
            if not args.execute:
                print("\n💡 To execute for real, run:")
                print(f"   python3 {__file__} --execute")
    except KeyboardInterrupt:
        print("\n\nOperation cancelled by user.")
        import sys
        sys.exit(1)
    except Exception as e:
        print(f"\n\nError: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        import sys
        sys.exit(1)
