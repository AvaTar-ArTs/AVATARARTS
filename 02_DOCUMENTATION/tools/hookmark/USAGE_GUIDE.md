# 🎵 Suno Extractor - Usage Guide

## Quick Start (Easiest Method)

### Option 1: Use the HTML Loader (Recommended)

1. **Open the loader:**
   ```bash
   open /Users/steven/Documents/Hookmark/suno-extractor-loader.html
   ```

2. **Click "Load Scripts"** - This loads both `suno-utils.js` and `suno-advanced.js`

3. **Open your Suno HTML file in another tab:**
   ```bash
   open /Users/steven/Documents/new-suno.html
   # OR
   open /Users/steven/Documents/suno-new.html
   ```

4. **Open browser console** (F12 or Cmd+Option+I)

5. **Run extraction:**
   ```javascript
   await sunoExtractAdvanced()
   ```

---

### Option 2: Manual Console Method

1. **Open your Suno HTML file:**
   ```bash
   open /Users/steven/Documents/new-suno.html
   ```

2. **Open browser console** (F12 or Cmd+Option+I)

3. **Load utilities first:**
   ```javascript
   // Copy and paste the ENTIRE contents of:
   // /Users/steven/Documents/Hookmark/suno-utils.js
   ```

4. **Load advanced extractor:**
   ```javascript
   // Copy and paste the ENTIRE contents of:
   // /Users/steven/Documents/Hookmark/suno-advanced.js
   ```

5. **Run extraction:**
   ```javascript
   await sunoExtractAdvanced()
   ```

---

### Option 3: Direct Script Injection (Advanced)

Create a bookmarklet or use this in console:

```javascript
// Load scripts from local files
async function loadSunoExtractor() {
    const basePath = '/Users/steven/Documents/Hookmark/';

    // Load utils
    const utilsScript = document.createElement('script');
    utilsScript.src = `file://${basePath}suno-utils.js`;
    document.head.appendChild(utilsScript);

    await new Promise(resolve => setTimeout(resolve, 500));

    // Load advanced
    const advancedScript = document.createElement('script');
    advancedScript.src = `file://${basePath}suno-advanced.js`;
    document.head.appendChild(advancedScript);

    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('✅ Scripts loaded! Run: await sunoExtractAdvanced()');
}

loadSunoExtractor();
```

**Note:** This method may have CORS issues with `file://` URLs. Use Option 1 or 2 instead.

---

## What Happens During Extraction

1. **Detection** - Automatically detects if it's a saved HTML file
2. **Song Discovery** - Finds all song links (`/song/[id]`)
3. **Lyrics Extraction** - Searches for lyrics with verse markers
4. **Progress Saving** - Saves progress every 10 songs (can resume)
5. **Export** - Creates 3 files in Downloads:
   - `suno-adv-YYYY-MM-DD-HHMMSS.csv` - Spreadsheet format
   - `suno-adv-YYYY-MM-DD-HHMMSS.json` - JSON data
   - `suno-adv-YYYY-MM-DD-HHMMSS.txt` - Human-readable summary

---

## Console Commands

```javascript
// Start extraction
await sunoExtractAdvanced()

// Check progress
const progress = JSON.parse(sessionStorage.getItem('suno_extractor_v2_progress') || '{}');
console.log('Processed:', Object.keys(progress.processed || {}).length);

// View extracted songs
console.log(window.extractedSongs);

// Clear progress (start fresh)
sessionStorage.removeItem('suno_extractor_v2_progress');

// Test on single song
const testId = 'e59aa634-6a62-4457-806b-ab567a5e1d73';
const testLink = document.querySelector(`a[href*="/song/${testId}"]`);
console.log('Test link:', testLink);
```

---

## Troubleshooting

### Scripts Not Loading?

**Check:**
- Are the files in the same directory?
- Open browser console and check for errors
- Make sure `suno-utils.js` loads before `suno-advanced.js`

### No Songs Found?

**Check:**
```javascript
const links = document.querySelectorAll('a[href*="/song/"]');
console.log(`Found ${links.length} song links`);
```

### No Lyrics Extracted?

**Check for verse markers:**
```javascript
const verseDivs = Array.from(document.querySelectorAll('div')).filter(d =>
    d.textContent.includes('[Verse') || d.textContent.includes('[Chorus')
);
console.log(`Found ${verseDivs.length} divs with verse markers`);
```

### Extraction Stops?

- Check console for errors
- Progress is saved - you can resume by running again
- Check `sessionStorage` for saved progress

---

## File Locations

```
/Users/steven/Documents/Hookmark/
├── suno-utils.js              # Shared utilities (load first)
├── suno-advanced.js           # Advanced extractor (load second)
├── suno-advanced-FIXED.js     # Alternative version
├── suno-extractor-loader.html # Auto-loader (easiest method)
└── USAGE_GUIDE.md            # This file

/Users/steven/Documents/
├── new-suno.html              # Your saved Suno page
└── suno-new.html              # Your other saved Suno page
```

---

## Tips

1. **Use the loader HTML** - Easiest way to load scripts
2. **Check console** - All status messages appear there
3. **Progress saves** - Can stop and resume extraction
4. **Multiple files** - Run extraction on each HTML file separately
5. **Export location** - Files save to your Downloads folder

---

## Expected Output

After extraction, you'll see:

```
🎉 Extraction done. Inspect window.extractedSongs and check your Downloads folder.

🎵 ADVANCED EXTRACTION COMPLETE!
======================================================================
 - Total: 25 songs
 - Files in ~/Downloads/:
    • suno-adv-2024-12-26-123456.csv
    • suno-adv-2024-12-26-123456.json
    • suno-adv-2024-12-26-123456.txt
```

---

**Ready to extract!** 🚀


