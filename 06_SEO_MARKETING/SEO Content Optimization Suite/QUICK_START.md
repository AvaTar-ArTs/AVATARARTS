# 📚 SEO Documentation - Quick Start

## Build Documentation

```bash
cd ~/docs_seo
python -m sphinx -b html . _build/html
```

## View Documentation

```bash
open _build/html/index.html
```

Or:

```bash
cd _build/html
python -m http.server 8000
# Open http://localhost:8000
```

## Documentation Includes

✅ **Hot Trending Content Engine** - Complete API and usage guide  
✅ **YouTube SEO Optimizer** - Optimization strategies and examples  
✅ **Multi-Platform Content Extractor** - Extraction and analysis guide  
✅ **AEO/SEO Guide** - Complete optimization guide  
✅ **API Reference** - Full API documentation  
✅ **Examples** - Practical code examples  
✅ **Strategies** - Best practices and tactics  

## All Documentation Files

- `index.rst` - Main index
- `overview.rst` - System overview
- `hot_trending_content_engine.rst` - Hot trending engine docs
- `youtube_seo_optimizer.rst` - YouTube optimizer docs
- `multi_platform_content_extractor.rst` - Content extractor docs
- `aeo_seo_guide.rst` - AEO/SEO guide
- `api_reference.rst` - API reference
- `examples.rst` - Examples
- `strategies.rst` - Strategies

## Rebuild After Changes

```bash
cd ~/docs_seo
rm -rf _build
python -m sphinx -b html . _build/html
```

