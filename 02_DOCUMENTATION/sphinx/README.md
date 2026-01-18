# AVATARARTS Sphinx Documentation

Comprehensive, in-depth Sphinx documentation for the entire AVATARARTS workspace.

## Overview

This Sphinx documentation system provides detailed, descriptive documentation for every component, project, tool, and system within the AVATARARTS workspace.

## Building the Documentation

### Prerequisites

```bash
pip install -r source/requirements.txt
```

### Build HTML Documentation

```bash
cd docs-sphinx
make html
```

The HTML documentation will be generated in `build/html/`. Open `build/html/index.html` in your browser.

### Build PDF Documentation

```bash
make latexpdf
```

PDF will be generated in `build/latex/`.

### Build EPUB

```bash
make epub
```

EPUB will be generated in `build/epub/`.

## Documentation Structure

### Main Sections

- **Introduction**: Overview and getting started
- **Workspace Overview**: High-level workspace structure
- **Directory Structure**: Detailed directory breakdown
- **Active Projects**: All active project documentation
- **Tools and Utilities**: Tool documentation
- **Documentation System**: Documentation about documentation
- **Archives**: Archived content documentation
- **Websites**: Website project documentation
- **Data Analytics**: Data systems documentation
- **SEO and Marketing**: SEO and marketing systems
- **Miscellaneous**: Miscellaneous items
- **Revenue Systems**: Revenue generation systems
- **Scripts and Automation**: Automation documentation
- **Development Guides**: Developer guides
- **API Reference**: API documentation
- **Deployment**: Deployment guides
- **Troubleshooting**: Common issues and solutions

## Documentation Features

- **Comprehensive Coverage**: Every major component documented
- **Detailed Descriptions**: In-depth explanations
- **Code Examples**: Practical examples throughout
- **Cross-References**: Links between related topics
- **Search Functionality**: Full-text search
- **Multiple Formats**: HTML, PDF, EPUB output
- **Professional Formatting**: Read the Docs theme

## Updating Documentation

### Adding New Content

1. Create new `.rst` file in `source/`
2. Add to `index.rst` table of contents
3. Write content following Sphinx conventions
4. Build and verify

### Editing Existing Content

1. Edit the relevant `.rst` file
2. Rebuild documentation
3. Verify changes

## Documentation Standards

- Use reStructuredText format
- Follow Sphinx conventions
- Include code examples
- Add cross-references
- Maintain consistency

## Quick Start

```bash
# Install dependencies
pip install -r source/requirements.txt

# Build HTML
make html

# View documentation
open build/html/index.html
```

## Output Locations

- **HTML**: `build/html/`
- **PDF**: `build/latex/`
- **EPUB**: `build/epub/`

## Contributing

When adding or updating documentation:

1. Follow existing style and format
2. Include examples where helpful
3. Add cross-references to related topics
4. Test build before committing
5. Update table of contents if needed

## Support

For documentation issues:

1. Check Sphinx documentation
2. Review existing documentation examples
3. Check build errors in console
4. Verify RST syntax
