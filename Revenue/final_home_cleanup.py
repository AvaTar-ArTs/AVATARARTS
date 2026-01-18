#!/usr/bin/env python3
"""
Final Home Directory Cleanup
Cleans additional cache and log directories found in home directory scan.
"""

import os
import shutil
from datetime import datetime
from pathlib import Path
import json

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

def filter_parent_directories(directories):
    """Remove child directories if their parent is also in the list."""
    directories = [os.path.normpath(d) for d in directories if d]
    directories.sort(key=len)
    
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

def clean_directories(directories, dry_run=True, log_file=None):
    """Clean directories."""
    stats = {
        'processed': 0,
        'cleaned': 0,
        'skipped': 0,
        'errors': 0,
        'space_freed': 0
    }
    
    # Filter parent-child duplicates
    directories = filter_parent_directories(directories)
    
    print(f"\nProcessing {len(directories)} directories...\n")
    
    for directory in directories:
        stats['processed'] += 1
        
        if not os.path.exists(directory):
            stats['skipped'] += 1
            if log_file:
                log_file.write(f"[SKIPPED] {directory} (not found)\n")
            continue
        
        try:
            size, files = get_directory_size(directory)
            size_mb = round(size / (1024 * 1024), 2)
            
            rel_path = os.path.relpath(directory, os.path.expanduser("~"))
            print(f"[{stats['processed']}/{len(directories)}] {rel_path[:60]}...")
            
            if dry_run:
                if log_file:
                    log_file.write(f"[DRY RUN] Would clean: {directory} ({files} files, {size_mb:.2f} MB)\n")
                stats['cleaned'] += 1
                stats['space_freed'] += size
                print(f"  ✓ Would clean ({files} files, {size_mb:.2f} MB)")
            else:
                shutil.rmtree(directory)
                if log_file:
                    log_file.write(f"[CLEANED] {directory} ({files} files, {size_mb:.2f} MB)\n")
                stats['cleaned'] += 1
                stats['space_freed'] += size
                print(f"  ✓ Cleaned ({files} files, {size_mb:.2f} MB)")
        except PermissionError:
            stats['errors'] += 1
            if log_file:
                log_file.write(f"[ERROR] {directory} (permission denied)\n")
            print(f"  ✗ Error (permission denied)")
        except Exception as e:
            stats['errors'] += 1
            if log_file:
                log_file.write(f"[ERROR] {directory} ({str(e)})\n")
            print(f"  ✗ Error ({str(e)})")
    
    stats['space_freed_mb'] = round(stats['space_freed'] / (1024 * 1024), 2)
    return stats

def execute_final_home_cleanup(dry_run=True):
    """Execute final home directory cleanup."""
    # Load scan results
    scan_file = "/Users/steven/AVATARARTS/Revenue/home_directory_scan_20260113_041612.json"
    
    if not os.path.exists(scan_file):
        print(f"Error: Scan file not found: {scan_file}")
        print("Run home_directory_scan.py first")
        return None
    
    with open(scan_file, 'r') as f:
        scan_results = json.load(f)
    
    log_dir = "/Users/steven/AVATARARTS/Revenue"
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    mode = "DRY_RUN" if dry_run else "EXECUTED"
    log_file_path = os.path.join(log_dir, f"final_home_cleanup_{mode}_{timestamp}.log")
    
    print("=" * 80)
    print("FINAL HOME DIRECTORY CLEANUP")
    print("=" * 80)
    print(f"Mode: {mode}")
    print(f"Log file: {log_file_path}\n")
    
    total_stats = {
        'cache_cleaned': 0,
        'cache_space_freed_mb': 0,
        'log_cleaned': 0,
        'log_space_freed_mb': 0,
        'total_space_freed_mb': 0
    }
    
    with open(log_file_path, 'w') as log_file:
        log_file.write(f"Final Home Directory Cleanup {mode}\n")
        log_file.write(f"Started: {datetime.now().isoformat()}\n\n")
        
        # Clean cache directories (excluding user data like Pictures/etsy)
        print("=" * 80)
        print("CLEANING CACHE DIRECTORIES")
        print("=" * 80)
        
        cache_dirs = []
        for cache in scan_results['cache_directories']:
            cache_path = cache['path']
            # Skip user content directories
            if 'Pictures/etsy' in cache_path or 'Movies/CapCut' in cache_path:
                print(f"Skipping user content: {os.path.relpath(cache_path, os.path.expanduser('~'))}")
                continue
            cache_dirs.append(cache_path)
        
        cache_stats = clean_directories(cache_dirs, dry_run=dry_run, log_file=log_file)
        total_stats['cache_cleaned'] = cache_stats['cleaned']
        total_stats['cache_space_freed_mb'] = cache_stats['space_freed_mb']
        
        log_file.write(f"\n--- Cache Cleanup Summary ---\n")
        log_file.write(f"Processed: {cache_stats['processed']}\n")
        log_file.write(f"Cleaned: {cache_stats['cleaned']}\n")
        log_file.write(f"Skipped: {cache_stats['skipped']}\n")
        log_file.write(f"Errors: {cache_stats['errors']}\n")
        log_file.write(f"Space freed: {cache_stats['space_freed_mb']:.2f} MB\n")
        
        # Clean log directories
        print(f"\n{'='*80}")
        print("CLEANING LOG DIRECTORIES")
        print("=" * 80)
        
        log_dirs = [log['path'] for log in scan_results['log_directories']]
        log_stats = clean_directories(log_dirs, dry_run=dry_run, log_file=log_file)
        total_stats['log_cleaned'] = log_stats['cleaned']
        total_stats['log_space_freed_mb'] = log_stats['space_freed_mb']
        
        log_file.write(f"\n--- Log Cleanup Summary ---\n")
        log_file.write(f"Processed: {log_stats['processed']}\n")
        log_file.write(f"Cleaned: {log_stats['cleaned']}\n")
        log_file.write(f"Skipped: {log_stats['skipped']}\n")
        log_file.write(f"Errors: {log_stats['errors']}\n")
        log_file.write(f"Space freed: {log_stats['space_freed_mb']:.2f} MB\n")
        
        total_stats['total_space_freed_mb'] = total_stats['cache_space_freed_mb'] + total_stats['log_space_freed_mb']
        
        log_file.write(f"\n--- Final Summary ---\n")
        log_file.write(f"Total cache directories cleaned: {total_stats['cache_cleaned']}\n")
        log_file.write(f"Total log directories cleaned: {total_stats['log_cleaned']}\n")
        log_file.write(f"Total space freed: {total_stats['total_space_freed_mb']:.2f} MB\n")
        log_file.write(f"Completed: {datetime.now().isoformat()}\n")
    
    print(f"\n{'='*80}")
    print("SUMMARY")
    print(f"{'='*80}")
    print(f"Cache directories {'would be cleaned' if dry_run else 'cleaned'}: {total_stats['cache_cleaned']}")
    print(f"Log directories {'would be cleaned' if dry_run else 'cleaned'}: {total_stats['log_cleaned']}")
    print(f"Space {'would be freed' if dry_run else 'freed'}: {total_stats['total_space_freed_mb']:.2f} MB")
    print(f"\nLog file: {log_file_path}")
    
    return total_stats, log_file_path

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Final home directory cleanup')
    parser.add_argument('--execute', action='store_true', help='Actually clean (default is dry-run)')
    
    args = parser.parse_args()
    
    if not args.execute:
        print("\n⚠️  DRY RUN MODE - No files will be deleted")
        print("   Use --execute flag to actually clean\n")
    
    try:
        stats, log_file = execute_final_home_cleanup(dry_run=not args.execute)
        
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
