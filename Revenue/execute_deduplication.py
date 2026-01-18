#!/usr/bin/env python3
"""
Safe Deduplication Executor
Removes duplicate files based on the merge plan, keeping the best copy.
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

def verify_file_exists(filepath):
    """Verify a file exists and is readable."""
    return os.path.exists(filepath) and os.path.isfile(filepath)

def safe_remove_file(filepath, dry_run=True, log_file=None):
    """Safely remove a file with logging."""
    if not verify_file_exists(filepath):
        return {'status': 'skipped', 'reason': 'file_not_found'}
    
    try:
        file_size = os.path.getsize(filepath)
        
        if dry_run:
            if log_file:
                log_file.write(f"[DRY RUN] Would remove: {filepath} ({file_size:,} bytes)\n")
            return {'status': 'dry_run', 'size': file_size}
        else:
            # Move to trash or remove
            os.remove(filepath)
            if log_file:
                log_file.write(f"[REMOVED] {filepath} ({file_size:,} bytes)\n")
            return {'status': 'removed', 'size': file_size}
    except PermissionError:
        return {'status': 'error', 'reason': 'permission_denied'}
    except Exception as e:
        return {'status': 'error', 'reason': str(e)}

def execute_deduplication(plan_file, dry_run=True, limit=None):
    """Execute deduplication based on merge plan."""
    plan = load_merge_plan(plan_file)
    
    log_dir = os.path.dirname(plan_file)
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    mode = "DRY_RUN" if dry_run else "EXECUTED"
    log_file_path = os.path.join(log_dir, f"deduplication_{mode}_{timestamp}.log")
    
    stats = {
        'total_actions': 0,
        'files_removed': 0,
        'files_skipped': 0,
        'errors': 0,
        'space_freed_bytes': 0,
        'space_freed_mb': 0
    }
    
    actions = plan['deduplication_actions']
    if limit:
        actions = actions[:limit]
    
    print(f"\n{'='*80}")
    print(f"DEDUPLICATION {'(DRY RUN)' if dry_run else '(EXECUTING)'}")
    print(f"{'='*80}")
    print(f"Processing {len(actions)} duplicate sets...")
    print(f"Log file: {log_file_path}\n")
    
    with open(log_file_path, 'w') as log_file:
        log_file.write(f"Deduplication {mode}\n")
        log_file.write(f"Started: {datetime.now().isoformat()}\n")
        log_file.write(f"Total actions: {len(actions)}\n\n")
        
        for i, action in enumerate(actions, 1):
            print(f"[{i}/{len(actions)}] Processing: {os.path.basename(action['keep']['relative_path'])}")
            
            # Verify keep file exists
            keep_path = action['keep']['full_path']
            if not verify_file_exists(keep_path):
                print(f"  ⚠️  WARNING: Keep file not found: {keep_path}")
                log_file.write(f"WARNING: Keep file not found: {keep_path}\n")
                stats['errors'] += 1
                continue
            
            log_file.write(f"\n--- Action {i} ---\n")
            log_file.write(f"Keep: {keep_path}\n")
            log_file.write(f"File size: {action['file_size_mb']:.2f} MB\n")
            log_file.write(f"Remove {len(action['remove'])} duplicate(s):\n")
            
            # Remove duplicates
            for dup in action['remove']:
                dup_path = dup['full_path']
                result = safe_remove_file(dup_path, dry_run=dry_run, log_file=log_file)
                
                if result['status'] == 'removed' or result['status'] == 'dry_run':
                    stats['files_removed'] += 1
                    stats['space_freed_bytes'] += result.get('size', 0)
                    print(f"  ✓ {'Would remove' if dry_run else 'Removed'}: {os.path.basename(dup_path)}")
                elif result['status'] == 'skipped':
                    stats['files_skipped'] += 1
                    print(f"  ⊘ Skipped ({result['reason']}): {os.path.basename(dup_path)}")
                else:
                    stats['errors'] += 1
                    print(f"  ✗ Error ({result.get('reason', 'unknown')}): {os.path.basename(dup_path)}")
            
            stats['total_actions'] += 1
        
        stats['space_freed_mb'] = round(stats['space_freed_bytes'] / (1024 * 1024), 2)
        
        log_file.write(f"\n--- Summary ---\n")
        log_file.write(f"Total actions: {stats['total_actions']}\n")
        log_file.write(f"Files removed: {stats['files_removed']}\n")
        log_file.write(f"Files skipped: {stats['files_skipped']}\n")
        log_file.write(f"Errors: {stats['errors']}\n")
        log_file.write(f"Space freed: {stats['space_freed_mb']:.2f} MB\n")
        log_file.write(f"Completed: {datetime.now().isoformat()}\n")
    
    print(f"\n{'='*80}")
    print("SUMMARY")
    print(f"{'='*80}")
    print(f"Total actions processed: {stats['total_actions']}")
    print(f"Files {'would be removed' if dry_run else 'removed'}: {stats['files_removed']}")
    print(f"Files skipped: {stats['files_skipped']}")
    print(f"Errors: {stats['errors']}")
    print(f"Space {'would be freed' if dry_run else 'freed'}: {stats['space_freed_mb']:.2f} MB")
    print(f"\nLog file: {log_file_path}")
    
    return stats, log_file_path

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Execute deduplication from merge plan')
    parser.add_argument('--plan', type=str, help='Path to merge plan JSON file')
    parser.add_argument('--execute', action='store_true', help='Actually remove files (default is dry-run)')
    parser.add_argument('--limit', type=int, help='Limit number of actions to process (for testing)')
    
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
        print("\n⚠️  DRY RUN MODE - No files will be deleted")
        print("   Use --execute flag to actually remove files\n")
    
    try:
        stats, log_file = execute_deduplication(args.plan, dry_run=not args.execute, limit=args.limit)
        
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
