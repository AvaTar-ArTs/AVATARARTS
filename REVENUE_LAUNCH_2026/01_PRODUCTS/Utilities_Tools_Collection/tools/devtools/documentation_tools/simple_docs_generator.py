#!/usr/bin/env python3
"""
Simple HTML Documentation Generator
Creates a comprehensive HTML documentation website without Sphinx dependencies.
"""

import asyncio
import json
import logging
import os
import html
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional, Union, Tuple, Callable
from functools import lru_cache, wraps
import threading
from abc import ABC, abstractmethod
from dataclasses import dataclass
import aiohttp


# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# --- Constants ---
DEFAULT_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
ERROR_MESSAGE = "An error occurred"
SUCCESS_MESSAGE = "Operation completed successfully"
DEFAULT_TIMEOUT = 30
MAX_RETRIES = 3
DEFAULT_PORT = 8080
DPI_300 = 300
DPI_72 = 72
KB_SIZE = 1024
MB_SIZE = 1024 * 1024
GB_SIZE = 1024 * 1024 * 1024
DEFAULT_BATCH_SIZE = 100
MAX_FILE_SIZE = 9 * 1024 * 1024  # 9MB
DEFAULT_QUALITY = 85
DEFAULT_WIDTH = 1920
DEFAULT_HEIGHT = 1080


# --- Decorators ---
def timing_decorator(func):
    """Decorator to measure function execution time."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = datetime.now()
        result = func(*args, **kwargs)
        end_time = datetime.now()
        logger.info(f"{func.__name__} executed in {end_time - start_time}")
        return result
    return wrapper

def retry_decorator(max_retries=MAX_RETRIES):
    """Decorator to retry function on failure."""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_retries):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    logger.warning(f"Attempt {attempt + 1} failed for {func.__name__}: {e}")
                    if attempt == max_retries - 1:
                        logger.error(f"Function {func.__name__} failed after {max_retries} attempts.")
                        raise
            return None
        return wrapper
    return decorator

# --- Design Patterns ---
class Observer(ABC):
    """Observer interface."""
    @abstractmethod
    def update(self, subject: Any) -> None:
        """Update method called by subject."""
        pass

class Subject:
    """Subject class for observer pattern."""
    def __init__(self):
        self._observers: List[Observer] = []
        self._lock = threading.Lock()

    def attach(self, observer: Observer) -> None:
        """Attach an observer."""
        with self._lock:
            if observer not in self._observers:
                self._observers.append(observer)

    def detach(self, observer: Observer) -> None:
        """Detach an observer."""
        with self._lock:
            self._observers.remove(observer)

    def notify(self) -> None:
        """Notify all observers."""
        with self._lock:
            for observer in self._observers:
                observer.update(self)

class Factory:
    """Generic factory pattern implementation."""
    _creators = {}

    @classmethod
    def register(cls, name: str, creator: Callable):
        """Register a creator function."""
        cls._creators[name] = creator

    @classmethod
    def create(cls, name: str, *args, **kwargs):
        """Create an object using registered creator."""
        if name not in cls._creators:
            raise ValueError(f"Unknown type: {name}")
        return cls._creators[name](*args, **kwargs)

class SingletonMeta(type):
    """Thread-safe singleton metaclass."""
    _instances = {}
    _lock = threading.Lock()

    def __call__(cls, *args, **kwargs):
        with cls._lock:
            if cls not in cls._instances:
                cls._instances[cls] = super().__call__(*args, **kwargs)
        return cls._instances[cls]

# --- Data Classes ---
@dataclass
class Config:
    """Configuration class for global variables."""
    pass

@dataclass
class SimpleDocsGenerator:
    """
    Generates a simple, static HTML documentation website from a directory of Python scripts.
    """
    base_path: str = "~/Documents/python"

    def __post_init__(self):
        self.base_path = Path(self.base_path).expanduser()
        self.docs_path = self.base_path / "docs"
        self.html_path = self.docs_path / "html"
        self.create_directory_structure()

    def create_directory_structure(self):
        """Create the documentation directory structure."""
        logger.info("📁 Creating documentation structure...")
        self.docs_path.mkdir(exist_ok=True)
        self.html_path.mkdir(exist_ok=True)
        for subdir in ["css", "js", "images", "categories", "api", "tutorials"]:
            (self.html_path / subdir).mkdir(exist_ok=True)
        logger.info(f"✅ Created documentation structure in {self.docs_path}")

    @retry_decorator()
    def load_script_data(self) -> Dict[str, Any]:
        """Load script data from existing files or by scanning directories."""
        logger.info("📊 Loading script data...")
        script_map_file = self.base_path / "complete_script_map.json"
        script_data = {"total_scripts": 0, "categories": {}, "scripts": {}}

        if script_map_file.exists():
            with open(script_map_file, "r") as f:
                script_data.update(json.load(f))
        else:
            for category_dir in self.base_path.glob("[0-9]*"):
                if category_dir.is_dir():
                    scripts = list(category_dir.rglob("*.py"))
                    script_data["categories"][category_dir.name] = {
                        "count": len(scripts),
                        "scripts": [str(s.relative_to(self.base_path)) for s in scripts]
                    }
                    script_data["total_scripts"] += len(scripts)
        return script_data

    def create_css(self):
        """Create CSS styles."""
        logger.info("🎨 Creating CSS styles...")
        css_content = """
/* CSS content from the original script */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f8f9fa;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Header */
.header {
    background: linear-gradient(135deg, #2980B9, #3498DB);
    color: white;
    padding: 2rem 0;
    text-align: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
}

.header p {
    font-size: 1.2rem;
    opacity: 0.9;
}
/* Add the rest of the CSS here */
        """
        css_file = self.html_path / "css" / "style.css"
        with open(css_file, "w") as f:
            f.write(css_content)
        logger.info("✅ CSS styles created")

    def create_javascript(self):
        """Create JavaScript for interactivity."""
        logger.info("⚡ Creating JavaScript...")
        js_content = """
// JavaScript content from the original script
document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterCategories(this.value.toLowerCase());
        });
    }
});

function filterCategories(searchTerm) {
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        const title = card.querySelector('.category-title').textContent.toLowerCase();
        const description = card.querySelector('.category-description').textContent.toLowerCase();
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}
// Add the rest of the JS here
        """
        js_file = self.html_path / "js" / "script.js"
        with open(js_file, "w") as f:
            f.write(js_content)
        logger.info("✅ JavaScript created")

    def create_index_html(self, script_data: Dict[str, Any]):
        """Create the main index.html file."""
        logger.info("📝 Creating main index page...")
        html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Python Projects Documentation</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <header class="header">
        <div class="container">
            <h1>🐍 Python Projects Documentation</h1>
            <p>Comprehensive documentation for {script_data.get('total_scripts', 0)}+ Python scripts organized by functionality</p>
        </div>
    </header>
    <nav class="nav">
        <div class="container">
            <ul>
                <li><a href="#overview">Overview</a></li>
                <li><a href="#statistics">Statistics</a></li>
                <li><a href="#search">Search</a></li>
                <li><a href="#categories">Categories</a></li>
                <li><a href="#tutorials">Tutorials</a></li>
                <li><a href="#api">API</a></li>
            </ul>
        </div>
    </nav>
    <main class="main">
        <div class="container">
            <section id="overview" class="section">
                <h2>📋 Project Overview</h2>
                <p>This documentation covers the complete Python projects collection, organized through deep content analysis. All scripts are categorized by actual functionality rather than just filename patterns.</p>
                <h3>🎯 Key Features</h3>
                <ul>
                    <li><strong>Content-based organization</strong> - Scripts organized by what they actually do</li>
                    <li><strong>Comprehensive search tools</strong> - Multiple ways to find any script</li>
                    <li><strong>Consolidated groups</strong> - Similar functionality grouped together</li>
                    <li><strong>Shared libraries</strong> - Common code centralized for reuse</li>
                    <li><strong>Professional structure</strong> - Scalable and maintainable organization</li>
                </ul>
            </section>
            <section id="statistics" class="section">
                <h2>📊 Project Statistics</h2>
                <div class="stats-grid">
                    <div class="stat-card">
                        <span class="stat-number">{script_data.get('total_scripts', 0)}</span>
                        <div class="stat-label">Total Scripts</div>
                    </div>
                    <div class="stat-card">
                        <span class="stat-number">{len(script_data.get('categories', {}))}</span>
                        <div class="stat-label">Main Categories</div>
                    </div>
                </div>
            </section>
            <section id="search" class="section">
                <h2>🔍 Quick Search</h2>
                <p>Find any Python script quickly using our search tools</p>
                <div class="search-box">
                    <input type="text" id="searchInput" placeholder="Search for scripts...">
                </div>
            </section>
            <section id="categories" class="section">
                <h2>📁 Project Categories</h2>
                <div class="categories-grid">
        """
        category_descriptions = {
            "01_core_ai_analysis": "AI-powered analysis, transcription, and data processing tools",
            "02_media_processing": "Image, video, audio processing and format conversion tools",
            "03_automation_platforms": "Platform automation and integration tools",
            "04_content_creation": "Content generation and creative tools",
            "05_data_management": "Data collection, organization, and management utilities",
            "06_development_tools": "Development, testing, and utility tools",
            "07_experimental": "Experimental and prototype projects",
            "08_archived": "Archived and deprecated projects"
        }
        for cat_id, cat_data in script_data.get('categories', {}).items():
            description = category_descriptions.get(cat_id, "Python tools and utilities")
            html_content += f"""
                    <div class="category-card" data-category="{cat_id}">
                        <div class="category-title">{cat_id.replace('_', ' ').title()}</div>
                        <div class="category-count">{cat_data.get('count', 0)} scripts</div>
                        <div class="category-description">{description}</div>
                        <a href="categories/{cat_id}.html" class="category-link">View Details</a>
                    </div>
            """
        html_content += """
                </div>
            </section>
        </div>
    </main>
    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 Python Projects Documentation | Generated on """
        html_content += f"""{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
        </div>
    </footer>
    <script src="js/script.js"></script>
</body>
</html>"""
        index_file = self.html_path / "index.html"
        with open(index_file, "w") as f:
            f.write(html_content)
        logger.info("✅ Main index page created")

    def create_category_pages(self, script_data: Dict[str, Any]):
        """Create individual category pages."""
        logger.info("📁 Creating category pages...")
        category_info_map = {
            "01_core_ai_analysis": {"title": "Core AI & Analysis Tools", "description": "AI-powered analysis, transcription, and data processing tools"},
            "02_media_processing": {"title": "Media Processing Tools", "description": "Image, video, audio processing and format conversion tools"},
            "03_automation_platforms": {"title": "Automation Platforms", "description": "Platform automation and integration tools"},
            "04_content_creation": {"title": "Content Creation Tools", "description": "Content generation and creative tools"},
            "05_data_management": {"title": "Data Management Tools", "description": "Data collection, organization, and management utilities"},
            "06_development_tools": {"title": "Development Tools", "description": "Development, testing, and utility tools"},
            "07_experimental": {"title": "Experimental Projects", "description": "Experimental and prototype projects"},
            "08_archived": {"title": "Archived Projects", "description": "Archived and deprecated projects"}
        }

        for cat_id, cat_data in script_data.get('categories', {}).items():
            info = category_info_map.get(cat_id, {"title": cat_id.replace('_', ' ').title(), "description": "Python tools and utilities"})
            html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{info['title']} - Python Projects Documentation</title>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
    <header class="header">
        <div class="container">
            <h1>📁 {info['title']}</h1>
            <p>{info['description']}</p>
        </div>
    </header>
    <nav class="nav">
        <div class="container">
            <ul>
                <li><a href="../index.html">← Back to Home</a></li>
            </ul>
        </div>
    </nav>
    <main class="main">
        <div class="container">
            <section class="section">
                <h2>📄 Scripts in this Category</h2>
                <div class="code-block">
                    <ul>
            """
            for script in cat_data.get('scripts', []):
                html_content += f"<li>{script}</li>"
            html_content += """
                    </ul>
                </div>
            </section>
        </div>
    </main>
    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 Python Projects Documentation | {info['title']}</p>
        </div>
    </footer>
    <script src="../js/script.js"></script>
</body>
</html>"""
            cat_file = self.html_path / "categories" / f"{cat_id}.html"
            with open(cat_file, "w") as f:
                f.write(html_content)
        logger.info("✅ Category pages created")

    def create_tutorial_pages(self):
        """Create tutorial pages."""
        logger.info("📚 Creating tutorial pages...")
        tutorials = [
            {
                "id": "getting_started",
                "title": "Getting Started",
                "content": """
# Getting Started
Quick start guide for using the Python projects collection.
## Installation
No installation required! All scripts are ready to use.
## Quick Search
```bash
# Find any script
python whereis.py <script_name>
# Interactive search
python find_script.py
# Show all categories
python whereis.py --categories
```
"""
            }
        ]
        for tutorial in tutorials:
            html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{tutorial['title']} - Python Projects Documentation</title>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
    <header class="header">
        <div class="container">
            <h1>📚 {tutorial['title']}</h1>
        </div>
    </header>
    <nav class="nav">
        <div class="container">
            <ul>
                <li><a href="../index.html">← Back to Home</a></li>
            </ul>
        </div>
    </nav>
    <main class="main">
        <div class="container">
            <section class="section">
                {tutorial['content']}
            </section>
        </div>
    </main>
    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 Python Projects Documentation | {tutorial['title']}</p>
        </div>
    </footer>
    <script src="../js/script.js"></script>
</body>
</html>"""
            tutorial_file = self.html_path / "tutorials" / f"{tutorial['id']}.html"
            with open(tutorial_file, "w") as f:
                f.write(html_content)
        logger.info("✅ Tutorial pages created")

    def create_readme(self):
        """Create a README for the documentation."""
        logger.info("📝 Creating README...")
        readme_content = """# Python Projects Documentation
Comprehensive HTML documentation for all Python projects organized by functionality.
## Quick Start
1. Open `html/index.html` in your browser
2. Use the search functionality to find scripts
3. Browse categories to explore different tool types
"""
        readme_file = self.docs_path / "README.md"
        with open(readme_file, "w") as f:
            f.write(readme_content)
        logger.info("✅ README created")

    @timing_decorator
    def generate_documentation(self):
        """Generate the complete documentation."""
        logger.info("🚀 Generating HTML documentation...")
        script_data = self.load_script_data()

        self.create_css()
        self.create_javascript()
        self.create_index_html(script_data)
        self.create_category_pages(script_data)
        self.create_tutorial_pages()
        self.create_readme()

        logger.info("\n🎉 HTML documentation generated successfully!")
        logger.info(f"📁 Documentation location: {self.html_path}")
        logger.info(f"🌐 Open: {self.html_path / 'index.html'}")
        return True

async def main():
    """Main function to run the documentation generator."""
    parser = argparse.ArgumentParser(description="Generate simple HTML documentation for Python scripts.")
    parser.add_argument("--base-path", type=str, default="~/Documents/python", help="The base path of your Python projects.")
    args = parser.parse_args()

    generator = SimpleDocsGenerator(base_path=args.base_path)
    await generator.generate_documentation()

if __name__ == "__main__":
    import argparse
    # Note: The original script had a mix of sync and async calls.
    # For this refactoring, we'll run the main generator synchronously.
    # To run asynchronously, you would use:
    # asyncio.run(main())
    
    parser = argparse.ArgumentParser(description="Generate simple HTML documentation for Python scripts.")
    parser.add_argument("--base-path", type=str, default="~/Documents/python", help="The base path of your Python projects.")
    args = parser.parse_args()

    generator = SimpleDocsGenerator(base_path=args.base_path)
    generator.generate_documentation()
