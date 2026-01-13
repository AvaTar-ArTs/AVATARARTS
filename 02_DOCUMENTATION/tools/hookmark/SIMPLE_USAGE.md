# 🎵 Simple Usage - 3 Steps

## Step 1: Open Your Suno HTML File

```bash
open /Users/steven/Documents/new-suno.html
# OR
open /Users/steven/Documents/suno-new.html
```

## Step 2: Open Browser Console

Press **F12** (or **Cmd+Option+I** on Mac)

## Step 3: Copy & Paste This Code

Copy the ENTIRE code block below and paste into console, then press Enter:

```javascript
// ===== COPY EVERYTHING BELOW THIS LINE =====

// Load Suno Utilities
(function() {
    function clean(text) {
        if (!text) return '';
        return String(text).replace(/"/g, '""').replace(/\r?\n|\r/g, ' ').trim();
    }
    function downloadFile(content, filename, type = 'text/plain') {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log(`✅ Saved: ${filename}`);
    }
    function toCSV(rows, headers) {
        const lines = [];
        lines.push(headers.join(','));
        for (const r of rows) {
            const line = headers.map(h => {
                const v = String(r[h] || '').replace(/"/g, '""');
                return (v.includes(',') || v.includes('\n')) ? `"${v}"` : v;
            }).join(',');
            lines.push(line);
        }
        return lines.join('\n');
    }
    const wait = ms => new Promise(res => setTimeout(res, ms));
    window.sunoUtils = { clean, downloadFile, toCSV, wait };
    console.log('✅ Suno utilities loaded');
})();

// Now load the advanced extractor (copy contents of suno-advanced.js here)
// OR just run this to load from file:
(async function() {
    const script1 = document.createElement('script');
    script1.src = 'file:///Users/steven/Documents/Hookmark/suno-advanced.js';
    document.head.appendChild(script1);
    await new Promise(r => setTimeout(r, 1000));
    console.log('✅ Ready! Run: await sunoExtractAdvanced()');
})();

// ===== COPY EVERYTHING ABOVE THIS LINE =====
```

**Then run:**
```javascript
await sunoExtractAdvanced()
```

---

## ⚡ Even Simpler: Direct File Method

Since you have the files, the easiest is to:

1. **Open your Suno HTML file** in browser
2. **Open console** (F12)
3. **Drag and drop** `suno-utils.js` into the console (browser will execute it)
4. **Drag and drop** `suno-advanced.js` into the console
5. **Run:** `await sunoExtractAdvanced()`

---

## 📋 What You'll Get

After extraction completes, check your **Downloads folder** for:

- `suno-adv-YYYY-MM-DD-HHMMSS.csv` - Spreadsheet
- `suno-adv-YYYY-MM-DD-HHMMSS.json` - JSON data
- `suno-adv-YYYY-MM-DD-HHMMSS.txt` - Summary

Plus in console: `window.extractedSongs` array with all data!


