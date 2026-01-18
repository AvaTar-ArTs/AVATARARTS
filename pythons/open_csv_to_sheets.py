#!/usr/bin/env python3
"""
Open CSV file in Google Sheets with automatic import.

Creates a local HTML file that loads the CSV and opens Google Sheets
with the data ready to paste.
"""

import sys
from pathlib import Path
import argparse
import webbrowser
from urllib.parse import quote
import json

def create_sheets_import_html(csv_path: Path, output_html: Path = None):
    """Create HTML file that opens CSV in Google Sheets."""

    csv_path = Path(csv_path).expanduser()
    if not csv_path.exists():
        print(f"❌ Error: CSV file not found: {csv_path}")
        sys.exit(1)

    # Read CSV content
    with open(csv_path, 'r', encoding='utf-8') as f:
        csv_content = f.read()

    # Encode CSV as base64 for data URI
    import base64
    csv_base64 = base64.b64encode(csv_content.encode('utf-8')).decode('utf-8')

    # Create HTML that opens Google Sheets and prepares data
    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Open CSV in Google Sheets</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
            background: #f5f5f5;
        }}
        .container {{
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}
        h1 {{
            color: #1a73e8;
            margin-bottom: 20px;
        }}
        .info {{
            background: #e8f0fe;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
        }}
        button {{
            background: #1a73e8;
            color: white;
            border: none;
            padding: 12px 24px;
            font-size: 16px;
            border-radius: 4px;
            cursor: pointer;
            margin: 10px 5px;
        }}
        button:hover {{
            background: #1557b0;
        }}
        .csv-preview {{
            background: #f8f9fa;
            padding: 15px;
            border-radius: 4px;
            max-height: 300px;
            overflow: auto;
            font-family: monospace;
            font-size: 12px;
            white-space: pre-wrap;
            margin: 20px 0;
        }}
        .copy-instructions {{
            background: #fef3c7;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>📊 CSV to Google Sheets</h1>

        <div class="info">
            <strong>File:</strong> {csv_path.name}<br>
            <strong>Size:</strong> {len(csv_content)} characters<br>
            <strong>Rows:</strong> {len(csv_content.splitlines())} lines
        </div>

        <div class="copy-instructions">
            <strong>📋 Instructions:</strong><br>
            1. Click "Open Google Sheets" below<br>
            2. In the new Google Sheets tab, select cell A1<br>
            3. Press Ctrl+V (Cmd+V on Mac) to paste the CSV data<br>
            4. Google Sheets will automatically format the data
        </div>

        <button onclick="openSheets()">🚀 Open Google Sheets (Auto-copy)</button>
        <button onclick="importViaFileUpload()">📤 Import via File Upload</button>
        <button onclick="copyToClipboard()">📋 Copy CSV to Clipboard</button>
        <button onclick="downloadCSV()">💾 Download CSV</button>

        <h3>CSV Preview (first 50 lines):</h3>
        <div class="csv-preview" id="csvPreview">{escape_html(csv_content[:2000])}</div>

        <script>
            const csvContent = {json.dumps(csv_content)};

            function openSheets() {{
                // Method 1: Try direct import using data URI (may not work due to CORS)
                // Method 2: Copy to clipboard and open sheets
                copyToClipboard();

                // Open Google Sheets
                const sheetsWindow = window.open('https://sheets.new', '_blank');

                // Wait a moment then try to paste
                setTimeout(function() {{
                    // Show instructions
                    alert('📊 Google Sheets opened!\\n\\n✅ CSV data copied to clipboard.\\n\\n📋 INSTRUCTIONS:\\n1. Click cell A1 in the new Google Sheets tab\\n2. Press Ctrl+V (Cmd+V on Mac)\\n3. Click "Split text to columns" if prompted\\n\\n💡 Tip: You can also use File > Import > Upload and select the CSV file.');
                }}, 500);
            }}

            function importViaFileUpload() {{
                // Create a download link and instructions for file upload method
                downloadCSV();
                alert('📥 CSV file downloaded!\\n\\n📋 INSTRUCTIONS:\\n1. Go to https://sheets.new\\n2. Click File > Import\\n3. Upload the downloaded CSV file\\n4. Choose import settings and click Import Data');
            }}

            function copyToClipboard() {{
                // Copy CSV content to clipboard
                navigator.clipboard.writeText(csvContent).then(function() {{
                    console.log('CSV copied to clipboard!');
                }}, function(err) {{
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = csvContent;
                    textArea.style.position = 'fixed';
                    textArea.style.left = '-999999px';
                    document.body.appendChild(textArea);
                    textArea.select();
                    try {{
                        document.execCommand('copy');
                        console.log('CSV copied to clipboard (fallback)!');
                    }} catch (err) {{
                        console.error('Failed to copy:', err);
                    }}
                    document.body.removeChild(textArea);
                }});
            }}

            function downloadCSV() {{
                const blob = new Blob([csvContent], {{ type: 'text/csv' }});
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = '{csv_path.name}';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }}

            // Auto-copy on load (optional)
            // copyToClipboard();
        </script>
    </div>
</body>
</html>"""

    # Save HTML file
    if output_html is None:
        output_html = csv_path.parent / f"{csv_path.stem}_sheets_import.html"
    else:
        output_html = Path(output_html).expanduser()

    with open(output_html, 'w', encoding='utf-8') as f:
        f.write(html_content)

    print(f"✅ HTML file created: {output_html}")
    return output_html


def escape_html(text):
    """Escape HTML special characters for preview."""
    return (text
            .replace('&', '&amp;')
            .replace('<', '&lt;')
            .replace('>', '&gt;')
            .replace('"', '&quot;')
            .replace("'", '&#x27;'))


def main():
    parser = argparse.ArgumentParser(description="Open CSV in Google Sheets")
    parser.add_argument("csv_file", type=str, help="Path to CSV file")
    parser.add_argument("--html", type=str, default=None,
                        help="Output HTML file path (default: same as CSV with .html extension)")
    parser.add_argument("--open", action="store_true",
                        help="Automatically open HTML in browser")

    args = parser.parse_args()

    csv_path = Path(args.csv_file).expanduser()
    html_path = create_sheets_import_html(csv_path, args.html)

    if args.open:
        print(f"🌐 Opening {html_path.name} in browser...")
        webbrowser.open(f"file://{html_path.absolute()}")
        print("✅ HTML opened in browser!")
        print("\n💡 Click 'Open Google Sheets' button, then paste (Ctrl+V / Cmd+V) in Google Sheets")
    else:
        print(f"\n💡 To open: open '{html_path}'")
        print("   Or use: python3 open_csv_to_sheets.py <csv_file> --open")


if __name__ == '__main__':
    main()
