# Alfred Workflows - Improvement Roadmap

**Current State:** 22 workflows, 5.04 MB, 14 with hotkeys
**Analysis Date:** 2025-10-26

---

## 🎯 Priority Improvements

### 1. ADD HOTKEYS TO KEY WORKFLOWS (HIGH PRIORITY)

8 workflows currently lack hotkeys. Here are the most important ones:

#### Immediate Additions:
```
⌘⌥H  → Homebrew (brew install/update/search)
⌘⌥C  → Claude Conversations (AI chat history)
⌘⌥D  → Dynamic File Search (search within folders)
⌘⌥G  → ChatGPT / DALL-E (AI assistance)
⌘⌥P  → Package Managers (npm, pip, gem)
```

**Why:** These are frequently-used workflows that benefit from instant access. Currently require typing keywords.

**Implementation:** Need to manually add hotkey triggers in Alfred Preferences UI (these workflows use script filters, not keyword inputs).

---

### 2. OPTIMIZE PACKAGE MANAGERS WORKFLOW (MEDIUM PRIORITY)

**Current Size:** 1.67 MB (33% of total Alfred workflows size!)

**Problem:** Likely storing large package databases locally

**Solutions:**
1. **Use online APIs** instead of local caching
2. **Implement expiring cache** (clear data older than 7 days)
3. **Lazy loading** - only fetch when searched
4. **Split by package manager** - separate npm, pip, gem workflows

**Potential savings:** 1+ MB

---

### 3. CREATE SHARED PYTHON UTILITIES (LOW EFFORT, HIGH VALUE)

**Current Python Workflows:**
- Claude Conversations (4 .py files)
- Clipboard Search (3 .py files)
- Search Alfred Workflows (5 .py files)

**Recommendation:** Create shared utility library at:
```
~/Library/Alfred/shared/
├── alfred_utils.py      # Common Alfred JSON formatting
├── search_utils.py      # Shared search/fuzzy matching
└── cache_utils.py       # Caching helpers
```

**Benefits:**
- Faster development of new workflows
- Consistent error handling
- Reduce code duplication
- Easier maintenance

**Example shared_utils.py:**
```python
#!/usr/bin/env python3
"""Shared utilities for Alfred workflows"""

import json
import sys
from pathlib import Path

def alfred_json(items):
    """Output Alfred-formatted JSON"""
    output = {"items": items}
    print(json.dumps(output, ensure_ascii=False))

def alfred_item(title, subtitle, arg, icon="📄", valid=True):
    """Create Alfred result item"""
    return {
        "title": title,
        "subtitle": subtitle,
        "arg": arg,
        "valid": valid,
        "icon": {"type": "default", "path": icon}
    }

def get_cache_dir(workflow_name):
    """Get workflow cache directory"""
    cache = Path.home() / "Library/Caches/com.runningwithcrayons.Alfred/Workflow Data"
    workflow_cache = cache / workflow_name
    workflow_cache.mkdir(parents=True, exist_ok=True)
    return workflow_cache
```

---

### 4. WORKFLOW INTEGRATIONS & CHAINING

#### A. Clipboard Search + Other Workflows

**Connect Clipboard Search with:**

1. **Shimmering Obsidian**
   - Add action: "Paste to Obsidian Note"
   - Use case: Found text in clipboard → instantly create note

2. **Pretty JSON** (if you have it)
   - Add action: "Format as JSON"
   - Use case: Found JSON in clipboard → beautify it

3. **ChatGPT / DALL-E**
   - Add action: "Send to ChatGPT"
   - Use case: Found code in clipboard → ask AI to explain

4. **Markdown Transform**
   - Add action: "Transform to Markdown"
   - Use case: Found content → convert format

**Implementation:**
```python
# In search_content.py, add to each result item:
"mods": {
    "cmd": {"arg": text, "subtitle": "Copy to clipboard"},
    "alt": {"arg": f"obsidian://new?vault=main&content={text}",
            "subtitle": "Create Obsidian note"},
    "ctrl": {"arg": text, "subtitle": "Send to ChatGPT"},
    "shift": {"arg": text, "subtitle": "Transform to markdown"}
}
```

#### B. Homebrew + Claude Conversations

**Integration:** Ask Claude about brew packages
```
Browse Homebrew package → ⌥Enter → Ask Claude about it
```

#### C. Dynamic File Search + Clipboard Search

**Fallback Search:**
```python
# In Dynamic File Search: if no files found
if len(results) == 0:
    return [{
        "title": "No files found",
        "subtitle": "Press Enter to search clipboard instead",
        "arg": f"clipboard_search:{query}"
    }]
```

---

### 5. NEW WORKFLOW IDEAS (Based on Your Usage Patterns)

#### A. **Git Helper Workflow** 🔥 HIGHLY RECOMMENDED

**Why:** You have 235 git commands in clipboard history (1% of all items)

**Keywords:**
- `git status` → Show current status
- `git push` → Smart push (detects branch)
- `git log` → Pretty log viewer
- `git diff` → Visual diff viewer
- `git undo` → Undo last commit safely

**Features:**
- Show current branch status
- List recent commits with fuzzy search
- Quick commands (add, commit, push)
- Clipboard integration (find previous git commands)

**Quick Implementation:**
```bash
# Create workflow with keywords
git status → git status --short
git push   → git push origin $(git branch --show-current)
git log    → git log --oneline --graph --decorate --all -20
```

#### B. **Developer's Toolkit Workflow** 🔥 RECOMMENDED

**Combines:**
- Clipboard Search (code snippets)
- Homebrew (install tools)
- Package Managers (npm/pip)
- Run Command (execute)
- Pretty JSON (format)

**Single keyword:** `dev`

**Usage:**
```
dev install python  → Brew install python
dev search react    → Search npm for react
dev clip python     → Search clipboard for Python
dev json            → Format clipboard as JSON
dev run ls -la      → Run command
```

#### C. **URL Manager Workflow** 🔥 RECOMMENDED

**Why:** You have 1,217 URLs in clipboard (8% of items)

**Features:**
- Quick URL shortener
- URL cleaner (remove tracking params)
- Open multiple URLs at once
- Save URLs to collections
- Search clipboard URLs (`clipurl`)

**Keywords:**
- `url clean` → Remove tracking params
- `url short` → Shorten URL
- `url open` → Open from clipboard
- Already have: `clipurl` → Search URLs

#### D. **Quick Note Workflow**

**Integration with existing:**
- Shimmering Obsidian
- Scratchpad
- Clipboard Search

**Single hotkey:** ⌘⌥N

**Actions:**
1. Opens with empty note
2. Type content
3. Auto-saves to Obsidian with timestamp
4. Also saves to clipboard history
5. Tags based on content

---

### 6. KEYBOARD SHORTCUT OPTIMIZATION

**Current Hotkeys in Use:**
```
⌘⌥Space → Clipboard Search (recently added)
```

**Recommended Hotkey Map:**
```
⌘⌥Space → Clipboard Search (✅ done)
⌘⌥C     → Claude Conversations
⌘⌥H     → Homebrew
⌘⌥D     → Dynamic File Search
⌘⌥G     → ChatGPT / DALL-E
⌘⌥O     → Shimmering Obsidian (if not set)
⌘⌥N     → Quick Note (new workflow)
⌘⌥R     → Run Command
⌘⌥T     → String multitool
⌘⌥F     → fzf-alfred-workflow
⌘⌥P     → Package Managers
```

**Muscle Memory Strategy:**
- **⌘⌥C** - "C" for Conversations/ChatGPT
- **⌘⌥H** - "H" for Homebrew
- **⌘⌥D** - "D" for Dynamic/Directory search
- **⌘⌥O** - "O" for Obsidian
- **⌘⌥N** - "N" for New note
- **⌘⌥R** - "R" for Run
- **⌘⌥T** - "T" for Text/Transform

---

### 7. CONTENT-TYPE SEARCH ENHANCEMENTS

**Your Clipboard Search already has:**
- `clippy` → Python code
- `clipsh` → Shell commands
- `clipurl` → URLs
- `clipjson` → JSON
- `clipgit` → Git commands
- `clipmd` → Markdown

**Suggested Additions:**

#### A. Add `clipjs` for JavaScript (695 items, 4%)
```python
# In search_typed.py, already defined but not exposed:
'js': r'(function |const |let |var |=>|\.js\b|npm |yarn)',
```

Add to workflow:
```
clipjs → Search JavaScript code
```

#### B. Add `clipsql` for SQL (249 items, 1%)
```python
'sql': r'\b(SELECT|INSERT|UPDATE|DELETE|CREATE TABLE)\b',
```

#### C. Add temporal search modes:
```
cliptoday   → Items from today
clipweek    → Items from this week
clipmonth   → Items from this month
cliprecent  → Last 100 items
```

**Implementation:**
```python
# New file: search_temporal.py
def search_temporal(timeframe, query=""):
    now = datetime.now()

    if timeframe == 'today':
        cutoff = now.replace(hour=0, minute=0, second=0)
    elif timeframe == 'week':
        cutoff = now - timedelta(days=7)
    elif timeframe == 'month':
        cutoff = now - timedelta(days=30)

    # Filter items by created date
    # ... rest of implementation
```

---

### 8. WORKFLOW MONITORING & ANALYTICS

**Create:** `workflow-stats` command

**Features:**
- Track which workflows you actually use
- Show usage frequency
- Identify unused workflows
- Show hotkey conflicts

**Example output:**
```
Most used workflows (last 30 days):
  1. Clipboard Search      → 127 uses
  2. Shimmering Obsidian   →  89 uses
  3. Homebrew              →  45 uses
  4. Claude Conversations  →  34 uses
  5. String multitool      →  12 uses

Unused workflows:
  • Reddit Browser         → 0 uses (last 90 days)
  • Get latest files       → 1 use (last 90 days)
```

**Implementation:**
```python
# Log every workflow execution to:
# ~/Library/Caches/Alfred/workflow_usage.json

{
  "Clipboard Search": {
    "count": 127,
    "last_used": "2025-10-26T08:30:00",
    "avg_per_day": 4.2
  }
}
```

---

### 9. UNIVERSAL ACTIONS

**Add to Clipboard Search:**

Enable Universal Actions (right-click on selected text/files):

```xml
<!-- In info.plist, add: -->
<key>triggers</key>
<array>
  <dict>
    <key>type</key>
    <string>alfred.workflow.trigger.action</string>
    <key>argument</key>
    <integer>0</integer>
  </dict>
</array>
```

**Usage:**
1. Select text anywhere
2. Right-click → Show Actions
3. "Search in Clipboard"
4. Finds similar text in clipboard history

---

### 10. SNIPPET INTEGRATION

**Create:** Clipboard → Snippets converter

**Feature:** Convert frequently-used clipboard items to Alfred snippets

**Usage:**
```
clippy import requests → Found 15 times
Action: "Save as snippet" → Creates Alfred snippet
```

**Suggested snippet collection:**
- Python imports
- Git commands
- Shell one-liners
- API endpoints
- Code templates

---

## 📊 Workflow Health Checklist

Use this to audit your workflows quarterly:

### Performance
- [ ] No workflow over 2 MB
- [ ] All workflows respond under 500ms
- [ ] No duplicate functionality
- [ ] Caches are cleaned regularly

### Organization
- [ ] All workflows categorized
- [ ] All workflows have descriptions
- [ ] Keywords are memorable and consistent
- [ ] Hotkeys assigned to frequent workflows

### Integration
- [ ] Workflows share common utilities
- [ ] Related workflows are connected
- [ ] Universal actions enabled where useful
- [ ] Clipboard integration where relevant

### Maintenance
- [ ] Unused workflows removed/disabled
- [ ] Scripts updated for macOS version
- [ ] Dependencies up to date
- [ ] Documentation current

---

## 🚀 Implementation Priority

### Week 1: Quick Wins (2-3 hours)
1. ✅ Add hotkeys to 5 workflows
2. ✅ Create shared Python utilities
3. ✅ Add temporal search to Clipboard Search

### Week 2: Integrations (3-4 hours)
1. ✅ Connect Clipboard Search with 3 workflows
2. ✅ Add Universal Actions to Clipboard Search
3. ✅ Create workflow usage tracking

### Week 3: New Workflows (4-5 hours)
1. ✅ Build Git Helper workflow
2. ✅ Build Developer's Toolkit workflow
3. ✅ Build URL Manager workflow

### Month 2: Optimization (2-3 hours)
1. ✅ Optimize Package Managers (reduce size)
2. ✅ Set up workflow analytics
3. ✅ Create snippet converter

---

## 🎯 Success Metrics

**Current State:**
- 22 workflows
- 14 with hotkeys (64%)
- 5.04 MB total size
- 10 with keywords

**Target State (3 months):**
- 25 workflows (add 3 new, optimized ones)
- 20+ with hotkeys (80%+)
- <4 MB total size (20% reduction)
- All with keywords/hotkeys
- 5+ workflow integrations
- Usage analytics enabled

---

## 💡 Advanced Ideas (Future)

### 1. AI-Powered Clipboard Categorization
Use local ML model to automatically categorize clipboard items:
- Code vs prose
- Programming language detection
- Topic classification
- Importance scoring

### 2. Clipboard Sync Across Devices
Sync clipboard items between Macs via iCloud:
- Real-time sync
- Conflict resolution
- Privacy controls

### 3. Context-Aware Suggestions
Alfred learns usage patterns:
- Time of day
- Currently open apps
- Recent clipboard items
- Project context

Suggests relevant clipboard items before you search.

### 4. Workflow Marketplace Integration
Share your enhanced Clipboard Search:
- Export as .alfredworkflow
- Submit to Alfred Gallery
- Get community feedback
- Track downloads

---

## 📚 Resources

### Learning
- **Alfred Forum:** https://alfredforum.com/
- **Workflow Variables:** https://www.alfredapp.com/help/workflows/advanced/variables/
- **Script Filters:** https://www.alfredapp.com/help/workflows/inputs/script-filter/

### Tools
- **Alfred-Workflow (Python):** https://github.com/deanishe/alfred-workflow
- **Alfred-Workflow (Node):** https://github.com/sindresorhus/alfy
- **Workflow Debugger:** Built into Alfred Preferences

### Inspiration
- **Packal:** http://www.packal.org/ (deprecated but good examples)
- **Alfred Gallery:** https://alfred.app/workflows/
- **GitHub:** Search for "alfred workflow"

---

## 🎉 Summary

Your Alfred setup is already strong with 22 well-organized workflows. The biggest opportunities:

### Top 3 Priorities:
1. **Add hotkeys to 5 key workflows** (Homebrew, Claude Conversations, Dynamic File Search, ChatGPT, Package Managers)
2. **Create Git Helper workflow** (you have 235 git commands in clipboard!)
3. **Optimize Package Managers** (currently 1.67 MB, 33% of total size)

### Quick Wins:
- Add `clipjs` and `clipsql` to Clipboard Search
- Create shared Python utilities
- Add temporal search (`cliptoday`, `clipweek`)
- Enable Universal Actions for Clipboard Search

### Time Investment:
- **Week 1:** 2-3 hours for quick wins
- **Month 1:** 10-15 hours for full implementation
- **Ongoing:** 1 hour/month for maintenance

**ROI:** 10-20 minutes saved per day → 60-120 hours saved per year

---

Generated: 2025-10-26
Workflows Analyzed: 22
Total Size: 5.04 MB
