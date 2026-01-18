# Clipboard Automation Guide

## Overview

Automate the export and organization of your Paste app clipboard history with intelligent incremental updates. Never manually export again!

---

## 🚀 Quick Start

### Test the Automation
```bash
cd ~/Documents/paste_export
./schedule_updates.sh test
```

### Run Update Immediately
```bash
./schedule_updates.sh now
```

### Schedule Daily Auto-Updates
```bash
./schedule_updates.sh install
```

Done! Your clipboard will now be automatically organized every night at 11:30 PM.

---

## 📋 What's Included

### 1. `auto_update_clipboard.py`
**Intelligent incremental updater** that:
- Exports only NEW items since last update
- Categorizes items automatically
- Appends to existing organized structure
- Tracks state to avoid duplicates
- Cleans up temporary files

### 2. `schedule_updates.sh`
**Scheduler utility** that:
- Tests the automation
- Runs updates on-demand
- Installs daily scheduled updates
- Manages logs
- Shows status and history

---

## 🎯 How It Works

### Incremental Updates

**Traditional approach:** Re-export everything every time (slow, wasteful)

**Our approach:** Track the last processed item ID and only export new items

```
First run:  Export items 1-15,196
Second run: Export items 15,197-15,250  (only 54 new items!)
Third run:  Export items 15,251-15,300  (only 50 new items!)
```

### Smart Organization

New items are automatically categorized and added to:
- `BY_TYPE/code/{language}/` - Code snippets
- `BY_TYPE/commands/{tool}/` - Terminal commands
- `BY_TYPE/urls/` - Web URLs
- `RESOURCES/file_paths/` - File paths
- `RESOURCES/credentials/` - API keys (⚠️ flagged)
- `BY_TYPE/misc/` - Uncategorized items

### State Tracking

Maintains `.update_state.json`:
```json
{
  "last_update": "2025-10-26T02:45:00",
  "last_item_count": 54,
  "last_processed_id": 15250
}
```

---

## 📅 Scheduling Options

### Option 1: Daily Auto-Update (Recommended)
```bash
./schedule_updates.sh install
```

**Schedule:** Every night at 11:30 PM
**Method:** macOS LaunchAgent
**Logs:** `logs/auto_update.log`

**Check status:**
```bash
./schedule_updates.sh status
```

**View logs:**
```bash
./schedule_updates.sh logs
```

### Option 2: Manual Updates
```bash
# Run whenever you want
./schedule_updates.sh now
```

### Option 3: Custom Schedule

Edit the LaunchAgent plist at:
`~/Library/LaunchAgents/com.user.clipboard-updater.plist`

Change the hour/minute:
```xml
<key>Hour</key>
<integer>9</integer>  <!-- Run at 9 AM -->
<key>Minute</key>
<integer>0</integer>
```

Then reload:
```bash
launchctl unload ~/Library/LaunchAgents/com.user.clipboard-updater.plist
launchctl load ~/Library/LaunchAgents/com.user.clipboard-updater.plist
```

---

## 🛠️ Advanced Usage

### Check What Will Be Exported
```python
python3 << 'EOF'
import sqlite3
from pathlib import Path

db_path = Path.home() / "Library/Application Support/com.wiheads.paste-setapp/db.sqlite"
conn = sqlite3.connect(str(db_path))
cursor = conn.cursor()

# Get max ID from database
cursor.execute("SELECT MAX(Z_PK) FROM ZITEMENTITY")
max_id = cursor.fetchone()[0]

# Get last processed ID
import json
state_file = Path.home() / "Documents/paste_export/.update_state.json"
if state_file.exists():
    state = json.load(open(state_file))
    last_id = state['last_processed_id']
    print(f"Items in database: {max_id}")
    print(f"Last processed: {last_id}")
    print(f"New items to export: {max_id - last_id}")
else:
    print(f"No previous state. Will export all {max_id} items on first run.")

conn.close()
EOF
```

### Force Full Re-Export
```bash
# Backup current state
cp .update_state.json .update_state.json.backup

# Reset state
echo '{"last_update": null, "last_item_count": 0, "last_processed_id": 0}' > .update_state.json

# Run full export
python3 auto_update_clipboard.py --full
```

### Modify Categorization

Edit `auto_update_clipboard.py`, find the `categorize_item` method:

```python
def categorize_item(self, item):
    # Add your custom patterns here
    patterns = {
        'my_project': r'special_keyword',
        'my_workflow': r'custom_pattern',
        # ... existing patterns
    }
```

### View Statistics
```bash
python3 << 'EOF'
import json
from pathlib import Path

state_file = Path.home() / "Documents/paste_export/.update_state.json"
if state_file.exists():
    state = json.load(open(state_file))
    print("📊 Automation Statistics:")
    print(f"  Last update: {state['last_update']}")
    print(f"  Items in last update: {state['last_item_count']}")
    print(f"  Total processed: {state['last_processed_id']}")
else:
    print("No updates yet")
EOF
```

---

## 🚀 Improvements & Features

### Current Features

✅ **Incremental Updates** - Only processes new items
✅ **Smart Categorization** - Automatic pattern detection
✅ **State Tracking** - Remembers last position
✅ **Duplicate Prevention** - Never processes same item twice
✅ **Auto Cleanup** - Removes temporary files
✅ **Logging** - Full audit trail
✅ **Scheduling** - Set-and-forget automation
✅ **Security Detection** - Flags potential credentials

### Planned Improvements

Here are potential enhancements you might want:

#### 1. **AI-Powered Categorization**
Use LLM API to semantically categorize items:
```python
# Could add:
import anthropic
client = anthropic.Anthropic()

def categorize_with_ai(text):
    message = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        messages=[{
            "role": "user",
            "content": f"Categorize this clipboard item: {text}"
        }]
    )
    return message.content
```

#### 2. **Deduplication**
Track content hashes to avoid storing duplicates:
```python
def is_duplicate(item):
    text = str(item.get('data', {}).get('text', ''))
    content_hash = hashlib.sha256(text.encode()).hexdigest()
    # Check against stored hashes
    return content_hash in seen_hashes
```

#### 3. **Full-Text Search Index**
Build searchable index with `whoosh` or `elasticsearch`:
```python
from whoosh.index import create_in
from whoosh.fields import Schema, TEXT, ID

# Create search index of all clipboard items
```

#### 4. **Web Dashboard**
Flask app to browse/search clipboard:
```python
from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def dashboard():
    # Show recent items, stats, search
    pass
```

#### 5. **Smart Notifications**
Alert on interesting patterns:
```python
# "You've copied 50 Python snippets this week!"
# "New API key detected - remember to rotate!"
# "Your most productive day this month was..."
```

#### 6. **Integration with Tools**
- Export to Notion, Obsidian, Roam
- Sync to GitHub gist
- Send summaries to email/Slack

#### 7. **Machine Learning Insights**
- Predict what you'll need next
- Suggest related items
- Identify work patterns

---

## 🔧 Troubleshooting

### "Database not found"
**Problem:** Can't access Paste database

**Solution:**
```bash
# Check if file exists
ls -la ~/Library/Application\ Support/com.wiheads.paste-setapp/db.sqlite

# If not found, check Paste is installed via Setapp
# Or update path in script if using different Paste version
```

### "No new items found" (but you know there are)
**Problem:** State file might be corrupted

**Solution:**
```bash
cd ~/Documents/paste_export
cat .update_state.json  # Check current state
rm .update_state.json   # Reset if needed
./schedule_updates.sh test
```

### Script fails to run
**Problem:** Python dependencies or permissions

**Solution:**
```bash
# Check Python version
python3 --version  # Need 3.6+

# Make executable
chmod +x auto_update_clipboard.py schedule_updates.sh

# Test manually
python3 auto_update_clipboard.py
```

### LaunchAgent not running
**Problem:** Schedule not activating

**Solution:**
```bash
# Check if loaded
launchctl list | grep clipboard

# View system logs
log show --predicate 'process == "launchd"' --info --last 1h | grep clipboard

# Reload agent
launchctl unload ~/Library/LaunchAgents/com.user.clipboard-updater.plist
launchctl load ~/Library/LaunchAgents/com.user.clipboard-updater.plist
```

---

## 📊 Monitoring

### Check Automation Status
```bash
./schedule_updates.sh status
```

### View Recent Logs
```bash
./schedule_updates.sh logs
```

### Track Updates Over Time
```bash
# See update history
grep "Found.*new items" logs/auto_update.log

# See categorization stats
grep "Organization statistics" logs/auto_update.log -A 10
```

### Dashboard One-Liner
```bash
echo "📊 Clipboard Automation Dashboard"
echo "=================================="
echo ""
echo "Status:"
./schedule_updates.sh status | head -3
echo ""
echo "Recent activity:"
tail -20 logs/auto_update.log | grep "Found\|Organized"
```

---

## 🎓 Tips & Best Practices

### 1. Run First Update Manually
Before scheduling, test that everything works:
```bash
./schedule_updates.sh test
./schedule_updates.sh now
./schedule_updates.sh logs
```

### 2. Schedule During Low-Activity Time
Default is 11:30 PM. Choose when your Mac is on but you're not actively working.

### 3. Periodically Review Logs
```bash
# Weekly check
./schedule_updates.sh logs | grep "Error\|Warning"
```

### 4. Backup State File
```bash
# Monthly backup
cp .update_state.json .update_state.json.backup-$(date +%Y%m%d)
```

### 5. Clean Old Logs
```bash
# Every few months
rm logs/auto_update.log.old
mv logs/auto_update.log logs/auto_update.log.old
```

### 6. Audit Credentials Folder
```bash
# Weekly security check
ls -la organized_merged/RESOURCES/credentials/
grep -r "api" organized_merged/RESOURCES/credentials/
```

---

## 🔒 Security Considerations

### Sensitive Data Detection

The automation flags potential secrets:
- API keys
- Tokens
- Passwords
- SSH keys

These go to: `RESOURCES/credentials/`

**Action Required:**
1. Review this folder weekly
2. Rotate any exposed credentials
3. Use a secrets manager (1Password, Bitwarden)
4. Consider encrypting the credentials folder

### Encrypt Sensitive Folder
```bash
# Create encrypted disk image
hdiutil create -size 100m -encryption AES-256 \
  -volname "Credentials" -fs HFS+J \
  ~/Documents/paste_export/credentials.dmg

# Mount when needed
hdiutil attach ~/Documents/paste_export/credentials.dmg

# Store credentials there
mv organized_merged/RESOURCES/credentials/* /Volumes/Credentials/

# Unmount when done
hdiutil detach /Volumes/Credentials
```

---

## 📚 Additional Resources

### File Locations

```
~/Documents/paste_export/
├── auto_update_clipboard.py     Main automation script
├── schedule_updates.sh           Scheduler utility
├── .update_state.json            State tracking (created on first run)
├── new_items.json                Temp file (auto-cleaned)
├── logs/
│   └── auto_update.log           Activity log
└── organized_merged/             Your organized clipboard
```

### LaunchAgent Location
```
~/Library/LaunchAgents/com.user.clipboard-updater.plist
```

### Paste Database Location
```
~/Library/Application Support/com.wiheads.paste-setapp/db.sqlite
```

---

## 🚀 Quick Command Reference

```bash
# Test automation
./schedule_updates.sh test

# Run update now
./schedule_updates.sh now

# Install daily schedule
./schedule_updates.sh install

# Check status
./schedule_updates.sh status

# View logs
./schedule_updates.sh logs

# Remove schedule
./schedule_updates.sh remove
```

---

## 🎉 Next Steps

1. **Test the automation:**
   ```bash
   cd ~/Documents/paste_export
   ./schedule_updates.sh test
   ```

2. **Run first update:**
   ```bash
   ./schedule_updates.sh now
   ```

3. **Install daily schedule:**
   ```bash
   ./schedule_updates.sh install
   ```

4. **Relax!** Your clipboard is now automatically organized every day.

---

## 💡 Ideas for Customization

Want to make it your own? Here are some ideas:

- Change the schedule (morning, midday, evening)
- Add custom categorization patterns
- Integrate with your note-taking app
- Build a search interface
- Create weekly summary emails
- Export to different formats (Markdown, Notion, Obsidian)
- Add machine learning for better categorization
- Build productivity insights dashboard

The scripts are yours to modify! They're designed to be readable and extensible.

---

## ✅ Done!

Your clipboard automation is now set up. It will:
- ✅ Export new items automatically
- ✅ Organize them intelligently
- ✅ Keep everything up-to-date
- ✅ Log all activity
- ✅ Require zero manual work

**You can now focus on creating, not organizing!** 🚀
