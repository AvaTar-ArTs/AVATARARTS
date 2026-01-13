#!/usr/bin/env python3
"""
Open CSV file directly in Google Sheets using import URL method.

This creates a more reliable import by using Google Sheets' import functionality.
"""

import sys
from pathlib import Path
import argparse
import webbrowser
import base64
from urllib.parse import quote

def create_direct_import_url(csv_path: Path):
    """
    Create a Google Sheets import URL.

    Note: Google Sheets can import CSV from:
    1. Publicly accessible URLs
    2. File upload (via File > Import)
    3. Clipboard paste

    For local files, we'll create an HTML page that:
    - Offers multiple import methods
    - Uses the most reliable approach
    """

    csv_path = Path(csv_path).expanduser()
    if not csv_path.exists():
        print(f"❌ Error: CSV file not found: {csv_path}")
        sys.exit(1)

    # Read CSV content
    with open(csv_path, 'r', encoding='utf-8') as f:
        csv_content = f.read()

    # Create improved HTML with multiple import methods
    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSV to Google Sheets - Direct Import</title>
    <style>
        * {{
            box-sizing: border-box;
        }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            padding: 20px;
            max-width: 900px;
            margin: 0 auto;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }}
        .container {{
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }}
        h1 {{
            color: #1a73e8;
            margin-bottom: 10px;
            font-size: 28px;
        }}
        .subtitle {{
            color: #666;
            margin-bottom: 30px;
        }}
        .method-card {{
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 15px 0;
            border-left: 4px solid #1a73e8;
        }}
        .method-card h3 {{
            margin-top: 0;
            color: #1a73e8;
        }}
        .method-card.recommended {{
            background: #e8f0fe;
            border-left-color: #34a853;
        }}
        button {{
            background: #1a73e8;
            color: white;
            border: none;
            padding: 14px 28px;
            font-size: 16px;
            font-weight: 500;
            border-radius: 6px;
            cursor: pointer;
            margin: 8px 5px;
            transition: all 0.3s;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}
        button:hover {{
            background: #1557b0;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }}
        button.secondary {{
            background: #34a853;
        }}
        button.secondary:hover {{
            background: #2d8e47;
        }}
        .info-box {{
            background: #fff3cd;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            border-left: 4px solid #ffc107;
        }}
        .success-box {{
            background: #d4edda;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            border-left: 4px solid #28a745;
        }}
        .csv-preview {{
            background: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            max-height: 200px;
            overflow: auto;
            font-family: 'Courier New', monospace;
            font-size: 11px;
            white-space: pre-wrap;
            margin: 20px 0;
            border: 1px solid #ddd;
        }}
        .step-list {{
            padding-left: 20px;
        }}
        .step-list li {{
            margin: 8px 0;
        }}
        .badge {{
            background: #34a853;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            margin-left: 10px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>📊 CSV to Google Sheets Import</h1>
        <p class="subtitle">File: <strong>{csv_path.name}</strong> ({len(csv_content.splitlines())} rows)</p>

        <div class="method-card recommended">
            <h3>🚀 Method 1: Direct Import (Recommended) <span class="badge">EASIEST</span></h3>
            <p>Downloads CSV and opens Google Sheets with import instructions.</p>
            <button class="secondary" onclick="directImport()">📥 Download & Import Now</button>
            <ol class="step-list">
                <li>CSV will download automatically</li>
                <li>Google Sheets will open in a new tab</li>
                <li>Click <strong>File > Import > Upload</strong></li>
                <li>Select the downloaded CSV file</li>
                <li>Choose import settings and click <strong>Import Data</strong></li>
            </ol>
        </div>

        <div class="method-card">
            <h3>📋 Method 2: Clipboard Paste</h3>
            <p>Copy CSV to clipboard, then paste into Google Sheets.</p>
            <button onclick="clipboardImport()">📋 Copy & Open Sheets</button>
            <ol class="step-list">
                <li>CSV data copied to clipboard</li>
                <li>Google Sheets opens in new tab</li>
                <li>Click cell <strong>A1</strong></li>
                <li>Press <strong>Ctrl+V</strong> (Windows) or <strong>Cmd+V</strong> (Mac)</li>
                <li>Click "Split text to columns" if prompted</li>
            </ol>
        </div>

        <div class="info-box">
            <strong>💡 Tip:</strong> Method 1 (File Import) is most reliable for preserving formatting and handling large files.
        </div>

        <h3>📄 CSV Preview (first 30 lines):</h3>
        <div class="csv-preview" id="csvPreview">{escape_html('\n'.join(csv_content.splitlines()[:30]))}</div>

        <script>
            const csvContent = {repr(csv_content)};
            const csvFileName = '{csv_path.name}';

            function directImport() {{
                // Download CSV file
                const blob = new Blob([csvContent], {{ type: 'text/csv;charset=utf-8;' }});
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = csvFileName;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                // Open Google Sheets
                setTimeout(() => {{
                    window.open('https://sheets.new', '_blank');

                    // Show success message
                    const successBox = document.createElement('div');
                    successBox.className = 'success-box';
                    successBox.innerHTML = `
                        <strong>✅ CSV Downloaded!</strong><br>
                        Google Sheets opened in new tab.<br>
                        <strong>Next steps:</strong><br>
                        1. In Google Sheets, click <strong>File > Import</strong><br>
                        2. Click <strong>Upload</strong> and select: <strong>${{csvFileName}}</strong><br>
                        3. Choose import settings (defaults usually work)<br>
                        4. Click <strong>Import Data</strong>
                    `;
                    document.querySelector('.info-box').replaceWith(successBox);
                }}, 500);
            }}

            function clipboardImport() {{
                // Copy to clipboard
                navigator.clipboard.writeText(csvContent).then(function() {{
                    // Open Google Sheets
                    window.open('https://sheets.new', '_blank');

                    // Show instructions
                    alert('✅ CSV copied to clipboard!\\n\\n📋 INSTRUCTIONS:\\n\\n1. In the Google Sheets tab that just opened\\n2. Click cell A1\\n3. Press Ctrl+V (Windows) or Cmd+V (Mac)\\n4. Click "Split text to columns" if prompted\\n\\n💡 The data will be automatically formatted!');
                }}, function(err) {{
                    // Fallback
                    const textArea = document.createElement('textarea');
                    textArea.value = csvContent;
                    textArea.style.position = 'fixed';
                    textArea.style.left = '-999999px';
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);

                    window.open('https://sheets.new', '_blank');
                    alert('✅ CSV copied to clipboard!\\n\\nClick A1 in Google Sheets and press Ctrl+V / Cmd+V');
                }});
            }}
        </script>
    </div>
</body>
</html>"""

    return html_content


def escape_html(text):
    """Escape HTML special characters."""
    return (text
            .replace('&', '&amp;')
            .replace('<', '&lt;')
            .replace('>', '&gt;')
            .replace('"', '&quot;')
            .replace("'", '&#x27;')
            .replace('\n', '<br>'))


def repr(text):
    """JavaScript-safe string representation."""
    # Escape for JavaScript string literal
    escaped = text.replace('\\', '\\\\').replace('`', '\\`').replace('$', '\\$')
    return f'`{escaped}`'


def main():
    parser = argparse.ArgumentParser(description="Open CSV in Google Sheets with direct import")
    parser.add_argument("csv_file", type=str, help="Path to CSV file")
    parser.add_argument("--html", type=str, default=None,
                        help="Output HTML file path")
    parser.add_argument("--open", action="store_true",
                        help="Automatically open HTML in browser")

    args = parser.parse_args()

    csv_path = Path(args.csv_file).expanduser()
    if not csv_path.exists():
        print(f"❌ Error: CSV file not found: {csv_path}")
        sys.exit(1)

    html_content = create_direct_import_url(csv_path)

    # Save HTML file
    if args.html:
        html_path = Path(args.html).expanduser()
    else:
        html_path = csv_path.parent / f"{csv_path.stem}_sheets_import.html"

    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html_content)

    print(f"✅ Enhanced HTML file created: {html_path}")

    if args.open:
        print(f"🌐 Opening {html_path.name} in browser...")
        webbrowser.open(f"file://{html_path.absolute()}")
        print("✅ HTML opened in browser!")
    else:
        print(f"\n💡 To open: open '{html_path}'")
        print("   Or use: python3 open_csv_to_sheets_direct.py <csv_file> --open")


if __name__ == '__main__':
    main()
