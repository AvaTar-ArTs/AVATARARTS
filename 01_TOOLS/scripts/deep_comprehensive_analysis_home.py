#!/usr/bin/env python3
"""
Deep Comprehensive Home Directory Analysis
Unlimited depth analysis of home directory (excluding system/cache dirs)
"""

import os
import json
from pathlib import Path
from collections import defaultdict
from datetime import datetime
import sys

# Directories to skip (system/cache directories)
SKIP_DIRS = {
    '.Trash', '.cache', '.npm', '.yarn', '.pnpm', 
    '.mozilla', '.vscode', '.Code', '.android',
    '.gradle', '.m2', '.ivy2', '.sbt',
    'Library/Caches', 'Library/Application Support/Google/Chrome',
    'Library/Application Support/Code',
    '.node_modules', 'node_modules',
    '.git', '__pycache__', '.pytest_cache',
    'venv', '.venv', 'env', '.env',
    '.tmp', 'tmp', 'temp', '.temp'
}

class DeepHomeAnalyzer:
    def __init__(self, root_path):
        self.root_path = Path(root_path).resolve()
        self.stats = {
            'total_directories': 0,
            'total_files': 0,
            'total_size_bytes': 0,
            'file_types': defaultdict(int),
            'directory_structure': {},
            'large_directories': [],
            'python_files': [],
            'markdown_files': [],
            'config_files': [],
            'data_files': [],
            'script_files': [],
            'documentation_files': [],
            'duplicate_names': defaultdict(list),
            'deepest_path': {'depth': 0, 'path': ''},
            'connections': defaultdict(list),
            'skipped_directories': [],
            'analysis_date': datetime.now().isoformat()
        }
        
    def should_skip(self, path_str):
        """Check if directory should be skipped"""
        path_lower = path_str.lower()
        for skip in SKIP_DIRS:
            if skip.lower() in path_lower:
                return True
        return False
        
    def get_file_size(self, filepath):
        try:
            return os.path.getsize(filepath)
        except:
            return 0
    
    def analyze_file(self, filepath, relative_path):
        """Analyze individual file"""
        size = self.get_file_size(filepath)
        self.stats['total_files'] += 1
        self.stats['total_size_bytes'] += size
        
        suffix = filepath.suffix.lower()
        name = filepath.name.lower()
        
        # File type counting
        if suffix:
            self.stats['file_types'][suffix] += 1
        
        # Track duplicate names
        self.stats['duplicate_names'][filepath.name].append(str(relative_path))
        
        # Categorize files
        if suffix == '.py':
            self.stats['python_files'].append(str(relative_path))
        elif suffix == '.md':
            self.stats['markdown_files'].append(str(relative_path))
        elif suffix in ['.json', '.yaml', '.yml', '.toml', '.ini', '.conf']:
            self.stats['config_files'].append(str(relative_path))
        elif suffix in ['.csv', '.tsv', '.xlsx', '.xls', '.db', '.sqlite']:
            self.stats['data_files'].append(str(relative_path))
        elif suffix in ['.sh', '.bash', '.zsh']:
            self.stats['script_files'].append(str(relative_path))
        elif 'readme' in name or 'doc' in name or 'guide' in name:
            self.stats['documentation_files'].append(str(relative_path))
    
    def analyze_directory_recursive(self, dirpath, relative_path, depth=0, max_depth=15):
        """Recursively analyze directory structure"""
        # Skip if too deep or should be skipped
        if depth > max_depth:
            return None
            
        dir_str = str(relative_path)
        if self.should_skip(dir_str):
            self.stats['skipped_directories'].append(dir_str)
            return None
        
        dir_info = {
            'path': dir_str,
            'depth': depth,
            'files': [],
            'subdirectories': {},
            'file_count': 0,
            'size_bytes': 0,
            'file_types': defaultdict(int)
        }
        
        try:
            items = list(dirpath.iterdir())
            
            # Track deepest path
            if depth > self.stats['deepest_path']['depth']:
                self.stats['deepest_path']['depth'] = depth
                self.stats['deepest_path']['path'] = dir_str
            
            for item in sorted(items):
                item_relative = relative_path / item.name
                
                # Skip hidden files at root level (except important ones)
                if depth == 0 and item.name.startswith('.') and item.name not in [
                    '.zshrc', '.bashrc', '.bash_profile', '.env.d', 
                    '.claude', '.cursor', '.gitconfig', '.vimrc', '.config'
                ]:
                    if self.should_skip(item.name):
                        continue
                
                if item.is_dir():
                    if self.should_skip(str(item_relative)):
                        self.stats['skipped_directories'].append(str(item_relative))
                        continue
                    
                    self.stats['total_directories'] += 1
                    subdir_info = self.analyze_directory_recursive(
                        item, item_relative, depth + 1, max_depth
                    )
                    if subdir_info:
                        dir_info['subdirectories'][item.name] = subdir_info
                        dir_info['file_count'] += subdir_info['file_count']
                        dir_info['size_bytes'] += subdir_info['size_bytes']
                        
                        # Merge file types
                        for ftype, count in subdir_info['file_types'].items():
                            dir_info['file_types'][ftype] += count
                
                elif item.is_file():
                    self.analyze_file(item, item_relative)
                    dir_info['files'].append(item.name)
                    dir_info['file_count'] += 1
                    file_size = self.get_file_size(item)
                    dir_info['size_bytes'] += file_size
                    
                    suffix = item.suffix.lower()
                    if suffix:
                        dir_info['file_types'][suffix] += 1
        
        except PermissionError:
            pass
        except Exception as e:
            pass
        
        # Track large directories (> 50 MB)
        if dir_info['size_bytes'] > 50 * 1024 * 1024:
            self.stats['large_directories'].append({
                'path': dir_str,
                'size_bytes': dir_info['size_bytes'],
                'size_mb': round(dir_info['size_bytes'] / (1024 * 1024), 2),
                'file_count': dir_info['file_count']
            })
        
        return dir_info
    
    def find_connections(self):
        """Find connections between files and directories"""
        common_terms = [
            'AVATARARTS',
            'pythons',
            'ai-sites',
            'passive-income',
            'cleanconnect',
            'quantumforge'
        ]
        
        for md_file in self.stats['markdown_files'][:50]:  # Sample first 50
            try:
                full_path = self.root_path / md_file
                if full_path.exists():
                    content = full_path.read_text(errors='ignore')[:50000]  # First 50KB
                    for term in common_terms:
                        if term in content:
                            self.stats['connections'][term].append(md_file)
            except:
                pass
    
    def analyze(self):
        """Run complete analysis"""
        print(f"🔍 Starting home directory analysis: {self.root_path}")
        print("   Skipping system/cache directories for faster analysis...\n")
        
        root_relative = Path('.')
        self.stats['directory_structure'] = self.analyze_directory_recursive(
            self.root_path, root_relative, 0, max_depth=15
        )
        
        print(f"✅ Analysis complete!")
        print(f"   Directories: {self.stats['total_directories']:,}")
        print(f"   Files: {self.stats['total_files']:,}")
        print(f"   Total size: {self.stats['total_size_bytes'] / (1024**3):.2f} GB")
        print(f"   Skipped: {len(self.stats['skipped_directories']):,} directories")
        print(f"   Deepest path: {self.stats['deepest_path']['depth']} levels\n")
        
        # Find connections
        print("🔗 Analyzing connections...")
        self.find_connections()
        
        return self.stats
    
    def generate_report(self, output_file=None):
        """Generate comprehensive report"""
        if output_file is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            output_file = Path('/Users/steven/AVATARARTS') / f"HOME_DEEP_ANALYSIS_{timestamp}.json"
        
        # Sort large directories
        self.stats['large_directories'].sort(key=lambda x: x['size_bytes'], reverse=True)
        
        # Limit duplicate names to actual duplicates
        self.stats['duplicate_names'] = {
            k: v for k, v in self.stats['duplicate_names'].items() if len(v) > 1
        }
        
        # Convert defaultdict to dict for JSON
        stats_json = json.loads(json.dumps(self.stats, default=str))
        
        with open(output_file, 'w') as f:
            json.dump(stats_json, f, indent=2, default=str)
        
        print(f"📄 Report saved to: {output_file}")
        return output_file
    
    def print_summary(self):
        """Print analysis summary"""
        print("\n" + "="*70)
        print("📊 HOME DIRECTORY ANALYSIS SUMMARY")
        print("="*70)
        
        print(f"\n📁 STRUCTURE:")
        print(f"   Total Directories: {self.stats['total_directories']:,}")
        print(f"   Total Files: {self.stats['total_files']:,}")
        print(f"   Total Size: {self.stats['total_size_bytes'] / (1024**3):.2f} GB")
        print(f"   Skipped Directories: {len(self.stats['skipped_directories']):,}")
        print(f"   Deepest Path: {self.stats['deepest_path']['depth']} levels")
        print(f"   Deepest Location: {self.stats['deepest_path']['path']}")
        
        print(f"\n📄 FILE TYPES (Top 15):")
        sorted_types = sorted(
            self.stats['file_types'].items(),
            key=lambda x: x[1],
            reverse=True
        )[:15]
        for ftype, count in sorted_types:
            print(f"   {ftype:10} {count:>8,} files")
        
        print(f"\n🐍 PYTHON:")
        print(f"   Python Files: {len(self.stats['python_files']):,}")
        
        print(f"\n📚 DOCUMENTATION:")
        print(f"   Markdown Files: {len(self.stats['markdown_files']):,}")
        print(f"   Documentation Files: {len(self.stats['documentation_files']):,}")
        
        print(f"\n💾 DATA:")
        print(f"   Data Files: {len(self.stats['data_files']):,}")
        print(f"   Config Files: {len(self.stats['config_files']):,}")
        
        print(f"\n📦 LARGE DIRECTORIES (Top 15):")
        for i, dir_info in enumerate(self.stats['large_directories'][:15], 1):
            path_display = dir_info['path'][:55] + '...' if len(dir_info['path']) > 58 else dir_info['path']
            print(f"   {i:2}. {path_display:58} {dir_info['size_mb']:>8.1f} MB ({dir_info['file_count']:,} files)")
        
        print(f"\n🔗 CONNECTIONS FOUND:")
        for term, files in list(self.stats['connections'].items())[:10]:
            print(f"   {term:30} {len(files):>4} references")
        
        print(f"\n🔄 DUPLICATE FILE NAMES (Top 10):")
        sorted_dupes = sorted(
            self.stats['duplicate_names'].items(),
            key=lambda x: len(x[1]),
            reverse=True
        )[:10]
        for name, paths in sorted_dupes:
            print(f"   {name:40} {len(paths):>3} occurrences")
        
        print("\n" + "="*70 + "\n")


def main():
    root_path = '/Users/steven'
    
    if len(sys.argv) > 1:
        root_path = sys.argv[1]
    
    analyzer = DeepHomeAnalyzer(root_path)
    stats = analyzer.analyze()
    analyzer.print_summary()
    
    # Generate JSON report
    report_file = analyzer.generate_report()
    
    return 0


if __name__ == '__main__':
    sys.exit(main())

