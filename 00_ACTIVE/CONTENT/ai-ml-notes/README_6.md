# Clipboard Search - Alfred Workflow

Search through your 15,196 clipboard items from Paste history directly from Alfred!

## Features

- 🔍 **Fast fuzzy search** through organized clipboard files
- 📝 **Content search** across all clipboard text
- 🐍 **Smart icons** for different file types
- ⚡ **Instant results** as you type
- 📋 **One-click copy** to clipboard

## Commands

### `clip [query]`
Search clipboard files by filename

- **Enter** - Copy file contents to clipboard
- **Cmd+Enter** - Copy file path
- **Alt+Enter** - Open in default editor
- **Ctrl+Enter** - Reveal in Finder

### `clips [query]`
Search clipboard content directly

- **Enter** - Copy content to clipboard
- **Cmd+Enter** - Copy to clipboard (same)

## Installation

1. Double-click `Clipboard Search.alfredworkflow` to install
2. Alfred will import the workflow automatically
3. Start searching with `clip` or `clips`

## Examples

```
clip python etsy          → Find Python files related to Etsy
clip transcribe           → Find transcription-related files
clips "def transcribe"    → Search for function definitions
clips ffmpeg              → Find all ffmpeg commands you've copied
```

## Requirements

- Alfred 5+ with Powerpack
- Python 3 (built-in on macOS)
- Clipboard export at `~/Documents/paste_export/`

## File Structure

The workflow searches through:
- `~/Documents/paste_export/organized_merged/` - Organized files
- `~/Documents/paste_export/text_items.json` - Raw content

## Icons

- 🐍 Python files
- 📜 JavaScript files
- ⚡ Shell scripts
- 📝 Markdown files
- 📊 JSON files
- 📄 Text files
- 🔗 URLs

## Tips

- Type partial words for fuzzy matching: `py etsy` finds "python_etsy_automation.py"
- Use `clips` for searching actual clipboard content
- Use `clip` for finding organized files by name
- Results are sorted by relevance

## Troubleshooting

**"No results found"**
- Make sure clipboard export exists at `~/Documents/paste_export/`
- Check that `organized_merged/` directory has files

**"Script error"**
- Ensure Python 3 is installed: `python3 --version`
- Check file permissions: `chmod +x *.py *.sh`

**"Slow searches"**
- First search builds index and may be slower
- Subsequent searches are instant

## What's Searched

- **9,623 active clipboard items** in Paste database
- **15,196 archived items** in organized exports
- **292 MB** of organized content across:
  - Projects (Etsy, Music, Video, Python tools, SEO)
  - Workflows (Automation, Transcription, Media processing)
  - Code snippets (Python, JavaScript, Bash, SQL)
  - Resources (URLs, APIs, Documentation)

## Version

1.0.0 - Initial release

## Credits

Created with Claude Code
