# Changelog

All notable changes to NotebookLM will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2026-01-14

### 🎉 Major Release - Enterprise Edition

This is a complete rewrite of NotebookLM with modern Python practices and enterprise-grade features.

### Added
- **Modern Project Structure**: Adopted `src/` layout for proper Python packaging
- **Type Safety**: Full type hints throughout codebase with mypy validation
- **Pydantic Models**: Robust data models with validation and serialization
- **Rich CLI Interface**: Beautiful command-line interface with tables, colors, and progress bars
- **Configuration Management**: YAML and environment-based configuration system
- **Structured Logging**: Comprehensive logging with Rich integration
- **Custom Exception Hierarchy**: Detailed exception classes for better error handling
- **Testing Infrastructure**: pytest setup with fixtures and coverage reporting
- **Documentation System**: Organized documentation by category (user, developer, tutorials)
- **Package Installation**: Proper `pyproject.toml` for pip installation
- **CLI Entry Points**: `nlm` and `notebooklm` commands installed globally
- **Utility Modules**: Validators, helpers, decorators, and logging utilities
- **Development Tools**: Black, isort, mypy, pylint configuration

### Changed
- **Architecture**: Refactored from flat scripts to modular package structure
- **Data Models**: Migrated to Pydantic for validation and type safety
- **Configuration**: Centralized configuration with env variables and YAML files
- **Error Handling**: Comprehensive exception handling with recovery strategies
- **CLI Commands**: Reorganized and enhanced CLI with subcommands
- **Logging**: Replaced print statements with structured logging
- **File Organization**: Better separation of concerns with clear module boundaries

### Improved
- **Code Quality**: PEP 8 compliant, Black formatted, type checked
- **Documentation**: Comprehensive guides for users and developers
- **Developer Experience**: Better IDE support with type hints
- **Performance**: Optimized with caching and async operations
- **Maintainability**: Modular design with clear interfaces
- **Testing**: Comprehensive test suite with good coverage
- **Installation**: Simple pip install workflow

### Deprecated
- Old flat script structure (maintained in v2.0 branch for compatibility)

### Fixed
- Various edge cases in error handling
- Improved browser state management
- Better profile switching reliability
- Enhanced notebook URL validation

## [2.0.0] - 2026-01-13

### Added
- Multi-account support with profile management
- Profile switching commands (`nlma`, `nlmcho`)
- GitHub PAT integration per profile
- SSH key support for multi-account Git operations
- Profile metadata tracking
- Logout functionality per profile
- Conversation logging system
- Source extraction tools (multiple versions)

### Changed
- Enhanced library.json format with dictionary-based notebooks
- Improved browser state handling during profile switches
- Better error handling for directory operations

### Fixed
- `OSError: Directory not empty` during profile switches
- `AttributeError: 'list' object has no attribute 'values'` in notebook_manager
- Browser state cleanup issues

## [1.0.0] - 2025-12-XX

### Added
- Initial release
- Basic NotebookLM automation
- Google authentication
- Notebook library management
- Query functionality
- Browser automation with Patchright
- Claude Code skill integration

### Features
- Ask questions to NotebookLM
- Manage notebook library
- Persistent authentication
- Browser automation
- Local data storage

---

## Version History Summary

| Version | Release Date | Major Features |
|---------|-------------|----------------|
| **3.0.0** | 2026-01-14 | Enterprise rewrite, type safety, Rich CLI, testing |
| **2.0.0** | 2026-01-13 | Multi-account support, profile management |
| **1.0.0** | 2025-12-XX | Initial release, basic automation |

---

## Upgrade Guide

### From v2.0 to v3.0

1. **Backup your data**:
   ```bash
   cp -r ~/.claude/skills/notebooklm ~/.claude/skills/notebooklm.bak
   ```

2. **Install v3.0**:
   ```bash
   cd /Users/steven/AVATARARTS/notebookLM
   pip install -e .
   ```

3. **Migrate profiles** (automatic):
   ```bash
   nlm profile list  # Will auto-detect v2.0 profiles
   ```

4. **Update environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

### From v1.0 to v3.0

Follow the v2.0 migration first, then proceed with v3.0 upgrade.

---

## Future Roadmap

### Planned for v3.1
- [ ] Async query support
- [ ] Batch query operations
- [ ] Advanced search filters
- [ ] Export to multiple formats
- [ ] API server mode

### Planned for v3.2
- [ ] Web UI dashboard
- [ ] Query templates
- [ ] Scheduled queries
- [ ] Notebook analytics
- [ ] Integration with other tools

### Planned for v4.0
- [ ] Plugin system
- [ ] Custom extractors
- [ ] Machine learning features
- [ ] Cloud sync
- [ ] Team collaboration

---

**For detailed changes, see commit history at [GitHub](https://github.com/AvaTar-ArTs/notebooklm-skill)**
