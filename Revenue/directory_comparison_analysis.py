#!/usr/bin/env python3
"""
Comprehensive directory comparison, deduplication, and merge analysis tool.
Compares multiple directories, finds duplicates, and generates merge strategies.
"""

import os
import hashlib
import json
from pathlib import Path
from collections import defaultdict
from datetime import datetime
import sys

# All directories to analyze
DIRECTORIES = [
    '/Users/steven/AVATARARTS/00_ACTIVE/CLIENT_PROJECTS/Dr_Adu_GainesvillePFS_SEO_Project/02_Analysis_Research/01_Content_Analysis',
    '/Users/steven/Library/Mobile Documents/com~apple~CloudDocs/Downloads/Dr_Adu_GainesvillePFS_SEO_Project/02_Analysis_Research/01_Content_Analysis',
    '/Users/steven/Library/Mobile Documents/com~apple~CloudDocs/Downloads/Dr_Adu_GainesvillePFS_SEO_Project/03_Content_Development/01_Original_Content',
    '/Users/steven/Downloads/Compressed/Takeout/Drive/tehSiTes/02_Content_Aware_Analysis',
    '/Users/steven/Downloads/Compressed/Takeout/Drive/tehSiTes/02_Content_Aware_Analysis/02_Content_Categories',
    '/Users/steven/Library/Mobile Documents/com~apple~CloudDocs/Downloads/Dr_Adu_GainesvillePFS_SEO_Project/03_Content_Development/02_Enhanced_Content',
    '/Users/steven/AVATARARTS/00_ACTIVE/CONTENT',
    '/Users/steven/pythons/CONTENT',
    '/Users/steven/AVATARARTS/00_ACTIVE/DEVELOPMENT/UTILITIES_TOOLS/content_creation',
    '/Users/steven/AVATARARTS/00_ACTIVE/DEVELOPMENT/AI_TOOLS/content-generation',
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
    '/Users/steven/AVATARARTS/00_ACTIVE/DEVELOPMENT/UTILITIES_TOOLS/cataloging/CONTENT_AWARE_CATALOG/CONTENT',
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
    except (IOError, OSError, PermissionError) as e:
        return None


def get_file_info(filepath):
    """Get file information including size and modification time."""
    try:
        stat = os.stat(filepath)
        return {
            'size': stat.st_size,
            'mtime': stat.st_mtime,
            'path': filepath
        }
    except (OSError, PermissionError):
        return None


def scan_directory(directory):
    """Scan a directory and return all files with their hashes."""
    files = []
    if not os.path.exists(directory):
        return files
    
    try:
        for root, dirs, filenames in os.walk(directory):
            # Skip hidden directories
            dirs[:] = [d for d in dirs if not d.startswith('.')]
            
            for filename in filenames:
                if filename.startswith('.'):
                    continue
                    
                filepath = os.path.join(root, filename)
                try:
                    file_info = get_file_info(filepath)
                    if file_info:
                        file_info['hash'] = calculate_file_hash(filepath)
                        file_info['relative_path'] = os.path.relpath(filepath, directory)
                        files.append(file_info)
                except Exception as e:
                    print(f"Error processing {filepath}: {e}", file=sys.stderr)
    except (PermissionError, OSError) as e:
        print(f"Error accessing {directory}: {e}", file=sys.stderr)
    
    return files


def analyze_directories():
    """Main analysis function."""
    print("=" * 80)
    print("DIRECTORY COMPARISON AND DEDUPLICATION ANALYSIS")
    print("=" * 80)
    print(f"Analyzing {len(DIRECTORIES)} directories...\n")
    
    # Step 1: Verify directories and get basic stats
    existing_dirs = []
    missing_dirs = []
    
    for directory in DIRECTORIES:
        if os.path.exists(directory):
            existing_dirs.append(directory)
        else:
            missing_dirs.append(directory)
    
    print(f"Found: {len(existing_dirs)}/{len(DIRECTORIES)} directories exist\n")
    
    if missing_dirs:
        print("Missing directories:")
        for d in missing_dirs:
            print(f"  ✗ {d}")
        print()
    
    # Step 2: Scan all directories
    print("Scanning directories for files...")
    all_files = []
    dir_file_map = {}
    
    for directory in existing_dirs:
        print(f"  Scanning: {directory[:80]}...")
        files = scan_directory(directory)
        dir_file_map[directory] = files
        all_files.extend([(directory, f) for f in files])
        print(f"    Found {len(files)} files")
    
    print(f"\nTotal files found: {len(all_files)}\n")
    
    # Step 3: Find duplicates by hash
    print("Finding duplicate files by content hash...")
    hash_to_files = defaultdict(list)
    
    for directory, file_info in all_files:
        if file_info.get('hash'):
            hash_to_files[file_info['hash']].append((directory, file_info))
    
    duplicates = {h: files for h, files in hash_to_files.items() if len(files) > 1}
    
    print(f"Found {len(duplicates)} sets of duplicate files\n")
    
    # Step 4: Find duplicates by name
    print("Finding duplicate files by name...")
    name_to_files = defaultdict(list)
    
    for directory, file_info in all_files:
        filename = os.path.basename(file_info['relative_path'])
        name_to_files[filename].append((directory, file_info))
    
    name_duplicates = {name: files for name, files in name_to_files.items() if len(files) > 1}
    
    print(f"Found {len(name_duplicates)} files with duplicate names\n")
    
    # Step 5: Generate report
    report = {
        'timestamp': datetime.now().isoformat(),
        'directories_analyzed': len(existing_dirs),
        'directories_missing': len(missing_dirs),
        'total_files': len(all_files),
        'duplicate_sets_by_hash': len(duplicates),
        'duplicate_files_by_name': len(name_duplicates),
        'directory_stats': {},
        'duplicates_by_hash': {},
        'duplicates_by_name': {},
        'unique_files_per_directory': {}
    }
    
    # Directory statistics
    for directory, files in dir_file_map.items():
        total_size = sum(f['size'] for f in files if f.get('size'))
        report['directory_stats'][directory] = {
            'file_count': len(files),
            'total_size_bytes': total_size,
            'total_size_mb': round(total_size / (1024 * 1024), 2)
        }
    
    # Duplicate details
    for hash_val, files in list(duplicates.items())[:100]:  # Limit to first 100 for report
        report['duplicates_by_hash'][hash_val] = [
            {
                'directory': d,
                'relative_path': f['relative_path'],
                'size': f['size'],
                'mtime': datetime.fromtimestamp(f['mtime']).isoformat()
            }
            for d, f in files
        ]
    
    # Name duplicates
    for name, files in list(name_duplicates.items())[:100]:  # Limit to first 100
        report['duplicates_by_name'][name] = [
            {
                'directory': d,
                'relative_path': f['relative_path'],
                'size': f['size'],
                'hash': f.get('hash', 'N/A')
            }
            for d, f in files
        ]
    
    # Unique files per directory
    for directory, files in dir_file_map.items():
        unique_hashes = set(f.get('hash') for f in files if f.get('hash'))
        report['unique_files_per_directory'][directory] = len(unique_hashes)
    
    # Save JSON report
    report_file = f"/Users/steven/AVATARARTS/Revenue/directory_comparison_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(report_file, 'w') as f:
        json.dump(report, f, indent=2)
    
    print(f"\nReport saved to: {report_file}\n")
    
    # Print summary
    print("=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print(f"Directories analyzed: {len(existing_dirs)}")
    print(f"Total files: {len(all_files):,}")
    print(f"Duplicate sets (by content): {len(duplicates)}")
    print(f"Files with duplicate names: {len(name_duplicates)}")
    print("\nDirectory Statistics:")
    for directory, stats in sorted(report['directory_stats'].items(), key=lambda x: x[1]['file_count'], reverse=True):
        print(f"  {stats['file_count']:5d} files ({stats['total_size_mb']:8.2f} MB) - {directory[:70]}")
    
    # Show top duplicates
    if duplicates:
        print("\nTop 10 Duplicate Sets (by number of copies):")
        sorted_dups = sorted(duplicates.items(), key=lambda x: len(x[1]), reverse=True)[:10]
        for i, (hash_val, files) in enumerate(sorted_dups, 1):
            print(f"\n  {i}. Found {len(files)} copies:")
            for directory, file_info in files[:3]:  # Show first 3
                print(f"     - {file_info['relative_path']}")
                print(f"       in {directory[:70]}")
            if len(files) > 3:
                print(f"     ... and {len(files) - 3} more")
    
    return report_file


if __name__ == "__main__":
    try:
        report_file = analyze_directories()
        print(f"\n✓ Analysis complete! Full report: {report_file}")
    except KeyboardInterrupt:
        print("\n\nAnalysis interrupted by user.")
        sys.exit(1)
    except Exception as e:
        print(f"\n\nError during analysis: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)
