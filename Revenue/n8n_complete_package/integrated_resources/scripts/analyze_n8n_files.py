#!/usr/bin/env python3
"""
Analyze and deduplicate n8n files from various locations
"""

import os
import json
import hashlib
import shutil
from pathlib import Path
from collections import defaultdict
from typing import Dict, List, Tuple

class N8nFileAnalyzer:
    def __init__(self, target_dir: str = "/Users/steven/AVATARARTS/n8n"):
        self.target_dir = Path(target_dir)
        self.target_dir.mkdir(parents=True, exist_ok=True)
        
        # File paths from user input
        self.file_paths = [
            "/Volumes/2T-Xx/ai-sites/n8n/n8n-public-api.json",
            "/Volumes/2T-Xx/ai-sites/n8n/n8n_workflows/n8n_ai_agent_templates.json",
            "/Volumes/2T-Xx/Documents/n8n_social_media_automation.json",
            "/Volumes/2T-Xx/Documents/n8n_automation_workflows.json",
            "/Volumes/DeVonDaTa/gDrive/n8n_templates_enriched_with_links.csv",
            "/Volumes/DeVonDaTa/gDrive/n8n_templates_cleaned_view.csv",
            "/Volumes/DeVonDaTa/gDrive/dataset_n8n-template-scraper_2025-12-04_18-51-25-722.csv",
            "/Volumes/DeVonDaTa/gDrive/dataset_n8n-template-scraper_2025-12-03_04-11-52-840.csv",
            "/Volumes/DeVonDaTa/gDrive/dataset_n8n-template-scraper_2025-12-03_04-11-52-840(1).csv",
        ]
        
        # Additional paths from the long list (filtering for actual files)
        self.additional_paths = []
        
        self.file_hashes = {}
        self.duplicates = defaultdict(list)
        self.file_info = []
        
    def calculate_file_hash(self, file_path: str) -> str:
        """Calculate SHA256 hash of file"""
        try:
            with open(file_path, 'rb') as f:
                return hashlib.sha256(f.read()).hexdigest()
        except Exception as e:
            print(f"Error reading {file_path}: {e}")
            return None
    
    def get_file_info(self, file_path: str) -> Dict:
        """Get file information"""
        path = Path(file_path)
        if not path.exists():
            return None
        
        try:
            stat = path.stat()
            return {
                'path': str(path),
                'name': path.name,
                'size': stat.st_size,
                'extension': path.suffix,
                'exists': True,
                'hash': self.calculate_file_hash(str(path))
            }
        except Exception as e:
            return {
                'path': str(path),
                'name': path.name,
                'exists': False,
                'error': str(e)
            }
    
    def analyze_files(self):
        """Analyze all files"""
        print("Analyzing n8n files...")
        print("=" * 60)
        
        for file_path in self.file_paths:
            info = self.get_file_info(file_path)
            if info:
                self.file_info.append(info)
                if info.get('hash'):
                    self.duplicates[info['hash']].append(info)
        
        # Report
        print(f"\nTotal files analyzed: {len(self.file_info)}")
        print(f"Files found: {sum(1 for f in self.file_info if f.get('exists'))}")
        print(f"Files missing: {sum(1 for f in self.file_info if not f.get('exists'))}")
        
        # Find duplicates
        duplicate_groups = {h: files for h, files in self.duplicates.items() if len(files) > 1}
        print(f"\nDuplicate groups found: {len(duplicate_groups)}")
        
        return self.file_info, duplicate_groups
    
    def categorize_files(self, file_info: List[Dict]) -> Dict[str, List[Dict]]:
        """Categorize files by type"""
        categories = {
            'json': [],
            'csv': [],
            'yaml': [],
            'md': [],
            'html': [],
            'css': [],
            'other': []
        }
        
        for info in file_info:
            if not info.get('exists'):
                continue
            
            ext = info.get('extension', '').lower()
            if ext == '.json':
                categories['json'].append(info)
            elif ext == '.csv':
                categories['csv'].append(info)
            elif ext == '.yaml' or ext == '.yml':
                categories['yaml'].append(info)
            elif ext == '.md':
                categories['md'].append(info)
            elif ext == '.html':
                categories['html'].append(info)
            elif ext == '.css':
                categories['css'].append(info)
            else:
                categories['other'].append(info)
        
        return categories
    
    def create_organized_structure(self, categories: Dict[str, List[Dict]], duplicates: Dict):
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
    
    def generate_report(self, file_info: List[Dict], duplicates: Dict, categories: Dict):
        """Generate analysis report"""
        report = []
        report.append("# n8n Files Analysis Report")
        report.append(f"Generated: {Path(__file__).stat().st_mtime}")
        report.append("")
        
        report.append("## File Summary")
        report.append(f"- Total files analyzed: {len(file_info)}")
        report.append(f"- Files found: {sum(1 for f in file_info if f.get('exists'))}")
        report.append(f"- Files missing: {sum(1 for f in file_info if not f.get('exists'))}")
        report.append("")
        
        report.append("## File Categories")
        for cat, files in categories.items():
            if files:
                report.append(f"### {cat.upper()}")
                report.append(f"- Count: {len(files)}")
                total_size = sum(f.get('size', 0) for f in files)
                report.append(f"- Total size: {total_size / 1024 / 1024:.2f} MB")
                report.append("")
        
        report.append("## Duplicates")
        if duplicates:
            for hash_val, files in duplicates.items():
                report.append(f"### Duplicate Group ({hash_val[:8]}...)")
                for f in files:
                    report.append(f"- {f['path']}")
                report.append("")
        else:
            report.append("No duplicates found.")
        
        report.append("## Files by Category")
        for cat, files in categories.items():
            if files:
                report.append(f"### {cat.upper()}")
                for f in files:
                    report.append(f"- {f['name']} ({f.get('size', 0) / 1024:.2f} KB)")
                report.append("")
        
        report_path = self.target_dir / 'analysis_report.md'
        with open(report_path, 'w') as f:
            f.write('\n'.join(report))
        
        print(f"\nReport saved to: {report_path}")
        return report_path
    
    def run(self):
        """Run full analysis"""
        print("n8n Files Analyzer")
        print("=" * 60)
        
        # Analyze files
        file_info, duplicates = self.analyze_files()
        
        # Categorize
        categories = self.categorize_files(file_info)
        
        # Create structure
        structure = self.create_organized_structure(categories, duplicates)
        
        # Generate report
        report_path = self.generate_report(file_info, duplicates, categories)
        
        # Save JSON summary
        summary = {
            'total_files': len(file_info),
            'files_found': sum(1 for f in file_info if f.get('exists')),
            'duplicate_groups': len(duplicates),
            'categories': {k: len(v) for k, v in categories.items()},
            'files': file_info,
            'duplicates': {h: [f['path'] for f in files] for h, files in duplicates.items()}
        }
        
        summary_path = self.target_dir / 'file_summary.json'
        with open(summary_path, 'w') as f:
            json.dump(summary, f, indent=2)
        
        print(f"Summary saved to: {summary_path}")
        print("\n" + "=" * 60)
        print("Analysis complete!")
        print(f"Results in: {self.target_dir}")
        
        return summary


def main():
    analyzer = N8nFileAnalyzer()
    summary = analyzer.run()
    
    print("\nNext steps:")
    print("1. Review analysis_report.md")
    print("2. Review file_summary.json")
    print("3. Decide on deduplication strategy")
    print("4. Copy unique files to organized structure")


if __name__ == '__main__':
    main()
