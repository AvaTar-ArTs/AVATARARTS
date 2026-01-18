#!/usr/bin/env python3
"""
Deep Dive Analysis Script
Performs unlimited depth analysis of a directory, excluding system directories
"""

import os
import csv
import time
import json
from pathlib import Path
from datetime import datetime
import mimetypes


def should_exclude(path):
    """Check if a path should be excluded from analysis (system directories)"""
    exclude_patterns = [
        '.git',
        '__pycache__',
        '.DS_Store',
        '$RECYCLE.BIN',
        'System Volume Information',
        '.Spotlight-V100',
        '.Trashes',
        'node_modules',
        '.vscode',
        '.idea',
        '.svn',
        '.hg',
        'Thumbs.db',
        '.nfs',
        '*.tmp',
        '*.temp'
    ]
    
    path_parts = str(path).split(os.sep)
    for part in path_parts:
        if part in exclude_patterns or part.startswith('.'):
            # Allow some dot directories that are important for your projects
            if part in ['.claude', '.cursor', '.qwen', '.config', '.history', '.aider']:
                continue
            return True
    return False


def get_file_category(file_path):
    """Categorize files based on extension"""
    ext = file_path.suffix.lower()
    
    if ext in ['.py', '.js', '.ts', '.java', '.cpp', '.c', '.h', '.rb', '.go', '.rs']:
        return 'code'
    elif ext in ['.md', '.txt', '.rst', '.tex']:
        return 'documentation'
    elif ext in ['.json', '.yaml', '.yml', '.xml', '.csv', '.tsv']:
        return 'data'
    elif ext in ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp']:
        return 'image'
    elif ext in ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv']:
        return 'video'
    elif ext in ['.mp3', '.wav', '.flac', '.aac', '.ogg']:
        return 'audio'
    elif ext in ['.zip', '.tar', '.gz', '.rar', '.7z', '.bz2']:
        return 'archive'
    elif ext in ['.pdf', '.doc', '.docx', '.ppt', '.pptx']:
        return 'document'
    elif ext in ['.env', '.config', '.conf', '.ini']:
        return 'configuration'
    else:
        return 'other'


def analyze_directory(root_path, max_depth=None):
    """Analyze directory structure to unlimited depth, excluding system directories"""
    results = []
    
    def walk_with_depth(path, current_depth=0):
        if max_depth is not None and current_depth > max_depth:
            return
            
        if should_exclude(path):
            return
            
        try:
            if path.is_dir():
                # Process directory
                stat = path.stat()
                results.append({
                    'path': str(path),
                    'type': 'directory',
                    'size': 0,  # Will be calculated later
                    'modified': datetime.fromtimestamp(stat.st_mtime).strftime('%Y-%m-%d %H:%M:%S'),
                    'category': 'directory',
                    'depth': current_depth
                })
                
                # Process children
                for child in path.iterdir():
                    walk_with_depth(child, current_depth + 1)
            else:
                # Process file
                stat = path.stat()
                
                results.append({
                    'path': str(path),
                    'type': 'file',
                    'size': stat.st_size,
                    'modified': datetime.fromtimestamp(stat.st_mtime).strftime('%Y-%m-%d %H:%M:%S'),
                    'category': get_file_category(path),
                    'depth': current_depth
                })
        except (PermissionError, OSError):
            # Skip files/directories we don't have permission to access
            pass
    
    walk_with_depth(Path(root_path))
    return results


def calculate_directory_sizes(results):
    """Calculate actual sizes for directories based on their contents"""
    # Create a mapping of directory paths to their contents
    dir_contents = {}
    
    for item in results:
        parent_dir = os.path.dirname(item['path'])
        if parent_dir not in dir_contents:
            dir_contents[parent_dir] = []
        dir_contents[parent_dir].append(item)
    
    # Update directory sizes
    for item in results:
        if item['type'] == 'directory':
            total_size = 0
            stack = [item['path']]  # Use stack for recursive calculation
            
            while stack:
                current_path = stack.pop()
                if current_path in dir_contents:
                    for child in dir_contents[current_path]:
                        if child['type'] == 'file':
                            total_size += child['size']
                        elif child['type'] == 'directory':
                            stack.append(child['path'])
            
            item['size'] = total_size
    
    return results


def format_size(size_bytes):
    """Convert bytes to human readable format"""
    if size_bytes == 0:
        return "0B"
    
    size = float(size_bytes)
    for unit in ['B', 'K', 'M', 'G', 'T', 'P']:
        if size < 1024.0:
            return f"{size:.2f}{unit}"
        size /= 1024.0
    return f"{size_bytes}B"


def generate_report(results):
    """Generate a detailed analysis report"""
    total_files = sum(1 for r in results if r['type'] == 'file')
    total_dirs = sum(1 for r in results if r['type'] == 'directory')
    total_size = sum(r['size'] for r in results if r['type'] == 'file')
    
    categories = {}
    for r in results:
        cat = r['category']
        if cat not in categories:
            categories[cat] = {'count': 0, 'size': 0}
        categories[cat]['count'] += 1
        categories[cat]['size'] += r['size']
    
    # Find largest files/directories
    largest_items = sorted(results, key=lambda x: x['size'], reverse=True)[:20]
    
    # Find deepest directories
    deepest_items = sorted(results, key=lambda x: x['depth'], reverse=True)[:20]
    
    report = {
        'summary': {
            'total_files': total_files,
            'total_directories': total_dirs,
            'total_size_bytes': total_size,
            'total_size_formatted': format_size(total_size),
            'unique_categories': len(categories)
        },
        'categories': categories,
        'largest_items': largest_items,
        'deepest_items': deepest_items
    }
    
    return report


def save_csv(results, filename):
    """Save results to CSV file"""
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['path', 'type', 'size_bytes', 'size_formatted', 'modified', 'category', 'depth']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        
        writer.writeheader()
        for result in results:
            row = result.copy()
            row['size_formatted'] = format_size(result['size'])
            row['size_bytes'] = result['size']
            del row['size']  # Remove the original size field
            writer.writerow(row)


def save_report(report, filename):
    """Save report to JSON file"""
    with open(filename, 'w') as f:
        json.dump(report, f, indent=2)


if __name__ == "__main__":
    print("Starting deep dive analysis...")
    
    # Analyze the home directory
    home_dir = Path.home()
    print(f"Analyzing: {home_dir}")
    
    results = analyze_directory(home_dir)
    print(f"Found {len(results)} items")
    
    # Calculate actual directory sizes
    print("Calculating directory sizes...")
    results_with_sizes = calculate_directory_sizes(results)
    
    # Generate report
    print("Generating report...")
    report = generate_report(results_with_sizes)
    
    # Save results
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    csv_filename = f"~/deep_dive_analysis_{timestamp}.csv"
    report_filename = f"~/deep_dive_analysis_{timestamp}.json"
    
    csv_path = Path(csv_filename).expanduser()
    report_path = Path(report_filename).expanduser()
    
    save_csv(results_with_sizes, csv_path)
    save_report(report, report_path)
    
    print(f"Analysis complete!")
    print(f"CSV output saved to: {csv_path}")
    print(f"JSON report saved to: {report_path}")
    
    print("\nSummary:")
    print(f"  Total files: {report['summary']['total_files']}")
    print(f"  Total directories: {report['summary']['total_directories']}")
    print(f"  Total size: {report['summary']['total_size_formatted']}")
    print(f"  Unique categories: {report['summary']['unique_categories']}")
    
    print("\nTop 5 largest items:")
    for item in report['largest_items'][:5]:
        print(f"  {format_size(item['size'])} - {item['category']} - {item['path']}")