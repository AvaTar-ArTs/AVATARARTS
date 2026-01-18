# 📋 Paste.app Clipboard History Extraction Guide

> **Before clearing Paste.app history** | Save your clipboard data!

---

## 📊 Your Clipboard Statistics

**Location**: `~/Library/Application Support/com.wiheads.paste-setapp/db.sqlite`
**Database Size**: 848MB
**Total Items**: **17,779 clipboard items**
**Date Range**: October 6, 2024 to October 25, 2025 (1+ year of history!)

### Breakdown by Type

| Type | Count | Percentage | Description |
|------|------:|-----------:|-------------|
| Plain Text | 15,131 | 85.1% | Code, notes, text snippets |
| Rich Text | 1,321 | 7.4% | Formatted text, HTML |
| File/Image | 514 | 2.9% | Screenshots, images, files |
| URL/Link | 510 | 2.9% | Web URLs |
| Unknown | 180 | 1.0% | Other content |
| Rich Content | 123 | 0.7% | Complex formats |

---

## 🎯 Why Extract Before Cleaning?

**You have over 17,000 clipboard items!** Many could contain:
- ✅ Important code snippets
- ✅ API keys or tokens (be careful!)
- ✅ Research notes
- ✅ URLs you wanted to save
- ✅ Text you meant to document
- ✅ Command line snippets

**Better safe than sorry** - extract first, then clean!

---

## 🚀 Quick Start

### **Option 1: Check Statistics Only**
```bash
paste-stats
```
Shows what you have without extracting anything.

### **Option 2: Extract Recent 100 Items (Recommended)**
```bash
paste-extract-recent
# Creates: paste_recent_100.md (~500KB)
```
Good for reviewing your most recent clipboard usage.

### **Option 3: Extract Recent 500 Items**
```bash
paste-extract-500
# Creates: paste_recent_500.md (~2-3MB)
```
More comprehensive recent history.

### **Option 4: Extract Everything (⚠️ LARGE)**
```bash
paste-extract-all
# Creates: paste_full_history.md (~100-200MB!)
# Warning: Takes time and creates large file
```
Complete archive of all 17,779 items.

---

## 📖 Usage Examples

### **Basic Extraction (Default: Last 1000 items)**
```bash
paste-extract
```
Creates `paste_history.md` with last 1000 items.

### **Custom Number of Items**
```bash
python3 ~/extract_paste_history.py --limit 250 --output recent_250.md
```

### **Just Check Stats**
```bash
python3 ~/extract_paste_history.py --stats-only
```

---

## 📄 Output Format

The markdown file contains:

### **Header with Statistics**
```markdown
# Paste.app Clipboard History Export

**Exported**: 2025-10-25 04:55:00
**Total Items**: 100
**Date Range**: 2024-10-20 to 2025-10-25

## Statistics
| Type | Count | Percentage |
...
```

### **Each Clipboard Item**
```markdown
## Item #1 - Plain Text

**Date**: 2025-10-25 04:50:31
**Source**: Claude (`com.anthropic.Claude`)

**Content**:
```
Your clipboard content here...
```

---
```

---

## 🎯 Recommended Workflow

### **Step 1: Check what you have**
```bash
paste-stats
```

### **Step 2: Extract recent items for review**
```bash
paste-extract-recent
open paste_recent_100.md
```

### **Step 3: Review the markdown file**
- Look for important snippets
- Save anything critical elsewhere
- Check for sensitive data (API keys!)

### **Step 4: (Optional) Full extraction**
If you find valuable items in recent history:
```bash
paste-extract-500
# Or even
paste-extract-all
```

### **Step 5: Archive the markdown files**
```bash
mkdir ~/clipboard_archive
mv paste_*.md ~/clipboard_archive/
```

### **Step 6: Clean Paste.app**
Now it's safe to clear Paste.app history:
- Through app: Settings → Clear history
- Or reduce retention: Settings → Keep items for 30 days

---

## 📊 Expected File Sizes

| Items | Estimated Size | Time to Generate |
|------:|---------------:|-----------------:|
| 100 | ~500KB | 5 seconds |
| 500 | ~2-3MB | 20 seconds |
| 1,000 | ~5-6MB | 40 seconds |
| 5,000 | ~25-30MB | 3 minutes |
| 17,779 (all) | ~100-200MB | 10-15 minutes |

---

## 🔍 What Gets Extracted

### **✅ Successfully Extracted**
- Plain text snippets
- URLs
- Rich text (converted to plain text)
- Timestamps
- Source application names
- Content previews

### **⚠️ Partially Extracted**
- Images (noted as "[Binary data - File/Image]")
- Files (noted with type)
- Complex rich content

### **❌ Not Extracted**
- Actual image data (too large for markdown)
- Binary file contents
- Formatting (converted to plain text)

---

## 🛡️ Security Considerations

### **⚠️ IMPORTANT: Check for Sensitive Data**

Your clipboard may contain:
- 🔐 API keys
- 🔑 Passwords
- 🎫 Auth tokens
- 💳 Personal information
- 📧 Email addresses

**Before sharing or storing:**
1. Review the extracted markdown
2. Search for sensitive patterns:
   ```bash
   grep -i "api.*key" paste_history.md
   grep -i "password" paste_history.md
   grep -i "token" paste_history.md
   ```
3. Redact sensitive information
4. Store in secure location

---

## 🧹 After Extraction - Cleanup Options

### **Option 1: Through Paste.app**
1. Open Paste.app
2. Settings → History
3. "Clear All History" or "Keep items for X days"

### **Option 2: Reduce Retention (Recommended)**
1. Paste.app → Settings
2. Set retention to 30-90 days
3. Automatically limits future growth

### **Option 3: Database Reset (Nuclear)**
⚠️ **ONLY after successful extraction!**
```bash
# Quit Paste.app first!
killall Paste 2>/dev/null

# Backup database (just in case)
cp ~/Library/Application\ Support/com.wiheads.paste-setapp/db.sqlite \
   ~/clipboard_archive/paste_backup.sqlite

# Delete database (Paste will create new one)
rm ~/Library/Application\ Support/com.wiheads.paste-setapp/db.sqlite*

# Restart Paste.app
open -a Paste
```

**Result**: Fresh start, ~850MB freed!

---

## 📁 File Locations

| File | Purpose |
|------|---------|
| `~/extract_paste_history.py` | Extraction script |
| `~/Library/Application Support/com.wiheads.paste-setapp/db.sqlite` | Original database (848MB) |
| `~/paste_history.md` | Default output file |
| `~/paste_recent_100.md` | Last 100 items |
| `~/paste_recent_500.md` | Last 500 items |
| `~/paste_full_history.md` | Complete history |

---

## 🎨 Advanced Usage

### **Extract by Date Range**
```bash
# Modify script to add WHERE clause:
python3 ~/extract_paste_history.py --help
```

### **Search Database Directly**
```bash
sqlite3 ~/Library/Application\ Support/com.wiheads.paste-setapp/db.sqlite \
  "SELECT datetime(ZCREATEDAT + 978307200, 'unixepoch') as date, ZTITLE
   FROM ZITEMENTITY
   ORDER BY ZCREATEDAT DESC
   LIMIT 20;"
```

### **Find Specific Content**
```bash
# After extraction
grep -i "searchterm" paste_history.md
```

---

## 🐛 Troubleshooting

### **"Database locked" error**
**Solution**: Quit Paste.app before extracting
```bash
killall Paste
paste-extract
```

### **Script fails to run**
**Solution**: Check Python 3 is available
```bash
python3 --version  # Should show 3.13.9
```

### **Extraction is slow**
**Solution**: Extract fewer items or be patient
```bash
paste-extract-500  # Instead of paste-extract-all
```

### **Markdown file is too large**
**Solution**: Extract in batches
```bash
# First 1000
python3 ~/extract_paste_history.py --limit 1000 --output batch1.md
# Skip and next 1000 (would need script modification)
```

---

## 💡 Tips & Best Practices

1. **Start Small**: Extract 100 items first, review, then decide
2. **Regular Exports**: Run monthly to archive important clips
3. **Set Retention**: Configure Paste.app to keep 30-90 days only
4. **Search First**: If looking for something specific, search before full export
5. **Archive Important**: Save critical snippets to proper note-taking app
6. **Clean Regularly**: Don't let it grow to 17,000+ items again!

---

## 📊 Maintenance Schedule

### **Weekly**
- Review recent clipboard items
- Save important snippets elsewhere

### **Monthly**
```bash
paste-extract-recent  # Archive last 100
```

### **Quarterly**
```bash
paste-extract-500     # Larger archive
# Clear old Paste.app history
```

### **Annually**
```bash
paste-extract-all     # Complete backup
# Reset Paste.app database
```

---

## 🎯 Quick Command Reference

```bash
# Statistics
paste-stats

# Quick extractions
paste-extract-recent    # 100 items
paste-extract-500       # 500 items
paste-extract-all       # ALL 17,779 items

# Custom extraction
python3 ~/extract_paste_history.py --limit N --output filename.md

# Check file size
du -sh paste_*.md

# Search extracted content
grep -i "keyword" paste_history.md

# Archive
mkdir ~/clipboard_archive
mv paste_*.md ~/clipboard_archive/
```

---

## 📞 Summary

**Your Paste.app database contains:**
- 📊 17,779 total items
- 💾 848MB of data
- 📅 1+ year of clipboard history
- 🎯 85% plain text (15,131 items)

**Recommended action:**
1. ✅ Run `paste-extract-recent` now
2. 📖 Review the markdown file
3. 💾 Save important items elsewhere
4. 🧹 Configure Paste retention to 30-90 days
5. 🗑️ Clear old history

**After extraction, you can safely clean Paste.app and free ~850MB!**

---

**Script created**: 2025-10-25
**Database analyzed**: 17,779 items
**Ready to extract**: ✅

*Don't lose your clipboard history - extract it first!* 📋
