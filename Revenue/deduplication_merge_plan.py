#!/usr/bin/env python3
"""
Deduplication and Merge Plan Generator
Creates actionable plans for merging and deduplicating directories.
"""

import json
import os
from pathlib import Path
from collections import defaultdict
from datetime import datetime

def load_report(report_file):
    """Load the comparison report."""
    with open(report_file, 'r') as f:
        return json.load(f)

def generate_merge_plan(report_file):
    """Generate a detailed merge and deduplication plan."""
    report = load_report(report_file)
    
    plan = {
        'timestamp': datetime.now().isoformat(),
        'summary': {
            'total_files': report['total_files'],
            'duplicate_sets': report['duplicate_sets_by_hash'],
            'potential_space_savings_mb': 0
        },
        'recommendations': [],
        'merge_strategies': [],
        'deduplication_actions': []
    }
    
    # Analyze duplicates and create deduplication plan
    total_duplicate_size = 0
    for hash_val, files in report['duplicates_by_hash'].items():
        if len(files) > 1:
            # Calculate space that could be saved (keep one, remove others)
            file_size = files[0]['size']
            duplicate_size = file_size * (len(files) - 1)
            total_duplicate_size += duplicate_size
            
            # Find the "best" file to keep (most recent, or in primary directory)
            primary_dirs = [
                '/Users/steven/AVATARARTS/00_ACTIVE/CONTENT',
                '/Users/steven/AVATARARTS/00_ACTIVE/CLIENT_PROJECTS',
            ]
            
            best_file = None
            best_score = -1
            
            for file_info in files:
                score = 0
                directory = file_info['directory']
                
                # Prefer files in primary directories
                if any(primary in directory for primary in primary_dirs):
                    score += 100
                
                # Prefer more recent files
                mtime = datetime.fromisoformat(file_info['mtime'])
                score += mtime.timestamp() / 1000000  # Normalize timestamp
                
                if score > best_score:
                    best_score = score
                    best_file = file_info
            
            # Create deduplication action
            action = {
                'hash': hash_val,
                'file_size_bytes': file_size,
                'file_size_mb': round(file_size / (1024 * 1024), 4),
                'copies': len(files),
                'keep': {
                    'directory': best_file['directory'],
                    'relative_path': best_file['relative_path'],
                    'full_path': os.path.join(best_file['directory'], best_file['relative_path'])
                },
                'remove': [
                    {
                        'directory': f['directory'],
                        'relative_path': f['relative_path'],
                        'full_path': os.path.join(f['directory'], f['relative_path']),
                        'size_bytes': f['size']
                    }
                    for f in files if f != best_file
                ],
                'space_savings_bytes': duplicate_size,
                'space_savings_mb': round(duplicate_size / (1024 * 1024), 4)
            }
            
            plan['deduplication_actions'].append(action)
    
    plan['summary']['potential_space_savings_mb'] = round(total_duplicate_size / (1024 * 1024), 2)
    
    # Sort by space savings
    plan['deduplication_actions'].sort(key=lambda x: x['space_savings_bytes'], reverse=True)
    
    # Generate merge strategies based on directory relationships
    dir_groups = defaultdict(list)
    for directory in report['directory_stats'].keys():
        # Group similar directories
        if 'ai-content-studio' in directory:
            dir_groups['ai-content-studio'].append(directory)
        elif 'content-management' in directory:
            dir_groups['content-management'].append(directory)
        elif 'retention-products-suite' in directory:
            dir_groups['retention-products-suite'].append(directory)
        elif 'seo-optimized-content' in directory:
            dir_groups['seo-optimized-content'].append(directory)
        elif 'steven-chaplinski-website' in directory:
            dir_groups['steven-chaplinski-website'].append(directory)
        elif 'avatararts.org' in directory:
            dir_groups['avatararts.org'].append(directory)
        elif 'Dr_Adu_GainesvillePFS_SEO_Project' in directory:
            dir_groups['Dr_Adu_GainesvillePFS_SEO_Project'].append(directory)
    
    for group_name, directories in dir_groups.items():
        if len(directories) > 1:
            # Find primary directory (prefer AVATARARTS/00_ACTIVE or 04_WEBSITES)
            primary = None
            for d in directories:
                if '/AVATARARTS/04_WEBSITES/' in d or '/AVATARARTS/00_ACTIVE/' in d:
                    primary = d
                    break
            if not primary:
                primary = directories[0]
            
            merge_strategy = {
                'group_name': group_name,
                'primary_directory': primary,
                'secondary_directories': [d for d in directories if d != primary],
                'recommendation': 'merge',
                'action': f"Merge {len(directories) - 1} secondary directories into primary: {primary}"
            }
            plan['merge_strategies'].append(merge_strategy)
    
    # Generate recommendations
    if plan['summary']['potential_space_savings_mb'] > 100:
        plan['recommendations'].append({
            'priority': 'high',
            'action': 'deduplicate',
            'description': f"High potential space savings: {plan['summary']['potential_space_savings_mb']} MB",
            'impact': 'significant'
        })
    
    if len(plan['merge_strategies']) > 0:
        plan['recommendations'].append({
            'priority': 'medium',
            'action': 'merge_directories',
            'description': f"Found {len(plan['merge_strategies'])} directory groups that should be merged",
            'impact': 'organizational'
        })
    
    return plan

def save_plan(plan, output_file):
    """Save the merge plan to a file."""
    with open(output_file, 'w') as f:
        json.dump(plan, f, indent=2)
    
    # Also create a human-readable report
    report_file = output_file.replace('.json', '_README.md')
    with open(report_file, 'w') as f:
        f.write("# Directory Deduplication and Merge Plan\n\n")
        f.write(f"Generated: {plan['timestamp']}\n\n")
        
        f.write("## Summary\n\n")
        f.write(f"- **Total Files Analyzed**: {plan['summary']['total_files']:,}\n")
        f.write(f"- **Duplicate Sets Found**: {plan['summary']['duplicate_sets']}\n")
        f.write(f"- **Potential Space Savings**: {plan['summary']['potential_space_savings_mb']:.2f} MB\n\n")
        
        f.write("## Recommendations\n\n")
        for i, rec in enumerate(plan['recommendations'], 1):
            f.write(f"### {i}. {rec['action'].upper()} ({rec['priority']} priority)\n")
            f.write(f"{rec['description']}\n\n")
        
        f.write("## Merge Strategies\n\n")
        for strategy in plan['merge_strategies']:
            f.write(f"### {strategy['group_name']}\n")
            f.write(f"- **Primary**: `{strategy['primary_directory']}`\n")
            f.write(f"- **Secondary directories to merge**:\n")
            for d in strategy['secondary_directories']:
                f.write(f"  - `{d}`\n")
            f.write(f"- **Action**: {strategy['action']}\n\n")
        
        f.write("## Top 20 Deduplication Actions (by space savings)\n\n")
        for i, action in enumerate(plan['deduplication_actions'][:20], 1):
            f.write(f"### {i}. Save {action['space_savings_mb']:.2f} MB\n")
            f.write(f"- **Keep**: `{action['keep']['full_path']}`\n")
            f.write(f"- **Remove {len(action['remove'])} duplicate(s)**:\n")
            for dup in action['remove']:
                f.write(f"  - `{dup['full_path']}` ({dup['size_bytes']:,} bytes)\n")
            f.write("\n")
        
        f.write(f"\n## Full Details\n\n")
        f.write(f"See `{os.path.basename(output_file)}` for complete JSON data.\n")
    
    return report_file

if __name__ == "__main__":
    import sys
    
    # Find the most recent report
    report_dir = "/Users/steven/AVATARARTS/Revenue"
    report_files = sorted([
        f for f in os.listdir(report_dir) 
        if f.startswith('directory_comparison_report_') and f.endswith('.json')
    ], reverse=True)
    
    if not report_files:
        print("No comparison report found. Run directory_comparison_analysis.py first.")
        sys.exit(1)
    
    report_file = os.path.join(report_dir, report_files[0])
    print(f"Using report: {report_file}")
    
    plan = generate_merge_plan(report_file)
    
    plan_file = f"/Users/steven/AVATARARTS/Revenue/merge_plan_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    readme_file = save_plan(plan, plan_file)
    
    print(f"\n✓ Merge plan generated!")
    print(f"  JSON: {plan_file}")
    print(f"  README: {readme_file}")
    print(f"\nSummary:")
    print(f"  - Potential space savings: {plan['summary']['potential_space_savings_mb']:.2f} MB")
    print(f"  - Merge strategies: {len(plan['merge_strategies'])}")
    print(f"  - Deduplication actions: {len(plan['deduplication_actions'])}")
