#!/usr/bin/env python3
"""
Comprehensive Cleanup Script
Handles remaining duplicates and directory consolidation.
"""

import os
import hashlib
import json
import shutil
from pathlib import Path
from datetime import datetime
from collections import defaultdict
import sys

# All directories to process
ALL_DIRECTORIES = [
    '/Users/steven/AVATARARTS/00_ACTIVE/CLIENT_PROJECTS/Dr_Adu_GainesvillePFS_SEO_Project/02_Analysis_Research/01_Content_Analysis',
    '/Users/steven/Library/Mobile Documents/com~apple~CloudDocs/Downloads/Dr_Adu_GainesvillePFS_SEO_Project/02_Analysis_Research/01_Content_Analysis',
    '/Users/steven/Library/Mobile Documents/com~apple~CloudDocs/Downloads/Dr_Adu_GainesvillePFS_SEO_Project/03_Content_Development/01_Original_Content',
    '/Users/steven/Downloads/Compressed/Takeout/Drive/tehSiTes/02_Content_Aware_Analysis',
    '/Users/steven/Downloads/Compressed/Takeout/Drive/tehSiTes/02_Content_Aware_Analysis/02_Content_Categories',
    '/Users/steven/Library/Mobile Documents/com~apple~CloudDocs/Downloads/Dr_Adu_GainesvillePFS_SEO_Project/03_Content_Development/02_Enhanced_Content',
    '/Users/steven/AVATARARTS/00_ACTIVE/CONTENT',
    '/Users/steven/pythons/CONTENT',
    '/Users/steven/AVATARARTS/00_ACTIVE/DEVELOPMENT/UTILITIES_TOOLS/content_creation',
    '/Users/steven/AVATARARTS/00_ACTIVE/DEVELOPMENT/AI_TOOLS/content-generation/AI_CONTENT',
    '/Users/steven/AVATARARTS/Revenue/Trend_Pulse_All_Expansion_Packs/AI_Content_Repurposing',
    '/Users/steven/ai-sites/ai-content-studio',
    '/Users/steven/AVATARARTS/04_WEBSITES/ai-sites/active/ai-content-studio',
    '/Users/steven/AVATARARTS/00_ACTIVE/CONTENT/audio-content',
    '/Users/steven/AVATARARTS/06_SEO_MARKETING/blog-content',
    '/Users/steven/AVATARARTS/00_ACTIVE/BUSINESS/retention-suite-complete/digital-products/educational-content/generated_courses/complete_ai_content_creation_masterclass',
    '/Users/steven/AVATARARTS/07_MISC/content',
    '/Users/steven/avatararts.org/content',
    '/Users/steven/avatararts.org/admin/content',
    '/Users/steven/AVATARARTS/avatararts.org/content',
    '/Users/steven/AVATARARTS/avatararts.org/admin/content',
    '/Users/steven/AVATARARTS/00_ACTIVE/CONTENT/video-content',
    '/Users/steven/AVATARARTS/00_ACTIVE/DEVELOPMENT/UTILITIES_TOOLS/cataloging/CONTENT_AWARE_CATALOG',
    '/Users/steven/ai-sites/steven-chaplinski-website/content/resources/CONTENT_AWARE_CHAT_ANALYSIS',
    '/Users/steven/AVATARARTS/04_WEBSITES/ai-sites/active/steven-chaplinski-website/content/resources/CONTENT_AWARE_CHAT_ANALYSIS',
    '/Users/steven/AVATARARTS/03_ARCHIVES/intelligent-declutter/content-duplicates',
    '/Users/steven/ai-sites/content-management',
    '/Users/steven/AVATARARTS/04_WEBSITES/ai-sites/active/content-management',
    '/Users/steven/AVATARARTS/06_SEO_MARKETING/documentation/aeo-seo/AEO_SEO_Content_Optimization',
    '/Users/steven/ai-sites/retention-products-suite/digital-products/educational-content/generated_courses/complete_ai_content_creation_masterclass',
    '/Users/steven/AVATARARTS/04_WEBSITES/ai-sites/active/retention-products-suite/digital-products/educational-content/generated_courses/complete_ai_content_creation_masterclass',
    '/Users/steven/AVATARARTS/00_ACTIVE/BUSINESS/retention-suite-complete/digital-products/educational-content/generated_courses/complete_ai_content_creation_masterclass',
    '/Users/steven/AVATARARTS/04_WEBSITES/ai-sites/active/seo-optimized-content',
    '/Users/steven/ai-sites/seo-optimized-content',
    '/Users/steven/AVATARARTS/03_ARCHIVES/archive/system/advanced-systems/specialized_systems/ultra_content',
    '/Users/steven/AVATARARTS/00_ACTIVE/CLIENT_PROJECTS/josephrosadomd/wp-content',
    '/Users/steven/Documents/json/YouTube-Content',
]

def calculate_file_hash(filepath):
    """Calculate MD5 hash of a file."""
    hash_md5 = hashlib.md5()
    try:
        with open(filepath, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_md5.update(chunk)
        return hash_md5.hexdigest()
    except (IOError, OSError, PermissionError):
        return None

def find_duplicates_and_merge_opportunities(dry_run=True):
    """Find duplicates and identify merge opportunities."""
    print("=" * 80)
    print("COMPREHENSIVE CLEANUP ANALYSIS")
    print("=" * 80)
    
    # Step 1: Find all files and their hashes
    print("\n1. Scanning directories for files...")
    all_files = []
    hash_to_files = defaultdict(list)
    
    for directory in ALL_DIRECTORIES:
        if not os.path.exists(directory):
            continue
        
        print(f"  Scanning: {directory[:70]}...")
        try:
            for root, dirs, filenames in os.walk(directory):
                dirs[:] = [d for d in dirs if not d.startswith('.')]
                
                for filename in filenames:
                    if filename.startswith('.'):
                        continue
                    
                    filepath = os.path.join(root, filename)
                    try:
                        file_size = os.path.getsize(filepath)
                        file_hash = calculate_file_hash(filepath)
                        
                        if file_hash:
                            file_info = {
                                'path': filepath,
                                'directory': directory,
                                'relative_path': os.path.relpath(filepath, directory),
                                'size': file_size,
                                'hash': file_hash
                            }
                            all_files.append(file_info)
                            hash_to_files[file_hash].append(file_info)
                    except Exception as e:
                        pass
        except Exception as e:
            print(f"    Error: {e}")
    
    print(f"\n  Total files found: {len(all_files)}")
    
    # Step 2: Find duplicates
    print("\n2. Finding duplicate files...")
    duplicates = {h: files for h, files in hash_to_files.items() if len(files) > 1}
    print(f"  Found {len(duplicates)} sets of duplicate files")
    
    # Step 3: Identify merge opportunities
    print("\n3. Identifying merge opportunities...")
    
    # Group directories by similarity
    merge_groups = defaultdict(list)
    
    for directory in ALL_DIRECTORIES:
        if not os.path.exists(directory):
            continue
        
        # Identify primary vs secondary directories
        if '/Library/Mobile Documents/' in directory or '/Downloads/Compressed/' in directory:
            # These are likely secondary/backup locations
            if 'Dr_Adu' in directory:
                merge_groups['Dr_Adu'].append(('secondary', directory))
            elif 'tehSiTes' in directory:
                merge_groups['tehSiTes'].append(('secondary', directory))
        elif '/ai-sites/' in directory and '/AVATARARTS/04_WEBSITES/ai-sites/active/' not in directory:
            # Secondary ai-sites locations
            name = directory.split('/ai-sites/')[-1].split('/')[0]
            merge_groups[f'ai-sites-{name}'].append(('secondary', directory))
        elif '/AVATARARTS/04_WEBSITES/ai-sites/active/' in directory:
            # Primary ai-sites locations
            name = directory.split('/active/')[-1].split('/')[0]
            merge_groups[f'ai-sites-{name}'].append(('primary', directory))
        elif '/AVATARARTS/avatararts.org/' in directory:
            merge_groups['avatararts'].append(('secondary', directory))
        elif '/avatararts.org/' in directory and '/AVATARARTS/' not in directory:
            merge_groups['avatararts'].append(('primary', directory))
        elif 'retention-products-suite' in directory or 'retention-suite-complete' in directory:
            if '/AVATARARTS/04_WEBSITES/' in directory:
                merge_groups['retention-suite'].append(('primary', directory))
            elif '/AVATARARTS/00_ACTIVE/BUSINESS/' in directory:
                merge_groups['retention-suite'].append(('primary', directory))
            else:
                merge_groups['retention-suite'].append(('secondary', directory))
    
    print(f"  Found {len(merge_groups)} merge groups")
    
    # Step 4: Generate cleanup plan
    cleanup_plan = {
        'timestamp': datetime.now().isoformat(),
        'duplicates': [],
        'merge_actions': [],
        'remove_actions': []
    }
    
    # Process duplicates
    for hash_val, files in list(duplicates.items())[:200]:  # Limit for performance
        if len(files) > 1:
            # Find best file to keep (prefer AVATARARTS/00_ACTIVE)
            best_file = None
            best_score = -1
            
            for file_info in files:
                score = 0
                directory = file_info['directory']
                
                if '/AVATARARTS/00_ACTIVE/' in directory:
                    score += 100
                elif '/AVATARARTS/04_WEBSITES/' in directory:
                    score += 50
                elif '/AVATARARTS/' in directory:
                    score += 25
                
                # Prefer non-backup locations
                if '/Library/Mobile Documents/' not in directory and '/Downloads/Compressed/' not in directory:
                    score += 10
                
                if score > best_score:
                    best_score = score
                    best_file = file_info
            
            if best_file:
                cleanup_plan['duplicates'].append({
                    'keep': best_file['path'],
                    'remove': [f['path'] for f in files if f != best_file],
                    'size_bytes': best_file['size']
                })
    
    # Process merge groups
    for group_name, dirs in merge_groups.items():
        primaries = [d for t, d in dirs if t == 'primary']
        secondaries = [d for t, d in dirs if t == 'secondary']
        
        if primaries and secondaries:
            primary = primaries[0]  # Use first primary
            cleanup_plan['merge_actions'].append({
                'group': group_name,
                'primary': primary,
                'secondaries': secondaries
            })
    
    return cleanup_plan, len(duplicates), len(all_files)

def execute_cleanup(cleanup_plan, dry_run=True):
    """Execute the cleanup plan."""
    log_dir = "/Users/steven/AVATARARTS/Revenue"
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    mode = "DRY_RUN" if dry_run else "EXECUTED"
    log_file_path = os.path.join(log_dir, f"cleanup_{mode}_{timestamp}.log")
    
    stats = {
        'duplicates_removed': 0,
        'space_freed_bytes': 0,
        'merges_completed': 0,
        'directories_removed': 0,
        'errors': 0
    }
    
    print(f"\n{'='*80}")
    print(f"CLEANUP {'(DRY RUN)' if dry_run else '(EXECUTING)'}")
    print(f"{'='*80}")
    print(f"Log file: {log_file_path}\n")
    
    with open(log_file_path, 'w') as log_file:
        log_file.write(f"Cleanup {mode}\n")
        log_file.write(f"Started: {datetime.now().isoformat()}\n\n")
        
        # Process duplicates
        print("Processing duplicates...")
        for i, dup in enumerate(cleanup_plan['duplicates'], 1):
            keep_path = dup['keep']
            remove_paths = dup['remove']
            
            if not os.path.exists(keep_path):
                continue
            
            log_file.write(f"\n--- Duplicate Set {i} ---\n")
            log_file.write(f"Keep: {keep_path}\n")
            
            for remove_path in remove_paths:
                if not os.path.exists(remove_path):
                    continue
                
                try:
                    file_size = os.path.getsize(remove_path)
                    if dry_run:
                        log_file.write(f"[DRY RUN] Would remove: {remove_path}\n")
                    else:
                        os.remove(remove_path)
                        log_file.write(f"[REMOVED] {remove_path}\n")
                        stats['duplicates_removed'] += 1
                        stats['space_freed_bytes'] += file_size
                except Exception as e:
                    log_file.write(f"[ERROR] {remove_path}: {e}\n")
                    stats['errors'] += 1
        
        # Process merges
        print("\nProcessing directory merges...")
        for merge in cleanup_plan['merge_actions']:
            primary = merge['primary']
            secondaries = merge['secondaries']
            
            log_file.write(f"\n--- Merge: {merge['group']} ---\n")
            log_file.write(f"Primary: {primary}\n")
            
            if not os.path.exists(primary):
                if not dry_run:
                    os.makedirs(primary, exist_ok=True)
            
            for secondary in secondaries:
                if not os.path.exists(secondary):
                    continue
                
                log_file.write(f"Merging from: {secondary}\n")
                
                files_copied = 0
                try:
                    for root, dirs, files in os.walk(secondary):
                        dirs[:] = [d for d in dirs if not d.startswith('.')]
                        
                        for filename in files:
                            if filename.startswith('.'):
                                continue
                            
                            src = os.path.join(root, filename)
                            rel_path = os.path.relpath(src, secondary)
                            dst = os.path.join(primary, rel_path)
                            
                            if os.path.exists(dst):
                                continue  # Skip if already exists
                            
                            if dry_run:
                                log_file.write(f"[DRY RUN] Would copy: {src} -> {dst}\n")
                                files_copied += 1
                            else:
                                os.makedirs(os.path.dirname(dst), exist_ok=True)
                                shutil.copy2(src, dst)
                                log_file.write(f"[COPIED] {src} -> {dst}\n")
                                files_copied += 1
                    
                    if files_copied > 0:
                        stats['merges_completed'] += 1
                        log_file.write(f"Copied {files_copied} files\n")
                        
                        # Optionally remove secondary directory after merge
                        if not dry_run and files_copied > 0:
                            log_file.write(f"[NOTE] Secondary directory preserved: {secondary}\n")
                            log_file.write(f"       Remove manually if merge successful\n")
                
                except Exception as e:
                    log_file.write(f"[ERROR] {secondary}: {e}\n")
                    stats['errors'] += 1
        
        stats['space_freed_mb'] = round(stats['space_freed_bytes'] / (1024 * 1024), 2)
        
        log_file.write(f"\n--- Summary ---\n")
        log_file.write(f"Duplicates removed: {stats['duplicates_removed']}\n")
        log_file.write(f"Space freed: {stats['space_freed_mb']:.2f} MB\n")
        log_file.write(f"Merges completed: {stats['merges_completed']}\n")
        log_file.write(f"Errors: {stats['errors']}\n")
        log_file.write(f"Completed: {datetime.now().isoformat()}\n")
    
    print(f"\n{'='*80}")
    print("SUMMARY")
    print(f"{'='*80}")
    print(f"Duplicates {'would be removed' if dry_run else 'removed'}: {stats['duplicates_removed']}")
    print(f"Space {'would be freed' if dry_run else 'freed'}: {stats['space_freed_mb']:.2f} MB")
    print(f"Merges {'would be completed' if dry_run else 'completed'}: {stats['merges_completed']}")
    print(f"Errors: {stats['errors']}")
    print(f"\nLog file: {log_file_path}")
    
    return stats, log_file_path

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Comprehensive cleanup of content directories')
    parser.add_argument('--execute', action='store_true', help='Actually perform cleanup (default is dry-run)')
    parser.add_argument('--skip-analysis', action='store_true', help='Skip analysis and use existing plan')
    
    args = parser.parse_args()
    
    if not args.execute:
        print("\n⚠️  DRY RUN MODE - No files will be deleted or moved")
        print("   Use --execute flag to actually perform cleanup\n")
    
    try:
        if not args.skip_analysis:
            cleanup_plan, dup_count, file_count = find_duplicates_and_merge_opportunities(dry_run=not args.execute)
            
            # Save plan
            plan_file = f"/Users/steven/AVATARARTS/Revenue/cleanup_plan_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            with open(plan_file, 'w') as f:
                json.dump(cleanup_plan, f, indent=2)
            print(f"\nCleanup plan saved to: {plan_file}")
        else:
            # Load existing plan
            plan_dir = "/Users/steven/AVATARARTS/Revenue"
            plan_files = sorted([
                f for f in os.listdir(plan_dir) 
                if f.startswith('cleanup_plan_') and f.endswith('.json')
            ], reverse=True)
            
            if not plan_files:
                print("Error: No cleanup plan found. Run without --skip-analysis first.")
                sys.exit(1)
            
            plan_file = os.path.join(plan_dir, plan_files[0])
            with open(plan_file, 'r') as f:
                cleanup_plan = json.load(f)
            print(f"Using existing plan: {plan_file}")
        
        stats, log_file = execute_cleanup(cleanup_plan, dry_run=not args.execute)
        
        if not args.execute:
            print("\n💡 To execute for real, run:")
            print(f"   python3 {__file__} --execute")
    
    except KeyboardInterrupt:
        print("\n\nOperation cancelled by user.")
        sys.exit(1)
    except Exception as e:
        print(f"\n\nError: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)
