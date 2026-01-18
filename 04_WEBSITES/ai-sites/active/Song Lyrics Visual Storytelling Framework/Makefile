# Song Lyrics Visual Storytelling Framework Makefile

.PHONY: help install install-dev test lint format clean docs serve-docs build publish

# Default target
help:
	@echo "Song Lyrics Visual Storytelling Framework"
	@echo "=========================================="
	@echo ""
	@echo "Available targets:"
	@echo "  install      Install the package and dependencies"
	@echo "  install-dev  Install development dependencies"
	@echo "  test         Run tests with pytest"
	@echo "  lint         Run linting (flake8, black, isort)"
	@echo "  format       Format code with black and isort"
	@echo "  clean        Clean build artifacts and cache"
	@echo "  docs         Build documentation"
	@echo "  serve-docs   Serve documentation locally"
	@echo "  build        Build the package"
	@echo "  publish      Publish to PyPI"
	@echo "  setup        Initial setup for development"
	@echo "  check        Run all checks (lint, test, format)"

# Installation
install:
	pip install -e .

install-dev:
	pip install -e ".[dev]"
	pre-commit install

# Testing
test:
	pytest tests/ -v --cov=src/song_lyrics_visual --cov-report=html --cov-report=term-missing

test-fast:
	pytest tests/ -v -m "not slow"

test-integration:
	pytest tests/ -v -m "integration"

# Linting and Formatting
lint:
	flake8 src/ tests/
	black --check src/ tests/
	isort --check-only src/ tests/
	mypy src/

format:
	black src/ tests/
	isort src/ tests/

# Code Quality
check: lint test format
	@echo "All checks passed!"

# Cleaning
clean:
	rm -rf build/
	rm -rf dist/
	rm -rf *.egg-info/
	rm -rf .pytest_cache/
	rm -rf .coverage
	rm -rf htmlcov/
	rm -rf .mypy_cache/
	rm -rf .tox/
	rm -rf .nox/
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete

# Documentation
docs:
	cd docs && make html

serve-docs:
	cd docs && python -m http.server 8000

# Building and Publishing
build: clean
	python -m build

publish: build
	python -m twine upload dist/*

# Development Setup
setup: install-dev
	@echo "Setting up development environment..."
	@echo "Creating .env file template..."
	@echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
	@echo "Development setup complete!"
	@echo "Don't forget to add your OpenAI API key to .env"

# Docker
docker-build:
	docker build -t song-lyrics-visual .

docker-run:
	docker run -it --env-file .env song-lyrics-visual

# Database
db-migrate:
	@echo "No database migrations needed for this project"

# Security
security:
	bandit -r src/
	safety check

# Performance
benchmark:
	pytest tests/ --benchmark-only

# Coverage
coverage:
	pytest tests/ --cov=src/song_lyrics_visual --cov-report=html --cov-report=xml
	@echo "Coverage report generated in htmlcov/"

# Pre-commit
pre-commit-install:
	pre-commit install
	pre-commit install --hook-type commit-msg

pre-commit-run:
	pre-commit run --all-files

# Git Hooks
git-hooks: pre-commit-install
	@echo "Git hooks installed successfully"

# Release
release-patch:
	@echo "Creating patch release..."
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		bump2version patch; \
		git push --tags; \
	fi

release-minor:
	@echo "Creating minor release..."
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		bump2version minor; \
		git push --tags; \
	fi

release-major:
	@echo "Creating major release..."
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		bump2version major; \
		git push --tags; \
	fi

# Development Workflow
dev-start: setup
	@echo "Starting development environment..."
	@echo "Run 'make test' to run tests"
	@echo "Run 'make lint' to check code quality"
	@echo "Run 'make format' to format code"
	@echo "Run 'make docs' to build documentation"

# CI/CD
ci-install:
	pip install -e ".[dev]"

ci-test:
	pytest tests/ --cov=src/song_lyrics_visual --cov-report=xml --junitxml=test-results.xml

ci-lint:
	flake8 src/ tests/
	black --check src/ tests/
	isort --check-only src/ tests/
	mypy src/

# Local Development
dev:
	@echo "Starting development server..."
	python -m song_lyrics_visual.cli

# Example Usage
example:
	@echo "Running example..."
	python examples/basic_usage.py

# Help for specific targets
help-install:
	@echo "Installation targets:"
	@echo "  install      Install the package and dependencies"
	@echo "  install-dev  Install development dependencies"
	@echo "  setup        Initial setup for development"

help-test:
	@echo "Testing targets:"
	@echo "  test         Run all tests"
	@echo "  test-fast    Run fast tests only"
	@echo "  test-integration  Run integration tests"
	@echo "  coverage     Generate coverage report"

help-lint:
	@echo "Linting targets:"
	@echo "  lint         Run all linting checks"
	@echo "  format       Format code with black and isort"
	@echo "  check        Run all checks (lint, test, format)"

help-docs:
	@echo "Documentation targets:"
	@echo "  docs         Build documentation"
	@echo "  serve-docs   Serve documentation locally"

help-build:
	@echo "Build targets:"
	@echo "  build        Build the package"
	@echo "  publish      Publish to PyPI"
	@echo "  clean        Clean build artifacts"

# Default target
.DEFAULT_GOAL := help