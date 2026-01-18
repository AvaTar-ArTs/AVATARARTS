#!/usr/bin/env python3
"""
Setup Script for AVATARARTS.ORG Root Directory Structure
This script creates a proper directory structure for the avatararts.org website
"""

import os
import shutil
from pathlib import Path
from datetime import datetime


def create_directory_structure(base_path):
    """Create the complete directory structure for avatararts.org"""
    
    # Define the directory structure
    directories = [
        # Root directories
        "",
        
        # Main content directories
        "assets",
        "assets/css",
        "assets/js",
        "assets/images",
        "assets/fonts",
        "assets/icons",
        
        # Content sections
        "content",
        "content/projects",
        "content/services",
        "content/portfolio",
        "content/blog",
        "content/news",
        "content/resources",
        "content/documentation",
        
        # Media directories
        "media",
        "media/images",
        "media/videos",
        "media/audio",
        "media/documents",
        "media/downloads",
        
        # Development directories
        "src",
        "src/html",
        "src/css",
        "src/js",
        "src/components",
        "src/templates",
        
        # System directories
        "system",
        "system/cache",
        "system/logs",
        "system/config",
        "system/data",
        "system/backup",
        
        # API and integrations
        "api",
        "api/endpoints",
        "api/integrations",
        "api/webhooks",
        
        # SEO and analytics
        "seo",
        "analytics",
        
        # Legal and policy
        "legal",
        "privacy",
        
        # Admin and management
        "admin",
        "admin/dashboard",
        "admin/users",
        "admin/content",
        "admin/settings",
        
        # Static pages
        "pages",
        "pages/about",
        "pages/contact",
        "pages/team",
        "pages/careers",
        
        # Utilities
        "utils",
        "scripts",
        "tests",
    ]
    
    # Create all directories
    for directory in directories:
        full_path = base_path / directory
        full_path.mkdir(parents=True, exist_ok=True)
        print(f"Created directory: {full_path}")


def create_basic_files(base_path):
    """Create basic files for the website"""
    
    # Create index.html
    index_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AVATARARTS - AI Automation & Digital Marketing Ecosystem</title>
    <meta name="description" content="Comprehensive AI automation and digital marketing solutions">
    <link rel="stylesheet" href="assets/css/main.css">
    <link rel="icon" type="image/x-icon" href="assets/icons/favicon.ico">
</head>
<body>
    <header>
        <nav>
            <div class="logo">
                <h1>AVATARARTS</h1>
            </div>
            <ul class="navigation">
                <li><a href="/">Home</a></li>
                <li><a href="/pages/about/">About</a></li>
                <li><a href="/content/projects/">Projects</a></li>
                <li><a href="/content/services/">Services</a></li>
                <li><a href="/pages/contact/">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section class="hero">
            <h1>Welcome to AVATARARTS</h1>
            <p>Your comprehensive AI automation and digital marketing ecosystem</p>
            <a href="/content/projects/" class="cta-button">Explore Projects</a>
        </section>
        
        <section class="features">
            <div class="feature-card">
                <h3>AI Automation</h3>
                <p>Advanced AI solutions for business automation</p>
            </div>
            <div class="feature-card">
                <h3>Digital Marketing</h3>
                <p>Comprehensive marketing strategies and implementation</p>
            </div>
            <div class="feature-card">
                <h3>SEO Optimization</h3>
                <p>Advanced SEO techniques for maximum visibility</p>
            </div>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2026 AVATARARTS. All rights reserved.</p>
        <div class="footer-links">
            <a href="/legal/">Legal</a>
            <a href="/privacy/">Privacy Policy</a>
            <a href="/pages/contact/">Contact</a>
        </div>
    </footer>
    
    <script src="assets/js/main.js"></script>
</body>
</html>
"""
    
    index_file = base_path / "index.html"
    with open(index_file, 'w', encoding='utf-8') as f:
        f.write(index_content)
    print(f"Created file: {index_file}")
    
    # Create main CSS file
    css_content = """/* Main Stylesheet for AVATARARTS.ORG */
:root {
    --primary-color: #4361ee;
    --secondary-color: #3f37c9;
    --accent-color: #4cc9f0;
    --light-bg: #f8f9fa;
    --dark-bg: #212529;
    --text-color: #212529;
    --border-radius: 8px;
    --box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    --transition: all 0.3s ease;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: var(--text-color);
    background-color: var(--light-bg);
}

header {
    background: var(--dark-bg);
    color: white;
    padding: 1rem 0;
    position: sticky;
    top: 0;
    z-index: 100;
}

nav {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo h1 {
    color: var(--accent-color);
}

.navigation {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.navigation a {
    color: white;
    text-decoration: none;
    transition: var(--transition);
}

.navigation a:hover {
    color: var(--accent-color);
}

main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 20px;
}

.hero {
    text-align: center;
    padding: 4rem 0;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: white;
    border-radius: var(--border-radius);
    margin-bottom: 3rem;
}

.hero h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.cta-button {
    display: inline-block;
    padding: 1rem 2rem;
    background: white;
    color: var(--primary-color);
    text-decoration: none;
    border-radius: var(--border-radius);
    font-weight: bold;
    margin-top: 1rem;
    transition: var(--transition);
}

.cta-button:hover {
    transform: translateY(-3px);
    box-shadow: var(--box-shadow);
}

.features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
}

.feature-card {
    background: white;
    padding: 2rem;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    text-align: center;
    transition: var(--transition);
}

.feature-card:hover {
    transform: translateY(-5px);
}

footer {
    background: var(--dark-bg);
    color: white;
    text-align: center;
    padding: 2rem 0;
    margin-top: 3rem;
}

.footer-links {
    margin-top: 1rem;
}

.footer-links a {
    color: var(--accent-color);
    margin: 0 1rem;
    text-decoration: none;
}

.footer-links a:hover {
    text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 768px) {
    nav {
        flex-direction: column;
        gap: 1rem;
    }
    
    .navigation {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }
    
    .hero h1 {
        font-size: 2rem;
    }
}
"""
    
    css_file = base_path / "assets" / "css" / "main.css"
    with open(css_file, 'w', encoding='utf-8') as f:
        f.write(css_content)
    print(f"Created file: {css_file}")
    
    # Create main JavaScript file
    js_content = """// Main JavaScript for AVATARARTS.ORG
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.navigation');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form validation
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            validateForm(e.target);
        });
    }
    
    console.log('AVATARARTS.ORG website initialized');
});

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
        } else {
            field.classList.remove('error');
        }
    });
    
    if (isValid) {
        // Submit form
        console.log('Form is valid, submitting...');
        // In a real implementation, you would submit the form here
    } else {
        console.log('Form has errors, please fill in all required fields');
    }
}

// Utility functions
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    document.body.insertBefore(alertDiv, document.body.firstChild);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}
"""
    
    js_file = base_path / "assets" / "js" / "main.js"
    with open(js_file, 'w', encoding='utf-8') as f:
        f.write(js_content)
    print(f"Created file: {js_file}")
    
    # Create robots.txt
    robots_content = """User-agent: *
Disallow: /admin/
Disallow: /system/
Disallow: /api/

Sitemap: https://avatararts.org/sitemap.xml
"""
    
    robots_file = base_path / "robots.txt"
    with open(robots_file, 'w', encoding='utf-8') as f:
        f.write(robots_content)
    print(f"Created file: {robots_file}")
    
    # Create sitemap.xml
    sitemap_content = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://avatararts.org/</loc>
        <lastmod>{}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://avatararts.org/pages/about/</loc>
        <lastmod>{}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://avatararts.org/content/projects/</loc>
        <lastmod>{}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://avatararts.org/content/services/</loc>
        <lastmod>{}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>https://avatararts.org/pages/contact/</loc>
        <lastmod>{}</lastmod>
        <changefreq>yearly</changefreq>
        <priority>0.6</priority>
    </url>
</urlset>
""".format(
        datetime.now().strftime('%Y-%m-%d'),
        datetime.now().strftime('%Y-%m-%d'),
        datetime.now().strftime('%Y-%m-%d'),
        datetime.now().strftime('%Y-%m-%d'),
        datetime.now().strftime('%Y-%m-%d')
    )
    
    sitemap_file = base_path / "sitemap.xml"
    with open(sitemap_file, 'w', encoding='utf-8') as f:
        f.write(sitemap_content)
    print(f"Created file: {sitemap_file}")
    
    # Create .htaccess for Apache configurations
    htaccess_content = """# AVATARARTS.ORG - Apache Configuration File
# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Enable caching
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/x-icon "access plus 1 year"
    ExpiresByType text/html "access plus 1 month"
    ExpiresByType text/xml "access plus 1 hour"
    ExpiresByType application/xml "access plus 1 hour"
    ExpiresByType application/xhtml+xml "access plus 1 hour"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
</IfModule>

# Redirect www to non-www
RewriteEngine On
RewriteCond %{HTTP_HOST} ^www.avatararts.org [NC]
RewriteRule ^(.*)$ https://avatararts.org/$1 [L,R=301]

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://avatararts.org/$1 [L,R=301]
"""
    
    htaccess_file = base_path / ".htaccess"
    with open(htaccess_file, 'w', encoding='utf-8') as f:
        f.write(htaccess_content)
    print(f"Created file: {htaccess_file}")
    
    # Create README.md
    readme_content = """# AVATARARTS.ORG Website

Welcome to the official website repository for AVATARARTS - a comprehensive AI automation and digital marketing ecosystem.

## Directory Structure

```
avatararts.org/
├── index.html              # Main landing page
├── robots.txt             # Search engine directives
├── sitemap.xml            # Site map for search engines
├── .htaccess              # Apache configuration
├── assets/                # Static assets
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript files
│   ├── images/            # Image assets
│   ├── fonts/             # Font files
│   └── icons/             # Icon files
├── content/               # Website content
│   ├── projects/          # Project pages
│   ├── services/          # Service descriptions
│   ├── portfolio/         # Portfolio items
│   ├── blog/              # Blog posts
│   └── documentation/     # Documentation
├── media/                 # Media files
├── api/                   # API endpoints
├── system/                # System files
├── pages/                 # Static pages
├── admin/                 # Administration area
└── src/                   # Source files
```

## Features

- Modern, responsive design
- SEO optimized
- Fast loading times
- Secure implementation
- Easy content management

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Apache Web Server

## Deployment

To deploy this website:

1. Upload all files to your web server
2. Ensure .htaccess is properly configured
3. Set proper file permissions
4. Configure SSL certificate for HTTPS

## Contributing

We welcome contributions to improve the AVATARARTS website. Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
"""
    
    readme_file = base_path / "README.md"
    with open(readme_file, 'w', encoding='utf-8') as f:
        f.write(readme_content)
    print(f"Created file: {readme_file}")
    
    # Create a basic favicon placeholder
    favicon_path = base_path / "assets" / "icons" / "favicon.ico"
    favicon_path.touch(exist_ok=True)
    print(f"Created file: {favicon_path} (placeholder)")


def create_project_specific_files(base_path):
    """Create project-specific files for AVATARARTS projects"""
    
    # Create projects page
    projects_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Our Projects | AVATARARTS</title>
    <link rel="stylesheet" href="../assets/css/main.css">
</head>
<body>
    <header>
        <nav>
            <div class="logo">
                <h1>AVATARARTS</h1>
            </div>
            <ul class="navigation">
                <li><a href="/">Home</a></li>
                <li><a href="/pages/about/">About</a></li>
                <li><a href="/content/projects/">Projects</a></li>
                <li><a href="/content/services/">Services</a></li>
                <li><a href="/pages/contact/">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <h1>Our Projects</h1>
        <p>Discover our comprehensive AI automation and digital marketing solutions.</p>
        
        <div class="projects-grid">
            <div class="project-card">
                <h3>Passive Income Empire</h3>
                <p>Primary focus for generating passive income</p>
                <a href="/content/projects/passive-income-empire/">Learn More</a>
            </div>
            <div class="project-card">
                <h3>Retention Suite</h3>
                <p>Customer retention and engagement tools</p>
                <a href="/content/projects/retention-suite/">Learn More</a>
            </div>
            <div class="project-card">
                <h3>CleanConnect</h3>
                <p>Connection and communication tools</p>
                <a href="/content/projects/cleanconnect/">Learn More</a>
            </div>
            <div class="project-card">
                <h3>HeavenlyHands</h3>
                <p>AI assistant tools</p>
                <a href="/content/projects/heavenlyhands/">Learn More</a>
            </div>
            <div class="project-card">
                <h3>Marketplace</h3>
                <p>Digital marketplace platform</p>
                <a href="/content/projects/marketplace/">Learn More</a>
            </div>
            <div class="project-card">
                <h3>Education Platform</h3>
                <p>Educational content and tools</p>
                <a href="/content/projects/education/">Learn More</a>
            </div>
        </div>
    </main>
    
    <footer>
        <p>&copy; 2026 AVATARARTS. All rights reserved.</p>
    </footer>
</body>
</html>
"""
    
    projects_dir = base_path / "content" / "projects"
    projects_file = projects_dir / "index.html"
    projects_file.parent.mkdir(parents=True, exist_ok=True)
    
    with open(projects_file, 'w', encoding='utf-8') as f:
        f.write(projects_content)
    print(f"Created file: {projects_file}")


def main():
    """Main function to create the avatararts.org directory structure"""
    print("Setting up AVATARARTS.ORG root directory structure...")
    
    # Define the base path for avatararts.org
    base_path = Path.home() / "avatararts.org"
    
    # Create the base directory
    base_path.mkdir(parents=True, exist_ok=True)
    print(f"Created base directory: {base_path}")
    
    # Create the directory structure
    print("Creating directory structure...")
    create_directory_structure(base_path)
    
    # Create basic files
    print("Creating basic website files...")
    create_basic_files(base_path)
    
    # Create project-specific files
    print("Creating project-specific files...")
    create_project_specific_files(base_path)
    
    # Create a summary file
    summary_content = f"""AVATARARTS.ORG Setup Summary
==========================

Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
Base Directory: {base_path}

Directory Structure Created:
- assets/: Static assets (CSS, JS, images, etc.)
- content/: Website content (projects, services, etc.)
- media/: Media files
- src/: Source files
- system/: System files
- api/: API endpoints
- pages/: Static pages
- admin/: Administration area
- legal/: Legal documents
- analytics/: Analytics files

Key Files Created:
- index.html: Main landing page
- assets/css/main.css: Main stylesheet
- assets/js/main.js: Main JavaScript file
- robots.txt: Search engine directives
- sitemap.xml: Site map
- .htaccess: Apache configuration
- README.md: Project documentation

This directory structure is optimized for:
- SEO best practices
- Performance
- Security
- Scalability
- Maintainability

Ready for deployment to web server.
"""
    
    summary_file = base_path / "SETUP_SUMMARY.txt"
    with open(summary_file, 'w', encoding='utf-8') as f:
        f.write(summary_content)
    print(f"Created setup summary: {summary_file}")
    
    print(f"\nAVATARARTS.ORG directory structure successfully created at: {base_path}")
    print("The website is ready for customization and deployment!")


if __name__ == "__main__":
    main()