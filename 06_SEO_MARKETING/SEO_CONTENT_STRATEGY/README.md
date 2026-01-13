# Claude Conversations Directory

**Location:** `~/claude/conversations/`  
**Purpose:** Store all Claude Code conversation exports for search and reference

---

## ✅ Current Status

- **Total Conversations:** 50+ files
- **Formats:** TXT and HTML versions for each conversation
- **Searchable:** Via Alfred workflow (`cc` keyword)

---

## 🔄 How Conversations Are Stored

### 1. **Automatic Export (SessionEnd Hook)**
When you end a Claude Code session, conversations are automatically exported to this directory.

**Configuration:** `~/.claude/settings.json` includes a SessionEnd hook that runs:
```bash
python3 ~/.claude/hooks/export_conversation.py
```

### 2. **Manual Import from Export Files**
If you have Claude export ZIP files, you can import them:

```bash
python3 ~/.claude/hooks/import_claude_export.py /path/to/Claude-Convo-Export.zip
```

This will extract all conversations from the export file and save them here.

---

## 📁 File Format

Each conversation is saved as:
- `conversation_YYYYMMDD_HHMMSS.txt` - Text version (searchable)
- `conversation_YYYYMMDD_HHMMSS.html` - HTML version (readable)

**Example:**
- `conversation_20251201_114657.txt`
- `conversation_20251201_114657.html`

---

## 🔍 Searching Conversations

### Via Alfred Workflow
- **Keyword:** `cc` - Search all conversations
- **Keyword:** `ccstats` - View statistics

### Via Command Line
```bash
# Search for specific term
python3 ~/.claude/hooks/export_conversation.py "search term"

# Or use the Alfred workflow script directly
python3 "/Users/steven/Library/Mobile Documents/com~apple~CloudDocs/Alfred/Alfred.alfredpreferences/workflows/user.workflow.43D6DD9F-3DB9-479A-B8F1-8EE00E17FC14/search_conversations_v2.py" "search term"
```

---

## ✅ Ensuring More Conversations Are Stored

### Option 1: Automatic Export (Recommended)
The SessionEnd hook is already configured. Just make sure:
1. ✅ Hook is in `~/.claude/settings.json` (already done)
2. ✅ Script exists at `~/.claude/hooks/export_conversation.py` (already done)
3. ✅ Script is executable: `chmod +x ~/.claude/hooks/export_conversation.py` (already done)

**Note:** The current hook creates placeholder files. Claude Code may need to be configured to pass conversation data to the hook, or you may need to use Claude's built-in export feature.

### Option 2: Manual Export from Claude
1. In Claude Code, use the export feature
2. Save exports to this directory or import them using the import script

### Option 3: Regular Imports
Periodically import from Claude export files:
```bash
# When you get a new export file
python3 ~/.claude/hooks/import_claude_export.py ~/Downloads/Claude-Convo-Export.zip
```

---

## 📊 Statistics

Run the stats command:
```bash
python3 "/Users/steven/Library/Mobile Documents/com~apple~CloudDocs/Alfred/Alfred.alfredpreferences/workflows/user.workflow.43D6DD9F-3DB9-479A-B8F1-8EE00E17FC14/get_stats.py"
```

Or use Alfred: `ccstats`

---

## 🔧 Troubleshooting

### Conversations not auto-exporting
1. Check hook configuration:
   ```bash
   cat ~/.claude/settings.json | grep -A 10 SessionEnd
   ```

2. Check script exists and is executable:
   ```bash
   ls -la ~/.claude/hooks/export_conversation.py
   ```

3. Test the script manually:
   ```bash
   python3 ~/.claude/hooks/export_conversation.py
   ```

### Import not working
1. Check file path is correct
2. Check zip file contains `conversations.json`
3. Check Python version: `python3 --version`

---

## 📝 Notes

- Files are named with timestamps from the conversation's `updated_at` field
- Duplicate conversations (same timestamp) are skipped during import
- Empty conversations are automatically skipped
- The format matches the existing conversation structure for compatibility

---

*Last updated: December 1, 2025*
