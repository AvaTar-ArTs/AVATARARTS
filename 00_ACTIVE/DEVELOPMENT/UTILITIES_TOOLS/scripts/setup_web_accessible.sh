#!/bin/bash
# Quick Setup: Web-Accessible Organization System

echo "🌐 SETTING UP WEB-ACCESSIBLE ORGANIZATION..."
echo "════════════════════════════════════════════════════════════════"
echo ""

# Create main structure
echo "📁 Creating directory structure..."
mkdir -p ~/web_accessible/{quantumforgelabs,avatararts,gptjunkie,unified_catalog,deployment}
mkdir -p ~/web_accessible/quantumforgelabs/{docs,catalog,assets,downloads}
mkdir -p ~/web_accessible/avatararts/{music,gallery,videos,portfolio}
mkdir -p ~/web_accessible/gptjunkie/{guides,seo-empire,tools,blog}
mkdir -p ~/web_accessible/unified_catalog/{sphinx_docs,mkdocs_site,file_browser,data}

echo "✅ Directory structure created"
echo ""

# Check for required tools
echo "🔍 Checking for required tools..."
command -v python3 >/dev/null 2>&1 && echo "  ✅ Python3 installed" || echo "  ⚠️  Python3 not found"
command -v pip3 >/dev/null 2>&1 && echo "  ✅ pip3 installed" || echo "  ⚠️  pip3 not found"
command -v node >/dev/null 2>&1 && echo "  ✅ Node.js installed" || echo "  ⚠️  Node.js not found (optional)"
echo ""

# Install Python packages (if pip available)
if command -v pip3 >/dev/null 2>&1; then
    echo "📦 Installing documentation tools..."
    echo "  Installing Sphinx..."
    pip3 install sphinx sphinx-rtd-theme sphinx-autobuild --quiet 2>/dev/null && echo "  ✅ Sphinx installed" || echo "  ⚠️  Sphinx install failed"
    
    echo "  Installing MkDocs..."
    pip3 install mkdocs mkdocs-material --quiet 2>/dev/null && echo "  ✅ MkDocs installed" || echo "  ⚠️  MkDocs install failed"
    echo ""
fi

# Create README files
echo "📝 Creating documentation..."
cat > ~/web_accessible/README.md << 'EOFREADME'
# Web-Accessible Organization System

Complete web-accessible organization for 400K+ digital assets.

## Structure

- `quantumforgelabs/` - Technical content (code, docs, tools)
- `avatararts/` - Creative content (music, images, videos)
- `gptjunkie/` - AI/SEO content (guides, strategies)
- `unified_catalog/` - Master documentation hub
- `deployment/` - Deployment scripts

## Quick Start

1. Build documentation: `cd unified_catalog/sphinx_docs && make html`
2. Start MkDocs server: `cd unified_catalog/mkdocs_site && mkdocs serve`
3. Deploy sites: `bash deployment/deploy_all.sh`

## Tools Needed

- Python 3.8+ with Sphinx and MkDocs
- Node.js (optional, for enhanced features)
- rsync or git for deployment

See `~/Desktop/🌐_WEB_ACCESSIBLE_ORGANIZATION.md` for complete guide.
EOFREADME

echo "✅ README created"
echo ""

echo "════════════════════════════════════════════════════════════════"
echo "🎉 WEB-ACCESSIBLE STRUCTURE READY!"
echo ""
echo "📁 Location: ~/web_accessible/"
echo ""
echo "🚀 Next Steps:"
echo "  1. Read guide: open ~/Desktop/🌐_WEB_ACCESSIBLE_ORGANIZATION.md"
echo "  2. Choose approach: Sphinx, MkDocs, or Landing Page"
echo "  3. Start building: See Phase 1 in guide"
echo ""
echo "💡 Quick Commands:"
echo "  • cd ~/web_accessible/unified_catalog/"
echo "  • sphinx-quickstart sphinx_docs (for Sphinx)"
echo "  • mkdocs new mkdocs_site (for MkDocs)"
echo ""
echo "════════════════════════════════════════════════════════════════"

