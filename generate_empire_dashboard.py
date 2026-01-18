import os
import csv
import glob

# Configuration
HUB_ROOT = "/Users/steven/DiGiTaLDiVe"
OUTPUT_FILE = os.path.join(HUB_ROOT, "EMPIRE_DASHBOARD.html")
SCAN_DIR = os.path.join(HUB_ROOT, "5_Command_Reports/Scan_Data")

html_template = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AVATARARTS Empire Dashboard</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #1a1a1a; color: #f0f0f0; margin: 0; padding: 20px; }
        h1 { color: #00d2ff; text-transform: uppercase; letter-spacing: 2px; border-bottom: 2px solid #00d2ff; padding-bottom: 10px; }
        h2 { color: #ff0099; margin-top: 30px; }
        .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .card { background: #2a2a2a; border-radius: 8px; padding: 20px; border-left: 5px solid #00d2ff; box-shadow: 0 4px 6px rgba(0,0,0,0.3); transition: transform 0.2s; }
        .card:hover { transform: translateY(-5px); background: #333; }
        .card h3 { margin-top: 0; color: #fff; }
        .stat { font-size: 2em; font-weight: bold; color: #00d2ff; }
        .path { font-family: monospace; color: #888; font-size: 0.9em; word-break: break-all; }
        .btn { display: inline-block; background: #00d2ff; color: #000; padding: 8px 15px; text-decoration: none; border-radius: 4px; margin-top: 10px; font-weight: bold; }
        .btn:hover { background: #fff; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { text-align: left; padding: 8px; border-bottom: 1px solid #444; }
        th { color: #888; }
        .tag { background: #444; padding: 2px 6px; border-radius: 4px; font-size: 0.8em; }
    </style>
</head>
<body>
    <h1>🚀 AVATARARTS Empire Command</h1>
    <p>Status: <strong>ACTIVE</strong> | Location: <code>/Users/steven/DiGiTaLDiVe</code></p>

    <div class="dashboard-grid">
        <div class="card" style="border-left-color: #00ff00;">
            <h3>💰 Active Revenue</h3>
            <div class="stat">Upwork & SaaS</div>
            <p>Automation systems ready for deployment.</p>
            <a href="1_Active_Revenue" class="btn">Open Engine</a>
        </div>
        <div class="card" style="border-left-color: #ff0099;">
            <h3>🛒 Passive Income</h3>
            <div class="stat">Etsy & Music</div>
            <p>Storefront assets and media libraries.</p>
            <a href="2_Passive_Income" class="btn">Open Storefronts</a>
        </div>
        <div class="card" style="border-left-color: #ffcc00;">
            <h3>🧠 Intellectual Property</h3>
            <div class="stat">DNA & Books</div>
            <p>High-value proprietary assets.</p>
            <a href="3_Intellectual_Property" class="btn">Access Vault</a>
        </div>
    </div>

    <h2>📊 Asset Intelligence</h2>
    <div class="dashboard-grid">
"""

def generate_dashboard():
    print("Generating Empire Dashboard...")
    
    # 1. Walk the Hub to generate cards
    cards_html = ""
    for root, dirs, files in os.walk(HUB_ROOT):
        # Skip the root itself for cards, we want the subfolders
        if root == HUB_ROOT:
            continue
            
        # Only show top-level directories in the grid
        rel_path = os.path.relpath(root, HUB_ROOT)
        if rel_path.count(os.sep) == 0 and not rel_path.startswith('.'):
            file_count = len(files)
            subdir_count = len(dirs)
            
            cards_html += f"""
            <div class="card">
                <h3>{rel_path.replace('_', ' ')}</h3>
                <div class="path">{root}</div>
                <p>Contains {file_count} files, {subdir_count} subfolders.</p>
            </div>
            """
    
    # 2. Append Scan Summaries (if available)
    csv_html = ""
    scan_files = glob.glob(os.path.join(SCAN_DIR, "*.csv"))
    
    if scan_files:
        csv_html += "<h2>📈 Recent Scan Data</h2><div class='card' style='width:100%'><table><thead><tr><th>Scan File</th><th>Size</th></tr></thead><tbody>"
        for csv_file in scan_files:
            name = os.path.basename(csv_file)
            size = os.path.getsize(csv_file) / 1024 # KB
            csv_html += f"<tr><td>{name}</td><td>{size:.2f} KB</td></tr>"
        csv_html += "</tbody></table></div>"

    final_html = html_template + cards_html + "</div>" + csv_html + "</body></html>"
    
    with open(OUTPUT_FILE, 'w') as f:
        f.write(final_html)
    
    print(f"✅ Dashboard generated at: {OUTPUT_FILE}")

if __name__ == "__main__":
    generate_dashboard()
