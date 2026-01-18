# 📊 How to Open CSV Files in Google Sheets

## Quick Method 1: Direct Upload (Easiest)

1. Go to https://sheets.google.com
2. Click **Blank** to create a new spreadsheet
3. Go to **File → Import**
4. Click **Upload** tab
5. Drag and drop the CSV file OR click **Select a file from your device**
6. Choose import settings:
   - **Import location:** Create new spreadsheet (or Replace current sheet)
   - **Separator type:** Comma
   - Click **Import data**

## Quick Method 2: Drive Upload

1. Go to https://drive.google.com
2. Click **New → File upload**
3. Select your CSV file from `~/analysis_reports/`
4. After upload, right-click the file
5. Select **Open with → Google Sheets**

## Recommended Files to Open

### Start with these files:

1. **`migration_summary.csv`** - Overview of all categories
2. **`migration_map_all_files.csv`** - Complete migration map (500 files)
3. **`new_directory_structure.csv`** - Directory structure to create

### Then explore category-specific files:

- `migration_map_AI-ML.csv` (310 files - largest)
- `migration_map_Data-Analysis.csv` (85 files)
- `migration_map_Media-Content.csv` (66 files)
- `migration_map_Automation-Scripts.csv` (20 files)
- `migration_map_Portfolio-Work.csv` (11 files)

## File Locations

All CSV files are in:
```
~/analysis_reports/
```

Full path:
```
/Users/steven/analysis_reports/
```

## Tips for Using in Google Sheets

1. **Freeze header row:** View → Freeze → 1 row
2. **Filter data:** Click the filter icon in toolbar
3. **Sort by column:** Click column header → Sort sheet by column
4. **Search:** Ctrl+F (Cmd+F on Mac)
5. **Format numbers:** Format → Number → Automatic

## Column Descriptions (migration_map_all_files.csv)

- **Old Path:** Current file location
- **New Path:** Where file should be moved to
- **Filename:** Just the filename
- **Category:** File category (AI/ML, Data Analysis, etc.)
- **Priority:** Priority score (0-100, higher is more important)
- **Description:** File description
- **Status:** Migration status (currently "Pending")

