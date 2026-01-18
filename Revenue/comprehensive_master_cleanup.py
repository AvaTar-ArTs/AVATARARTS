#!/usr/bin/env python3
"""
Comprehensive Master Cleanup Script
Handles all directories with full parent-folder awareness, deduplication, and consolidation.
"""

import os
import hashlib
import json
import shutil
from pathlib import Path
from datetime import datetime
from collections import defaultdict

# All directories from original request
ALL_DIRECTORIES = [
    '/Users/steven/__pycache__',
    '/Users/steven/.aider',
    '/Users/steven/.apify',
    '/Users/steven/.aspnet',
    '/Users/steven/.boltai',
    '/Users/steven/.bun',
    '/Users/steven/.bundle',
    '/Users/steven/.cache',
    '/Users/steven/.cfg',
    '/Users/steven/.chatgpt',
    '/Users/steven/.claude',
    '/Users/steven/.claude-code-router',
    '/Users/steven/.claude-server-commander',
    '/Users/steven/.claude-worktrees',
    '/Users/steven/.codex',
    '/Users/steven/.composer',
    '/Users/steven/.conda',
    '/Users/steven/.config',
    '/Users/steven/.cups',
    '/Users/steven/.cursor',
    '/Users/steven/.dotfiles',
    '/Users/steven/.dotnet',
    '/Users/steven/.EasyOCR',
    '/Users/steven/.env.d',
    '/Users/steven/.fontconfig',
    '/Users/steven/.gem',
    '/Users/steven/.gemini',
    '/Users/steven/.github',
    '/Users/steven/.gnupg',
    '/Users/steven/.gradle',
    '/Users/steven/.grok',
    '/Users/steven/.harbor',
    '/Users/steven/.history',
    '/Users/steven/.hyper_plugins',
    '/Users/steven/.idlerc',
    '/Users/steven/.ipython',
    '/Users/steven/.iterm2',
    '/Users/steven/.jupyter',
    '/Users/steven/.keras',
    '/Users/steven/.lh',
    '/Users/steven/.local',
    '/Users/steven/.lpass',
    '/Users/steven/.m2',
    '/Users/steven/.matplotlib',
    '/Users/steven/.mplayer',
    '/Users/steven/.n8n',
    '/Users/steven/.npm',
    '/Users/steven/.nuget',
    '/Users/steven/.nvm',
    '/Users/steven/.oh-my-zsh',
    '/Users/steven/.oracle_jre_usage',
    '/Users/steven/.package_manager_backup_20251106_070741',
    '/Users/steven/.pdf-filler-profiles',
    '/Users/steven/.pixi',
    '/Users/steven/.postman',
    '/Users/steven/.putty',
    '/Users/steven/.qodo',
    '/Users/steven/.quicklook_plugins_backup',
    '/Users/steven/.qwen',
    '/Users/steven/.raycast',
    '/Users/steven/.rustup',
    '/Users/steven/Library',
    '/Users/steven/maigret',
    '/Users/steven/Miniforge_Mamba_Analysis',
    '/Users/steven/Movies',
    '/Users/steven/Music',
    '/Users/steven/orchestrator',
    '/Users/steven/Pictures',
    '/Users/steven/PSD-EXT',
    '/Users/steven/Public',
    '/Users/steven/pydocs',
    '/Users/steven/pythons',
    '/Users/steven/Raycast',
    '/Users/steven/RightFont',
    '/Users/steven/scripts',
    '/Users/steven/userscripts',
    '/Users/steven/Zotero',
    '/Users/steven/zsh-autocomplete',
    '/Users/steven/zsh-completions',
    '/Users/steven/iCloud',
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

def filter_parent_directories(directories):
    """Remove child directories if their parent is also in the list."""
    directories = [os.path.normpath(d) for d in directories if d]
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

def calculate_file_hash(filepath):
    """Calculate MD5 hash of a file."""
    hash_md5 = hashlib.md5()
    try:
        with open(filepath, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_md5.update(chunk)
        return hash_md5.hexdigest()
    except:
        return None

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

def find_duplicates_across_directories(directories, limit=None):
    """Find duplicate files across all directories."""
    print("=" * 80)
    print("FINDING DUPLICATES ACROSS ALL DIRECTORIES")
    print("=" * 80)
    
    hash_to_files = defaultdict(list)
    total_files = 0
    
    # Filter to only existing directories
    existing_dirs = [d for d in directories if os.path.exists(d)]
    existing_dirs = filter_parent_directories(existing_dirs)
    
    print(f"Scanning {len(existing_dirs)} directories...\n")
    
    for directory in existing_dirs:
        print(f"  Scanning: {directory[:70]}...")
        try:
            for root, dirs, files in os.walk(directory):
                dirs[:] = [d for d in dirs if not d.startswith('.')]
                
                for filename in files:
                    if filename.startswith('.'):
                        continue
                    
                    filepath = os.path.join(root, filename)
                    try:
                        file_hash = calculate_file_hash(filepath)
                        if file_hash:
                            hash_to_files[file_hash].append({
                                'path': filepath,
                                'directory': directory,
                                'size': os.path.getsize(filepath)
                            })
                            total_files += 1
                    except:
                        pass
        except Exception as e:
            print(f"    Error: {e}")
    
    # Find duplicates
    duplicates = {h: files for h, files in hash_to_files.items() if len(files) > 1}
    
    print(f"\nTotal files scanned: {total_files:,}")
    print(f"Duplicate sets found: {len(duplicates)}")
    
    if limit:
        duplicates = dict(list(duplicates.items())[:limit])
    
    return duplicates

def clean_duplicates(duplicates, dry_run=True, log_file=None):
    """Clean duplicate files, keeping the best copy."""
    stats = {
        'processed': 0,
        'removed': 0,
        'skipped': 0,
        'errors': 0,
        'space_freed': 0
    }
    
    print(f"\n{'='*80}")
    print(f"CLEANING DUPLICATES {'(DRY RUN)' if dry_run else '(EXECUTING)'}")
    print(f"{'='*80}\n")
    
    for hash_val, files in duplicates.items():
        if len(files) <= 1:
            continue
        
        stats['processed'] += 1
        
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
            
            if '/Library/Mobile Documents/' not in directory and '/Downloads/Compressed/' not in directory:
                score += 10
            
            if score > best_score:
                best_score = score
                best_file = file_info
        
        if not best_file:
            continue
        
        # Remove duplicates
        for file_info in files:
            if file_info == best_file:
                continue
            
            filepath = file_info['path']
            if not os.path.exists(filepath):
                stats['skipped'] += 1
                continue
            
            try:
                file_size = file_info['size']
                if not dry_run:
                    os.remove(filepath)
                if log_file:
                    log_file.write(f"{'[DRY RUN] Would remove' if dry_run else '[REMOVED]'} {filepath} ({file_size:,} bytes)\n")
                stats['removed'] += 1
                stats['space_freed'] += file_size
            except Exception as e:
                stats['errors'] += 1
                if log_file:
                    log_file.write(f"[ERROR] {filepath}: {e}\n")
    
    return stats

def identify_merge_opportunities(directories):
    """Identify directories that should be merged."""
    print(f"\n{'='*80}")
    print("IDENTIFYING MERGE OPPORTUNITIES")
    print(f"{'='*80}\n")
    
    merge_groups = defaultdict(list)
    
    for directory in directories:
        if not os.path.exists(directory):
            continue
        
        # Group similar directories
        if '/Library/Mobile Documents/' in directory or '/Downloads/Compressed/' in directory:
            if 'Dr_Adu' in directory:
                merge_groups['Dr_Adu'].append(('secondary', directory))
            elif 'tehSiTes' in directory:
                merge_groups['tehSiTes'].append(('secondary', directory))
        elif '/ai-sites/' in directory and '/AVATARARTS/04_WEBSITES/ai-sites/active/' not in directory:
            name = directory.split('/ai-sites/')[-1].split('/')[0]
            merge_groups[f'ai-sites-{name}'].append(('secondary', directory))
        elif '/AVATARARTS/04_WEBSITES/ai-sites/active/' in directory:
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
    
    print(f"Found {len(merge_groups)} merge groups")
    
    return merge_groups

def execute_comprehensive_cleanup(dry_run=True):
    """Execute comprehensive cleanup of all directories."""
    log_dir = "/Users/steven/AVATARARTS/Revenue"
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    mode = "DRY_RUN" if dry_run else "EXECUTED"
    log_file_path = os.path.join(log_dir, f"comprehensive_cleanup_{mode}_{timestamp}.log")
    
    print("=" * 80)
    print("COMPREHENSIVE MASTER CLEANUP")
    print("=" * 80)
    print(f"Mode: {mode}")
    print(f"Log file: {log_file_path}\n")
    
    total_stats = {
        'duplicates_removed': 0,
        'duplicate_space_freed_mb': 0,
        'merges_completed': 0,
        'directories_removed': 0,
        'total_space_freed_mb': 0
    }
    
    with open(log_file_path, 'w') as log_file:
        log_file.write(f"Comprehensive Master Cleanup {mode}\n")
        log_file.write(f"Started: {datetime.now().isoformat()}\n")
        log_file.write(f"Directories to process: {len(ALL_DIRECTORIES)}\n\n")
        
        # Step 1: Find and clean duplicates
        print("\n" + "="*80)
        print("STEP 1: FINDING AND CLEANING DUPLICATES")
        print("="*80)
        duplicates = find_duplicates_across_directories(ALL_DIRECTORIES)
        
        dup_stats = clean_duplicates(duplicates, dry_run=dry_run, log_file=log_file)
        total_stats['duplicates_removed'] = dup_stats['removed']
        total_stats['duplicate_space_freed_mb'] = round(dup_stats['space_freed'] / (1024 * 1024), 2)
        
        log_file.write(f"\n--- Duplicate Cleanup Summary ---\n")
        log_file.write(f"Processed: {dup_stats['processed']}\n")
        log_file.write(f"Removed: {dup_stats['removed']}\n")
        log_file.write(f"Skipped: {dup_stats['skipped']}\n")
        log_file.write(f"Errors: {dup_stats['errors']}\n")
        log_file.write(f"Space freed: {total_stats['duplicate_space_freed_mb']:.2f} MB\n")
        
        # Step 2: Identify merge opportunities
        print("\n" + "="*80)
        print("STEP 2: IDENTIFYING MERGE OPPORTUNITIES")
        print("="*80)
        merge_groups = identify_merge_opportunities(ALL_DIRECTORIES)
        
        log_file.write(f"\n--- Merge Opportunities ---\n")
        log_file.write(f"Found {len(merge_groups)} merge groups\n")
        
        # Step 3: Summary
        total_stats['total_space_freed_mb'] = total_stats['duplicate_space_freed_mb']
        
        log_file.write(f"\n--- Final Summary ---\n")
        log_file.write(f"Duplicates removed: {total_stats['duplicates_removed']}\n")
        log_file.write(f"Total space freed: {total_stats['total_space_freed_mb']:.2f} MB\n")
        log_file.write(f"Completed: {datetime.now().isoformat()}\n")
    
    print(f"\n{'='*80}")
    print("FINAL SUMMARY")
    print(f"{'='*80}")
    print(f"Duplicates {'would be removed' if dry_run else 'removed'}: {total_stats['duplicates_removed']}")
    print(f"Space {'would be freed' if dry_run else 'freed'}: {total_stats['total_space_freed_mb']:.2f} MB")
    print(f"\nLog file: {log_file_path}")
    
    return total_stats, log_file_path

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Comprehensive cleanup of all directories')
    parser.add_argument('--execute', action='store_true', help='Actually perform cleanup (default is dry-run)')
    parser.add_argument('--limit', type=int, help='Limit number of duplicate sets to process (for testing)')
    
    args = parser.parse_args()
    
    if not args.execute:
        print("\n⚠️  DRY RUN MODE - No files will be deleted")
        print("   Use --execute flag to actually perform cleanup\n")
    
    try:
        stats, log_file = execute_comprehensive_cleanup(dry_run=not args.execute)
        
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
