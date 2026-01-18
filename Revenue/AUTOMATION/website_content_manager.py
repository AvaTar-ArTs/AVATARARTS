#!/usr/bin/env python3
"""
Website Content Manager - Automate content updates for avatararts.org/SEO-revenue

Features:
- Generate HTML pages from templates
- Update navigation links
- Create sitemaps
- Optimize SEO meta tags
- Generate content indexes
"""

import os
import json
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any, Optional
import re

BASE_DIR = Path("/Users/steven/AVATARARTS/Revenue")
WEB_DIR = BASE_DIR / "WEB_DEPLOYMENT"
SITE_URL = "https://avatararts.org/SEO-revenue"

class WebsiteContentManager:
    """Manage and automate website content updates."""

    def __init__(self, base_dir: Path = BASE_DIR):
        self.base_dir = base_dir
        self.web_dir = base_dir / "WEB_DEPLOYMENT"
        self.site_url = SITE_URL

    def generate_sitemap_xml(self) -> str:
        """Generate XML sitemap for SEO."""
        pages = [
            {"url": f"{self.site_url}/", "priority": "1.0", "changefreq": "daily"},
            {"url": f"{self.site_url}/expansion-packs.html", "priority": "0.9", "changefreq": "weekly"},
            {"url": f"{self.site_url}/monetization.html", "priority": "0.9", "changefreq": "weekly"},
            {"url": f"{self.site_url}/n8n-workflows.html", "priority": "0.9", "changefreq": "weekly"},
            {"url": f"{self.site_url}/docs.html", "priority": "0.8", "changefreq": "weekly"},
            {"url": f"{self.site_url}/sitemap.html", "priority": "0.5", "changefreq": "monthly"},
            {"url": f"{self.site_url}/products/", "priority": "0.8", "changefreq": "weekly"},
        ]

        # Add expansion packs
        expansion_packs = [
            "AI_Agents_Framework", "AI_Content_Repurposing", "AI_Knowledge_Base",
            "AI_Mini_PC_Setup", "AI_Note_Taker", "AI_Workflow_Automation",
            "Faceless_YouTube_AI", "Instagram_Reel_Generator", "Local_AI_Assistant",
            "Local_LLM_Workflow", "Obsidian_AI_Automation", "Offline_AI_Assistant",
            "Podcast_to_Shorts_AI", "Private_AI_Chat", "Private_GPT_Alternative",
            "Second_Brain_AI", "TikTok_AI_Video_Generator", "YouTube_Shorts_Automation",
            "MEDIA_INDEXING_SYSTEM"
        ]

        for pack in expansion_packs:
            pages.append({
                "url": f"{self.site_url}/{pack}/",
                "priority": "0.7",
                "changefreq": "monthly"
            })

        xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

        for page in pages:
            xml += '  <url>\n'
            xml += f'    <loc>{page["url"]}</loc>\n'
            xml += f'    <lastmod>{datetime.now().strftime("%Y-%m-%d")}</lastmod>\n'
            xml += f'    <changefreq>{page["changefreq"]}</changefreq>\n'
            xml += f'    <priority>{page["priority"]}</priority>\n'
            xml += '  </url>\n'

        xml += '</urlset>\n'
        return xml

    def generate_robots_txt(self) -> str:
        """Generate robots.txt file."""
        content = f"""User-agent: *
Allow: /
Sitemap: {self.site_url}/sitemap.xml

# Disallow admin and private directories
Disallow: /.history/
Disallow: /.vscode/
Disallow: /__pycache__/
"""
        return content

    def update_meta_tags(self, html_file: Path, meta_data: Dict[str, str]) -> str:
        """Update or add SEO meta tags to HTML file."""
        if not html_file.exists():
            return ""

        content = html_file.read_text()

        # Update or add meta description
        if 'meta name="description"' in content:
            content = re.sub(
                r'<meta name="description" content="[^"]*"',
                f'<meta name="description" content="{meta_data.get("description", "")}"',
                content
            )
        else:
            # Add after charset meta
            content = content.replace(
                '<meta charset="UTF-8">',
                f'<meta charset="UTF-8">\n    <meta name="description" content="{meta_data.get("description", "")}">'
            )

        # Update or add Open Graph tags
        og_tags = f"""
    <meta property="og:title" content="{meta_data.get("title", "")}">
    <meta property="og:description" content="{meta_data.get("description", "")}">
    <meta property="og:url" content="{meta_data.get("url", self.site_url)}">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{meta_data.get("title", "")}">
    <meta name="twitter:description" content="{meta_data.get("description", "")}">
"""

        if '<meta property="og:title"' not in content:
            content = content.replace('</head>', f'{og_tags}</head>')

        return content

    def generate_content_index(self, directory: Path) -> Dict[str, Any]:
        """Generate index of all content in a directory."""
        index = {
            "generated": datetime.now().isoformat(),
            "directory": str(directory),
            "files": [],
            "directories": []
        }

        if not directory.exists():
            return index

        for item in sorted(directory.iterdir()):
            if item.name.startswith('.'):
                continue

            if item.is_file():
                stat = item.stat()
                index["files"].append({
                    "name": item.name,
                    "size": stat.st_size,
                    "modified": datetime.fromtimestamp(stat.st_mtime).isoformat(),
                    "url": f"{self.site_url}/{item.relative_to(self.base_dir)}"
                })
            elif item.is_dir():
                index["directories"].append({
                    "name": item.name,
                    "url": f"{self.site_url}/{item.relative_to(self.base_dir)}/"
                })

        return index

    def create_htaccess(self) -> str:
        """Create .htaccess file for clean URLs and SEO."""
        content = f"""# Trend Pulse OS - SEO Optimizations

# Enable Rewrite Engine
RewriteEngine On
RewriteBase /SEO-revenue/

# Force HTTPS
RewriteCond %{{HTTPS}} off
RewriteRule ^(.*)$ https://%{{HTTP_HOST}}%{{REQUEST_URI}} [L,R=301]

# Remove .html extension
RewriteCond %{{REQUEST_FILENAME}} !-d
RewriteCond %{{REQUEST_FILENAME}} !-f
RewriteRule ^([^\.]+)$ $1.html [NC,L]

# Custom Error Pages
ErrorDocument 404 /SEO-revenue/404.html

# Enable Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType text/html "access plus 1 day"
</IfModule>

# Security Headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>
"""
        return content

    def generate_all(self):
        """Generate all website files."""
        print("🌐 Generating website files...")

        # Generate sitemap.xml
        sitemap = self.generate_sitemap_xml()
        (self.web_dir / "sitemap.xml").write_text(sitemap)
        print("✅ Generated sitemap.xml")

        # Generate robots.txt
        robots = self.generate_robots_txt()
        (self.web_dir / "robots.txt").write_text(robots)
        print("✅ Generated robots.txt")

        # Generate .htaccess
        htaccess = self.create_htaccess()
        (self.web_dir / ".htaccess").write_text(htaccess)
        print("✅ Generated .htaccess")

        # Generate content indexes
        for dir_name in ["Trend_Pulse_All_Expansion_Packs", "MONETIZATION", "n8n_workflows"]:
            dir_path = self.base_dir / dir_name
            if dir_path.exists():
                index = self.generate_content_index(dir_path)
                index_file = self.web_dir / f"{dir_name}_index.json"
                index_file.write_text(json.dumps(index, indent=2))
                print(f"✅ Generated index for {dir_name}")

        print("\n🎉 All website files generated!")

if __name__ == "__main__":
    manager = WebsiteContentManager()
    manager.generate_all()
