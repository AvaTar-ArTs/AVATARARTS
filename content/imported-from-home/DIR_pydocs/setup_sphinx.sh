#!/bin/bash
# Sphinx Documentation Setup Script
# Sets up professional documentation for Python projects with carbon integration

set -euo pipefail

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

PYDOCS_DIR=~/pydocs
PYTHON_DIR=~/documents/python
CARBON_SCRIPT=~/documents/script/carbon-automation.sh

echo -e "${BLUE}?? Setting up Sphinx Documentation System${NC}"
echo "=========================================="

# Create directory structure
echo -e "${YELLOW}?? Creating directory structure...${NC}"
mkdir -p "$PYDOCS_DIR"/{source,build,_static,_templates,carbon-images}

cd "$PYDOCS_DIR"

# Initialize Sphinx
echo -e "${YELLOW}?? Initializing Sphinx...${NC}"

cat > source/conf.py << 'EOF'
# Configuration file for the Sphinx documentation builder
import os
import sys
sys.path.insert(0, os.path.abspath('../../documents/python'))

# -- Project information -----------------------------------------------------
project = 'Python Automation Tools'
copyright = '2025, Steven'
author = 'Steven'
release = '1.0.0'

# -- General configuration ---------------------------------------------------
extensions = [
    'sphinx.ext.autodoc',
    'sphinx.ext.napoleon',
    'sphinx.ext.viewcode',
    'sphinx.ext.todo',
    'sphinx.ext.coverage',
    'sphinx.ext.ifconfig',
    'sphinx.ext.autosummary',
    'myst_parser',
    'sphinx_copybutton',
]

templates_path = ['../_templates']
exclude_patterns = []

# -- Options for HTML output -------------------------------------------------
html_theme = 'sphinx_rtd_theme'
html_static_path = ['../_static']
html_css_files = ['custom.css']

html_theme_options = {
    'navigation_depth': 4,
    'collapse_navigation': False,
    'sticky_navigation': True,
    'includehidden': True,
    'titles_only': False,
    'logo_only': False,
    'display_version': True,
    'prev_next_buttons_location': 'bottom',
    'style_external_links': True,
}

# Napoleon settings (for Google/NumPy docstrings)
napoleon_google_docstring = True
napoleon_numpy_docstring = True
napoleon_include_init_with_doc = True
napoleon_include_private_with_doc = False
napoleon_include_special_with_doc = True
napoleon_use_admonition_for_examples = False
napoleon_use_admonition_for_notes = False
napoleon_use_admonition_for_references = False
napoleon_use_ivar = False
napoleon_use_param = True
napoleon_use_rtype = True
napoleon_preprocess_types = False
napoleon_type_aliases = None
napoleon_attr_annotations = True

# Autodoc settings
autodoc_default_options = {
    'members': True,
    'member-order': 'bysource',
    'special-members': '__init__',
    'undoc-members': True,
    'exclude-members': '__weakref__'
}

# MyST Parser settings (for Markdown)
myst_enable_extensions = [
    "colon_fence",
    "deflist",
    "html_image",
]

# Auto-summary settings
autosummary_generate = True

# Todo extension
todo_include_todos = True
EOF

# Create index page
echo -e "${YELLOW}?? Creating documentation structure...${NC}"

cat > source/index.rst << 'EOF'
Python Automation Tools Documentation
====================================

Welcome to the comprehensive documentation for Python automation tools and scripts.

.. toctree::
   :maxdepth: 2
   :caption: Contents:

   getting_started
   modules/index
   api_reference
   examples
   carbon_gallery

Overview
--------

This collection contains over 1,500 Python scripts organized by functionality:

- **AI & LLM Tools**: 167 scripts for AI integrations
- **YouTube Automation**: 381 scripts for YouTube content management
- **Instagram Tools**: 253 scripts for Instagram automation
- **Image Processing**: 217 scripts for image manipulation
- **Audio Processing**: 87 scripts for audio and TTS
- **Data Processing**: 276 scripts for CSV, JSON, and file operations

Features
--------

? **Key Features:**

- Environment-based API key management (``~/.env.d/``)
- Comprehensive error handling
- Logging and debugging utilities
- Batch processing capabilities
- Web automation and scraping
- Social media integrations

Quick Start
-----------

1. **Install Dependencies**::

    pip install -r ~/documents/python/requirements.txt

2. **Configure API Keys**::

    # Set up your environment
    cp ~/.env.d/llm-apis.env.example ~/.env.d/llm-apis.env
    # Edit and add your API keys

3. **Run a Script**::

    python ~/documents/python/ai/your_script.py

Indices and Tables
==================

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`
EOF

# Create getting started guide
cat > source/getting_started.md << 'EOF'
# Getting Started

## Installation

### Prerequisites

- Python 3.8+
- pip package manager
- Git (for version control)

### Setup

1. Clone or navigate to the Python directory:
   ```bash
   cd ~/documents/python
   ```

2. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure environment variables:
   ```bash
   # Your API keys are stored in ~/.env.d/
   # Example:
   export OPENAI_API_KEY="your-key-here"
   ```

## Project Structure

```
~/documents/python/
??? ai/              # AI and LLM integrations
??? youtube/         # YouTube automation
??? instagram/       # Instagram tools
??? image/           # Image processing
??? audio/           # Audio and TTS
??? video/           # Video processing
??? csv/             # CSV utilities
??? json/            # JSON tools
??? file/            # File management
??? utils/           # Helper utilities
```

## Your First Script

Here's a simple example using an AI script:

```python
import os
from pathlib import Path

# Load environment variables
def load_env_d():
    env_d_path = Path.home() / '.env.d'
    if env_d_path.exists():
        for env_file in env_d_path.glob('*.env'):
            with open(env_file) as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        key, value = line.split('=', 1)
                        os.environ[key.strip()] = value.strip()

load_env_d()

# Your code here
api_key = os.getenv("OPENAI_API_KEY")
print(f"API key loaded: {'Yes' if api_key else 'No'}")
```

## Common Workflows

### Image Processing
```python
from PIL import Image
import os

# Load and resize image
img = Image.open("input.jpg")
img = img.resize((800, 600))
img.save("output.jpg", quality=95)
```

### YouTube Automation
```python
# Example workflow for YouTube scripts
# See youtube/ directory for full implementations
```

### Instagram Tools
```python
# Example workflow for Instagram automation
# See instagram/ directory for detailed scripts
```

## Next Steps

- Explore the [Modules](modules/index) documentation
- Check out [Code Examples](examples)
- View the [Carbon Gallery](carbon_gallery) for visual code references
- Read the [API Reference](api_reference)
EOF

# Create modules index
mkdir -p source/modules

cat > source/modules/index.rst << 'EOF'
Modules Reference
=================

This section provides detailed documentation for all Python modules.

.. toctree::
   :maxdepth: 2
   :caption: Module Categories:

   ai_modules
   youtube_modules
   instagram_modules
   image_modules
   audio_modules
   utils_modules

Module Overview
---------------

AI & LLM Modules
~~~~~~~~~~~~~~~~
AI integrations, LLM tools, and machine learning utilities.

YouTube Modules
~~~~~~~~~~~~~~~
YouTube automation, content creation, and video processing.

Instagram Modules
~~~~~~~~~~~~~~~~~
Instagram automation, posting, and engagement tools.

Image Processing
~~~~~~~~~~~~~~~~
Image manipulation, optimization, and generation.

Audio Processing
~~~~~~~~~~~~~~~~
Audio processing, TTS, and music generation.

Utilities
~~~~~~~~~
Helper functions, file management, and common utilities.
EOF

# Create API reference
cat > source/api_reference.rst << 'EOF'
API Reference
=============

Complete API documentation for all modules.

.. autosummary::
   :toctree: _autosummary
   :recursive:

Auto-generated Module Documentation
------------------------------------

.. automodule:: ai
   :members:
   :undoc-members:
   :show-inheritance:

.. automodule:: youtube
   :members:
   :undoc-members:
   :show-inheritance:

.. automodule:: instagram
   :members:
   :undoc-members:
   :show-inheritance:
EOF

# Create examples page
cat > source/examples.md << 'EOF'
# Code Examples

## AI & LLM Examples

### OpenAI Integration
```python
import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello!"}
    ]
)
print(response.choices[0].message.content)
```

### Image Generation
```python
from PIL import Image
import requests
import io

# Generate image with DALL-E
response = client.images.generate(
    prompt="A beautiful sunset over mountains",
    n=1,
    size="1024x1024"
)

# Download and save
image_url = response.data[0].url
image_data = requests.get(image_url).content
img = Image.open(io.BytesIO(image_data))
img.save("generated_image.png")
```

## Video Processing

### YouTube Download
```python
# Example YouTube download script
# See youtube/ directory for full implementation
```

## Image Optimization

### Batch Image Optimizer
```python
from PIL import Image
from pathlib import Path

def optimize_images(input_dir, output_dir, quality=85):
    """Optimize all images in a directory"""
    Path(output_dir).mkdir(exist_ok=True)
    
    for img_path in Path(input_dir).glob("*.{jpg,png}"):
        img = Image.open(img_path)
        output_path = Path(output_dir) / img_path.name
        img.save(output_path, optimize=True, quality=quality)
        print(f"Optimized: {img_path.name}")

optimize_images("input/", "output/", quality=90)
```

## Data Processing

### CSV Processing
```python
import csv
import pandas as pd

# Read CSV
df = pd.read_csv("data.csv")

# Process data
df['new_column'] = df['existing_column'] * 2

# Save result
df.to_csv("output.csv", index=False)
```

## More Examples

Check the individual module documentation for category-specific examples.
EOF

# Create Carbon gallery page
cat > source/carbon_gallery.md << 'EOF'
# Carbon Code Gallery

Beautiful code visualizations generated with Carbon.

## What is Carbon?

Carbon (carbon.now.sh) creates beautiful images of source code. All scripts in this documentation can be visualized using the included carbon-automation tools.

## Featured Scripts

### AI Tools
![AI Unified Menu](../carbon-images/ai_unified_menu.png)

### Data Processing
![CSV Processor](../carbon-images/csv_processor.png)

### Image Tools
![Image Optimizer](../carbon-images/image_optimizer.png)

## Generating Carbon Images

Use the carbon automation scripts to generate beautiful code visualizations:

```bash
# Generate carbon images for all scripts
~/documents/script/carbon-automation.sh -i ~/documents/python -o ~/pydocs/carbon-images

# Optimize generated images
cd ~/pydocs/carbon-images
~/documents/script/carbon_image_analyze_optimize.sh
```

## Presets Available

- **web-optimized**: Best for web documentation
- **print-optimized**: High quality for print/PDF
- **social-optimized**: Optimized for social media sharing
- **minimal**: Lightweight, compact style
EOF

# Create custom CSS
cat > _static/custom.css << 'EOF'
/* Custom styling for Python documentation */

.wy-side-nav-search {
    background-color: #2980b9;
}

.wy-nav-top {
    background-color: #2980b9;
}

img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    margin: 1em 0;
}

code {
    background-color: #f8f8f8;
    border: 1px solid #e1e4e8;
    border-radius: 3px;
    padding: 0.2em 0.4em;
}

.rst-content .admonition {
    margin: 1em 0;
    padding: 0.5em 1em;
    border-left: 4px solid #2980b9;
}

.rst-content .note {
    background-color: #e7f2fa;
    border-left-color: #2980b9;
}

.rst-content .warning {
    background-color: #ffedcc;
    border-left-color: #f0b37e;
}
EOF

# Create Makefile
cat > Makefile << 'EOF'
# Minimal makefile for Sphinx documentation

SPHINXOPTS    ?=
SPHINXBUILD   ?= sphinx-build
SOURCEDIR     = source
BUILDDIR      = build

help:
	@$(SPHINXBUILD) -M help "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)

.PHONY: help Makefile

# Catch-all target: route all unknown targets to Sphinx using the new
# "make mode" option.  $(O) is meant as a shortcut for $(SPHINXOPTS).
%: Makefile
	@$(SPHINXBUILD) -M $@ "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)

# Custom targets
clean-build:
	rm -rf $(BUILDDIR)/*

open:
	open $(BUILDDIR)/html/index.html

serve:
	@echo "Starting local server..."
	cd $(BUILDDIR)/html && python3 -m http.server 8000

watch:
	sphinx-autobuild "$(SOURCEDIR)" "$(BUILDDIR)/html" --open-browser
EOF

# Create quick build script
cat > build_docs.sh << 'EOF'
#!/bin/bash
# Quick documentation build script

set -e

echo "?? Building Sphinx documentation..."

# Clean previous build
make clean-build

# Build HTML documentation
make html

echo "? Documentation built successfully!"
echo "?? Output: build/html/"
echo ""
echo "To view:"
echo "  make open        # Open in browser"
echo "  make serve       # Start local server (http://localhost:8000)"
echo "  make watch       # Auto-rebuild on changes"
EOF

chmod +x build_docs.sh

# Create requirements file
cat > requirements.txt << 'EOF'
sphinx>=8.0
sphinx-rtd-theme>=3.0
sphinx-autobuild>=2025.8
sphinxcontrib-napoleon>=0.7
myst-parser>=4.0
sphinx-copybutton>=0.5
EOF

echo -e "${GREEN}? Sphinx setup complete!${NC}"
echo ""
echo -e "${BLUE}?? Next steps:${NC}"
echo "  1. cd ~/pydocs"
echo "  2. ./build_docs.sh              # Build documentation"
echo "  3. make open                     # View in browser"
echo "  4. make watch                    # Auto-rebuild on changes"
echo ""
echo -e "${YELLOW}?? Generate Carbon images:${NC}"
echo "  ~/documents/script/carbon-automation.sh -i ~/documents/python/ai -o ~/pydocs/carbon-images"
echo ""
echo -e "${BLUE}?? Directory structure:${NC}"
echo "  ~/pydocs/"
echo "  ??? source/           # Documentation source files"
echo "  ??? build/            # Built HTML documentation"
echo "  ??? carbon-images/    # Carbon code visualizations"
echo "  ??? build_docs.sh     # Quick build script"
echo "  ??? Makefile          # Sphinx build system"
EOF

chmod +x /Users/steven/pydocs/setup_sphinx.sh
