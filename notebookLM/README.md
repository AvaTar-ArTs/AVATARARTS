# NotebookLM v3.0 - Enterprise Edition

<div align="center">

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Type Checked](https://img.shields.io/badge/Type%20Checked-mypy-green.svg)](http://mypy-lang.org/)
[![Code Style](https://img.shields.io/badge/Code%20Style-black-000000.svg)](https://github.com/psf/black)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Enterprise-grade NotebookLM automation with modern Python practices**

[Installation](#installation) • [Features](#features) • [Quick Start](#quick-start) • [Documentation](#documentation)

</div>

---

## 🎯 Overview

NotebookLM v3.0 is a complete rewrite of the NotebookLM automation tool, built with enterprise-grade Python practices, comprehensive type safety, and a beautiful CLI interface.

### What's New in v3.0?

- ✅ **Modern Python Architecture**: `src/` layout with proper packaging
- ✅ **Full Type Safety**: Complete type hints with mypy validation
- ✅ **Pydantic Models**: Robust data validation and serialization
- ✅ **Rich CLI Interface**: Beautiful, modern command-line experience
- ✅ **Comprehensive Logging**: Structured logging with multiple outputs
- ✅ **Configuration Management**: YAML/ENV config with validation
- ✅ **Error Handling**: Custom exception hierarchy with recovery
- ✅ **Testing Infrastructure**: pytest with fixtures and coverage
- ✅ **Documentation**: Organized guides for users and developers
- ✅ **Installable Package**: `pip install` with entry points

## ✨ Features

### Core Functionality
- 🔐 **Multi-Account Support**: Manage multiple Google accounts with profile switching
- 🤖 **Browser Automation**: Stealth browser automation with Patchright
- 📚 **Library Management**: Organize notebooks with metadata and tags
- 🔍 **Smart Queries**: Query NotebookLM with automatic retry and error handling
- 📊 **Query History**: Track all queries with statistics and analytics
- 💾 **Data Export**: Export notebooks and queries in multiple formats

### Developer Experience
- 🎨 **Beautiful CLI**: Rich terminal UI with tables, progress bars, and colors
- 📝 **Type Safety**: Full type hints for IDE autocomplete and validation
- ⚡ **Fast**: Optimized performance with caching and async operations
- 🧪 **Tested**: Comprehensive test suite with pytest
- 📖 **Documented**: Extensive documentation for users and developers

## 🚀 Installation

### Quick Install

```bash
# Clone or download
cd /Users/steven/AVATARARTS/notebookLM

# Install with pip (editable mode for development)
pip install -e .

# Or install from requirements
pip install -r requirements.txt
```

### Development Installation

```bash
# Install with development dependencies
pip install -e ".[dev]"

# Or using requirements-dev.txt
pip install -r requirements-dev.txt
```

### Post-Installation

```bash
# Install Chrome for Patchright
patchright install chrome

# Verify installation
nlm --version
nlm --help
```

## 📖 Quick Start

### 1. Initialize Configuration

```bash
# Create .env from template
cp .env.example .env

# Edit configuration (optional)
nano .env
```

### 2. Authenticate with Google

```bash
# Setup authentication (opens browser)
nlm auth login

# Verify authentication
nlm auth status
```

### 3. Create a Profile

```bash
# Create profile for your Google account
nlm profile create avatararts \
    --email me@avatararts.org \
    --name "AvaTar-ArTs" \
    --github AvaTar-ArTs

# Switch to profile
nlm profile switch avatararts
```

### 4. Add a Notebook

```bash
# Add notebook to library
nlm library add https://notebooklm.google.com/notebook/YOUR-NOTEBOOK \
    --name "My Docs" \
    --topics "documentation,api" \
    --description "My project documentation"

# List notebooks
nlm library list
```

### 5. Query NotebookLM

```bash
# Ask a question
nlm ask "What is X?"

# Query specific notebook
nlm ask "How do I use Y?" --notebook my-docs

# Interactive mode
nlm ask --interactive
```

## 💻 CLI Commands

### Authentication

```bash
nlm auth login              # Authenticate with Google
nlm auth logout             # Logout current profile
nlm auth status             # Check authentication status
nlm auth refresh            # Refresh authentication
```

### Profile Management

```bash
nlm profile list            # List all profiles
nlm profile create <name>   # Create new profile
nlm profile switch <name>   # Switch to profile
nlm profile delete <name>   # Delete profile
nlm profile show            # Show current profile
nlm profile info <name>     # Show profile details
```

### Library Management

```bash
nlm library list            # List all notebooks
nlm library add <url>       # Add notebook
nlm library remove <id>     # Remove notebook
nlm library info <id>       # Show notebook details
nlm library search <query>  # Search notebooks
nlm library export          # Export library
```

### Querying

```bash
nlm ask <question>          # Ask a question
nlm ask --notebook <id>     # Query specific notebook
nlm ask --interactive       # Interactive mode
nlm history                 # Show query history
nlm history --stats         # Show statistics
```

### Utilities

```bash
nlm config show             # Show configuration
nlm config edit             # Edit configuration
nlm version                 # Show version
nlm doctor                  # Check system health
```

## 📚 Documentation

### User Guides
- [Installation Guide](docs/getting-started/installation.md)
- [Quick Start](docs/getting-started/quick-start.md)
- [Authentication Setup](docs/getting-started/authentication.md)
- [Library Management](docs/user-guide/library.md)
- [Profile Management](docs/user-guide/profiles.md)
- [Querying](docs/user-guide/querying.md)
- [Multi-Account Setup](docs/tutorials/multi-account.md)

### Developer Guides
- [Architecture Overview](docs/developer/architecture.md)
- [API Reference](docs/developer/api-reference.md)
- [Contributing](docs/developer/contributing.md)
- [Testing](docs/developer/testing.md)

### Troubleshooting
- [Common Issues](docs/troubleshooting/common-issues.md)
- [FAQ](docs/troubleshooting/faq.md)

## 🏗️ Architecture

```
src/notebooklm/
├── core/           # Core functionality (auth, browser, query)
├── models/         # Pydantic data models
├── managers/       # Business logic managers
├── cli/            # Command-line interface
└── utils/          # Utility functions

tests/              # Test suite
├── unit/          # Unit tests
├── integration/   # Integration tests
└── fixtures/      # Test fixtures

docs/              # Documentation
├── getting-started/
├── user-guide/
├── developer/
├── tutorials/
└── troubleshooting/
```

## 🔧 Configuration

### Environment Variables

```bash
# Application
NOTEBOOKLM_ENV=production
NOTEBOOKLM_DEBUG=false
NOTEBOOKLM_DEFAULT_PROFILE=default

# Browser
NOTEBOOKLM_BROWSER_HEADLESS=false
NOTEBOOKLM_BROWSER_TIMEOUT=30000

# Paths
NOTEBOOKLM_DATA_DIR=data
NOTEBOOKLM_PROFILES_DIR=data/profiles

# Logging
NOTEBOOKLM_LOG_LEVEL=INFO
NOTEBOOKLM_LOG_FILE=notebooklm.log
```

### Configuration File

```yaml
# config.yaml
notebooklm:
  browser:
    headless: false
    timeout: 30000
  
  logging:
    level: INFO
    file: notebooklm.log
  
  performance:
    max_retries: 3
    retry_delay: 1
```

## 🧪 Development

### Setup Development Environment

```bash
# Clone repository
cd /Users/steven/AVATARARTS/notebookLM

# Install development dependencies
pip install -e ".[dev]"

# Setup pre-commit hooks
pre-commit install
```

### Run Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=src/notebooklm --cov-report=html

# Run specific test
pytest tests/unit/test_auth.py
```

### Code Quality

```bash
# Format code
black src/ tests/

# Sort imports
isort src/ tests/

# Type check
mypy src/

# Lint
pylint src/
flake8 src/
```

## 📊 Features Comparison

| Feature | v1.0 | v2.0 | v3.0 |
|---------|------|------|------|
| Multi-Account | ❌ | ✅ | ✅ |
| Type Safety | ❌ | ❌ | ✅ |
| Pydantic Models | ❌ | ❌ | ✅ |
| Rich CLI | ❌ | ❌ | ✅ |
| Config Management | ❌ | ❌ | ✅ |
| Testing | ❌ | ❌ | ✅ |
| Documentation | Basic | Good | Excellent |
| Packaging | Scripts | Scripts | pip install |
| Error Handling | Basic | Good | Comprehensive |
| Logging | Print | Basic | Structured |

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](docs/developer/contributing.md) for guidelines.

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

## 👤 Author

**AvaTar-ArTs**
- Email: me@avatararts.org
- GitHub: [@AvaTar-ArTs](https://github.com/AvaTar-ArTs)

## 🙏 Acknowledgments

- Based on the original NotebookLM MCP Server
- Built with [Patchright](https://github.com/Kaliiiiiiiiii-Vinyzu/patchright) for browser automation
- CLI powered by [Rich](https://github.com/Textualize/rich) and [Click](https://click.palletsprojects.com/)

## 🔗 Links

- [Repository](https://github.com/AvaTar-ArTs/notebooklm-skill)
- [Documentation](https://github.com/AvaTar-ArTs/notebooklm-skill/docs)
- [Issues](https://github.com/AvaTar-ArTs/notebooklm-skill/issues)
- [Changelog](CHANGELOG.md)

---

<div align="center">

**Built with ❤️ for the NotebookLM community**

v3.0.0 - Enterprise Edition

</div>
