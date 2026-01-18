#!/usr/bin/env python3
"""
Safe System Cache Cleanup
Removes cache and temporary files while preserving all config and user data.
"""

import os
import shutil
from datetime import datetime
from pathlib import Path

# Cache directories that are safe to clean
SAFE_TO_CLEAN = [
    '/Users/steven/__pycache__',
    '/Users/steven/.cache',
    '/Users/steven/.npm',
    '/Users/steven/.gemini',
    '/Users/steven/.gradle',
    '/Users/steven/.bun',
    '/Users/steven/.EasyOCR',
    '/Users/steven/.gem',
    '/Users/steven/.bundle',
    '/Users/steven/.m2',
    '/Users/steven/.fontconfig',
    '/Users/steven/.matplotlib',
    '/Users/steven/.jupyter',
    '/Users/steven/.ipython',
    '/Users/steven/.package_manager_backup_20251106_070741',
    '/Users/steven/.composer',
    '/Users/steven/.quicklook_plugins_backup',
    '/Users/steven/.nuget',
    '/Users/steven/.keras',
    '/Users/steven/.oracle_jre_usage',
    '/Users/steven/.idlerc',
    '/Users/steven/.mplayer',
    '/Users/steven/.conda',
    '/Users/steven/.cups',
]

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

def clean_directory(directory, dry_run=True, log_file=None):
    """Clean a cache directory."""
    if not os.path.exists(directory):
        return {'status': 'skipped', 'reason': 'not_found'}
    
    try:
        size, file_count = get_directory_size(directory)
        size_mb = round(size / (1024 * 1024), 2)
        
        if dry_run:
            if log_file:
                log_file.write(f"[DRY RUN] Would clean: {directory} ({file_count} files, {size_mb} MB)\n")
            return {'status': 'dry_run', 'size': size, 'file_count': file_count}
        else:
            # Remove directory contents but preserve structure for some directories
            if directory in ['/Users/steven/.npm', '/Users/steven/.cache']:
                # For npm and cache, clean subdirectories but keep main structure
                for item in os.listdir(directory):
                    item_path = os.path.join(directory, item)
                    try:
                        if os.path.isdir(item_path):
                            shutil.rmtree(item_path)
                        else:
                            os.remove(item_path)
                    except Exception as e:
                        if log_file:
                            log_file.write(f"[WARNING] Could not remove {item_path}: {e}\n")
            else:
                # For others, remove entire directory
                shutil.rmtree(directory)
            
            if log_file:
                log_file.write(f"[CLEANED] {directory} ({file_count} files, {size_mb} MB)\n")
            return {'status': 'cleaned', 'size': size, 'file_count': file_count}
    except PermissionError:
        return {'status': 'error', 'reason': 'permission_denied'}
    except Exception as e:
        return {'status': 'error', 'reason': str(e)}

def cleanup_caches(dry_run=True):
    """Clean up cache directories."""
    log_dir = "/Users/steven/AVATARARTS/Revenue"
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    mode = "DRY_RUN" if dry_run else "EXECUTED"
    log_file_path = os.path.join(log_dir, f"cache_cleanup_{mode}_{timestamp}.log")
    
    stats = {
        'directories_processed': 0,
        'directories_cleaned': 0,
        'directories_skipped': 0,
        'errors': 0,
        'space_freed_bytes': 0
    }
    
    print(f"\n{'='*80}")
    print(f"CACHE CLEANUP {'(DRY RUN)' if dry_run else '(EXECUTING)'}")
    print(f"{'='*80}")
    print(f"Log file: {log_file_path}\n")
    
    with open(log_file_path, 'w') as log_file:
        log_file.write(f"Cache Cleanup {mode}\n")
        log_file.write(f"Started: {datetime.now().isoformat()}\n")
        log_file.write(f"Directories to process: {len(SAFE_TO_CLEAN)}\n\n")
        
        for directory in SAFE_TO_CLEAN:
            stats['directories_processed'] += 1
            print(f"Processing: {directory[:70]}...")
            
            result = clean_directory(directory, dry_run=dry_run, log_file=log_file)
            
            if result['status'] == 'cleaned' or result['status'] == 'dry_run':
                stats['directories_cleaned'] += 1
                stats['space_freed_bytes'] += result.get('size', 0)
                print(f"  ✓ {'Would clean' if dry_run else 'Cleaned'} ({result.get('file_count', 0)} files, {result.get('size', 0) / (1024*1024):.2f} MB)")
            elif result['status'] == 'skipped':
                stats['directories_skipped'] += 1
                print(f"  ⊘ Skipped ({result.get('reason', 'unknown')})")
            else:
                stats['errors'] += 1
                print(f"  ✗ Error ({result.get('reason', 'unknown')})")
        
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
    
    parser = argparse.ArgumentParser(description='Clean system cache directories')
    parser.add_argument('--execute', action='store_true', help='Actually clean caches (default is dry-run)')
    
    args = parser.parse_args()
    
    if not args.execute:
        print("\n⚠️  DRY RUN MODE - No files will be deleted")
        print("   Use --execute flag to actually clean caches\n")
    
    try:
        stats, log_file = cleanup_caches(dry_run=not args.execute)
        
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
