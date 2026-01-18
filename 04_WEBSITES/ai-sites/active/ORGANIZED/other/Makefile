# Makefile for QuantumForgeLabs Static Site

# Variables
ROOT_DIR := /Users/steven/MySiTes/QuantumForgeLabs
ASSETS_DIR := $(ROOT_DIR)/assets
ZIP_PATH := /mnt/data/QuantumForgeLabs_site_starter.zip

# Default target
all: setup_assets generate_html create_zip

# Create assets directory and files
setup_assets:
	mkdir -p $(ASSETS_DIR)
	python3 -c "import os; exec(open('quantumforgelabs.py').read())"

# Generate HTML and other files
generate_html:
	python3 -c "import os; exec(open('quantumforgelabs.py').read())"

# Create a zip file for deployment
create_zip:
	zip -r $(ZIP_PATH) $(ROOT_DIR)

# Clean up generated files
clean:
	rm -rf $(ASSETS_DIR) $(ZIP_PATH)

.PHONY: all setup_assets generate_html create_zip clean