#!/usr/bin/env python3
"""
Generate HTML directory listing pages for all directories in AVATARARTS workspace
Creates index.html files similar to avatararts.org/seo/ structure
"""

import os
from pathlib import Path
from datetime import datetime

BASE_DIR = Path("/Users/steven/AVATARARTS")
TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - AVATARARTS Directory</title>
    <meta name="description" content="{description}">
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
            overflow: hidden;
        }}

        header {{
            background: linear-gradient(135deg, {color1} 0%, {color2} 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }}

        header h1 {{
            font-size: 2.5em;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }}

        header p {{
            opacity: 0.95;
            font-size: 1.1em;
            margin-top: 10px;
        }}

        .breadcrumb {{
            background: #f8f9fa;
            padding: 15px 30px;
            border-bottom: 1px solid #dee2e6;
            font-size: 0.9em;
        }}

        .breadcrumb a {{
            color: {color1};
            text-decoration: none;
        }}

        .breadcrumb a:hover {{
            text-decoration: underline;
        }}

        .directory-listing {{
            padding: 30px;
        }}

        .directory-header {{
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid {color1};
        }}

        .directory-header h2 {{
            font-size: 1.8em;
            color: {color1};
            margin-bottom: 10px;
        }}

        .search-box {{
            padding: 20px 30px;
            background: #f8f9fa;
            border-bottom: 1px solid #dee2e6;
        }}

        .search-box input {{
            width: 100%;
            padding: 12px 20px;
            border: 2px solid #dee2e6;
            border-radius: 6px;
            font-size: 1em;
            transition: all 0.3s;
        }}

        .search-box input:focus {{
            outline: none;
            border-color: {color1};
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }}

        table {{
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }}

        thead {{
            background: {color1};
            color: white;
        }}

        th {{
            text-align: left;
            padding: 15px;
            font-weight: 600;
            font-size: 0.95em;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }}

        td {{
            padding: 12px 15px;
            border-bottom: 1px solid #e9ecef;
        }}

        tbody tr:hover {{
            background: #f8f9fa;
        }}

        .icon {{
            width: 30px;
            text-align: center;
            font-size: 1.3em;
        }}

        .name {{
            font-weight: 500;
        }}

        .name a {{
            color: {color1};
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 10px;
        }}

        .name a:hover {{
            text-decoration: underline;
            color: {color2};
        }}

        .size {{
            color: #6c757d;
            font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
            font-size: 0.9em;
        }}

        .type {{
            color: #6c757d;
            font-size: 0.9em;
        }}

        .folder-icon {{
            color: #ffc107;
        }}

        .file-icon {{
            color: #6c757d;
        }}

        .parent-dir {{
            background: #e7f3ff;
            font-weight: 600;
        }}

        .parent-dir a {{
            color: #0066cc;
        }}

        .stats {{
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 30px;
            border-top: 3px solid {color1};
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
        }}

        .stat-item {{
            text-align: center;
            padding: 15px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}

        .stat-label {{
            font-size: 0.85em;
            color: #6c757d;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
        }}

        .stat-value {{
            font-size: 2em;
            font-weight: bold;
            color: {color1};
        }}
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>{header_icon} {header_title}</h1>
            <p>{header_subtitle}</p>
            <p style="font-size: 0.9em; margin-top: 15px; opacity: 0.9;">Base URL: avatararts.org{base_path}/ | Last Updated: {date}</p>
        </header>

        <div class="breadcrumb">
            {breadcrumb}
        </div>

        <div class="search-box">
            <input type="text" id="searchInput" placeholder="🔍 Search files and folders..." autocomplete="off">
        </div>

        <div class="directory-listing">
            <div class="directory-header">
                <h2>📂 Directory: {directory_path}</h2>
                <p>{directory_description}</p>
            </div>

            <table>
                <thead>
                    <tr>
                        <th class="icon"></th>
                        <th class="name">Name</th>
                        <th class="size">Size</th>
                        <th class="type">Type</th>
                    </tr>
                </thead>
                <tbody id="fileTable">
                    {table_rows}
                </tbody>
            </table>
        </div>

        <div class="stats">
            <div class="stat-item">
                <div class="stat-label">Total Items</div>
                <div class="stat-value">{total_items}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Directories</div>
                <div class="stat-value">{total_dirs}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Files</div>
                <div class="stat-value">{total_files}</div>
            </div>
        </div>
    </div>

    <script>
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', function(e) {{
            const searchTerm = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('#fileTable tr');

            rows.forEach(row => {{
                const text = row.textContent.toLowerCase();
                if (text.includes(searchTerm)) {{
                    row.style.display = '';
                }} else {{
                    row.style.display = 'none';
                }}
            }});
        }});
    </script>
</body>
</html>"""

def get_directory_info(dir_path):
    """Get information about a directory for styling"""
    dir_name = dir_path.name

    # Color schemes based on directory type
    schemes = {
        '00_ACTIVE': ('#667eea', '#764ba2', '📁', 'Active Projects & Development'),
        '01_TOOLS': ('#17a2b8', '#138496', '⚙️', 'Tools & Utilities'),
        '02_DOCUMENTATION': ('#6f42c1', '#5a32a3', '📚', 'Documentation & Guides'),
        '03_ARCHIVES': ('#6c757d', '#5a6268', '📦', 'Archived Content'),
        '04_WEBSITES': ('#e83e8c', '#d91a72', '🌐', 'Website Projects'),
        '05_DATA': ('#20c997', '#1aa179', '💾', 'Data Files & Databases'),
        '06_SEO_MARKETING': ('#28a745', '#20c997', '📈', 'SEO & Marketing'),
        '07_MISC': ('#fd7e14', '#dc6502', '📦', 'Miscellaneous'),
        'BUSINESS': ('#dc3545', '#c82333', '💼', 'Business Projects'),
        'Revenue': ('#ffc107', '#e0a800', '💰', 'Revenue Generation'),
        'DATABASES': ('#20c997', '#1aa179', '💾', 'Database Files'),
        'INDEXES': ('#6f42c1', '#5a32a3', '📇', 'Generated Indexes'),
        'docs-docusaurus': ('#2e86ab', '#1e6a85', '📚', 'Docusaurus Documentation'),
        'docs-mkdocs': ('#2e86ab', '#1e6a85', '📚', 'MkDocs Documentation'),
        'docs-sphinx': ('#2e86ab', '#1e6a85', '📚', 'Sphinx Documentation'),
        'docs-vitepress': ('#2e86ab', '#1e6a85', '📚', 'VitePress Documentation'),
        'Sorted': ('#6c757d', '#5a6268', '📁', 'Sorted Documentation'),
        'seo': ('#28a745', '#20c997', '📈', 'SEO Resources'),
    }

    # Default scheme
    default = ('#667eea', '#764ba2', '📁', 'Directory')

    return schemes.get(dir_name, default)

def format_size(size_bytes):
    """Format file size in human-readable format"""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.1f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.1f} TB"

def get_file_type(filename):
    """Determine file type from extension"""
    ext = Path(filename).suffix.lower()
    types = {
        '.md': 'Markdown',
        '.py': 'Python',
        '.sh': 'Shell Script',
        '.js': 'JavaScript',
        '.html': 'HTML',
        '.css': 'CSS',
        '.json': 'JSON',
        '.csv': 'CSV',
        '.txt': 'Text',
        '.xml': 'XML',
        '.db': 'Database',
        '.sqlite': 'Database',
    }
    return types.get(ext, 'File')

def generate_breadcrumb(current_path, base_dir):
    """Generate breadcrumb navigation"""
    rel_path = current_path.relative_to(base_dir)
    parts = ['<a href="/">Home</a>']

    if rel_path == Path('.'):
        parts.append('<span>Root</span>')
    else:
        path_parts = rel_path.parts
        current = Path('/')
        for i, part in enumerate(path_parts):
            current = current / part
            if i == len(path_parts) - 1:
                parts.append(f'<span>{part}</span>')
            else:
                parts.append(f'<a href="{current}/">{part}</a>')

    return ' / '.join(parts)

def generate_directory_listing(dir_path, base_dir):
    """Generate HTML directory listing for a directory"""
    if not dir_path.exists() or not dir_path.is_dir():
        return

    # Get directory info
    color1, color2, icon, description = get_directory_info(dir_path)

    # Build breadcrumb
    breadcrumb = generate_breadcrumb(dir_path, base_dir)

    # Get relative path for base URL
    rel_path = dir_path.relative_to(base_dir)
    if rel_path == Path('.'):
        base_path = ''
        directory_path = '/Users/steven/AVATARARTS/'
    else:
        base_path = '/' + '/'.join(rel_path.parts)
        directory_path = str(dir_path) + '/'

    # Build table rows
    rows = []

    # Parent directory link
    if rel_path != Path('.'):
        parent_path = dir_path.parent.relative_to(base_dir)
        if parent_path == Path('.'):
            parent_link = '../'
        else:
            parent_link = '../' * len(rel_path.parts)
        rows.append(f'''<tr class="parent-dir">
            <td class="icon">📁</td>
            <td class="name"><a href="{parent_link}">..</a></td>
            <td class="size">-</td>
            <td class="type">Parent Directory</td>
        </tr>''')

    # Get all items in directory
    items = []
    try:
        for item in sorted(dir_path.iterdir()):
            if item.name.startswith('.'):
                continue
            items.append(item)
    except PermissionError:
        pass

    # Separate directories and files
    dirs = [item for item in items if item.is_dir()]
    files = [item for item in items if item.is_file()]

    # Add directories
    for item in sorted(dirs):
        item_name = item.name
        rows.append(f'''<tr>
            <td class="icon folder-icon">📁</td>
            <td class="name"><a href="{item_name}/">{item_name}/</a></td>
            <td class="size">-</td>
            <td class="type">Directory</td>
        </tr>''')

    # Add files
    for item in sorted(files):
        item_name = item.name
        try:
            size = item.stat().st_size
            size_str = format_size(size)
        except:
            size_str = '-'
        file_type = get_file_type(item_name)
        rows.append(f'''<tr>
            <td class="icon file-icon">📄</td>
            <td class="name"><a href="{item_name}">{item_name}</a></td>
            <td class="size">{size_str}</td>
            <td class="type">{file_type}</td>
        </tr>''')

    table_rows = '\n                    '.join(rows)

    # Generate HTML
    html = TEMPLATE.format(
        title=dir_path.name if rel_path != Path('.') else 'AVATARARTS',
        description=description,
        color1=color1,
        color2=color2,
        header_icon=icon,
        header_title=dir_path.name if rel_path != Path('.') else 'AVATARARTS Directory',
        header_subtitle=description,
        base_path=base_path,
        date=datetime.now().strftime('%B %d, %Y %I:%M %p'),
        breadcrumb=breadcrumb,
        directory_path=directory_path,
        directory_description=description,
        table_rows=table_rows,
        total_items=len(items),
        total_dirs=len(dirs),
        total_files=len(files)
    )

    # Write index.html
    index_file = dir_path / 'index.html'
    index_file.write_text(html, encoding='utf-8')
    print(f"✅ Created: {index_file}")

def main():
    """Generate directory listings for all major directories"""
    directories = [
        BASE_DIR,  # Root
        BASE_DIR / '00_ACTIVE',
        BASE_DIR / '01_TOOLS',
        BASE_DIR / '02_DOCUMENTATION',
        BASE_DIR / '03_ARCHIVES',
        BASE_DIR / '04_WEBSITES',
        BASE_DIR / '05_DATA',
        BASE_DIR / '06_SEO_MARKETING',
        BASE_DIR / '07_MISC',
        BASE_DIR / 'BUSINESS',
        BASE_DIR / 'Revenue',
        BASE_DIR / 'DATABASES',
        BASE_DIR / 'INDEXES',
        BASE_DIR / 'docs-docusaurus',
        BASE_DIR / 'docs-mkdocs',
        BASE_DIR / 'docs-sphinx',
        BASE_DIR / 'docs-vitepress',
        BASE_DIR / 'Sorted',
        BASE_DIR / 'seo',
        BASE_DIR / 'assets',
        BASE_DIR / 'content',
        BASE_DIR / 'scripts',
    ]

    print("🚀 Generating HTML directory listings...")
    print("=" * 60)

    for dir_path in directories:
        if dir_path.exists() and dir_path.is_dir():
            generate_directory_listing(dir_path, BASE_DIR)
        else:
            print(f"⏭️  Skipped (not found): {dir_path}")

    print("=" * 60)
    print("✅ Directory listing generation complete!")

if __name__ == '__main__':
    main()
