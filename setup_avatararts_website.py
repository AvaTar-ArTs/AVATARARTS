#!/usr/bin/env python3
"""
AVATARARTS.ORG Website Setup
============================
Creates a comprehensive website setup for avatararts.org with:
- Modern, responsive design
- Folder index integration
- SEO optimization
- Performance optimization
"""

import os
import json
from pathlib import Path
from datetime import datetime
import shutil


class WebsiteBuilder:
    """Builds the avatararts.org website structure"""
    
    def __init__(self, base_path: Path):
        self.base_path = base_path
        self.base_path.mkdir(parents=True, exist_ok=True)
    
    def create_directory_structure(self):
        """Create complete directory structure"""
        directories = [
            "assets/css",
            "assets/js",
            "assets/images",
            "assets/fonts",
            "assets/icons",
            "content/projects",
            "content/services",
            "content/portfolio",
            "content/blog",
            "content/documentation",
            "content/index",
            "media/images",
            "media/videos",
            "media/audio",
            "media/documents",
            "api/endpoints",
            "api/integrations",
            "system/data",
            "system/cache",
            "pages/about",
            "pages/contact",
            "pages/team",
            "admin/dashboard",
            "admin/content",
        ]
        
        for directory in directories:
            (self.base_path / directory).mkdir(parents=True, exist_ok=True)
            print(f"✓ Created: {directory}")
    
    def create_index_html(self, folder_index_path: Path = None):
        """Create main index.html with folder index integration"""
        index_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AVATARARTS - AI Automation & Digital Marketing Ecosystem</title>
    <meta name="description" content="Comprehensive AI automation and digital marketing solutions. Explore our projects, services, and portfolio.">
    <meta name="keywords" content="AI automation, digital marketing, SEO, automation tools, creative AI">
    <meta name="author" content="AVATARARTS">
    <link rel="stylesheet" href="assets/css/main.css">
    <link rel="icon" type="image/x-icon" href="assets/icons/favicon.ico">
    <link rel="canonical" href="https://avatararts.org/">
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
                <li><a href="/content/index/">Index</a></li>
                <li><a href="/pages/contact/">Contact</a></li>
            </ul>
            <button class="menu-toggle" aria-label="Toggle menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </nav>
    </header>
    
    <main>
        <section class="hero">
            <div class="hero-content">
                <h1>Welcome to AVATARARTS</h1>
                <p class="hero-subtitle">Your comprehensive AI automation and digital marketing ecosystem</p>
                <div class="hero-buttons">
                    <a href="/content/projects/" class="cta-button primary">Explore Projects</a>
                    <a href="/content/index/" class="cta-button secondary">Browse Index</a>
                </div>
            </div>
        </section>
        
        <section class="features">
            <h2 class="section-title">What We Offer</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">🤖</div>
                    <h3>AI Automation</h3>
                    <p>Advanced AI solutions for business automation, workflow optimization, and intelligent systems.</p>
                    <a href="/content/services/ai-automation/" class="feature-link">Learn More →</a>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📈</div>
                    <h3>Digital Marketing</h3>
                    <p>Comprehensive marketing strategies, SEO optimization, and content creation services.</p>
                    <a href="/content/services/digital-marketing/" class="feature-link">Learn More →</a>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🔍</div>
                    <h3>SEO Optimization</h3>
                    <p>Advanced SEO techniques, keyword research, and optimization for maximum visibility.</p>
                    <a href="/content/services/seo/" class="feature-link">Learn More →</a>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🎨</div>
                    <h3>Creative Solutions</h3>
                    <p>Creative AI tools, content generation, and multimedia production services.</p>
                    <a href="/content/services/creative/" class="feature-link">Learn More →</a>
                </div>
            </div>
        </section>
        
        <section class="stats">
            <h2 class="section-title">Project Statistics</h2>
            <div class="stats-grid" id="statsGrid">
                <div class="stat-card">
                    <div class="stat-number" data-target="1000">0</div>
                    <div class="stat-label">Projects</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" data-target="500">0</div>
                    <div class="stat-label">Tools & Scripts</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" data-target="50">0</div>
                    <div class="stat-label">Active Services</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" data-target="24">0</div>
                    <div class="stat-label">Hours Support</div>
                </div>
            </div>
        </section>
        
        <section class="projects-preview">
            <h2 class="section-title">Featured Projects</h2>
            <div class="projects-grid">
                <div class="project-card">
                    <h3>Passive Income Empire</h3>
                    <p>Automated revenue generation systems and passive income solutions.</p>
                    <a href="/content/projects/passive-income-empire/" class="project-link">View Project →</a>
                </div>
                <div class="project-card">
                    <h3>Retention Suite</h3>
                    <p>Customer retention and engagement automation tools.</p>
                    <a href="/content/projects/retention-suite/" class="project-link">View Project →</a>
                </div>
                <div class="project-card">
                    <h3>HeavenlyHands</h3>
                    <p>AI assistant tools and intelligent automation systems.</p>
                    <a href="/content/projects/heavenlyhands/" class="project-link">View Project →</a>
                </div>
            </div>
        </section>
    </main>
    
    <footer>
        <div class="footer-content">
            <div class="footer-section">
                <h3>AVATARARTS</h3>
                <p>Comprehensive AI automation and digital marketing ecosystem.</p>
            </div>
            <div class="footer-section">
                <h4>Quick Links</h4>
                <ul>
                    <li><a href="/pages/about/">About</a></li>
                    <li><a href="/content/projects/">Projects</a></li>
                    <li><a href="/content/services/">Services</a></li>
                    <li><a href="/pages/contact/">Contact</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4>Resources</h4>
                <ul>
                    <li><a href="/content/index/">Folder Index</a></li>
                    <li><a href="/content/documentation/">Documentation</a></li>
                    <li><a href="/content/blog/">Blog</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4>Legal</h4>
                <ul>
                    <li><a href="/legal/">Legal</a></li>
                    <li><a href="/privacy/">Privacy Policy</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; {datetime.now().year} AVATARARTS. All rights reserved.</p>
        </div>
    </footer>
    
    <script src="assets/js/main.js"></script>
</body>
</html>
"""
        
        index_file = self.base_path / "index.html"
        with open(index_file, 'w', encoding='utf-8') as f:
            f.write(index_content)
        print(f"✓ Created: index.html")
    
    def create_css(self):
        """Create comprehensive CSS stylesheet"""
        css_content = """/* AVATARARTS.ORG Main Stylesheet */
:root {
    --primary-color: #4361ee;
    --secondary-color: #3f37c9;
    --accent-color: #4cc9f0;
    --success-color: #06d6a0;
    --warning-color: #ffd166;
    --danger-color: #ef476f;
    --light-bg: #f8f9fa;
    --dark-bg: #212529;
    --text-color: #212529;
    --text-light: #6c757d;
    --border-color: #dee2e6;
    --border-radius: 12px;
    --box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    --box-shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.15);
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: var(--text-color);
    background-color: var(--light-bg);
    font-size: 16px;
}

/* Header & Navigation */
header {
    background: var(--dark-bg);
    color: white;
    padding: 1rem 0;
    position: sticky;
    top: 0;
    z-index: 1000;
    box-shadow: var(--box-shadow);
}

nav {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo h1 {
    color: var(--accent-color);
    font-size: 1.8rem;
    font-weight: 700;
}

.navigation {
    display: flex;
    list-style: none;
    gap: 2rem;
    align-items: center;
}

.navigation a {
    color: white;
    text-decoration: none;
    font-weight: 500;
    transition: var(--transition);
    position: relative;
}

.navigation a::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--accent-color);
    transition: var(--transition);
}

.navigation a:hover::after {
    width: 100%;
}

.navigation a:hover {
    color: var(--accent-color);
}

.menu-toggle {
    display: none;
    flex-direction: column;
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px;
}

.menu-toggle span {
    width: 25px;
    height: 3px;
    background: white;
    margin: 3px 0;
    transition: var(--transition);
}

/* Main Content */
main {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem 20px;
}

.section-title {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: var(--primary-color);
}

/* Hero Section */
.hero {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
    color: white;
    border-radius: var(--border-radius);
    padding: 5rem 3rem;
    margin-bottom: 4rem;
    text-align: center;
    box-shadow: var(--box-shadow-lg);
}

.hero-content h1 {
    font-size: 3.5rem;
    margin-bottom: 1rem;
    font-weight: 700;
}

.hero-subtitle {
    font-size: 1.3rem;
    margin-bottom: 2rem;
    opacity: 0.95;
}

.hero-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

.cta-button {
    display: inline-block;
    padding: 1rem 2.5rem;
    border-radius: var(--border-radius);
    text-decoration: none;
    font-weight: 600;
    transition: var(--transition);
    border: 2px solid transparent;
}

.cta-button.primary {
    background: white;
    color: var(--primary-color);
}

.cta-button.primary:hover {
    transform: translateY(-3px);
    box-shadow: var(--box-shadow-lg);
}

.cta-button.secondary {
    background: transparent;
    color: white;
    border-color: white;
}

.cta-button.secondary:hover {
    background: white;
    color: var(--primary-color);
}

/* Features Section */
.features {
    margin: 4rem 0;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
}

.feature-card {
    background: white;
    padding: 2.5rem;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    text-align: center;
    transition: var(--transition);
    border: 1px solid var(--border-color);
}

.feature-card:hover {
    transform: translateY(-8px);
    box-shadow: var(--box-shadow-lg);
}

.feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.feature-card h3 {
    color: var(--primary-color);
    margin-bottom: 1rem;
    font-size: 1.5rem;
}

.feature-card p {
    color: var(--text-light);
    margin-bottom: 1.5rem;
}

.feature-link {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 600;
    transition: var(--transition);
}

.feature-link:hover {
    color: var(--secondary-color);
}

/* Stats Section */
.stats {
    margin: 4rem 0;
    padding: 3rem;
    background: white;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
}

.stat-card {
    text-align: center;
    padding: 2rem;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: white;
    border-radius: var(--border-radius);
}

.stat-number {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
}

.stat-label {
    font-size: 1.1rem;
    opacity: 0.9;
}

/* Projects Section */
.projects-preview {
    margin: 4rem 0;
}

.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.project-card {
    background: white;
    padding: 2rem;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    transition: var(--transition);
    border-left: 4px solid var(--primary-color);
}

.project-card:hover {
    transform: translateX(5px);
    box-shadow: var(--box-shadow-lg);
}

.project-card h3 {
    color: var(--primary-color);
    margin-bottom: 1rem;
}

.project-link {
    display: inline-block;
    margin-top: 1rem;
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 600;
    transition: var(--transition);
}

.project-link:hover {
    color: var(--secondary-color);
}

/* Footer */
footer {
    background: var(--dark-bg);
    color: white;
    margin-top: 4rem;
    padding: 3rem 0 1rem;
}

.footer-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 20px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
}

.footer-section h3,
.footer-section h4 {
    color: var(--accent-color);
    margin-bottom: 1rem;
}

.footer-section ul {
    list-style: none;
}

.footer-section ul li {
    margin-bottom: 0.5rem;
}

.footer-section a {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    transition: var(--transition);
}

.footer-section a:hover {
    color: var(--accent-color);
}

.footer-bottom {
    text-align: center;
    padding-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.6);
}

/* Responsive Design */
@media (max-width: 768px) {
    .menu-toggle {
        display: flex;
    }
    
    .navigation {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--dark-bg);
        flex-direction: column;
        padding: 1rem;
        box-shadow: var(--box-shadow);
    }
    
    .navigation.active {
        display: flex;
    }
    
    .hero-content h1 {
        font-size: 2rem;
    }
    
    .hero-subtitle {
        font-size: 1rem;
    }
    
    .section-title {
        font-size: 2rem;
    }
    
    .features-grid,
    .projects-grid {
        grid-template-columns: 1fr;
    }
}
"""
        
        css_file = self.base_path / "assets" / "css" / "main.css"
        with open(css_file, 'w', encoding='utf-8') as f:
            f.write(css_content)
        print(f"✓ Created: assets/css/main.css")
    
    def create_javascript(self):
        """Create main JavaScript file"""
        js_content = """// AVATARARTS.ORG Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.navigation');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Animate statistics
    animateStats();
    
    // Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img.lazy').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    console.log('AVATARARTS.ORG initialized');
});

function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateNumber(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

function animateNumber(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 30);
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: #4361ee;
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Form validation
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
    
    return isValid;
}
"""
        
        js_file = self.base_path / "assets" / "js" / "main.js"
        with open(js_file, 'w', encoding='utf-8') as f:
            f.write(js_content)
        print(f"✓ Created: assets/js/main.js")
    
    def create_folder_index_page(self, index_json_path: Path = None):
        """Create folder index page"""
        index_page_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Folder Index | AVATARARTS</title>
    <link rel="stylesheet" href="../../assets/css/main.css">
    <style>
        .index-container {{
            max-width: 1400px;
            margin: 0 auto;
            padding: 2rem 20px;
        }}
        .index-header {{
            background: white;
            padding: 2rem;
            border-radius: 12px;
            margin-bottom: 2rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }}
        .search-box {{
            width: 100%;
            padding: 1rem;
            font-size: 1.1rem;
            border: 2px solid #ddd;
            border-radius: 8px;
            margin-bottom: 2rem;
        }}
        .folder-tree {{
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }}
        .folder-item {{
            padding: 0.5rem;
            margin: 0.25rem 0;
            cursor: pointer;
            border-left: 3px solid #4361ee;
            background: #f8f9fa;
            transition: all 0.2s;
        }}
        .folder-item:hover {{
            background: #e9ecef;
            transform: translateX(5px);
        }}
        .file-item {{
            padding: 0.25rem 0.25rem 0.25rem 2rem;
            color: #666;
            font-size: 0.9rem;
        }}
        .hidden {{
            display: none;
        }}
    </style>
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
                <li><a href="/content/index/">Index</a></li>
                <li><a href="/pages/contact/">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <div class="index-container">
            <div class="index-header">
                <h1>📁 Folder Index</h1>
                <p>Complete directory structure of AVATARARTS project</p>
                <input type="text" class="search-box" id="searchInput" placeholder="Search folders and files...">
            </div>
            
            <div class="folder-tree" id="folderTree">
                <p>Loading folder index...</p>
                <p><a href="/content/index/folder_index.html">View Full HTML Index</a></p>
            </div>
        </div>
    </main>
    
    <footer>
        <div class="footer-content">
            <div class="footer-section">
                <h3>AVATARARTS</h3>
                <p>Comprehensive AI automation and digital marketing ecosystem.</p>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; {datetime.now().year} AVATARARTS. All rights reserved.</p>
        </div>
    </footer>
    
    <script src="../../assets/js/main.js"></script>
    <script>
        // Search functionality
        document.getElementById('searchInput').addEventListener('keyup', function(e) {{
            const filter = e.target.value.toLowerCase();
            const items = document.querySelectorAll('.folder-item, .file-item');
            items.forEach(item => {{
                const text = item.textContent.toLowerCase();
                if (text.includes(filter)) {{
                    item.classList.remove('hidden');
                }} else {{
                    item.classList.add('hidden');
                }}
            }});
        }});
    </script>
</body>
</html>
"""
        
        index_dir = self.base_path / "content" / "index"
        index_file = index_dir / "index.html"
        with open(index_file, 'w', encoding='utf-8') as f:
            f.write(index_page_content)
        print(f"✓ Created: content/index/index.html")
    
    def create_config_files(self):
        """Create configuration files"""
        # robots.txt
        robots_content = """User-agent: *
Allow: /
Disallow: /admin/
Disallow: /system/
Disallow: /api/

Sitemap: https://avatararts.org/sitemap.xml
"""
        (self.base_path / "robots.txt").write_text(robots_content)
        print(f"✓ Created: robots.txt")
        
        # sitemap.xml
        sitemap_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://avatararts.org/</loc>
        <lastmod>{datetime.now().strftime('%Y-%m-%d')}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://avatararts.org/pages/about/</loc>
        <lastmod>{datetime.now().strftime('%Y-%m-%d')}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://avatararts.org/content/projects/</loc>
        <lastmod>{datetime.now().strftime('%Y-%m-%d')}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://avatararts.org/content/services/</loc>
        <lastmod>{datetime.now().strftime('%Y-%m-%d')}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>https://avatararts.org/content/index/</loc>
        <lastmod>{datetime.now().strftime('%Y-%m-%d')}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.6</priority>
    </url>
    <url>
        <loc>https://avatararts.org/pages/contact/</loc>
        <lastmod>{datetime.now().strftime('%Y-%m-%d')}</lastmod>
        <changefreq>yearly</changefreq>
        <priority>0.6</priority>
    </url>
</urlset>
"""
        (self.base_path / "sitemap.xml").write_text(sitemap_content)
        print(f"✓ Created: sitemap.xml")
        
        # .htaccess
        htaccess_content = """# AVATARARTS.ORG Apache Configuration
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain text/html text/xml text/css
    AddOutputFilterByType DEFLATE application/xml application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

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
</IfModule>

<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
</IfModule>

RewriteEngine On
RewriteCond %{HTTP_HOST} ^www.avatararts.org [NC]
RewriteRule ^(.*)$ https://avatararts.org/$1 [L,R=301]

RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://avatararts.org/$1 [L,R=301]
"""
        (self.base_path / ".htaccess").write_text(htaccess_content)
        print(f"✓ Created: .htaccess")
        
        # README.md
        readme_content = f"""# AVATARARTS.ORG Website

Welcome to the official website for AVATARARTS - a comprehensive AI automation and digital marketing ecosystem.

## Features

- Modern, responsive design
- SEO optimized
- Fast loading times
- Secure implementation
- Folder index integration
- Performance optimized

## Structure

```
avatararts.org/
├── index.html              # Main landing page
├── assets/                 # Static assets
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript files
│   ├── images/            # Image assets
│   └── fonts/             # Font files
├── content/               # Website content
│   ├── projects/          # Project pages
│   ├── services/          # Service descriptions
│   ├── index/             # Folder index
│   └── documentation/     # Documentation
└── pages/                 # Static pages
```

## Setup

This website was generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}.

## Deployment

1. Upload all files to your web server
2. Ensure .htaccess is properly configured
3. Set proper file permissions
4. Configure SSL certificate for HTTPS

## License

Copyright © {datetime.now().year} AVATARARTS. All rights reserved.
"""
        (self.base_path / "README.md").write_text(readme_content)
        print(f"✓ Created: README.md")


def main():
    """Main function"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Setup avatararts.org website')
    parser.add_argument('--output', type=str, default='./avatararts.org', 
                       help='Output directory for website')
    parser.add_argument('--index', type=str, help='Path to folder index JSON file')
    
    args = parser.parse_args()
    
    base_path = Path(args.output).resolve()
    
    print("="*80)
    print("AVATARARTS.ORG Website Setup")
    print("="*80)
    print(f"\nOutput directory: {base_path}\n")
    
    builder = WebsiteBuilder(base_path)
    
    print("Creating directory structure...")
    builder.create_directory_structure()
    
    print("\nCreating website files...")
    builder.create_index_html()
    builder.create_css()
    builder.create_javascript()
    builder.create_folder_index_page()
    builder.create_config_files()
    
    print("\n" + "="*80)
    print("✅ Website setup complete!")
    print("="*80)
    print(f"\nWebsite files created at: {base_path}")
    print("\nNext steps:")
    print("1. Run the folder indexer: python3 01_TOOLS/scripts/index_all_folders.py")
    print("2. Copy the generated index files to content/index/")
    print("3. Customize content as needed")
    print("4. Deploy to web server")


if __name__ == '__main__':
    main()
