# Google Sheets CSV Upload Instructions

## Quick Manual Upload (Recommended)

Since automated upload requires OAuth authentication setup, here's the easiest way to upload your CSV:

### Method 1: Direct Import (Easiest)

1. **Open your Google Sheet:**
   ```
   https://docs.google.com/spreadsheets/d/1XIgZXHlu9XNQo6LcT4SGLs0XElMVMravswpeG2DWcOs/edit
   ```

2. **Go to:** `File` → `Import`

3. **Click the "Upload" tab**

4. **Select your CSV file:**
   ```
   /Users/steven/directory_listing.csv
   ```

5. **Choose import location:**
   - **"Replace spreadsheet"** - Replaces all existing data
   - **"Insert new sheet"** - Adds as a new sheet (recommended if you have existing data)

6. **Click "Import data"**

### Method 2: Drag and Drop

1. Open the Google Sheet
2. Simply drag the CSV file (`/Users/steven/directory_listing.csv`) into the browser window
3. Google Sheets will automatically detect it and prompt you to import

---

## Automated Upload Setup (Optional)

If you want to automate future uploads, you can set up OAuth credentials:

### Step 1: Create Google Cloud Project

1. Go to: https://console.cloud.google.com/
2. Create a new project (or select existing)
3. Enable "Google Sheets API"

### Step 2: Create OAuth Credentials

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click "Create Credentials" → "OAuth client ID"
3. Application type: "Desktop app"
4. Download the JSON file
5. Save it as: `~/.config/gspread/credentials.json`

### Step 3: Run Upload Script

```bash
python3 /Users/steven/upload_to_google_sheets.py
```

The first time, it will open a browser for authentication. After that, it will use saved credentials.

---

## CSV File Information

- **File:** `/Users/steven/directory_listing.csv`
- **Size:** 61 MB
- **Rows:** 191,095 (including header)
- **Columns:** 9
  - directory
  - relative_path
  - full_path
  - filename
  - size_bytes
  - size_human
  - file_type
  - modified
  - is_directory

---

## Notes

- Google Sheets has a limit of 10 million cells
- Your CSV has ~1.7 million cells (191,095 rows × 9 columns), so it's well within limits
- Large imports may take a few minutes to process
- The spreadsheet will be automatically formatted with the header row

---

## Troubleshooting

**If import fails:**
- Try splitting the CSV into smaller chunks
- Check that the CSV file is valid (open it in a text editor to verify)
- Make sure you have edit access to the spreadsheet

**If you get permission errors:**
- Make sure the spreadsheet is shared with your Google account
- Check that you have "Editor" permissions
