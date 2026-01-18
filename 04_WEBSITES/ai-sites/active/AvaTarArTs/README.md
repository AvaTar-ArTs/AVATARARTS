# Steven's Documentation

This directory contains Sphinx-generated documentation for Steven's projects and files.

## Overview

The documentation covers two main source directories:
- **tehSiTes**: Web development projects, AI tools, SEO optimization scripts, and creative multimedia workflows
- **Documents**: Personal and professional documents, Python development projects, analysis reports, and creative content

## Viewing the Documentation

To view the documentation, open the `build/html/index.html` file in your web browser:

```bash
open /Users/steven/AvaTarArTs/build/html/index.html
```

Or navigate to the build directory and open the index.html file directly.

## Rebuilding the Documentation

To rebuild the documentation after making changes:

```bash
cd /Users/steven/AvaTarArTs
make html
```

## Source Files

The documentation source files are located in the `source/` directory:
- `index.rst` - Main documentation index
- `tehsites.rst` - Documentation for tehSiTes directory
- `documents.rst` - Documentation for Documents directory
- `conf.py` - Sphinx configuration

## Structure

- `source/` - Source reStructuredText files
- `build/html/` - Generated HTML documentation
- `_static/` - Static assets (CSS, JavaScript, images)
- `_templates/` - Custom templates (if any)

## Features

- Search functionality
- Cross-references between sections
- Table of contents navigation
- Responsive design
- Syntax highlighting for code