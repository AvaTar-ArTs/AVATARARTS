# Modern CLI Tools Guide

Quick reference for your installed modern command-line tools: **eza**, **bat**, **fd**, **fzf**, **zoxide**, **uv**, **uvx**, and **ngrok**.

---

## 📁 Eza - Modern `ls` Replacement

**Version:** 0.23.4  
**Status:** ✅ Configured in `.zshrc`

### Quick Reference

```bash
# Your current aliases (already set up):
ls          # eza --icons
ll          # eza -la --icons --git
lt          # eza -la --icons --git --sort=modified
tree        # eza --tree --icons
```

### Common Commands

```bash
# Basic listing
eza                    # List files with icons
eza -l                 # Long format
eza -la                # All files (including hidden)
eza --git              # Show git status

# Sorting
eza --sort=modified    # Sort by modification time
eza --sort=size        # Sort by size
eza --sort=name        # Sort by name
eza --sort=type        # Sort by type

# Tree view
eza --tree             # Tree view
eza --tree --level=2   # Limit depth
eza --tree --all       # Include hidden files

# Filtering
eza --only-dirs        # Only directories
eza --only-files       # Only files
eza --extensions py,js # Only specific extensions

# Colors and icons
eza --icons            # Show icons (default)
eza --no-icons         # Disable icons
eza --color=always     # Force colors
eza --color=never      # No colors
```

### Tips

- Use `lt` alias to see recently modified files
- `eza --tree` is great for project structure overview
- Combine with `fzf` for interactive file selection

---

## 🦇 Bat - Syntax-Highlighted `cat`

**Version:** 0.26.0  
**Status:** ✅ Configured (aliased as `cat`)

### Quick Reference

```bash
# Your current setup:
cat file.txt           # Uses bat with auto style
bcat file.txt          # Original /bin/cat if needed
```

### Common Commands

```bash
# Basic viewing
bat file.txt           # View file with syntax highlighting
bat file1.txt file2.txt # Multiple files
bat *.py               # View all Python files

# Styling
bat --style=auto       # Auto style (your default)
bat --style=plain      # No decorations
bat --style=numbers    # Line numbers only
bat --style=full       # Everything (numbers, header, grid)

# Paging
bat --paging=always    # Always use pager
bat --paging=never     # Never use pager
bat --paging=auto      # Auto (default)

# Language detection
bat --language=python file.txt  # Force language
bat --list-languages            # List all supported languages

# Search
bat --grep="pattern" file.txt    # Search within file
bat -A file.txt                 # Show all (including non-printable)
```

### Tips

- Use with `fzf` for preview: `fzf --preview 'bat --color=always {}'`
- Great for viewing code, configs, logs
- Works with pipes: `cat file.txt | bat --language=json`

---

## 🔍 Fd - Fast `find` Replacement

**Version:** 10.3.0  
**Status:** ✅ Configured (used by fzf)

### Quick Reference

```bash
# Basic search
fd pattern             # Find files/dirs matching pattern
fd "\.py$"             # Find Python files
fd -e py               # Find by extension
fd -e py -e js         # Multiple extensions

# File types
fd -t f                # Only files
fd -t d                # Only directories
fd -t l                # Only symlinks

# Hidden files
fd --hidden pattern    # Include hidden files
fd --no-ignore pattern # Don't respect .gitignore

# Case sensitivity
fd -i pattern          # Case insensitive
fd -s pattern          # Case sensitive (default)

# Depth
fd --max-depth 2       # Limit search depth
fd --min-depth 2       # Minimum depth

# Exclusions
fd --exclude node_modules pattern
fd --exclude "*.pyc" pattern
```

### Tips

- Much faster than `find` for most use cases
- Respects `.gitignore` by default
- Used by your `fzf` setup for file finding

---

## 🎯 Fzf - Fuzzy Finder

**Version:** 0.67.0  
**Status:** ✅ Configured with fd integration

### Quick Reference

```bash
# Your current setup:
# - Ctrl+T: Find files (uses fd)
# - Alt+C: Change directory (uses fd)
# - Ctrl+R: Search history
```

### Common Commands

```bash
# File search
fzf                    # Interactive file search
fzf --preview 'bat {}' # With preview

# History search
history | fzf          # Search command history
fh                     # Your custom function for history

# Directory search
fd -t d | fzf          # Find directories
proj                   # Your custom function for projects

# Custom functions (already in .zshrc)
fh                     # Fuzzy history search
proj                   # Fuzzy project navigation
env-fzf                # Fuzzy env file editing
```

### Key Bindings

- `Ctrl+T` - Find files
- `Ctrl+R` - Search history
- `Alt+C` - Change directory
- `Enter` - Select
- `Esc` - Cancel
- `Tab` - Multi-select

### Tips

- Use `--preview` for file previews
- Combine with `bat` for syntax-highlighted previews
- Your `FZF_DEFAULT_COMMAND` uses `fd` for speed

---

## 🚀 Zoxide - Smart `cd`

**Version:** 0.9.8  
**Status:** ✅ Initialized in `.zshrc`

### Quick Reference

```bash
# Basic usage
z project              # Jump to project directory
z ~/Documents          # Jump to Documents
z -                    # Go back to previous directory

# Interactive
zi                     # Interactive mode (fzf)
z foo bar              # Jump to directory containing both "foo" and "bar"

# Querying
z -l                   # List all tracked directories
z -l project           # List matches for "project"
z -s project           # Show score for "project"
```

### How It Works

- **Learns your habits**: More frequently visited directories get higher scores
- **Fuzzy matching**: `z proj` will find `~/projects/my-project`
- **Fast**: Uses a database instead of scanning filesystem

### Tips

- Just use `z` instead of `cd` - it learns automatically
- Use `zi` for interactive selection when unsure
- Works great with `fzf` integration

---

## 🐍 Uv - Fast Python Package Manager

**Version:** 0.9.13  
**Status:** ✅ Installed with shell completions

### Quick Reference

```bash
# Package management
uv pip install requests        # Install package
uv pip install -r requirements.txt  # Install from file
uv pip list                    # List packages
uv pip uninstall package       # Uninstall

# Project management
uv init myproject              # Create new project
uv add requests                # Add dependency
uv sync                        # Sync dependencies
uv run python script.py        # Run script with project deps

# Virtual environments
uv venv                        # Create venv
uv venv --python 3.11          # Create with specific Python
source .venv/bin/activate      # Activate (standard)

# Lock files
uv lock                        # Generate lock file
uv lock --upgrade              # Upgrade dependencies
```

### Speed Benefits

- **10-100x faster** than pip
- Written in Rust
- Drop-in replacement for pip

### Tips

- Use `uv pip` as direct replacement for `pip`
- `uv sync` is like `pip install -r requirements.txt` but faster
- Great for CI/CD pipelines

---

## 🔧 Uvx - Run Python Tools

**Version:** 0.9.13  
**Status:** ✅ Installed with shell completions

### Quick Reference

```bash
# Run tools without installing
uvx black .                    # Run black formatter
uvx pytest                     # Run pytest
uvx mypy .                      # Run mypy

# With specific version
uvx "black==23.0.0" .          # Use specific version
uvx "pytest>=7.0.0"            # Minimum version

# Run scripts
uvx --from requests python -c "import requests; print(requests.__version__)"
```

### Common Tools

```bash
uvx black .                    # Code formatter
uvx ruff check .               # Linter
uvx pytest                     # Testing
uvx mypy .                      # Type checking
uvx cookiecutter               # Project templates
uvx httpie                      # HTTP client
```

### Tips

- No need to install tools globally
- Each tool runs in isolated environment
- Automatically manages dependencies
- Great for one-off tool usage

---

## 🌐 Ngrok - Secure Tunneling

**Version:** Installed (lazy-loaded)  
**Status:** ✅ Configured in `.zshrc`

### Quick Reference

```bash
# Basic tunneling
ngrok http 8000                # Tunnel local port 8000
ngrok http 3000                # Tunnel local port 3000

# With authentication
ngrok http 8000 --basic-auth="user:pass"

# TCP tunneling
ngrok tcp 22                   # Tunnel SSH

# Web interface
ngrok http 8000 --web-addr=localhost:4040

# Configuration
ngrok config add-authtoken YOUR_TOKEN
ngrok config check             # Verify config
```

### Common Use Cases

```bash
# Local web server
python -m http.server 8000 &   # Start server
ngrok http 8000                # Expose it

# Development API
ngrok http 5000                # Flask/FastAPI on 5000

# Database access
ngrok tcp 5432                 # PostgreSQL
```

### Tips

- Free tier available (with limitations)
- Great for testing webhooks
- Useful for sharing local development
- Your setup lazy-loads ngrok for faster shell startup

---

## 🔗 Integration Examples

### Combining Tools

```bash
# Find Python files and view with bat
fd -e py | fzf --preview 'bat {}'

# Navigate to project and list files
z project && ll

# Find file, view with bat, edit
fd -e py | fzf --preview 'bat {}' | xargs vim

# Search history, run command
fh

# Quick project setup with uv
z myproject && uv init && uv add requests
```

### Your Custom Functions

From your `.zshrc`:

```bash
fh          # Fuzzy history search
proj        # Fuzzy project navigation  
env-fzf     # Fuzzy env file editing
```

---

## 📝 Quick Cheat Sheet

| Tool | Purpose | Key Command |
|------|---------|-------------|
| **eza** | List files | `ll`, `lt`, `tree` |
| **bat** | View files | `cat file.txt` |
| **fd** | Find files | `fd pattern` |
| **fzf** | Fuzzy find | `Ctrl+T`, `Ctrl+R` |
| **zoxide** | Smart cd | `z project` |
| **uv** | Python packages | `uv pip install pkg` |
| **uvx** | Run tools | `uvx black .` |
| **ngrok** | Tunneling | `ngrok http 8000` |

---

## 🚀 Next Steps

1. **Try the aliases**: Use `ll`, `lt`, `tree` instead of `ls`
2. **Use zoxide**: Replace `cd` with `z` - it learns automatically
3. **Explore fzf**: Press `Ctrl+T` to see it in action
4. **Speed up Python**: Use `uv` instead of `pip`
5. **Run tools easily**: Use `uvx` for one-off Python tools

All tools are installed and configured! Your `.zshrc` already has the essential setup. 🎉
