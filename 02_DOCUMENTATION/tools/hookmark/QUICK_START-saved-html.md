# Quick Start: Using Suno Advanced Extractor with Saved HTML

## ✅ Fixed Issues

1. **Saved HTML Detection** - Automatically detects `file://` URLs
2. **DOM Traversal** - Works on saved pages without fetch/iframe
3. **Lyrics Detection** - Improved selectors for finding lyrics in saved HTML
4. **Syntax Errors** - All optional chaining issues fixed

## 🚀 Usage with new-suno.html

### Step 1: Open the HTML File

```bash
open /Users/steven/Documents/new-suno.html
```

Or drag the file into your browser.

### Step 2: Load Scripts in Console

Open browser console (F12 or Cmd+Option+I) and paste:

```javascript
// First, load utilities
// Copy and paste the entire contents of suno-utils.js here

// Then, load advanced extractor
// Copy and paste the entire contents of suno-advanced.js here
```

### Step 3: Run Extraction

```javascript
await sunoExtractAdvanced()
```

## 📋 What It Does

1. **Detects saved file** - Automatically knows it's a saved HTML
2. **Finds all songs** - Scans for all `/song/` links
3. **Extracts lyrics** - Looks for verse markers `[Verse]`, `[Chorus]`
4. **Saves progress** - Can resume if interrupted
5. **Exports data** - CSV, JSON, and TXT files

## 🎯 Expected Results

Based on your HTML file, you should see:
- Multiple song links detected
- Lyrics extracted from divs with verse markers
- Files saved to Downloads folder:
  - `suno-adv-YYYY-MM-DD-HHMMSS.csv`
  - `suno-adv-YYYY-MM-DD-HHMMSS.json`
  - `suno-adv-YYYY-MM-DD-HHMMSS.txt`

## 🔍 Debugging

If lyrics aren't found:

```javascript
// Check if songs are detected
const links = document.querySelectorAll('a[href*="/song/"]');
console.log(`Found ${links.length} song links`);

// Check for verse markers
const verseDivs = Array.from(document.querySelectorAll('div')).filter(d =>
    d.textContent.includes('[Verse') || d.textContent.includes('[Chorus')
);
console.log(`Found ${verseDivs.length} divs with verse markers`);

// Test on first song
const firstId = 'e59aa634-6a62-4457-806b-ab567a5e1d73';
const songLink = document.querySelector(`a[href*="/song/${firstId}"]`);
console.log('First song link:', songLink);
```

## 📝 Notes

- **Progress saving**: Uses `sessionStorage` - cleared when browser closes
- **Resume capability**: If extraction stops, it will skip already-processed songs
- **Auto-save**: Saves every 10 songs by default
- **Lyrics detection**: Looks for divs with `[Verse]`, `[Chorus]` markers

## 🐛 Troubleshooting

**No songs found?**
- Make sure you're on a page with song links
- Check console for errors

**No lyrics extracted?**
- Lyrics may not be in the saved HTML (loaded dynamically)
- Check if verse markers exist: `document.querySelectorAll('div').forEach(d => { if(d.textContent.includes('[Verse')) console.log(d) })`

**Scripts not loading?**
- Make sure `suno-utils.js` loads first
- Check for JavaScript errors in console

---

**Ready to extract!** 🎵

