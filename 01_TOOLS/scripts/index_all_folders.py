#!/usr/bin/env python3
"""
Comprehensive Folder Indexer - Unlimited Depth
==============================================
Indexes all folders and files in the AVATARARTS project to unlimited depth.
Creates comprehensive indexes in multiple formats (JSON, HTML, CSV, TXT).
"""

import os
import json
import csv
from pathlib import Path
from datetime import datetime
from collections import defaultdict
from typing import Dict, List, Optional
import hashlib


class Colors:
    """Terminal colors"""
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'


class FolderIndexer:
    """Comprehensive folder and file indexer with unlimited depth"""
    
    def __init__(self, root_path: Path = None, exclude_dirs: set = None):
        self.root_path = root_path or Path.cwd()
        self.exclude_dirs = exclude_dirs or {
            '.git', '.github', '.history', '__pycache__', 
            'node_modules', '.next', '.venv', 'venv', 'env',
            '.DS_Store', '.vscode', '.idea', 'dist', 'build'
        }
        self.index = {
            'root': str(self.root_path),
            'generated': datetime.now().isoformat(),
            'statistics': {},
            'folders': [],
            'files': [],
            'structure': {}
        }
        self.stats = {
            'total_folders': 0,
            'total_files': 0,
            'total_size': 0,
            'max_depth': 0,
            'folders_by_depth': defaultdict(int),
            'files_by_type': defaultdict(int),
            'size_by_type': defaultdict(int),
            'largest_files': [],
            'largest_folders': []
        }
    
    def format_size(self, size_bytes: int) -> str:
        """Format bytes to human readable"""
        for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
            if size_bytes < 1024.0:
                return f"{size_bytes:.2f} {unit}"
            size_bytes /= 1024.0
        return f"{size_bytes:.2f} PB"
    
    def should_exclude(self, path: Path) -> bool:
        """Check if path should be excluded"""
        parts = path.parts
        return any(part in self.exclude_dirs for part in parts)
    
    def get_folder_info(self, folder_path: Path, depth: int) -> Dict:
        """Get comprehensive folder information"""
        try:
            file_count = 0
            dir_count = 0
            total_size = 0
            
            try:
                for item in folder_path.iterdir():
                    if self.should_exclude(item):
                        continue
                    if item.is_file():
                        file_count += 1
                        try:
                            total_size += item.stat().st_size
                        except:
                            pass
                    elif item.is_dir():
                        dir_count += 1
            except (PermissionError, OSError):
                pass
            
            rel_path = folder_path.relative_to(self.root_path)
            
            return {
                'path': str(rel_path),
                'absolute_path': str(folder_path),
                'name': folder_path.name,
                'depth': depth,
                'file_count': file_count,
                'dir_count': dir_count,
                'size': total_size,
                'size_formatted': self.format_size(total_size),
                'parent': str(rel_path.parent) if rel_path.parent != Path('.') else None
            }
        except Exception as e:
            return {
                'path': str(folder_path.relative_to(self.root_path)),
                'name': folder_path.name,
                'depth': depth,
                'error': str(e)
            }
    
    def get_file_info(self, file_path: Path, depth: int) -> Dict:
        """Get comprehensive file information"""
        try:
            stat = file_path.stat()
            ext = file_path.suffix.lower().lstrip('.') or 'no-ext'
            rel_path = file_path.relative_to(self.root_path)
            
            return {
                'path': str(rel_path),
                'absolute_path': str(file_path),
                'name': file_path.name,
                'extension': ext,
                'size': stat.st_size,
                'size_formatted': self.format_size(stat.st_size),
                'depth': depth,
                'modified': datetime.fromtimestamp(stat.st_mtime).isoformat(),
                'created': datetime.fromtimestamp(stat.st_ctime).isoformat(),
                'parent': str(rel_path.parent) if rel_path.parent != Path('.') else None
            }
        except Exception as e:
            return {
                'path': str(file_path.relative_to(self.root_path)),
                'name': file_path.name,
                'depth': depth,
                'error': str(e)
            }
    
    def index_all(self) -> Dict:
        """Index all folders and files recursively"""
        print(f"{Colors.HEADER}{'='*80}{Colors.ENDC}")
        print(f"{Colors.BOLD}Indexing All Folders and Files (Unlimited Depth){Colors.ENDC}")
        print(f"{Colors.HEADER}{'='*80}{Colors.ENDC}\n")
        print(f"{Colors.CYAN}Root: {self.root_path}{Colors.ENDC}\n")
        
        def walk_directory(path: Path, depth: int = 0, parent_structure: Dict = None):
            """Recursively walk directory tree"""
            if self.should_exclude(path):
                return
            
            # Update max depth
            self.stats['max_depth'] = max(self.stats['max_depth'], depth)
            self.stats['folders_by_depth'][depth] += 1
            
            # Get folder info
            folder_info = self.get_folder_info(path, depth)
            self.index['folders'].append(folder_info)
            self.stats['total_folders'] += 1
            
            # Add to structure tree
            if parent_structure is None:
                parent_structure = self.index['structure']
            
            folder_key = path.name or str(path)
            if folder_key not in parent_structure:
                parent_structure[folder_key] = {
                    'info': folder_info,
                    'children': {}
                }
            
            current_structure = parent_structure[folder_key]['children']
            
            try:
                items = sorted(path.iterdir(), key=lambda x: (x.is_file(), x.name.lower()))
                
                for item in items:
                    if self.should_exclude(item):
                        continue
                    
                    if item.is_file():
                        file_info = self.get_file_info(item, depth + 1)
                        self.index['files'].append(file_info)
                        self.stats['total_files'] += 1
                        self.stats['total_size'] += file_info.get('size', 0)
                        
                        ext = file_info.get('extension', 'no-ext')
                        self.stats['files_by_type'][ext] += 1
                        self.stats['size_by_type'][ext] += file_info.get('size', 0)
                        
                        # Track largest files
                        if len(self.stats['largest_files']) < 100:
                            self.stats['largest_files'].append(file_info)
                        else:
                            self.stats['largest_files'].sort(key=lambda x: x.get('size', 0), reverse=True)
                            if file_info.get('size', 0) > self.stats['largest_files'][-1].get('size', 0):
                                self.stats['largest_files'][-1] = file_info
                                self.stats['largest_files'].sort(key=lambda x: x.get('size', 0), reverse=True)
                    
                    elif item.is_dir():
                        walk_directory(item, depth + 1, current_structure)
            
            except (PermissionError, OSError) as e:
                folder_info['error'] = str(e)
        
        # Start indexing from root
        walk_directory(self.root_path)
        
        # Sort largest files
        self.stats['largest_files'].sort(key=lambda x: x.get('size', 0), reverse=True)
        self.stats['largest_files'] = self.stats['largest_files'][:50]
        
        # Calculate largest folders
        folder_sizes = [(f, f.get('size', 0)) for f in self.index['folders']]
        folder_sizes.sort(key=lambda x: x[1], reverse=True)
        self.stats['largest_folders'] = [f[0] for f in folder_sizes[:50]]
        
        # Update index statistics
        self.index['statistics'] = {
            'total_folders': self.stats['total_folders'],
            'total_files': self.stats['total_files'],
            'total_size': self.stats['total_size'],
            'total_size_formatted': self.format_size(self.stats['total_size']),
            'max_depth': self.stats['max_depth'],
            'folders_by_depth': dict(self.stats['folders_by_depth']),
            'files_by_type': dict(self.stats['files_by_type']),
            'size_by_type': {k: self.format_size(v) for k, v in self.stats['size_by_type'].items()},
            'top_file_types': dict(sorted(
                self.stats['files_by_type'].items(), 
                key=lambda x: x[1], 
                reverse=True
            )[:20]),
            'largest_files': self.stats['largest_files'][:20],
            'largest_folders': self.stats['largest_folders'][:20]
        }
        
        print(f"{Colors.GREEN}✅ Indexing complete!{Colors.ENDC}")
        print(f"   Folders: {self.stats['total_folders']:,}")
        print(f"   Files: {self.stats['total_files']:,}")
        print(f"   Total Size: {self.format_size(self.stats['total_size'])}")
        print(f"   Max Depth: {self.stats['max_depth']}")
        
        return self.index
    
    def export_json(self, output_file: Optional[Path] = None) -> Path:
        """Export index to JSON file"""
        if output_file is None:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            output_file = self.root_path / f"folder_index_{timestamp}.json"
        
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(self.index, f, indent=2, ensure_ascii=False)
        
        print(f"{Colors.GREEN}✅ JSON index exported to: {output_file}{Colors.ENDC}")
        return output_file
    
    def export_csv(self, output_file: Optional[Path] = None) -> Path:
        """Export index to CSV file"""
        if output_file is None:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            output_file = self.root_path / f"folder_index_{timestamp}.csv"
        
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=[
                'type', 'path', 'name', 'size', 'size_formatted', 
                'extension', 'depth', 'file_count', 'dir_count', 'modified'
            ])
            writer.writeheader()
            
            # Write folders
            for folder in self.index['folders']:
                writer.writerow({
                    'type': 'folder',
                    'path': folder.get('path', ''),
                    'name': folder.get('name', ''),
                    'size': folder.get('size', 0),
                    'size_formatted': folder.get('size_formatted', ''),
                    'extension': '',
                    'depth': folder.get('depth', 0),
                    'file_count': folder.get('file_count', 0),
                    'dir_count': folder.get('dir_count', 0),
                    'modified': ''
                })
            
            # Write files
            for file in self.index['files']:
                writer.writerow({
                    'type': 'file',
                    'path': file.get('path', ''),
                    'name': file.get('name', ''),
                    'size': file.get('size', 0),
                    'size_formatted': file.get('size_formatted', ''),
                    'extension': file.get('extension', ''),
                    'depth': file.get('depth', 0),
                    'file_count': 0,
                    'dir_count': 0,
                    'modified': file.get('modified', '')
                })
        
        print(f"{Colors.GREEN}✅ CSV index exported to: {output_file}{Colors.ENDC}")
        return output_file
    
    def export_html(self, output_file: Optional[Path] = None) -> Path:
        """Export index to interactive HTML file"""
        if output_file is None:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            output_file = self.root_path / f"folder_index_{timestamp}.html"
        
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        stats = self.index['statistics']
        
        html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AVATARARTS Folder Index - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: #f5f5f5;
            color: #333;
            line-height: 1.6;
            padding: 20px;
        }}
        .container {{
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 30px;
        }}
        h1 {{
            color: #4361ee;
            margin-bottom: 10px;
        }}
        .stats {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }}
        .stat-card {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }}
        .stat-card h3 {{
            font-size: 2em;
            margin-bottom: 5px;
        }}
        .stat-card p {{
            opacity: 0.9;
        }}
        .controls {{
            margin: 20px 0;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
        }}
        .controls input {{
            padding: 10px;
            width: 100%;
            max-width: 400px;
            border: 2px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        }}
        .tree {{
            margin-top: 20px;
        }}
        .folder {{
            margin: 5px 0;
            padding: 8px;
            border-left: 3px solid #4361ee;
            background: #f8f9fa;
            cursor: pointer;
            user-select: none;
        }}
        .folder:hover {{
            background: #e9ecef;
        }}
        .folder-name {{
            font-weight: bold;
            color: #4361ee;
        }}
        .file {{
            margin: 2px 0;
            padding: 5px 5px 5px 30px;
            color: #666;
            font-size: 0.9em;
        }}
        .file:hover {{
            background: #f8f9fa;
        }}
        .hidden {{
            display: none;
        }}
        .meta {{
            font-size: 0.85em;
            color: #999;
            margin-left: 10px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>📁 AVATARARTS Folder Index</h1>
        <p><strong>Root:</strong> {self.index['root']}</p>
        <p><strong>Generated:</strong> {self.index['generated']}</p>
        
        <div class="stats">
            <div class="stat-card">
                <h3>{stats['total_folders']:,}</h3>
                <p>Folders</p>
            </div>
            <div class="stat-card">
                <h3>{stats['total_files']:,}</h3>
                <p>Files</p>
            </div>
            <div class="stat-card">
                <h3>{stats['total_size_formatted']}</h3>
                <p>Total Size</p>
            </div>
            <div class="stat-card">
                <h3>{stats['max_depth']}</h3>
                <p>Max Depth</p>
            </div>
        </div>
        
        <div class="controls">
            <input type="text" id="searchInput" placeholder="Search folders and files..." onkeyup="filterItems()">
        </div>
        
        <div class="tree" id="tree">
            {self._generate_html_tree()}
        </div>
    </div>
    
    <script>
        const indexData = {json.dumps(self.index, ensure_ascii=False)};
        
        function filterItems() {{
            const input = document.getElementById('searchInput');
            const filter = input.value.toLowerCase();
            const items = document.querySelectorAll('.folder, .file');
            
            items.forEach(item => {{
                const text = item.textContent.toLowerCase();
                if (text.includes(filter)) {{
                    item.classList.remove('hidden');
                }} else {{
                    item.classList.add('hidden');
                }}
            }});
        }}
        
        document.querySelectorAll('.folder').forEach(folder => {{
            folder.addEventListener('click', function() {{
                const children = this.nextElementSibling;
                if (children && children.classList.contains('folder-children')) {{
                    children.classList.toggle('hidden');
                }}
            }});
        }});
    </script>
</body>
</html>
"""
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        print(f"{Colors.GREEN}✅ HTML index exported to: {output_file}{Colors.ENDC}")
        return output_file
    
    def _generate_html_tree(self) -> str:
        """Generate HTML tree structure"""
        def build_tree(structure: Dict, indent: int = 0) -> str:
            html = ""
            for key, data in sorted(structure.items()):
                info = data.get('info', {})
                children = data.get('children', {})
                
                indent_str = "&nbsp;" * (indent * 4)
                folder_class = "folder"
                folder_name = info.get('name', key)
                folder_path = info.get('path', '')
                file_count = info.get('file_count', 0)
                dir_count = info.get('dir_count', 0)
                size = info.get('size_formatted', '')
                
                html += f'<div class="{folder_class}">{indent_str}📁 <span class="folder-name">{folder_name}</span>'
                html += f'<span class="meta">({file_count} files, {dir_count} dirs, {size})</span></div>'
                
                if children:
                    html += f'<div class="folder-children">{build_tree(children, indent + 1)}</div>'
            
            return html
        
        return build_tree(self.index['structure'])


def main():
    """Main function"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='Index all folders and files to unlimited depth',
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    
    parser.add_argument('--root', type=str, default='.', help='Root directory to index')
    parser.add_argument('--output-dir', type=str, help='Output directory for index files')
    parser.add_argument('--format', type=str, nargs='+', choices=['json', 'csv', 'html', 'all'], 
                       default=['json'], help='Output format(s)')
    parser.add_argument('--exclude', type=str, nargs='+', help='Additional directories to exclude')
    
    args = parser.parse_args()
    
    root_path = Path(args.root).resolve()
    output_dir = Path(args.output_dir) if args.output_dir else root_path
    
    exclude_dirs = {
        '.git', '.github', '.history', '__pycache__', 
        'node_modules', '.next', '.venv', 'venv', 'env',
        '.DS_Store', '.vscode', '.idea', 'dist', 'build'
    }
    if args.exclude:
        exclude_dirs.update(args.exclude)
    
    # Create indexer
    indexer = FolderIndexer(root_path=root_path, exclude_dirs=exclude_dirs)
    
    # Index everything
    indexer.index_all()
    
    # Export in requested formats
    formats = args.format if 'all' not in args.format else ['json', 'csv', 'html']
    
    for fmt in formats:
        if fmt == 'json':
            indexer.export_json(output_dir / f"folder_index_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json")
        elif fmt == 'csv':
            indexer.export_csv(output_dir / f"folder_index_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv")
        elif fmt == 'html':
            indexer.export_html(output_dir / f"folder_index_{datetime.now().strftime('%Y%m%d_%H%M%S')}.html")
    
    print(f"\n{Colors.GREEN}{'='*80}{Colors.ENDC}")
    print(f"{Colors.BOLD}✅ Indexing complete!{Colors.ENDC}")
    print(f"{Colors.GREEN}{'='*80}{Colors.ENDC}")


if __name__ == '__main__':
    main()
