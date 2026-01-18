#!/usr/bin/env python3
"""
Final Directory Cleanup
Removes empty or redundant directories after merges.
"""

import os
import shutil
from datetime import datetime

# Directories that can be safely removed after successful merges
DIRECTORIES_TO_REMOVE = [
    # Cloud/backup locations that have been merged
    '/Users/steven/Library/Mobile Documents/com~apple~CloudDocs/Downloads/Dr_Adu_GainesvillePFS_SEO_Project',
    '/Users/steven/Downloads/Compressed/Takeout/Drive/tehSiTes/02_Content_Aware_Analysis',
    
    # Secondary ai-sites directories (merged into AVATARARTS/04_WEBSITES)
    '/Users/steven/ai-sites/ai-content-studio',
    '/Users/steven/ai-sites/content-management',
    '/Users/steven/ai-sites/seo-optimized-content',
    '/Users/steven/ai-sites/steven-chaplinski-website',
    '/Users/steven/ai-sites/retention-products-suite',
    
    # Secondary avatararts.org directories
    '/Users/steven/AVATARARTS/avatararts.org',
    
    # Empty or minimal directories
    '/Users/steven/AVATARARTS/00_ACTIVE/CONTENT/video-content',  # 0 files
    '/Users/steven/avatararts.org/admin/content',  # 0 files
    '/Users/steven/AVATARARTS/avatararts.org/admin/content',  # 0 files
    '/Users/steven/Downloads/Compressed/Takeout/Drive/tehSiTes/02_Content_Aware_Analysis/02_Content_Categories',  # 0 files
]

def is_directory_empty(directory):
    """Check if directory is empty or only contains empty subdirectories."""
    if not os.path.exists(directory):
        return True
    
    try:
        for root, dirs, files in os.walk(directory):
            # Skip hidden files
            files = [f for f in files if not f.startswith('.')]
            dirs[:] = [d for d in dirs if not d.startswith('.')]
            
            if files:
                return False
        return True
    except:
        return False

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

def remove_directory_safe(directory, dry_run=True, log_file=None):
    """Safely remove a directory."""
    if not os.path.exists(directory):
        return {'status': 'skipped', 'reason': 'not_found'}
    
    try:
        size, file_count = get_directory_size(directory)
        size_mb = round(size / (1024 * 1024), 2)
        
        if dry_run:
            if log_file:
                log_file.write(f"[DRY RUN] Would remove: {directory} ({file_count} files, {size_mb} MB)\n")
            return {'status': 'dry_run', 'size': size, 'file_count': file_count}
        else:
            shutil.rmtree(directory)
            if log_file:
                log_file.write(f"[REMOVED] {directory} ({file_count} files, {size_mb} MB)\n")
            return {'status': 'removed', 'size': size, 'file_count': file_count}
    except PermissionError:
        return {'status': 'error', 'reason': 'permission_denied'}
    except Exception as e:
        return {'status': 'error', 'reason': str(e)}

def cleanup_directories(dry_run=True):
    """Clean up redundant directories."""
    log_dir = "/Users/steven/AVATARARTS/Revenue"
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    mode = "DRY_RUN" if dry_run else "EXECUTED"
    log_file_path = os.path.join(log_dir, f"directory_cleanup_{mode}_{timestamp}.log")
    
    stats = {
        'directories_processed': 0,
        'directories_removed': 0,
        'directories_skipped': 0,
        'errors': 0,
        'space_freed_bytes': 0
    }
    
    print(f"\n{'='*80}")
    print(f"DIRECTORY CLEANUP {'(DRY RUN)' if dry_run else '(EXECUTING)'}")
    print(f"{'='*80}")
    print(f"Log file: {log_file_path}\n")
    
    with open(log_file_path, 'w') as log_file:
        log_file.write(f"Directory Cleanup {mode}\n")
        log_file.write(f"Started: {datetime.now().isoformat()}\n")
        log_file.write(f"Directories to process: {len(DIRECTORIES_TO_REMOVE)}\n\n")
        
        for directory in DIRECTORIES_TO_REMOVE:
            stats['directories_processed'] += 1
            print(f"Processing: {directory[:70]}...")
            
            result = remove_directory_safe(directory, dry_run=dry_run, log_file=log_file)
            
            if result['status'] == 'removed' or result['status'] == 'dry_run':
                stats['directories_removed'] += 1
                stats['space_freed_bytes'] += result.get('size', 0)
                print(f"  ✓ {'Would remove' if dry_run else 'Removed'} ({result.get('file_count', 0)} files, {result.get('size', 0) / (1024*1024):.2f} MB)")
            elif result['status'] == 'skipped':
                stats['directories_skipped'] += 1
                print(f"  ⊘ Skipped ({result.get('reason', 'unknown')})")
            else:
                stats['errors'] += 1
                print(f"  ✗ Error ({result.get('reason', 'unknown')})")
        
        stats['space_freed_mb'] = round(stats['space_freed_bytes'] / (1024 * 1024), 2)
        
        log_file.write(f"\n--- Summary ---\n")
        log_file.write(f"Directories processed: {stats['directories_processed']}\n")
        log_file.write(f"Directories {'would be removed' if dry_run else 'removed'}: {stats['directories_removed']}\n")
        log_file.write(f"Directories skipped: {stats['directories_skipped']}\n")
        log_file.write(f"Errors: {stats['errors']}\n")
        log_file.write(f"Space {'would be freed' if dry_run else 'freed'}: {stats['space_freed_mb']:.2f} MB\n")
        log_file.write(f"Completed: {datetime.now().isoformat()}\n")
    
    print(f"\n{'='*80}")
    print("SUMMARY")
    print(f"{'='*80}")
    print(f"Directories processed: {stats['directories_processed']}")
    print(f"Directories {'would be removed' if dry_run else 'removed'}: {stats['directories_removed']}")
    print(f"Directories skipped: {stats['directories_skipped']}")
    print(f"Errors: {stats['errors']}")
    print(f"Space {'would be freed' if dry_run else 'freed'}: {stats['space_freed_mb']:.2f} MB")
    print(f"\nLog file: {log_file_path}")
    
    return stats, log_file_path

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Remove redundant directories after merges')
    parser.add_argument('--execute', action='store_true', help='Actually remove directories (default is dry-run)')
    
    args = parser.parse_args()
    
    if not args.execute:
        print("\n⚠️  DRY RUN MODE - No directories will be removed")
        print("   Use --execute flag to actually remove directories\n")
    
    try:
        stats, log_file = cleanup_directories(dry_run=not args.execute)
        
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
