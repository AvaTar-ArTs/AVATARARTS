#!/usr/bin/env python3
"""
Safe Directory Merge Executor
Merges duplicate directories into their primary locations.
"""

import json
import os
import shutil
from pathlib import Path
from datetime import datetime
import sys

def load_merge_plan(plan_file):
    """Load the merge plan JSON."""
    with open(plan_file, 'r') as f:
        return json.load(f)

def get_directory_size(directory):
    """Get total size of directory in bytes."""
    total = 0
    try:
        for dirpath, dirnames, filenames in os.walk(directory):
            for filename in filenames:
                filepath = os.path.join(dirpath, filename)
                try:
                    total += os.path.getsize(filepath)
                except (OSError, PermissionError):
                    pass
    except (OSError, PermissionError):
        pass
    return total

def copy_file_safe(src, dst, log_file=None):
    """Safely copy a file, creating directories as needed."""
    try:
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        
        # If destination exists, check if it's the same file
        if os.path.exists(dst):
            if os.path.getsize(src) == os.path.getsize(dst):
                # Same size, might be duplicate - skip
                return {'status': 'skipped', 'reason': 'already_exists'}
            else:
                # Different size - rename
                base, ext = os.path.splitext(dst)
                counter = 1
                while os.path.exists(f"{base}_{counter}{ext}"):
                    counter += 1
                dst = f"{base}_{counter}{ext}"
        
        shutil.copy2(src, dst)
        return {'status': 'copied', 'destination': dst}
    except Exception as e:
        return {'status': 'error', 'reason': str(e)}

def merge_directory(source_dir, target_dir, dry_run=True, log_file=None):
    """Merge source directory into target directory."""
    if not os.path.exists(source_dir):
        return {'status': 'skipped', 'reason': 'source_not_found'}
    
    if not os.path.exists(target_dir):
        if not dry_run:
            os.makedirs(target_dir, exist_ok=True)
        else:
            return {'status': 'skipped', 'reason': 'target_not_found'}
    
    stats = {
        'files_copied': 0,
        'files_skipped': 0,
        'errors': 0,
        'bytes_copied': 0
    }
    
    try:
        for root, dirs, files in os.walk(source_dir):
            # Skip hidden directories
            dirs[:] = [d for d in dirs if not d.startswith('.')]
            
            for filename in files:
                if filename.startswith('.'):
                    continue
                
                src_path = os.path.join(root, filename)
                rel_path = os.path.relpath(src_path, source_dir)
                dst_path = os.path.join(target_dir, rel_path)
                
                if dry_run:
                    file_size = os.path.getsize(src_path)
                    stats['files_copied'] += 1
                    stats['bytes_copied'] += file_size
                    if log_file:
                        log_file.write(f"[DRY RUN] Would copy: {src_path} -> {dst_path}\n")
                else:
                    result = copy_file_safe(src_path, dst_path, log_file)
                    if result['status'] == 'copied':
                        stats['files_copied'] += 1
                        stats['bytes_copied'] += os.path.getsize(src_path)
                        if log_file:
                            log_file.write(f"[COPIED] {src_path} -> {result.get('destination', dst_path)}\n")
                    elif result['status'] == 'skipped':
                        stats['files_skipped'] += 1
                    else:
                        stats['errors'] += 1
                        if log_file:
                            log_file.write(f"[ERROR] {src_path}: {result.get('reason', 'unknown')}\n")
    
    except Exception as e:
        return {'status': 'error', 'reason': str(e), 'stats': stats}
    
    return {'status': 'completed', 'stats': stats}

def execute_merges(plan_file, dry_run=True):
    """Execute directory merges based on merge plan."""
    plan = load_merge_plan(plan_file)
    
    log_dir = os.path.dirname(plan_file)
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    mode = "DRY_RUN" if dry_run else "EXECUTED"
    log_file_path = os.path.join(log_dir, f"merge_{mode}_{timestamp}.log")
    
    total_stats = {
        'merges_processed': 0,
        'merges_completed': 0,
        'merges_skipped': 0,
        'merges_errors': 0,
        'total_files_copied': 0,
        'total_bytes_copied': 0
    }
    
    strategies = plan['merge_strategies']
    
    print(f"\n{'='*80}")
    print(f"DIRECTORY MERGE {'(DRY RUN)' if dry_run else '(EXECUTING)'}")
    print(f"{'='*80}")
    print(f"Processing {len(strategies)} merge strategies...")
    print(f"Log file: {log_file_path}\n")
    
    with open(log_file_path, 'w') as log_file:
        log_file.write(f"Directory Merge {mode}\n")
        log_file.write(f"Started: {datetime.now().isoformat()}\n")
        log_file.write(f"Total strategies: {len(strategies)}\n\n")
        
        for i, strategy in enumerate(strategies, 1):
            group_name = strategy['group_name']
            primary = strategy['primary_directory']
            secondaries = strategy['secondary_directories']
            
            print(f"\n[{i}/{len(strategies)}] {group_name}")
            print(f"  Primary: {primary}")
            
            log_file.write(f"\n--- Merge Strategy {i}: {group_name} ---\n")
            log_file.write(f"Primary: {primary}\n")
            
            if not os.path.exists(primary):
                print(f"  ⚠️  WARNING: Primary directory not found: {primary}")
                log_file.write(f"WARNING: Primary directory not found\n")
                total_stats['merges_skipped'] += 1
                continue
            
            for secondary in secondaries:
                print(f"  Merging: {secondary}")
                log_file.write(f"\nMerging from: {secondary}\n")
                
                if not os.path.exists(secondary):
                    print(f"    ⊘ Skipped (not found)")
                    log_file.write(f"Skipped: directory not found\n")
                    continue
                
                # Get size before merge
                size_before = get_directory_size(secondary)
                
                # Perform merge
                result = merge_directory(secondary, primary, dry_run=dry_run, log_file=log_file)
                
                if result['status'] == 'completed':
                    stats = result['stats']
                    total_stats['total_files_copied'] += stats['files_copied']
                    total_stats['total_bytes_copied'] += stats['bytes_copied']
                    
                    print(f"    ✓ {'Would copy' if dry_run else 'Copied'} {stats['files_copied']} files "
                          f"({stats['bytes_copied'] / (1024*1024):.2f} MB)")
                    
                    if not dry_run and stats['files_copied'] > 0:
                        # After successful merge, optionally remove source
                        print(f"    💡 Note: Source directory still exists. Remove manually if merge successful.")
                        log_file.write(f"Merge completed. Source directory preserved.\n")
                    
                    total_stats['merges_completed'] += 1
                else:
                    print(f"    ✗ Error: {result.get('reason', 'unknown')}")
                    total_stats['merges_errors'] += 1
            
            total_stats['merges_processed'] += 1
        
        total_stats['total_bytes_copied_mb'] = round(total_stats['total_bytes_copied'] / (1024 * 1024), 2)
        
        log_file.write(f"\n--- Summary ---\n")
        log_file.write(f"Strategies processed: {total_stats['merges_processed']}\n")
        log_file.write(f"Merges completed: {total_stats['merges_completed']}\n")
        log_file.write(f"Merges skipped: {total_stats['merges_skipped']}\n")
        log_file.write(f"Errors: {total_stats['merges_errors']}\n")
        log_file.write(f"Total files copied: {total_stats['total_files_copied']}\n")
        log_file.write(f"Total bytes copied: {total_stats['total_bytes_copied_mb']:.2f} MB\n")
        log_file.write(f"Completed: {datetime.now().isoformat()}\n")
    
    print(f"\n{'='*80}")
    print("SUMMARY")
    print(f"{'='*80}")
    print(f"Strategies processed: {total_stats['merges_processed']}")
    print(f"Merges {'would be completed' if dry_run else 'completed'}: {total_stats['merges_completed']}")
    print(f"Merges skipped: {total_stats['merges_skipped']}")
    print(f"Errors: {total_stats['merges_errors']}")
    print(f"Files {'would be copied' if dry_run else 'copied'}: {total_stats['total_files_copied']}")
    print(f"Data {'would be copied' if dry_run else 'copied'}: {total_stats['total_bytes_copied_mb']:.2f} MB")
    print(f"\nLog file: {log_file_path}")
    
    if not dry_run:
        print("\n⚠️  NOTE: Source directories were preserved.")
        print("   Review the merges and manually remove source directories if satisfied.")
    
    return total_stats, log_file_path

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Execute directory merges from merge plan')
    parser.add_argument('--plan', type=str, help='Path to merge plan JSON file')
    parser.add_argument('--execute', action='store_true', help='Actually merge directories (default is dry-run)')
    
    args = parser.parse_args()
    
    # Find most recent plan if not specified
    if not args.plan:
        plan_dir = "/Users/steven/AVATARARTS/Revenue"
        plan_files = sorted([
            f for f in os.listdir(plan_dir) 
            if f.startswith('merge_plan_') and f.endswith('.json')
        ], reverse=True)
        
        if not plan_files:
            print("Error: No merge plan found. Run deduplication_merge_plan.py first.")
            sys.exit(1)
        
        args.plan = os.path.join(plan_dir, plan_files[0])
        print(f"Using plan: {args.plan}")
    
    if not args.execute:
        print("\n⚠️  DRY RUN MODE - No files will be moved")
        print("   Use --execute flag to actually merge directories\n")
    
    try:
        stats, log_file = execute_merges(args.plan, dry_run=not args.execute)
        
        if not args.execute:
            print("\n💡 To execute for real, run:")
            print(f"   python3 {__file__} --plan {args.plan} --execute")
    except KeyboardInterrupt:
        print("\n\nOperation cancelled by user.")
        sys.exit(1)
    except Exception as e:
        print(f"\n\nError: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)
