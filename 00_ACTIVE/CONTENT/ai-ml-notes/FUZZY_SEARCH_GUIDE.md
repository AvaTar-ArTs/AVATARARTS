# Clipboard Fuzzy Search Guide

## Quick Start

### 1. Source the search helpers
```bash
source ~/Documents/paste_export/organized_v2/search_helpers.sh
```

Or add to your `~/.zshrc` for permanent access:
```bash
echo 'source ~/Documents/paste_export/organized_v2/search_helpers.sh' >> ~/.zshrc
source ~/.zshrc
```

### 2. Start searching!
```bash
clip-fzf           # Interactive file search
clip-fzf-content   # Search file contents
clip-fzf-menu      # Show interactive menu
```

---

## Available Commands

### 🔍 Fuzzy Search Commands

**`clip-fzf`** - Fuzzy search files by name
- Type to filter filenames
- Live preview of file contents
- `Enter` to view full file
- `Ctrl-Y` to copy to clipboard
- `Ctrl-O` to open in editor

**`clip-fzf-content`** - Search through file contents
- Powered by ripgrep - blazing fast
- Search across all files at once
- Shows matching lines with context
- Jump directly to matches

**`clip-fzf-category`** - Browse by category
- Two-step navigation
- First: select category (PROJECTS, WORKFLOWS, etc.)
- Second: fuzzy search within that category

**`clip-fzf-json`** - Search JSON export directly
- Search your raw clipboard export
- View items chronologically
- See creation dates
- Copy individual entries

**`clip-fzf-recent`** - Recent files (30 days)
- Only files modified in last 30 days
- Sorted by modification time
- Great for finding recent work

**`clip-fzf-python`** - Python code search
- Filter to .py files only
- Syntax highlighted preview
- Quick access to all Python snippets

**`clip-fzf-menu`** - Interactive menu
- Text-based menu interface
- Choose search mode
- Great for beginners

**`clip-fzf-help`** - Show fuzzy search help

---

## Keyboard Shortcuts

When in fzf interface:

| Key | Action |
|-----|--------|
| `↑/↓` or `Ctrl-K/J` | Navigate up/down |
| `Enter` | Select and view file |
| `Ctrl-Y` | Copy content to clipboard |
| `Ctrl-O` | Open in $EDITOR |
| `Ctrl-C` / `Esc` | Exit |
| `Tab` | Select multiple (where available) |
| `Ctrl-Space` | Toggle selection |
| `Ctrl-U` | Clear query |
| `Ctrl-R` | Toggle preview |

---

## Example Workflows

### Find Python function by name
```bash
clip-fzf-content
# Type: "def transcribe"
# Navigate to match, press Enter to view file
```

### Browse your Etsy project work
```bash
clip-fzf-category
# Select: PROJECTS
# Select: etsy_gallery_management
# Search for specific files
```

### Find recent work
```bash
clip-fzf-recent
# Shows only files from last 30 days
# Type to filter, Enter to view
```

### Copy a code snippet
```bash
clip-fzf-python
# Find your Python file
# Press Ctrl-Y to copy entire file to clipboard
# Or press Enter to view, then manually copy specific lines
```

### Search across all clipboard history
```bash
clip-fzf-json
# Searches the raw JSON export
# Shows date + preview
# Press Ctrl-Y to copy the entry
```

---

## Tips & Tricks

### Fuzzy Matching
fzf uses smart fuzzy matching:
- `transcribe` matches "auto_transcribe_video.py"
- `py etsy` matches "etsy_gallery_generation.py"
- `'ffmpeg` exact match for lines starting with "ffmpeg"
- `!test` inverse match - exclude files with "test"

### Preview Window
- Preview updates as you type
- Shows syntax highlighting (if bat installed)
- Scroll preview with `Shift-↑/↓`
- Toggle preview with `Ctrl-R`

### Chain Commands
Pipe output to other tools:
```bash
# Find file and edit
clip-fzf | xargs code

# Find content and copy
clip-fzf-python | xargs cat | pbcopy
```

### Combine with grep
Find specific patterns first, then fuzzy search:
```bash
# Find all TODO comments
rg -l "TODO" ~/Documents/paste_export/organized_merged | \
  fzf --preview="rg --color=always TODO {}"
```

---

## Advanced Usage

### Search Specific File Types
```bash
# JavaScript only
find ~/Documents/paste_export/organized_merged -name "*.js" | \
  fzf --preview="head -100 {}"

# Markdown only
find ~/Documents/paste_export/organized_merged -name "*.md" | \
  fzf --preview="head -100 {}"
```

### Multi-Select Mode
```bash
# Select multiple files and open all
clip-fzf --multi
# Use Tab to select multiple, Enter to view all
```

### Custom Preview
```bash
# With line numbers and syntax highlighting (if bat installed)
clip-fzf # Already configured for best preview

# Or manually:
find ~/Documents/paste_export/organized_merged -type f | \
  fzf --preview="bat --color=always --style=numbers {}"
```

### Search by Date
```bash
# Find files from specific date
clip-date 2025-10-26 | fzf
```

---

## Installation for Maximum Power

### Install bat (optional, for syntax highlighting)
```bash
brew install bat
```

Then previews will have beautiful syntax highlighting!

### Install ripgrep (required for content search)
```bash
brew install ripgrep
```

Already installed if you can run `rg` command.

### Add to Shell Startup

**For zsh** (`~/.zshrc`):
```bash
# Clipboard search helpers
source ~/Documents/paste_export/organized_v2/search_helpers.sh
```

**For bash** (`~/.bashrc`):
```bash
# Clipboard search helpers
source ~/Documents/paste_export/organized_v2/search_helpers.sh
```

Then reload:
```bash
source ~/.zshrc  # or source ~/.bashrc
```

---

## Comparison with Regular Commands

| Task | Regular | Fuzzy |
|------|---------|-------|
| Find file by name | `find ... \| grep` | `clip-fzf` |
| Search content | `grep -r` | `clip-fzf-content` |
| Browse category | `cd ... && ls` | `clip-fzf-category` |
| Recent files | `find -mtime` | `clip-fzf-recent` |
| Copy to clipboard | `cat file \| pbcopy` | `Ctrl-Y` in fzf |

Fuzzy search is:
- **Faster** - Type and see results instantly
- **Interactive** - Live preview, multiple actions
- **Forgiving** - Typo-tolerant fuzzy matching
- **Powerful** - Multi-select, piping, custom actions

---

## Troubleshooting

### "clip-fzf: command not found"
```bash
# Make sure to source the script
source ~/Documents/paste_export/organized_v2/search_helpers.sh

# Or source directly
source ~/Documents/paste_export/clipboard_fuzzy_search.sh
```

### "No preview showing"
Preview uses `head` by default. For better previews:
```bash
brew install bat
```

### "Content search not working"
Requires ripgrep:
```bash
brew install ripgrep
```

### "Can't copy to clipboard"
`Ctrl-Y` uses `pbcopy` (macOS). Should work by default.

### "Preview too small"
Resize with `Ctrl-R` to toggle, or adjust terminal size.

---

## File Locations

```
~/Documents/paste_export/
├── clipboard_fuzzy_search.sh       # Main fuzzy search script
├── organized_v2/search_helpers.sh  # Loads fuzzy + classic search
├── organized_merged/               # Your organized clipboard
└── text_items.json                 # Raw JSON export
```

---

## More Help

- **Fuzzy search help**: `clip-fzf-help`
- **Classic search help**: `clip-help`
- **fzf documentation**: https://github.com/junegunn/fzf

---

## Quick Reference

```bash
# Most used commands
clip-fzf              # Search files
clip-fzf-content      # Search content
clip-fzf-menu         # Show menu
clip-fzf-recent       # Recent files
clip-fzf-python       # Python only

# Inside fzf
Enter       → View
Ctrl-Y      → Copy to clipboard
Ctrl-O      → Open in editor
Ctrl-C      → Exit
```

---

## Pro Tips

1. **Use fuzzy matching shortcuts**
   - Type fragments: `py etsy` finds "python_etsy_automation.py"
   - Use `!` to exclude: `python !test` finds Python files without "test"

2. **Master Ctrl-Y**
   - Fastest way to copy any file to clipboard
   - Press and go - no need to view first

3. **Combine with other tools**
   - `clip-fzf | xargs $EDITOR` - Find and edit
   - `clip-fzf-python | xargs wc -l` - Count lines in Python files

4. **Use categories for big searches**
   - Start with `clip-fzf-category` to narrow scope
   - Then fuzzy search within that space

5. **Search JSON for specific dates**
   - `clip-fzf-json` then type the date: `2025-10`
   - See chronological clipboard history

---

## 🎉 You're Ready!

Start with:
```bash
clip-fzf-menu
```

Then explore the other commands. Happy searching!
