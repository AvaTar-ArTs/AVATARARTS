#!/usr/bin/env python3
"""
Generate complete web structure with linked pages for all folders
Creates a full website in /Users/steven/AVATARARTS/all where each folder is a page
"""

import os
import shutil
from pathlib import Path
from datetime import datetime
from urllib.parse import quote

BASE_DIR = Path("/Users/steven/AVATARARTS")
OUTPUT_DIR = BASE_DIR / "all"  # Local output directory
WEB_BASE_PATH = "/SEO-revenue/all"  # Web base path: avatararts.org/SEO-revenue/all/
MAX_DEPTH = 5  # Limit recursion depth

HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - AVATARARTS</title>
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

        .navigation {{
            background: #f8f9fa;
            padding: 15px 30px;
            border-bottom: 1px solid #dee2e6;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 10px;
        }}

        .breadcrumb {{
            font-size: 0.9em;
        }}

        .breadcrumb a {{
            color: {color1};
            text-decoration: none;
        }}

        .breadcrumb a:hover {{
            text-decoration: underline;
        }}

        .nav-links {{
            display: flex;
            gap: 15px;
        }}

        .nav-links a {{
            color: {color1};
            text-decoration: none;
            padding: 5px 10px;
            border-radius: 4px;
            transition: background 0.2s;
        }}

        .nav-links a:hover {{
            background: rgba(102, 126, 234, 0.1);
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

        .subdirectories {{
            margin-top: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
        }}

        .subdirectories h3 {{
            color: {color1};
            margin-bottom: 15px;
        }}

        .subdir-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 15px;
        }}

        .subdir-card {{
            background: white;
            padding: 15px;
            border-radius: 6px;
            border: 2px solid #e9ecef;
            transition: all 0.3s;
        }}

        .subdir-card:hover {{
            border-color: {color1};
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            transform: translateY(-2px);
        }}

        .subdir-card a {{
            color: {color1};
            text-decoration: none;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
        }}

        .subdir-card a:hover {{
            text-decoration: underline;
        }}
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>{header_icon} {header_title}</h1>
            <p>{header_subtitle}</p>
            <p style="font-size: 0.9em; margin-top: 15px; opacity: 0.9;">Base URL: avatararts.org{web_base_path}{base_path}/ | Path: {directory_path} | Updated: {date}</p>
        </header>

        <div class="navigation">
            <div class="breadcrumb">
                {breadcrumb}
            </div>
            <div class="nav-links">
                <a href="{home_link}">🏠 Home</a>
                <a href="{parent_link}">⬆️ Parent</a>
            </div>
        </div>

        <div class="search-box">
            <input type="text" id="searchInput" placeholder="🔍 Search files and folders..." autocomplete="off">
        </div>

        <div class="directory-listing">
            <div class="directory-header">
                <h2>📂 {display_path}</h2>
                <p>{directory_description}</p>
            </div>

            {subdirectories_section}

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
            const cards = document.querySelectorAll('.subdir-card');

            rows.forEach(row => {{
                const text = row.textContent.toLowerCase();
                if (text.includes(searchTerm)) {{
                    row.style.display = '';
                }} else {{
                    row.style.display = 'none';
                }}
            }});

            cards.forEach(card => {{
                const text = card.textContent.toLowerCase();
                if (text.includes(searchTerm)) {{
                    card.style.display = '';
                }} else {{
                    card.style.display = 'none';
                }}
            }});
        }});
    </script>
</body>
</html>"""

def get_directory_info(dir_path, base_dir):
    """Get information about a directory for styling"""
    rel_path = dir_path.relative_to(base_dir)
    dir_name = rel_path.parts[-1] if rel_path != Path('.') else 'AVATARARTS'

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
    if size_bytes == 0:
        return '-'
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

def generate_breadcrumb(current_path, base_dir, output_dir):
    """Generate breadcrumb navigation"""
    rel_path = current_path.relative_to(base_dir)

    parts = ['<a href="index.html">Home</a>']

    if rel_path == Path('.'):
        parts.append('<span>Root</span>')
    else:
        path_parts = rel_path.parts
        current = Path('.')
        for i, part in enumerate(path_parts):
            current = current / part
            if i == len(path_parts) - 1:
                parts.append(f'<span>{part}</span>')
            else:
                # Link to index.html in that directory
                link_path = str(current / 'index.html').replace('\\', '/')
                parts.append(f'<a href="{link_path}">{part}</a>')

    return ' / '.join(parts)

def get_relative_link(from_rel_path, to_rel_path):
    """Get relative link path between two directories based on their relative paths from base"""
    from_parts = from_rel_path.parts if from_rel_path != Path('.') else []
    to_parts = to_rel_path.parts if to_rel_path != Path('.') else []

    # Find common prefix
    common_len = 0
    for i in range(min(len(from_parts), len(to_parts))):
        if from_parts[i] == to_parts[i]:
            common_len += 1
        else:
            break

    # Build relative path
    up_levels = len(from_parts) - common_len
    down_parts = to_parts[common_len:]

    path = '../' * up_levels + '/'.join(down_parts)
    if path and not path.endswith('/'):
        path += '/'
    if not path:
        path = './'

    return path + 'index.html'

def generate_page_for_directory(source_dir, output_dir, base_dir, depth=0):
    """Generate HTML page for a directory"""
    if depth > MAX_DEPTH:
        return

    if not source_dir.exists() or not source_dir.is_dir():
        return

    # Create corresponding output directory
    rel_path = source_dir.relative_to(base_dir)
    if rel_path == Path('.'):
        output_path = output_dir
    else:
        output_path = output_dir / rel_path

    output_path.mkdir(parents=True, exist_ok=True)

    # Get directory info
    color1, color2, icon, description = get_directory_info(source_dir, base_dir)

    # Build breadcrumb
    breadcrumb = generate_breadcrumb(source_dir, base_dir, output_dir)

    # Get paths
    if rel_path == Path('.'):
        display_path = '/Users/steven/AVATARARTS/'
        base_path = ''
        web_base_path = WEB_BASE_PATH
        home_link = 'index.html'
        parent_link = 'index.html'
    else:
        display_path = str(source_dir) + '/'
        base_path = '/' + '/'.join(rel_path.parts)
        web_base_path = WEB_BASE_PATH
        home_link = '../' * len(rel_path.parts) + 'index.html'
        parent_rel_path = source_dir.parent.relative_to(base_dir)
        parent_link = get_relative_link(rel_path, parent_rel_path)

    # Build table rows
    rows = []
    subdirs = []

    # Get all items in directory
    items = []
    try:
        for item in sorted(source_dir.iterdir()):
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
        # URL encode the name for the link
        encoded_name = quote(item_name, safe='')
        link = f"{encoded_name}/index.html"
        rows.append(f'''<tr>
            <td class="icon folder-icon">📁</td>
            <td class="name"><a href="{link}">{item_name}/</a></td>
            <td class="size">-</td>
            <td class="type">Directory</td>
        </tr>''')

        # Add to subdirectories section
        subdirs.append(f'''<div class="subdir-card">
            <a href="{link}">📁 {item_name}/</a>
        </div>''')

    # Add files
    for item in sorted(files):
        item_name = item.name
        encoded_name = quote(item_name, safe='')
        try:
            size = item.stat().st_size
            size_str = format_size(size)
        except:
            size_str = '-'
        file_type = get_file_type(item_name)
        rows.append(f'''<tr>
            <td class="icon file-icon">📄</td>
            <td class="name"><a href="{encoded_name}">{item_name}</a></td>
            <td class="size">{size_str}</td>
            <td class="type">{file_type}</td>
        </tr>''')

    table_rows = '\n                    '.join(rows)

    # Subdirectories section
    if subdirs:
        subdirs_section = f'''<div class="subdirectories">
            <h3>📁 Subdirectories</h3>
            <div class="subdir-grid">
                {''.join(subdirs)}
            </div>
        </div>'''
    else:
        subdirs_section = ''

    # Generate HTML
    html = HTML_TEMPLATE.format(
        title=rel_path.parts[-1] if rel_path != Path('.') else 'AVATARARTS',
        description=description,
        color1=color1,
        color2=color2,
        header_icon=icon,
        header_title=rel_path.parts[-1] if rel_path != Path('.') else 'AVATARARTS',
        header_subtitle=description,
        web_base_path=web_base_path,
        base_path=base_path,
        directory_path=display_path,
        date=datetime.now().strftime('%B %d, %Y %I:%M %p'),
        breadcrumb=breadcrumb,
        home_link=home_link,
        parent_link=parent_link,
        display_path=display_path,
        directory_description=description,
        subdirectories_section=subdirs_section,
        table_rows=table_rows,
        total_items=len(items),
        total_dirs=len(dirs),
        total_files=len(files)
    )

    # Write index.html
    index_file = output_path / 'index.html'
    index_file.write_text(html, encoding='utf-8')
    print(f"✅ Created: {index_file} ({len(dirs)} dirs, {len(files)} files)")

    # Recursively process subdirectories
    for subdir in dirs:
        generate_page_for_directory(subdir, output_dir, base_dir, depth + 1)

def main():
    """Generate complete web structure"""
    print("🚀 Generating complete web structure...")
    print("=" * 60)
    print(f"Source: {BASE_DIR}")
    print(f"Output: {OUTPUT_DIR}")
    print("=" * 60)

    # Create output directory
    OUTPUT_DIR.mkdir(exist_ok=True)

    # Generate pages starting from root
    generate_page_for_directory(BASE_DIR, OUTPUT_DIR, BASE_DIR)

    print("=" * 60)
    print("✅ Complete web structure generation finished!")
    print(f"📁 Output directory: {OUTPUT_DIR}")
    print(f"🌐 Open: {OUTPUT_DIR / 'index.html'}")

if __name__ == '__main__':
    main()
