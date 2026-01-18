# Alfred Workflow - Clipboard Search

## Installation

### Quick Install
1. Double-click: `~/Documents/paste_export/Clipboard Search.alfredworkflow`
2. Alfred will open and ask to import
3. Click "Import" to install

That's it! You're ready to search.

---

## Usage

### Search Files by Name
```
⌘ Space → clip python
⌘ Space → clip etsy
⌘ Space → clip transcribe
```

### Search Content
```
⌘ Space → clips ffmpeg
⌘ Space → clips "def transcribe"
⌘ Space → clips "git clone"
```

---

## Keyboard Shortcuts

**In Alfred Results:**
- `Enter` - Copy to clipboard
- `⌘ Enter` - Copy file path
- `⌥ Enter` - Open in editor
- `⌃ Enter` - Reveal in Finder

---

## What You Can Search

### File Search (`clip`)
Searches filenames in organized clipboard:
- **9,623 active items** across organized structure
- **Multiple dimensions**: Projects, Workflows, Resources, Timeline
- **Smart icons** for different file types
- **Instant fuzzy matching**

### Content Search (`clips`)
Searches actual clipboard text:
- **15,196 historical items** from text_items.json
- **Chronological** - see when you copied it
- **Full text search** - find any phrase
- **Copy directly** - one click to clipboard

---

## Examples

```bash
clip python etsy         # Find: Python files related to Etsy
clip video              # Find: Video processing files
clip 2025-05            # Find: Files from May 2025

clips ffmpeg -i         # Find: All ffmpeg commands you ran
clips "def main"        # Find: Python main functions
clips transcribe        # Find: Transcription code/notes
```

---

## What Gets Searched

### organized_merged/
```
292 MB of organized clipboard:
  PROJECTS/           (5 projects: Etsy, Music, Video, Python, SEO)
  WORKFLOWS/          (6 workflows: Automation, Transcription, Media)
  DEVELOPMENT/        (Code, scripts, commands, configs)
  KNOWLEDGE_BASE/     (Docs, notes, references)
  RESOURCES/          (URLs, APIs, credentials)
  TIMELINE/           (13 months of work)
  HIGH_ACTIVITY_SPRINTS/ (Top 5 productive days)
  CROSS_PROJECT/      (Project intersections)
  BY_TYPE/            (Traditional categorization)
```

### text_items.json
```
38 MB raw export:
  15,196 chronological clipboard items
  Date range: Oct 2024 - Oct 2025
  Full text searchable
```

---

## Requirements

✅ Alfred 5+ with Powerpack
✅ Python 3 (built-in on macOS)
✅ Clipboard export at `~/Documents/paste_export/`

---

## Icons in Results

- 🐍 Python code
- 📜 JavaScript
- ⚡ Shell scripts
- 📝 Markdown
- 📊 JSON data
- 📄 Text files
- 🔗 URLs

---

## Performance

- **First search**: ~0.5 seconds (indexes files)
- **Subsequent searches**: Instant
- **Results limit**: 50 items max (most relevant first)
- **Fuzzy matching**: Type fragments, get matches

---

## Troubleshooting

### "No results found"
Check that your exports exist:
```bash
ls ~/Documents/paste_export/organized_merged/
ls ~/Documents/paste_export/text_items.json
```

### "Script error"
Verify Python is working:
```bash
python3 --version
cd ~/Documents/paste_export/alfred_workflow
python3 search_files.py "test"
```

### Slow searches
The first search builds an index. After that, searches are instant.

### Want to re-import
1. Alfred Preferences → Workflows
2. Find "Clipboard Search"
3. Right-click → Delete
4. Double-click workflow file to reinstall

---

## Advanced Usage

### Modify Keywords
Alfred Preferences → Workflows → Clipboard Search → Double-click keyword box

### Change Result Limit
Edit `search_files.py` and `search_content.py`:
```python
if len(results) >= 50:  # Change this number
```

### Add Custom Actions
In Alfred workflow editor, add new action blocks:
- Open in VSCode
- Send to DEVONthink
- Post to Slack
- etc.

---

## Comparison: Alfred vs Terminal

| Feature | Alfred | Terminal (fzf) |
|---------|--------|----------------|
| Speed | Instant | Instant |
| Interface | GUI | CLI |
| Previews | Yes | Yes (with setup) |
| Copy | One click | Ctrl-Y |
| Search | As you type | As you type |
| Integration | System-wide | Terminal only |
| Keyboard | ⌘ Space | cd + command |

**Use Alfred for**: Quick searches while working
**Use Terminal for**: Deep dives, scripting, automation

---

## What's Next?

### Enhance the Workflow
- Add more search modes (Python only, Recent only)
- Integrate with other apps (VSCode, Notion)
- Add custom actions (run code, save to...)
- Create hotkeys for instant search

### Use Both Systems
- **Alfred** for quick lookups during work
- **Terminal fuzzy search** for exploration
- **Classic search helpers** for scripting

All three systems work together!

---

## Files

```
~/Documents/paste_export/
├── Clipboard Search.alfredworkflow   ← Double-click to install
├── alfred_workflow/                  ← Source files
│   ├── search_files.py
│   ├── search_content.py
│   ├── copy_content.sh
│   ├── info.plist
│   └── README.md
├── organized_merged/                 ← What gets searched
└── text_items.json                   ← Content search source
```

---

## Support

**Test the scripts:**
```bash
cd ~/Documents/paste_export/alfred_workflow
python3 search_files.py "python" | jq
python3 search_content.py "ffmpeg" | jq
```

**Check workflow in Alfred:**
1. Alfred Preferences (⌘,)
2. Workflows tab
3. Find "Clipboard Search"
4. Check debugging log at bottom

---

## Version

**1.0.0** - Initial Release
- File search (`clip`)
- Content search (`clips`)
- Copy to clipboard actions
- Fuzzy matching
- Smart icons

Created with Claude Code

---

## Now Try It!

```
⌘ Space
clip python
```

Your 15,196 clipboard items are now instantly searchable from Alfred!
