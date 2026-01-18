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
