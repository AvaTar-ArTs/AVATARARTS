#!/usr/bin/env python3
"""
AVATARARTS Complete Reorganization Script
Safely reorganizes root directory files into proper structure
"""

import os
import shutil
import json
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Tuple

class AvatarArtsReorganizer:
    def __init__(self, root_path: str, dry_run: bool = True):
        self.root = Path(root_path)
        self.dry_run = dry_run
        self.moves_log = []
        self.errors = []
        
        # File categorization mapping
        self.categories = {
            'reports': {
                'target': '08_REPORTS',
                'patterns': [
                    '*ANALYSIS*.md', '*ANALYSIS*.html', '*ANALYSIS*.csv',
                    '*REPORT*.md', '*REPORT*.csv',
                    '*HANDOFF*.md', '*HANDOFF*.txt',
                    '*REVIEW*.md', '*SCAN*.md',
                    '*DECLUTTER*.md', '*DECLUTTER*.csv',
                    'cursor_revenue_trend_pulse_analysis.md',
                    'comprehensive_improvements_suggestions.html',
                    'pythons_duplicates_report.md',
                    'INTELLIGENT_DECLUTTER_ARCHIVED_FILES.csv',
                ]
            },
            'setup_scripts': {
                'target': '09_SCRIPTS/setup',
                'patterns': [
                    'setup_*.py', 'setup_*.sh',
                    'scan_and_add_to_avatararts.py',
                    'avatararts_org_summary.sh',
                ]
            },
            'organization_scripts': {
                'target': '09_SCRIPTS/organization',
                'patterns': [
                    'reorganize*.py', 'reorganize*.sh',
                    'organize*.sh', 'organize*.py',
                    'declutter*.sh', 'declutter*.py',
                    'rename*.py', 'reindex*.py',
                ]
            },
            'documentation': {
                'target': '02_DOCUMENTATION',
                'patterns': [
                    'README.md', 'QUICK_*.md', 'WORKFLOW*.md',
                    'EVOLUTION*.md', 'DAILY_*.md',
                    '*HANDOFF*.md', '*INDEX*.md',
                    '*GUIDE*.md', '*CONTEXT*.md',
                    'python-automation-repo.md',
                    'GROK.md', 'ZSH_*.md',
                ]
            },
            'utility_scripts': {
                'target': '01_TOOLS/scripts/utilities',
                'patterns': [
                    'compare_*.py', 'create_*.py',
                    'flatten_*.py', 'generate_*.py',
                    'open_*.py', 'deep_*.py',
                    'advanced_*.py',
                ]
            },
            'data_files': {
                'target': '05_DATA',
                'patterns': [
                    '*.txt', '*.csv',
                    'git-node-pytest.txt',
                    'git status --porcelain.txt',
                    '*.json',  # Analysis JSON files
                    'reorganization_report_*.json',
                    'DEEP_ANALYSIS_*.json',
                    'intelligent_declutter_plan.json',
                ],
                'exclude': [
                    '.gitignore', 'README.md',
                ]
            },
            'reports_additional': {
                'target': '08_REPORTS',
                'patterns': [
                    '*SUMMARY*.md', '*SUMMARY*.txt',
                    '*STRATEGY*.md',
                    '*HANDOFF*.md',
                    '*EXPORT*.md',
                    '*EXECUTIVE*.md',
                    '*CHECKLIST*.md',
                    '*TEST*.md', '*FIXES*.md',
                    '*RECOMMENDATIONS*.md',
                    '*INSTRUCTIONS*.md',
                    'REORGANIZATION_*.md',
                    'MCP_*.md',
                    'Handoff_Summary.md',
                    'Revenue_Strategy_Handoff_Simple.md',
                    'SEO_AEO_Strategy_*.md',
                    'QWEN_CURSOR_IMPROVEMENTS.md',
                ]
            },
            'seo_content': {
                'target': '06_SEO_MARKETING',
                'patterns': [
                    '*AEO_SEO*.md',
                    '2025-12-24*SEO*.md',
                ]
            },
            'documentation_additional': {
                'target': '02_DOCUMENTATION',
                'patterns': [
                    'steven-bio.md',
                    'AI_CLI_TOOLS_*.md',
                ]
            },
            'web_files': {
                'target': '04_WEBSITES',
                'patterns': [
                    '*.html', '*.css', '*.js',
                    'styles.css',
                    'enhanced_script.js',
                    'final_script.js',
                    'application.js',
                    'docs_system.html',
                    'AI_Alchemy_Portfolio.html',
                ]
            },
            'images': {
                'target': '05_DATA/images',
                'patterns': [
                    '*.png', '*.jpg', '*.jpeg',
                    '*.gif', '*.svg',
                    'top-trending.png',
                ]
            },
            'archives_files': {
                'target': '03_ARCHIVES',
                'patterns': [
                    '*.zip',
                    'Revenue.zip',
                ]
            },
            'scripts_additional': {
                'target': '09_SCRIPTS/utilities',
                'patterns': [
                    'final_summary.sh',
                ]
            },
            'archives': {
                'target': '03_ARCHIVES',
                'patterns': [
                    'pythons_reorganized',
                ]
            }
        }
        
        # Directories to keep in root
        self.keep_in_root = {
            '.git', '.gitignore', 'README.md', '.DS_Store',
            '00_ACTIVE', '01_TOOLS', '02_DOCUMENTATION',
            '03_ARCHIVES', '04_WEBSITES', '05_DATA',
            '06_SEO_MARKETING', '07_MISC', '08_REPORTS',
            '09_SCRIPTS', 'Revenue', 'Obsidian-plugins-mine',
            # Keep all reorganization guides in root for easy access
            'REORGANIZATION_PLAN.md',
            'REORGANIZATION_EXECUTION_GUIDE.md',
            'REORGANIZATION_COMPLETE_SUMMARY.md',
            'REORGANIZATION_READY.md',
            'REORGANIZATION_FINAL_CHECKLIST.md',
            'REORGANIZATION_COMPLETE.md',
            'FINAL_REORGANIZATION_STATUS.md',
            'MANUAL_FILE_CATEGORIZATION.md',
            'START_HERE.md',
            'QUICK_REORGANIZE.sh',
            'reorganize_avatararts_complete.py',
        }
    
    def create_directory_structure(self):
        """Create missing directories"""
        directories = [
            '03_ARCHIVES',
            '04_WEBSITES',
            '05_DATA',
            '08_REPORTS',
            '09_SCRIPTS/setup',
            '09_SCRIPTS/organization',
            '09_SCRIPTS/utilities',
            '01_TOOLS/scripts/utilities',
        ]
        
        for dir_path in directories:
            full_path = self.root / dir_path
            if not full_path.exists():
                if self.dry_run:
                    print(f"[DRY RUN] Would create: {dir_path}")
                else:
                    full_path.mkdir(parents=True, exist_ok=True)
                    print(f"Created: {dir_path}")
    
    def match_file_to_category(self, file_path: Path) -> str:
        """Match file to category based on patterns"""
        filename = file_path.name
        
        for category, config in self.categories.items():
            for pattern in config['patterns']:
                # Simple pattern matching
                if self._match_pattern(filename, pattern):
                    # Check exclusions
                    if 'exclude' in config:
                        if filename in config['exclude']:
                            continue
                    return category
        
        return None
    
    def _match_pattern(self, filename: str, pattern: str) -> bool:
        """Simple pattern matching"""
        import fnmatch
        return fnmatch.fnmatch(filename, pattern)
    
    def get_files_to_move(self) -> List[Tuple[Path, str]]:
        """Get list of files to move with their target categories"""
        files_to_move = []
        
        for item in self.root.iterdir():
            # Skip directories and files we want to keep
            if item.is_dir():
                continue
            
            if item.name in self.keep_in_root:
                continue
            
            # Skip hidden files (except .gitignore)
            if item.name.startswith('.') and item.name != '.gitignore':
                continue
            
            category = self.match_file_to_category(item)
            if category:
                target_dir = self.categories[category]['target']
                files_to_move.append((item, target_dir))
            else:
                # Unmatched files - log for review
                self.errors.append(f"Unmatched file: {item.name}")
        
        return files_to_move
    
    def move_file(self, source: Path, target_dir: str) -> bool:
        """Move file to target directory"""
        target_path = self.root / target_dir / source.name
        
        # Handle duplicates
        if target_path.exists():
            # Add timestamp to filename
            stem = source.stem
            suffix = source.suffix
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            target_path = self.root / target_dir / f"{stem}_{timestamp}{suffix}"
        
        try:
            if self.dry_run:
                print(f"[DRY RUN] Would move: {source.name} -> {target_dir}/")
                self.moves_log.append({
                    'source': str(source),
                    'target': str(target_path),
                    'status': 'dry_run'
                })
                return True
            else:
                shutil.move(str(source), str(target_path))
                print(f"Moved: {source.name} -> {target_dir}/")
                self.moves_log.append({
                    'source': str(source),
                    'target': str(target_path),
                    'status': 'moved'
                })
                return True
        except Exception as e:
            error_msg = f"Error moving {source.name}: {str(e)}"
            print(f"ERROR: {error_msg}")
            self.errors.append(error_msg)
            return False
    
    def reorganize(self):
        """Main reorganization function"""
        print("=" * 60)
        print("AVATARARTS Reorganization")
        print("=" * 60)
        print(f"Mode: {'DRY RUN' if self.dry_run else 'LIVE'}")
        print(f"Root: {self.root}")
        print()
        
        # Step 1: Create directory structure
        print("Step 1: Creating directory structure...")
        self.create_directory_structure()
        print()
        
        # Step 2: Get files to move
        print("Step 2: Analyzing files...")
        files_to_move = self.get_files_to_move()
        print(f"Found {len(files_to_move)} files to move")
        print()
        
        # Step 3: Move files
        print("Step 3: Moving files...")
        moved_count = 0
        for source, target_dir in files_to_move:
            if self.move_file(source, target_dir):
                moved_count += 1
        
        print()
        print("=" * 60)
        print("Reorganization Summary")
        print("=" * 60)
        print(f"Files processed: {moved_count}")
        print(f"Errors: {len(self.errors)}")
        
        if self.errors:
            print("\nUnmatched files (need manual review):")
            for error in self.errors:
                print(f"  - {error}")
        
        # Save log
        log_file = self.root / f"reorganization_log_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        log_data = {
            'timestamp': datetime.now().isoformat(),
            'dry_run': self.dry_run,
            'moves': self.moves_log,
            'errors': self.errors,
        }
        
        if not self.dry_run:
            with open(log_file, 'w') as f:
                json.dump(log_data, f, indent=2)
            print(f"\nLog saved to: {log_file}")
        
        return moved_count, len(self.errors)
    
    def generate_structure_report(self):
        """Generate report of new structure"""
        report = []
        report.append("# AVATARARTS Directory Structure")
        report.append(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append("")
        
        # List all numbered directories
        for i in range(10):
            dir_name = f"{i:02d}_*"
            dirs = list(self.root.glob(f"{i:02d}_*"))
            if dirs:
                for d in dirs:
                    if d.is_dir():
                        report.append(f"## {d.name}/")
                        # Count files
                        files = list(d.rglob('*'))
                        file_count = len([f for f in files if f.is_file()])
                        dir_count = len([f for f in files if f.is_dir()])
                        report.append(f"- Files: {file_count}")
                        report.append(f"- Directories: {dir_count}")
                        report.append("")
        
        report_file = self.root / "DIRECTORY_STRUCTURE_REPORT.md"
        with open(report_file, 'w') as f:
            f.write('\n'.join(report))
        
        print(f"Structure report saved to: {report_file}")


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Reorganize AVATARARTS directory')
    parser.add_argument('--root', default='/Users/steven/AVATARARTS',
                        help='Root directory path')
    parser.add_argument('--dry-run', action='store_true', default=True,
                        help='Dry run mode (default: True)')
    parser.add_argument('--execute', action='store_true',
                        help='Execute reorganization (overrides dry-run)')
    parser.add_argument('--report', action='store_true',
                        help='Generate structure report')
    
    args = parser.parse_args()
    
    dry_run = not args.execute
    
    reorganizer = AvatarArtsReorganizer(args.root, dry_run=dry_run)
    
    moved, errors = reorganizer.reorganize()
    
    if args.report:
        reorganizer.generate_structure_report()
    
    if dry_run:
        print("\n" + "=" * 60)
        print("This was a DRY RUN. No files were moved.")
        print("Run with --execute to perform actual reorganization.")
        print("=" * 60)
    else:
        print("\n" + "=" * 60)
        print("Reorganization complete!")
        print("=" * 60)


if __name__ == '__main__':
    main()
