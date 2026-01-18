# 📚 Sphinx Setup Guide

**Create professional Python documentation with Sphinx**

---

## 🎯 What is Sphinx?

Sphinx is a documentation generator used by Python projects. It creates beautiful HTML, PDF, and other formats from reStructuredText or Markdown.

**Benefits:**
- ✅ Python-native
- ✅ Multiple output formats
- ✅ Search functionality
- ✅ Theme customization
- ✅ Used by Python itself

---

## 📋 Prerequisites

- Python 3.8+ installed
- pip installed

---

## 🚀 Quick Setup (10 minutes)

### Step 1: Install Sphinx

```bash
pip install sphinx sphinx-rtd-theme
```

### Step 2: Create Documentation Directory

```bash
mkdir docs
cd docs
```

### Step 3: Initialize Sphinx

```bash
sphinx-quickstart
```

**Answer prompts:**
- Root path: `.` (current directory)
- Separate source/build: `y`
- Name: `Podcast to Shorts AI`
- Author: Your name
- Version: `2.0`
- Release: `2.0.0`
- Language: `en`
- Master file: `index` (default)
- epub: `y` (optional)

### Step 4: Configure Theme

**Edit `conf.py`:**

```python
import sphinx_rtd_theme

html_theme = 'sphinx_rtd_theme'
html_theme_path = [sphinx_rtd_theme.get_html_theme_path()]
```

### Step 5: Build Documentation

```bash
make html
```

**Or on Windows:**
```bash
make.bat html
```

**Output:** `_build/html/index.html`

**Open in browser!** 🎉

---

## 📁 Project Structure

```
docs/
├── _build/                 # Generated files
├── _static/                # Static assets
├── _templates/             # Custom templates
├── conf.py                 # Configuration
├── index.rst               # Main index
├── installation.rst        # Installation guide
├── quick-start.rst         # Quick start
├── testing.rst             # Testing guide
└── Makefile               # Build commands
```

---

## 📝 Add Your Documentation

### Convert Markdown to reStructuredText

**Or use MyST parser for Markdown:**

**Install:**
```bash
pip install myst-parser
```

**Update `conf.py`:**
```python
extensions = [
    'myst_parser',
    # ... other extensions
]
```

**Now you can use Markdown files!**

### Create Documentation Files

**Copy your markdown files to `docs/`:**

```bash
cp installation.md docs/installation.md
cp quick-start.md docs/quick-start.md
cp testing.md docs/testing.md
# ... etc
```

### Update Index

**Edit `index.rst`:**

```rst
Podcast to Shorts AI Documentation
==================================

Welcome to the Podcast to Shorts AI documentation!

.. toctree::
   :maxdepth: 2
   :caption: Contents:

   installation
   quick-start
   testing
   configuration
   examples
   api-reference
   troubleshooting
   deployment
   faq
```

---

## 🎨 Customize Configuration

### Edit `conf.py`

```python
project = 'Podcast to Shorts AI'
copyright = '2026, Your Name'
author = 'Your Name'

release = '2.0.0'
version = '2.0'

html_theme = 'sphinx_rtd_theme'
html_static_path = ['_static']

html_theme_options = {
    'logo_only': False,
    'display_version': True,
    'prev_next_buttons_location': 'bottom',
    'style_external_links': False,
    'vcs_pageview_mode': '',
    'style_nav_header_background': '#667eea',
    # Toc options
    'collapse_navigation': True,
    'sticky_navigation': True,
    'navigation_depth': 4,
    'includehidden': True,
    'titles_only': False
}
```

---

## 🚀 Build Commands

### HTML (Web)

```bash
make html
```

**Output:** `_build/html/`

### PDF

```bash
make latexpdf
```

**Output:** `_build/latex/podcasttoshortsai.pdf`

### EPUB

```bash
make epub
```

**Output:** `_build/epub/podcasttoshortsai.epub`

---

## 🌐 Deploy

### GitHub Pages

1. Build HTML:
   ```bash
   make html
   ```

2. Copy to `gh-pages` branch:
   ```bash
   git checkout --orphan gh-pages
   git rm -rf .
   cp -r _build/html/* .
   git add .
   git commit -m "Deploy docs"
   git push origin gh-pages
   ```

### Read the Docs

1. Sign up at [readthedocs.org](https://readthedocs.org)
2. Import your repository
3. Configure build settings
4. Deploy automatically!

**Free hosting!**

---

## 📋 Complete Setup Checklist

- [ ] Install Sphinx
- [ ] Initialize project
- [ ] Configure theme
- [ ] Add documentation files
- [ ] Update index
- [ ] Build HTML
- [ ] Test locally
- [ ] Deploy to hosting

---

## 🎯 Quick Commands

```bash
# Build HTML
make html

# Build PDF
make latexpdf

# Clean build
make clean

# Open in browser (Mac)
open _build/html/index.html

# Open in browser (Linux)
xdg-open _build/html/index.html

# Open in browser (Windows)
start _build/html/index.html
```

---

## 📚 Resources

- [Sphinx Documentation](https://www.sphinx-doc.org/)
- [reStructuredText Primer](https://www.sphinx-doc.org/en/master/usage/restructuredtext/index.html)
- [MyST Parser](https://myst-parser.readthedocs.io/)
- [Read the Docs](https://readthedocs.org/)

---

## 🆘 Troubleshooting

### "Command not found: sphinx-quickstart"
→ Install Sphinx: `pip install sphinx`

### "Theme not found"
→ Install theme: `pip install sphinx-rtd-theme`

### Build errors
→ Check `conf.py` syntax
→ Verify file paths

---

**Sphinx setup complete!** 🚀

**Your Python documentation is ready!**
