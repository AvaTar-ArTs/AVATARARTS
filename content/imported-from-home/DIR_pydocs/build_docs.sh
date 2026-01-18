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
