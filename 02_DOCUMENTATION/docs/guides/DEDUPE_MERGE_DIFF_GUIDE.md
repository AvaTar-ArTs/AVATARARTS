# Dedupe, Merge, Diff, and Du Tool - Usage Guide

A comprehensive tool for duplicate detection, file merging, directory comparison, and disk usage analysis.

## Quick Start

```bash
# Find duplicates (dry-run)
python3 dedupe_merge_diff_tool.py find --root ~/AVATARARTS --max-size 50

# Remove duplicates (dry-run by default)
python3 dedupe_merge_diff_tool.py dedupe --root ~/AVATARARTS --strategy newest

# Actually remove duplicates
python3 dedupe_merge_diff_tool.py dedupe --root ~/AVATARARTS --strategy newest --execute

# Show disk usage
python3 dedupe_merge_diff_tool.py du --path ~/Downloads --depth 2 --sort size

# Compare two directories
python3 dedupe_merge_diff_tool.py diff --dirs ~/AVATARARTS/ai-sites ~/AVATARARTS/archive

# Compare two files
python3 dedupe_merge_diff_tool.py diff --files file1.txt file2.txt --format unified

# Merge multiple files
python3 dedupe_merge_diff_tool.py merge --files file1.txt file2.txt file3.txt --output merged.txt --strategy concatenate

# Merge directories
python3 dedupe_merge_diff_tool.py merge --dirs dir1 dir2 --output merged_dir --strategy overwrite
```

## Commands

### 1. Find Duplicates (`find`)

Find duplicate files without removing them.

```bash
python3 dedupe_merge_diff_tool.py find [OPTIONS]
```

**Options:**
- `--root DIR` - Root directory to scan (default: current directory)
- `--max-size MB` - Maximum file size to check in MB (default: 50)
- `--report FILE` - Output report file path

**Example:**
```bash
# Find duplicates in AVATARARTS
python3 dedupe_merge_diff_tool.py find --root ~/AVATARARTS --max-size 100 --report duplicates_report.md
```

### 2. Dedupe (`dedupe`)

Find and remove duplicate files.

```bash
python3 dedupe_merge_diff_tool.py dedupe [OPTIONS]
```

**Options:**
- `--root DIR` - Root directory to scan
- `--strategy STRATEGY` - Strategy for choosing which file to keep:
  - `newest` - Keep newest file (default)
  - `oldest` - Keep oldest file
  - `largest` - Keep largest file
  - `smallest` - Keep smallest file
  - `shortest_path` - Keep file with shortest path
- `--max-size MB` - Maximum file size to check (default: 50)
- `--keep-paths PATTERNS` - Path patterns to prefer keeping
- `--execute` - Actually perform deletion (default is dry-run)

**Examples:**
```bash
# Dry-run: see what would be deleted
python3 dedupe_merge_diff_tool.py dedupe --root ~/AVATARARTS --strategy newest

# Actually delete duplicates, keeping newest version
python3 dedupe_merge_diff_tool.py dedupe --root ~/AVATARARTS --strategy newest --execute

# Keep files in specific directories
python3 dedupe_merge_diff_tool.py dedupe --root ~/AVATARARTS --keep-paths "ai-sites" "archive" --execute
```

### 3. Merge (`merge`)

Merge multiple files or directories into one.

```bash
python3 dedupe_merge_diff_tool.py merge [OPTIONS]
```

**Options:**
- `--files FILES` - List of files to merge
- `--dirs DIRS` - List of directories to merge
- `--output PATH` - Output path (required)
- `--strategy STRATEGY` - Merge strategy:
  - `concatenate` - Concatenate files (default for files)
  - `unique_lines` - Merge with unique lines only
  - `overwrite` - Overwrite conflicts (default for dirs)
  - `rename` - Rename conflicting files
- `--execute` - Actually perform merge (default is dry-run)

**Examples:**
```bash
# Merge multiple text files
python3 dedupe_merge_diff_tool.py merge --files file1.txt file2.txt file3.txt --output merged.txt --strategy concatenate

# Merge directories, overwriting conflicts
python3 dedupe_merge_diff_tool.py merge --dirs dir1 dir2 dir3 --output merged_dir --strategy overwrite --execute

# Merge directories, renaming conflicts
python3 dedupe_merge_diff_tool.py merge --dirs dir1 dir2 --output merged_dir --strategy rename --execute
```

### 4. Diff (`diff`)

Compare files or directories.

```bash
python3 dedupe_merge_diff_tool.py diff [OPTIONS]
```

**Options:**
- `--files FILE1 FILE2` - Two files to compare
- `--dirs DIR1 DIR2` - Two directories to compare
- `--format FORMAT` - Output format:
  - `unified` - Unified diff format (default)
  - `context` - Context diff format
  - `html` - HTML diff format
- `--output FILE` - Save diff results to file

**Examples:**
```bash
# Compare two files
python3 dedupe_merge_diff_tool.py diff --files old.py new.py --format unified

# Compare two directories
python3 dedupe_merge_diff_tool.py diff --dirs ~/AVATARARTS/ai-sites ~/AVATARARTS/archive --output diff_report.json

# Generate HTML diff
python3 dedupe_merge_diff_tool.py diff --files file1.html file2.html --format html --output diff.html
```

### 5. Du (`du`)

Show disk usage for directories.

```bash
python3 dedupe_merge_diff_tool.py du [OPTIONS]
```

**Options:**
- `--path PATH` - Path to analyze (default: root directory)
- `--depth DEPTH` - Maximum depth to analyze (default: 3)
- `--sort SORT` - Sort by:
  - `size` - Sort by size (default)
  - `files` - Sort by file count
  - `path` - Sort by path name

**Examples:**
```bash
# Show disk usage for Downloads
python3 dedupe_merge_diff_tool.py du --path ~/Downloads --depth 2 --sort size

# Analyze AVATARARTS directory
python3 dedupe_merge_diff_tool.py du --path ~/AVATARARTS --depth 3 --sort files
```

## Use Cases

### Cleanup Workflow

1. **Find duplicates:**
   ```bash
   python3 dedupe_merge_diff_tool.py find --root ~/AVATARARTS --report duplicates.md
   ```

2. **Review the report** (`duplicates.md`)

3. **Dry-run dedupe:**
   ```bash
   python3 dedupe_merge_diff_tool.py dedupe --root ~/AVATARARTS --strategy newest
   ```

4. **Execute dedupe:**
   ```bash
   python3 dedupe_merge_diff_tool.py dedupe --root ~/AVATARARTS --strategy newest --execute
   ```

### Directory Comparison

Compare two versions of a project:

```bash
# Compare current and backup
python3 dedupe_merge_diff_tool.py diff --dirs ~/AVATARARTS/ai-sites ~/AVATARARTS/archive/ai-sites --output comparison.json
```

### Merge Project Directories

Merge multiple project directories:

```bash
# Merge old projects into archive
python3 dedupe_merge_diff_tool.py merge --dirs project1 project2 project3 --output archive/merged_projects --strategy rename --execute
```

### Disk Usage Analysis

Find what's taking up space:

```bash
# Analyze Downloads directory
python3 dedupe_merge_diff_tool.py du --path ~/Downloads --depth 2 --sort size
```

## Strategies Explained

### Dedupe Strategies

- **newest**: Keep the most recently modified file (good for keeping latest versions)
- **oldest**: Keep the oldest file (good for preserving originals)
- **largest**: Keep the largest file (good for keeping full versions)
- **smallest**: Keep the smallest file (good for saving space)
- **shortest_path**: Keep file with shortest path (good for keeping root-level files)

### Merge Strategies

**For Files:**
- **concatenate**: Simply concatenate all files with separators
- **unique_lines**: Merge files, removing duplicate lines

**For Directories:**
- **overwrite**: Overwrite files in destination with source files
- **rename**: Rename conflicting files with numeric suffixes

## Safety Features

1. **Dry-run by default**: All operations are dry-run unless `--execute` is specified
2. **Detailed logging**: All operations show what will be done
3. **Reports**: Generate detailed reports before making changes
4. **Hash verification**: Uses MD5 hashing for accurate duplicate detection

## Tips

1. **Always start with `find`** to see what duplicates exist
2. **Use dry-run first** to preview changes
3. **Review reports** before executing destructive operations
4. **Use `--keep-paths`** to preserve files in important directories
5. **Set appropriate `--max-size`** to avoid processing huge files

## Output Files

The tool generates:
- **Markdown reports**: Detailed analysis reports
- **JSON files**: Machine-readable diff results
- **CSV files**: Structured data for further analysis

All reports are timestamped and saved in the root directory.
