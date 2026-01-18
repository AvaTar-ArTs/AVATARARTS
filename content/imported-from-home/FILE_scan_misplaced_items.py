#!/usr/bin/env python3
"""
Scan all directories for misplaced items
Find documentation/, MEDIA_PROCESSING/, analysis files, etc. that should be moved
"""

from pathlib import Path
from collections import defaultdict
import json

def scan_for_misplaced_items(root_dir):
    """Scan all directories for items that should be moved"""
    root = Path(root_dir)
    
    print("🔍 SCANNING FOR MISPLACED ITEMS")
    print("=" * 70)
    
    # Patterns to look for
    target_patterns = {
        'documentation': ['documentation', 'docs', 'doc'],
        'media': ['media_processing', 'media', 'images', 'audio', 'video'],
        'analysis': ['*analysis*.md', '*ANALYSIS*.md', 'CODEBASE*.md', 'INTELLIGENT*.md'],
        'config': ['config', 'configs', 'requirements.txt', 'setup.py', 'pyproject.toml'],
        'data': ['data', 'datasets', 'csv', 'json_data']
    }
    
    findings = defaultdict(list)
    
    # Scan all directories
    directories = [d for d in root.iterdir() if d.is_dir() and not d.name.startswith('.')]
    
    print(f"Scanning {len(directories)} directories...\n")
    
    for directory in directories:
        # Skip if this is already a target category directory
        if directory.name in ['documentation', 'MEDIA_PROCESSING', 'media', 'data', 'config']:
            continue
        
        try:
            items = list(directory.iterdir())
            
            # Check for subdirectories
            for item in items:
                if not item.is_dir():
                    # Check for analysis/documentation files
                    if item.suffix == '.md':
                        name_lower = item.name.lower()
                        if any(pattern in name_lower for pattern in ['analysis', 'codebase', 'intelligent', 'readme']):
                            findings['analysis_files'].append({
                                'file': str(item.relative_to(root)),
                                'parent': directory.name,
                                'type': 'analysis_markdown'
                            })
                    continue
                
                item_name_lower = item.name.lower()
                
                # Check for documentation directories
                if any(pattern in item_name_lower for pattern in target_patterns['documentation']):
                    findings['documentation_dirs'].append({
                        'path': str(item.relative_to(root)),
                        'parent': directory.name,
                        'files': count_files(item)
                    })
                
                # Check for media directories
                if any(pattern in item_name_lower for pattern in target_patterns['media']):
                    findings['media_dirs'].append({
                        'path': str(item.relative_to(root)),
                        'parent': directory.name,
                        'files': count_files(item)
                    })
                
                # Check for data directories
                if any(pattern in item_name_lower for pattern in target_patterns['data']):
                    findings['data_dirs'].append({
                        'path': str(item.relative_to(root)),
                        'parent': directory.name,
                        'files': count_files(item)
                    })
                
                # Check for config directories
                if any(pattern in item_name_lower for pattern in target_patterns['config']):
                    findings['config_dirs'].append({
                        'path': str(item.relative_to(root)),
                        'parent': directory.name,
                        'files': count_files(item)
                    })
        
        except Exception as e:
            continue
    
    # Print findings
    print("📋 FINDINGS:")
    print("=" * 70)
    
    if findings['documentation_dirs']:
        print(f"\n📚 Documentation Directories ({len(findings['documentation_dirs'])}):")
        for item in findings['documentation_dirs'][:20]:
            print(f"   {item['path']:60} ({item['files']} files in {item['parent']})")
        if len(findings['documentation_dirs']) > 20:
            print(f"   ... and {len(findings['documentation_dirs']) - 20} more")
    
    if findings['media_dirs']:
        print(f"\n🎬 Media Directories ({len(findings['media_dirs'])}):")
        for item in findings['media_dirs'][:20]:
            print(f"   {item['path']:60} ({item['files']} files in {item['parent']})")
        if len(findings['media_dirs']) > 20:
            print(f"   ... and {len(findings['media_dirs']) - 20} more")
    
    if findings['analysis_files']:
        print(f"\n📄 Analysis/Documentation Files ({len(findings['analysis_files'])}):")
        for item in findings['analysis_files'][:20]:
            print(f"   {item['file']:60} (in {item['parent']})")
        if len(findings['analysis_files']) > 20:
            print(f"   ... and {len(findings['analysis_files']) - 20} more")
    
    if findings['data_dirs']:
        print(f"\n💾 Data Directories ({len(findings['data_dirs'])}):")
        for item in findings['data_dirs'][:20]:
            print(f"   {item['path']:60} ({item['files']} files in {item['parent']})")
        if len(findings['data_dirs']) > 20:
            print(f"   ... and {len(findings['data_dirs']) - 20} more")
    
    if findings['config_dirs']:
        print(f"\n⚙️  Config Directories ({len(findings['config_dirs'])}):")
        for item in findings['config_dirs'][:20]:
            print(f"   {item['path']:60} ({item['files']} files in {item['parent']})")
        if len(findings['config_dirs']) > 20:
            print(f"   ... and {len(findings['config_dirs']) - 20} more")
    
    # Summary
    total_findings = sum(len(v) for v in findings.values())
    print("\n" + "=" * 70)
    print(f"📊 SUMMARY:")
    print(f"   Total findings: {total_findings}")
    print(f"   Documentation dirs: {len(findings['documentation_dirs'])}")
    print(f"   Media dirs: {len(findings['media_dirs'])}")
    print(f"   Analysis files: {len(findings['analysis_files'])}")
    print(f"   Data dirs: {len(findings['data_dirs'])}")
    print(f"   Config dirs: {len(findings['config_dirs'])}")
    print("=" * 70)
    
    # Save to JSON
    output_file = Path.home() / "misplaced_items_scan.json"
    with open(output_file, 'w') as f:
        json.dump(dict(findings), f, indent=2)
    
    print(f"\n💾 Findings saved to: {output_file}")
    
    return findings

def count_files(directory):
    """Count files in directory"""
    try:
        files = list(directory.rglob("*"))
        return len([f for f in files if f.is_file()])
    except:
        return 0

if __name__ == "__main__":
    import sys
    root_dir = sys.argv[1] if len(sys.argv) > 1 else "/Users/steven/pythons"
    scan_for_misplaced_items(root_dir)

