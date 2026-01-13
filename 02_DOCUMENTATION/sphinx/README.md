# AVATARARTS Sphinx Documentation System

Professional documentation site for the entire AVATARARTS platform, built with Sphinx.

## 🎯 What This Is

A comprehensive, searchable documentation website that consolidates:
- All 6+ business projects
- 3 client websites and projects
- AI/automation tools
- Code documentation
- Guides and tutorials
- API references

## 🚀 Quick Start

### View Documentation Locally

```bash
cd /Users/steven/AVATARARTS/docs-sphinx

# Build HTML documentation
make html

# Serve documentation locally (http://localhost:8000)
make serve
```

Then open your browser to: **http://localhost:8000**

### Rebuild Documentation

```bash
# Auto-generate doc files from workspace
python3 build_docs.py generate

# Build HTML
make html

# Clean and rebuild
make clean && make html
```

## 📁 Structure

```
docs-sphinx/
├── index.rst              # Main documentation index
├── conf.py                # Sphinx configuration
├── getting-started.md     # Quick start guide
├── overview.md            # Platform overview
├── build_docs.py          # Auto-generator script
├── Makefile               # Build commands
│
├── business/              # Business projects docs
├── clients/               # Client projects docs
├── ai-tools/              # AI & automation docs
├── seo/                   # Marketing & SEO docs
├── utilities/             # Tools & utilities docs
├── code/                  # Code documentation
├── data/                  # Data & analytics docs
├── content/               # Content & assets docs
├── api/                   # API reference
├── guides/                # Guides & tutorials
│
├── _static/               # Custom CSS and assets
│   └── custom.css         # AVATARARTS branding
├── _templates/            # Custom Sphinx templates
└── _build/                # Generated HTML output
    └── html/              # Built documentation site
```

## 🛠️ Available Commands

```bash
# Generate documentation files
make generate              # or: python3 build_docs.py generate

# Build HTML
make html                  # Builds to _build/html/

# Clean build files
make clean

# Serve locally
make serve                 # http://localhost:8000

# All commands via build_docs.py
python3 build_docs.py generate    # Generate doc files
python3 build_docs.py build       # Build HTML
python3 build_docs.py serve       # Build and serve
```

## 📚 What's Documented

### Business Projects
- Heavenly Hands Cleaning (118 MB)
- Retention Suite (Complete)
- QuantumForge Labs (Complete)
- CleanConnect variations
- Digital Marketplace
- Education Platform

### Client Projects
- Dr. Adu Gainesville PFS SEO Project
- Joseph Rosado MD (Medical practice website)
- Steven Chaplinski Personal Site

### AI & Automation
- Voice agent systems
- Intelligent organization tools
- Ollama LLM integration
- n8n workflow automation

### Tools & Utilities
- avatararts_organize.py - Workspace management
- avatararts_reindex.py - Search & indexing
- Data analytics tools
- Organization scripts

## 🎨 Features

✅ **Professional Theme** - ReadTheDocs theme with custom AVATARARTS branding
✅ **Full Search** - Search across all 4,338 indexed files
✅ **Markdown Support** - Write docs in Markdown or reStructuredText
✅ **Auto-Generation** - Pulls content from workspace automatically
✅ **Responsive Design** - Works on desktop and mobile
✅ **Code Highlighting** - Syntax highlighting for all languages
✅ **Cross-References** - Links between all documentation pages
✅ **Index & Search** - Comprehensive index and search functionality

## 🔧 Configuration

### Sphinx Settings

- **Theme**: sphinx_rtd_theme (ReadTheDocs)
- **Extensions**: autodoc, napoleon, myst_parser, todo
- **Source Formats**: .rst and .md files
- **Python Version**: 3.12
- **Sphinx Version**: 8.2.3

### Custom Styling

Custom CSS is in `_static/custom.css` with:
- AVATARARTS brand colors
- Enhanced navigation
- Improved code blocks
- Custom badges and cards
- Responsive design tweaks

## 📖 Writing Documentation

### Add New Page

1. Create a new `.md` or `.rst` file in appropriate directory
2. Add it to the `toctree` in `index.rst` or parent `index.md`
3. Rebuild: `make html`

### Markdown Example

```markdown
# Page Title

## Section

Content goes here with [links](other-page.md) and **formatting**.

\`\`\`python
# Code blocks work too
def example():
    return "Hello, AVATARARTS!"
\`\`\`
```

### reStructuredText Example

```rst
Page Title
==========

Section
-------

Content goes here with :doc:`links <other-page>` and **formatting**.

.. code-block:: python

   # Code blocks
   def example():
       return "Hello, AVATARARTS!"
```

## 🌐 Deployment Options

### Option 1: GitHub Pages

```bash
# Build documentation
make html

# Copy to GitHub Pages repo
cp -r _build/html/* ../AvaTar-ArTs.github.io/docs/

# Commit and push
cd ../AvaTar-ArTs.github.io
git add docs/
git commit -m "Update documentation"
git push
```

### Option 2: Local Server

```bash
# Serve on port 8000
make serve

# Or use Python directly
cd _build/html
python3 -m http.server 8000
```

### Option 3: Read the Docs

1. Connect your GitHub repo to readthedocs.org
2. Configure to use `docs-sphinx/` as source directory
3. Automatic builds on push

## 📊 Statistics

- **Total Pages**: 13 main sections
- **Auto-Generated**: Yes (from workspace)
- **Indexed Content**: 4,338 files
- **Build Time**: ~5 seconds
- **Output Size**: ~500 KB (HTML + assets)

## 🔄 Auto-Generation

The `build_docs.py` script automatically:

1. Scans workspace for documentation
2. Indexes all markdown files
3. Creates structured pages for each category
4. Links to actual project files
5. Generates API documentation
6. Builds comprehensive index

Run it anytime workspace changes:
```bash
python3 build_docs.py generate
make html
```

## 💡 Tips

1. **Rebuild Often** - Run `make html` after any changes
2. **Check Warnings** - Fix broken cross-references
3. **Test Locally** - Always test with `make serve` before deploying
4. **Keep Updated** - Regenerate when adding new projects
5. **Use Search** - Built-in search finds everything

## 🎯 Next Steps

1. ✅ Documentation system is built and working
2. 📝 Add detailed content to each section
3. 🔗 Create cross-references between pages
4. 📸 Add screenshots and diagrams
5. 🌐 Deploy to GitHub Pages or Read the Docs
6. 🔄 Set up auto-regeneration on workspace changes

## 🆘 Troubleshooting

### Build Errors

```bash
# Clean and rebuild
make clean
make html

# Check Python/Sphinx installation
python3 -m sphinx --version

# Reinstall dependencies
pip install --user --upgrade sphinx sphinx-rtd-theme myst-parser
```

### Missing Dependencies

```bash
# Install all required packages
pip install --user sphinx sphinx-rtd-theme myst-parser pygments
```

### Broken Links

- Check `toctree` directives in .rst files
- Verify file paths in cross-references
- Rebuild to regenerate references

## 📝 Documentation TODO

- [ ] Add detailed business project pages
- [ ] Document client websites
- [ ] Create API reference for Python tools
- [ ] Add deployment guides
- [ ] Include code examples
- [ ] Add screenshots/diagrams
- [ ] Write comprehensive guides
- [ ] Set up auto-deployment

## 🎉 Success!

Your Sphinx documentation system is fully set up and working!

**Built HTML Location**: `_build/html/`
**Main Index**: `_build/html/index.html`
**Local Server**: http://localhost:8000 (via `make serve`)

---

**Created**: 2026-01-02
**Version**: 1.0.0
**Status**: ✅ Active
