# Minimal makefile for Sphinx documentation

SPHINXOPTS    ?=
SPHINXBUILD   ?= python3 -m sphinx
SOURCEDIR     = .
BUILDDIR      = _build

.PHONY: help Makefile

help:
	@echo "AVATARARTS Documentation Builder"
	@echo ""
	@echo "  make html        to make standalone HTML files"
	@echo "  make clean       to remove build files"
	@echo "  make serve       to serve docs locally"
	@echo "  make generate    to auto-generate doc files"

clean:
	rm -rf $(BUILDDIR)/*

html:
	@$(SPHINXBUILD) -M html "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)

serve: html
	@echo "Starting documentation server at http://localhost:8000"
	cd $(BUILDDIR)/html && python3 -m http.server 8000

generate:
	@python3 build_docs.py generate

%: Makefile
	@$(SPHINXBUILD) -M $@ "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)
