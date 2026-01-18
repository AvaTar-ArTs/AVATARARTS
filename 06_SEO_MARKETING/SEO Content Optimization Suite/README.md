# SEO Content Optimization Suite - Sphinx Documentation

Complete Sphinx documentation for the SEO Content Optimization Suite.

## Building the Documentation

### Prerequisites

```bash
pip install sphinx sphinx-rtd-theme sphinx-autodoc-typehints
```

### Build HTML Documentation

```bash
cd ~/docs_seo
make html
```

The HTML documentation will be generated in `_build/html/`.

### View Documentation

```bash
open _build/html/index.html
```

Or use a local server:

```bash
cd _build/html
python -m http.server 8000
# Then open http://localhost:8000 in your browser
```

## Documentation Structure

* **index.rst** - Main documentation index
* **overview.rst** - System overview and architecture
* **hot_trending_content_engine.rst** - Hot trending content engine documentation
* **youtube_seo_optimizer.rst** - YouTube SEO optimizer documentation
* **multi_platform_content_extractor.rst** - Multi-platform content extractor documentation
* **aeo_seo_guide.rst** - AEO/SEO optimization guide
* **api_reference.rst** - Complete API reference
* **examples.rst** - Usage examples and tutorials
* **strategies.rst** - Strategic guides and best practices

## Quick Start

1. **Build documentation:**
   ```bash
   cd ~/docs_seo
   make html
   ```

2. **View documentation:**
   ```bash
   open _build/html/index.html
   ```

3. **Rebuild after changes:**
   ```bash
   make clean html
   ```

## Documentation Features

* **Auto-generated API docs** from docstrings
* **Type hints** support
* **Code examples** with syntax highlighting
* **Cross-references** between documents
* **Search functionality**
* **Responsive design** (Read the Docs theme)

## Customization

Edit `conf.py` to customize:
* Theme options
* Extensions
* Project information
* HTML output settings

## Troubleshooting

### Import Errors

If modules can't be imported, ensure the Python path is correct in `conf.py`:

```python
sys.path.insert(0, str(Path(__file__).parent.parent / 'pythons'))
```

### Build Warnings

Some warnings are normal (duplicate object descriptions). To suppress:

```python
suppress_warnings = ['autosummary']
```

## Contributing

When adding new modules:

1. Add module documentation in appropriate `.rst` file
2. Use `.. automodule::` for auto-generated API docs
3. Add examples in `examples.rst`
4. Update `index.rst` if needed
5. Rebuild: `make clean html`

