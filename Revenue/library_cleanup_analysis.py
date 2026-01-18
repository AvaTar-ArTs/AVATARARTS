#!/usr/bin/env python3
"""
Library Directory Cleanup Analysis
Analyzes ~/Library for safe cache and log cleanup opportunities.
"""

import os
import json
from pathlib import Path
from datetime import datetime
from collections import defaultdict

LIBRARY_DIR = os.path.expanduser("~/Library")

# Safe to clean - cache and log directories
SAFE_CACHE_DIRS = [
    'Caches',
    'Logs',
    'Saved Application State',  # Can be regenerated
    'Application Support/CrashReporter',
]

# Partially safe - can clean subdirectories but keep main structure
PARTIAL_CLEAN = {
    'Application Support': ['cache', 'Cache', 'caches', 'Caches', 'logs', 'Logs', 'tmp', 'temp'],
    'Containers': ['cache', 'Cache', 'caches', 'Caches', 'logs', 'Logs', 'tmp', 'temp'],
    'Group Containers': ['cache', 'Cache', 'caches', 'Caches', 'logs', 'Logs', 'tmp', 'temp'],
}

# NEVER clean - important system data
NEVER_CLEAN = [
    'Preferences',
    'Keychains',
    'Application Support',  # Main directory (but subdirs may be safe)
    'Mail',
    'Messages',
    'Safari',
    'Containers',  # Main directory (but subdirs may be safe)
    'Group Containers',  # Main directory (but subdirs may be safe)
    'Mobile Documents',
    'CloudKit',
    'Accounts',
    'Calendars',
    'Contacts',
    'Cookies',
    'Frameworks',
    'LaunchAgents',
    'LaunchDaemons',
    'Services',
    'Spotlight',
    'StickiesDatabase',
    'SyncedPreferences',
    'WebKit',
]

def get_directory_size(directory):
    """Get total size and file count of directory."""
    total_size = 0
    file_count = 0
    dir_count = 0
    
    if not os.path.exists(directory):
        return 0, 0, 0
    
    try:
        for root, dirs, files in os.walk(directory):
            for filename in files:
                if filename.startswith('.'):
                    continue
                filepath = os.path.join(root, filename)
                try:
                    total_size += os.path.getsize(filepath)
                    file_count += 1
                except (OSError, PermissionError):
                    pass
            
            dir_count += len([d for d in dirs if not d.startswith('.')])
    except (OSError, PermissionError):
        pass
    
    return total_size, file_count, dir_count

def categorize_library_item(item_path):
    """Categorize a Library item."""
    item_name = os.path.basename(item_path)
    rel_path = os.path.relpath(item_path, LIBRARY_DIR)
    
    # Check if it's a top-level directory
    if '/' not in rel_path:
        if item_name in SAFE_CACHE_DIRS:
            return 'safe_cache'
        elif item_name in NEVER_CLEAN:
            return 'never_clean'
        elif 'cache' in item_name.lower() or 'log' in item_name.lower():
            return 'likely_cache'
        else:
            return 'unknown'
    else:
        # Subdirectory - check parent
        parent = rel_path.split('/')[0]
        if parent in PARTIAL_CLEAN:
            subdir_name = os.path.basename(item_path).lower()
            if subdir_name in PARTIAL_CLEAN[parent]:
                return 'partial_clean'
        return 'unknown'

def analyze_library():
    """Analyze Library directory."""
    print("=" * 80)
    print("LIBRARY DIRECTORY CLEANUP ANALYSIS")
    print("=" * 80)
    print(f"Analyzing: {LIBRARY_DIR}\n")
    
    if not os.path.exists(LIBRARY_DIR):
        print(f"Error: {LIBRARY_DIR} does not exist")
        return None
    
    analysis = {
        'timestamp': datetime.now().isoformat(),
        'library_path': LIBRARY_DIR,
        'items': {},
        'categories': defaultdict(list),
        'safe_to_clean': [],
        'summary': {}
    }
    
    total_size = 0
    total_files = 0
    
    print("Scanning Library directory...\n")
    
    # Analyze top-level directories
    try:
        items = os.listdir(LIBRARY_DIR)
        items = [item for item in items if not item.startswith('.')]
        
        for item in items:
            item_path = os.path.join(LIBRARY_DIR, item)
            
            if not os.path.isdir(item_path):
                continue
            
            size, files, dirs = get_directory_size(item_path)
            category = categorize_library_item(item_path)
            size_mb = round(size / (1024 * 1024), 2)
            
            item_info = {
                'path': item_path,
                'name': item,
                'size_bytes': size,
                'size_mb': size_mb,
                'file_count': files,
                'dir_count': dirs,
                'category': category
            }
            
            analysis['items'][item_path] = item_info
            analysis['categories'][category].append(item_info)
            
            total_size += size
            total_files += files
            
            # Add to safe_to_clean if appropriate
            if category in ['safe_cache', 'likely_cache']:
                if size > 0:
                    analysis['safe_to_clean'].append(item_info)
            
            print(f"{'✓' if size > 0 else '⊘'} {item:40} {size_mb:10.2f} MB ({files:6d} files) [{category}]")
    
    except PermissionError as e:
        print(f"Permission error: {e}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Sort by size
    analysis['safe_to_clean'].sort(key=lambda x: x['size_bytes'], reverse=True)
    
    analysis['summary'] = {
        'total_items': len(analysis['items']),
        'total_size_mb': round(total_size / (1024 * 1024), 2),
        'total_files': total_files,
        'safe_to_clean_count': len(analysis['safe_to_clean']),
        'safe_to_clean_size_mb': round(sum(d['size_bytes'] for d in analysis['safe_to_clean']) / (1024 * 1024), 2),
    }
    
    print(f"\n{'='*80}")
    print("SUMMARY")
    print(f"{'='*80}")
    print(f"Total items analyzed: {analysis['summary']['total_items']}")
    print(f"Total size: {analysis['summary']['total_size_mb']:.2f} MB")
    print(f"Total files: {analysis['summary']['total_files']:,}")
    print(f"\nSafe to clean:")
    print(f"  - Items: {analysis['summary']['safe_to_clean_count']}")
    print(f"  - Size: {analysis['summary']['safe_to_clean_size_mb']:.2f} MB")
    
    # Save analysis
    output_file = f"/Users/steven/AVATARARTS/Revenue/library_cleanup_analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(output_file, 'w') as f:
        json.dump(analysis, f, indent=2)
    
    print(f"\nAnalysis saved to: {output_file}")
    
    # Show top items to clean
    if analysis['safe_to_clean']:
        print("\n" + "="*80)
        print("TOP 20 LARGEST SAFE-TO-CLEAN ITEMS")
        print("="*80)
        for i, item_info in enumerate(analysis['safe_to_clean'][:20], 1):
            print(f"{i:2d}. {item_info['name']:40} {item_info['size_mb']:10.2f} MB ({item_info['file_count']:6d} files)")
    
    return analysis, output_file

if __name__ == "__main__":
    try:
        result = analyze_library()
        if result:
            analysis, output_file = result
    except KeyboardInterrupt:
        print("\n\nAnalysis cancelled by user.")
        import sys
        sys.exit(1)
    except Exception as e:
        print(f"\n\nError: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        import sys
        sys.exit(1)
