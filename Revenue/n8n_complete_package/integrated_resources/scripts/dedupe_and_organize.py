#!/usr/bin/env python3
"""
Deduplicate and organize n8n files
"""

import os
import json
import shutil
from pathlib import Path
from collections import defaultdict

class N8nDeduplicator:
    def __init__(self, target_dir: str = "/Users/steven/AVATARARTS/n8n"):
        self.target_dir = Path(target_dir)
        self.summary_path = self.target_dir / 'file_summary.json'
        
    def load_summary(self):
        """Load file summary"""
        with open(self.summary_path, 'r') as f:
            return json.load(f)
    
    def create_organized_structure(self):
        """Create organized directory structure"""
        structure = {
            'workflows': self.target_dir / 'workflows',
            'templates': self.target_dir / 'templates',
            'data': self.target_dir / 'data',
            'api': self.target_dir / 'api',
            'documentation': self.target_dir / 'documentation',
            'duplicates': self.target_dir / 'duplicates',
        }
        
        for dir_path in structure.values():
            dir_path.mkdir(parents=True, exist_ok=True)
        
        return structure
    
    def categorize_file(self, file_info: dict) -> str:
        """Determine category for file"""
        name = file_info['name'].lower()
        path = file_info['path'].lower()
        
        # API files
        if 'api' in name or 'api' in path:
            return 'api'
        
        # Workflow files
        if 'workflow' in name or 'workflow' in path:
            return 'workflows'
        
        # Template files
        if 'template' in name or 'template' in path:
            return 'templates'
        
        # Data files (CSV)
        if file_info.get('extension', '').lower() == '.csv':
            return 'data'
        
        # Documentation
        if file_info.get('extension', '').lower() in ['.md', '.html']:
            return 'documentation'
        
        # Default based on extension
        ext = file_info.get('extension', '').lower()
        if ext == '.json':
            return 'workflows'  # Default JSON to workflows
        elif ext == '.yaml' or ext == '.yml':
            return 'workflows'
        else:
            return 'data'
    
    def deduplicate_and_copy(self, dry_run: bool = True):
        """Deduplicate and copy files"""
        summary = self.load_summary()
        structure = self.create_organized_structure()
        
        print("n8n Files Deduplication and Organization")
        print("=" * 60)
        print(f"Mode: {'DRY RUN' if dry_run else 'LIVE'}")
        print()
        
        # Track copied files
        copied_files = []
        duplicate_files = []
        
        # Process duplicates - keep first, mark others
        for hash_val, files in summary.get('duplicates', {}).items():
            if len(files) > 1:
                # Keep first file, mark others as duplicates
                primary = files[0]
                duplicates = files[1:]
                
                print(f"Duplicate group ({hash_val[:8]}...):")
                print(f"  Keeping: {primary}")
                for dup in duplicates:
                    print(f"  Duplicate: {dup}")
                    duplicate_files.append(dup)
        
        print()
        
        # Process unique files
        seen_hashes = set()
        for file_info in summary.get('files', []):
            if not file_info.get('exists'):
                continue
            
            file_hash = file_info.get('hash')
            if not file_hash:
                continue
            
            # Skip if already processed as duplicate
            if file_info['path'] in duplicate_files:
                continue
            
            # Skip if hash already seen
            if file_hash in seen_hashes:
                continue
            
            seen_hashes.add(file_hash)
            
            # Determine category
            category = self.categorize_file(file_info)
            target_dir = structure.get(category, structure['data'])
            
            # Create target path
            target_path = target_dir / file_info['name']
            
            # Handle name conflicts
            counter = 1
            original_target = target_path
            while target_path.exists():
                stem = original_target.stem
                suffix = original_target.suffix
                target_path = target_dir / f"{stem}_{counter}{suffix}"
                counter += 1
            
            if dry_run:
                print(f"[DRY RUN] Would copy: {file_info['name']}")
                print(f"  From: {file_info['path']}")
                print(f"  To: {target_path}")
            else:
                try:
                    shutil.copy2(file_info['path'], target_path)
                    print(f"Copied: {file_info['name']} -> {target_path}")
                except Exception as e:
                    print(f"Error copying {file_info['name']}: {e}")
                    continue
            
            copied_files.append({
                'source': file_info['path'],
                'target': str(target_path),
                'category': category
            })
        
        # Save duplicate list
        if duplicate_files:
            dup_list_path = self.target_dir / 'duplicates_list.txt'
            with open(dup_list_path, 'w') as f:
                f.write("Duplicate Files (not copied):\n")
                f.write("=" * 60 + "\n\n")
                for dup in duplicate_files:
                    f.write(f"{dup}\n")
            
            if not dry_run:
                print(f"\nDuplicate list saved to: {dup_list_path}")
        
        # Save copy log
        log_path = self.target_dir / f"{'dry_run_' if dry_run else ''}copy_log.json"
        with open(log_path, 'w') as f:
            json.dump({
                'dry_run': dry_run,
                'files_copied': len(copied_files),
                'duplicates_skipped': len(duplicate_files),
                'copied_files': copied_files,
                'duplicates': duplicate_files
            }, f, indent=2)
        
        print()
        print("=" * 60)
        print("Summary")
        print("=" * 60)
        print(f"Files to copy: {len(copied_files)}")
        print(f"Duplicates skipped: {len(duplicate_files)}")
        print(f"Log saved to: {log_path}")
        
        if dry_run:
            print("\nRun with --execute to perform actual copy")
        
        return copied_files, duplicate_files


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Deduplicate and organize n8n files')
    parser.add_argument('--execute', action='store_true', help='Execute copy (default is dry-run)')
    
    args = parser.parse_args()
    
    deduplicator = N8nDeduplicator()
    deduplicator.deduplicate_and_copy(dry_run=not args.execute)


if __name__ == '__main__':
    main()
