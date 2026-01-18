#!/usr/bin/env python3
"""
Home Directory Comprehensive Scan
Finds all cleanup opportunities in the entire home directory.
"""

import os
import json
from pathlib import Path
from datetime import datetime
from collections import defaultdict

HOME_DIR = os.path.expanduser("~")

# Patterns to look for
CACHE_PATTERNS = ['cache', 'Cache', 'caches', 'Caches', 'tmp', 'temp', 'Temp', 'TMP', '__pycache__']
LOG_PATTERNS = ['log', 'Log', 'logs', 'Logs']
BACKUP_PATTERNS = ['backup', 'Backup', 'backups', 'Backups', '.bak', '.old', '.orig']
TEMP_PATTERNS = ['.tmp', '.temp', '.swp', '.swo', '~']

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

def find_items_by_pattern(root_dir, patterns, item_type='directory', max_depth=3, current_depth=0):
    """Find items matching patterns."""
    items = []
    
    if current_depth >= max_depth or not os.path.exists(root_dir):
        return items
    
    try:
        for item in os.listdir(root_dir):
            if item.startswith('.') and current_depth == 0:
                continue  # Skip hidden items at root level
            
            item_path = os.path.join(root_dir, item)
            
            if item_type == 'directory' and not os.path.isdir(item_path):
                continue
            elif item_type == 'file' and not os.path.isfile(item_path):
                continue
            
            item_lower = item.lower()
            
            # Check if matches any pattern
            if any(pattern.lower() in item_lower for pattern in patterns):
                items.append(item_path)
            
            # Recursively search subdirectories
            if os.path.isdir(item_path) and current_depth < max_depth:
                items.extend(find_items_by_pattern(item_path, patterns, item_type, max_depth, current_depth + 1))
    
    except (PermissionError, OSError):
        pass
    
    return items

def scan_home_directory():
    """Comprehensive scan of home directory."""
    print("=" * 80)
    print("HOME DIRECTORY COMPREHENSIVE SCAN")
    print("=" * 80)
    print(f"Scanning: {HOME_DIR}\n")
    
    results = {
        'timestamp': datetime.now().isoformat(),
        'home_directory': HOME_DIR,
        'cache_directories': [],
        'log_directories': [],
        'backup_files': [],
        'temp_files': [],
        'large_directories': [],
        'summary': {}
    }
    
    # Find cache directories
    print("1. Finding cache directories...")
    cache_dirs = find_items_by_pattern(HOME_DIR, CACHE_PATTERNS, 'directory', max_depth=4)
    cache_dirs = filter_parent_directories(cache_dirs)
    print(f"   Found {len(cache_dirs)} cache directories")
    
    for cache_dir in cache_dirs:
        size, files = get_directory_size(cache_dir)
        if size > 0:
            rel_path = os.path.relpath(cache_dir, HOME_DIR)
            results['cache_directories'].append({
                'path': cache_dir,
                'relative_path': rel_path,
                'size_bytes': size,
                'size_mb': round(size / (1024 * 1024), 2),
                'file_count': files
            })
    
    results['cache_directories'].sort(key=lambda x: x['size_bytes'], reverse=True)
    
    # Find log directories
    print("\n2. Finding log directories...")
    log_dirs = find_items_by_pattern(HOME_DIR, LOG_PATTERNS, 'directory', max_depth=3)
    log_dirs = filter_parent_directories(log_dirs)
    print(f"   Found {len(log_dirs)} log directories")
    
    for log_dir in log_dirs:
        size, files = get_directory_size(log_dir)
        if size > 0:
            rel_path = os.path.relpath(log_dir, HOME_DIR)
            results['log_directories'].append({
                'path': log_dir,
                'relative_path': rel_path,
                'size_bytes': size,
                'size_mb': round(size / (1024 * 1024), 2),
                'file_count': files
            })
    
    results['log_directories'].sort(key=lambda x: x['size_bytes'], reverse=True)
    
    # Find large top-level directories (for analysis)
    print("\n3. Analyzing large directories...")
    try:
        for item in os.listdir(HOME_DIR):
            if item.startswith('.'):
                continue
            
            item_path = os.path.join(HOME_DIR, item)
            if not os.path.isdir(item_path):
                continue
            
            size, files = get_directory_size(item_path)
            size_mb = round(size / (1024 * 1024), 2)
            
            if size_mb > 100:  # Only show directories > 100 MB
                results['large_directories'].append({
                    'path': item_path,
                    'name': item,
                    'size_bytes': size,
                    'size_mb': size_mb,
                    'file_count': files
                })
    except:
        pass
    
    results['large_directories'].sort(key=lambda x: x['size_bytes'], reverse=True)
    
    # Calculate totals
    cache_total = sum(d['size_bytes'] for d in results['cache_directories'])
    log_total = sum(d['size_bytes'] for d in results['log_directories'])
    
    results['summary'] = {
        'cache_directories_count': len(results['cache_directories']),
        'cache_total_mb': round(cache_total / (1024 * 1024), 2),
        'log_directories_count': len(results['log_directories']),
        'log_total_mb': round(log_total / (1024 * 1024), 2),
        'large_directories_count': len(results['large_directories']),
    }
    
    # Save results
    output_file = f"/Users/steven/AVATARARTS/Revenue/home_directory_scan_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n{'='*80}")
    print("SUMMARY")
    print(f"{'='*80}")
    print(f"Cache directories: {results['summary']['cache_directories_count']} ({results['summary']['cache_total_mb']:.2f} MB)")
    print(f"Log directories: {results['summary']['log_directories_count']} ({results['summary']['log_total_mb']:.2f} MB)")
    print(f"Large directories (>100 MB): {results['summary']['large_directories_count']}")
    print(f"\nResults saved to: {output_file}")
    
    # Show top items
    if results['cache_directories']:
        print(f"\n{'='*80}")
        print("TOP 20 LARGEST CACHE DIRECTORIES")
        print(f"{'='*80}")
        for i, cache in enumerate(results['cache_directories'][:20], 1):
            print(f"{i:2d}. {cache['relative_path'][:60]:60} {cache['size_mb']:8.2f} MB ({cache['file_count']:5d} files)")
    
    if results['log_directories']:
        print(f"\n{'='*80}")
        print("TOP 10 LARGEST LOG DIRECTORIES")
        print(f"{'='*80}")
        for i, log_dir in enumerate(results['log_directories'][:10], 1):
            print(f"{i:2d}. {log_dir['relative_path'][:60]:60} {log_dir['size_mb']:8.2f} MB ({log_dir['file_count']:5d} files)")
    
    if results['large_directories']:
        print(f"\n{'='*80}")
        print("LARGE DIRECTORIES (>100 MB)")
        print(f"{'='*80}")
        for i, large_dir in enumerate(results['large_directories'][:20], 1):
            print(f"{i:2d}. {large_dir['name']:40} {large_dir['size_mb']:10.2f} MB ({large_dir['file_count']:6d} files)")
    
    return results, output_file

if __name__ == "__main__":
    try:
        results, output_file = scan_home_directory()
    except KeyboardInterrupt:
        print("\n\nScan cancelled by user.")
        import sys
        sys.exit(1)
    except Exception as e:
        print(f"\n\nError: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        import sys
        sys.exit(1)
