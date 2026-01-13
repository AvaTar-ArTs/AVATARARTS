# Merge, Diff, and Dedupe Tool - Quick Guide

**Tool**: `merge_diff_dedupe.py`  
**Purpose**: Unified tool for merging files, comparing differences, and removing duplicates

---

## 🚀 Quick Start

### Basic Usage
```bash
python3 merge_diff_dedupe.py [COMMAND] [OPTIONS]
```

---

## 📊 Commands

### 1. Summary - View Duplicates
```bash
python3 merge_diff_dedupe.py summary
```
**Shows:**
- Count of duplicates found
- Total size that can be recovered
- Top duplicates by size

**Current Status:**
- **725 duplicates** found
- **713.74 MB (0.70 GB)** can be recovered

---

### 2. Diff - Compare Files/Directories

#### Compare Two Files
```bash
python3 merge_diff_dedupe.py diff --files file1.py file2.py
```

#### Compare Two Directories
```bash
python3 merge_diff_dedupe.py diff --dirs dir1/ dir2/
```

#### Save Diff to File
```bash
python3 merge_diff_dedupe.py diff --files file1.py file2.py --output diff.txt
```

**Output:**
- Shows if files are identical
- Shows differences (unified diff format)
- Highlights additions (green) and deletions (red)

---

### 3. Merge - Combine Files

#### Merge Multiple Files
```bash
python3 merge_diff_dedupe.py merge --files file1.txt file2.txt file3.txt --output merged.txt
```

#### Merge Strategies

**Concatenate** (default):
- Combines all files with separators
- Preserves all content

```bash
python3 merge_diff_dedupe.py merge --files file1.txt file2.txt --output merged.txt --strategy concatenate
```

**Unique Lines**:
- Removes duplicate lines
- Keeps only unique content

```bash
python3 merge_diff_dedupe.py merge --files file1.txt file2.txt --output merged.txt --strategy unique_lines
```

---

### 4. Dedupe - Remove Duplicates

#### Dry Run (Preview)
```bash
python3 merge_diff_dedupe.py dedupe
```
Shows what would be removed without actually deleting.

#### Execute Removal
```bash
python3 merge_diff_dedupe.py dedupe --execute
```
**⚠️ WARNING**: Actually removes duplicate files!

#### Remove Only Large Duplicates
```bash
# Remove duplicates larger than 10MB
python3 merge_diff_dedupe.py dedupe --min-size 10 --execute

# Remove duplicates larger than 100MB
python3 merge_diff_dedupe.py dedupe --min-size 100 --execute
```

#### Limit Number of Removals
```bash
# Remove only first 10 duplicates
python3 merge_diff_dedupe.py dedupe --limit 10 --execute
```

---

## 📈 Current Project Status

Based on `dedupe_mapping.csv`:

- **725 duplicate items** identified
- **713.74 MB (0.70 GB)** recoverable space
- **Top duplicates:**
  1. `avatararts.org` projects (18.77 MB each)
  2. `CODE_PROJECTS` duplicates (13.02 MB)
  3. Music files in `disco/mp3/` (12.41 MB)
  4. Analysis visualizations (9.23 MB)

---

## 💡 Common Use Cases

### 1. Preview What Will Be Removed
```bash
python3 merge_diff_dedupe.py summary
python3 merge_diff_dedupe.py dedupe  # Dry run
```

### 2. Remove Large Duplicates Only
```bash
# Preview
python3 merge_diff_dedupe.py dedupe --min-size 10

# Execute
python3 merge_diff_dedupe.py dedupe --min-size 10 --execute
```

### 3. Compare Duplicate Directories Before Removing
```bash
# Compare two similar directories
python3 merge_diff_dedupe.py diff --dirs ai-sites/heavenlyHands heavenlyHands/

# Compare two files
python3 merge_diff_dedupe.py diff --files file1.py file2.py
```

### 4. Merge Similar Files
```bash
# Merge multiple README files
python3 merge_diff_dedupe.py merge --files README1.md README2.md README3.md --output README_merged.md
```

---

## ⚠️ Safety Features

1. **Dry Run by Default** - No files deleted unless `--execute` is used
2. **Confirmation Required** - Asks for confirmation before deleting
3. **Size Reporting** - Shows exactly how much space will be saved
4. **Error Handling** - Continues even if some files can't be removed

---

## 🔍 Examples

### Example 1: Safe Preview
```bash
# See what duplicates exist
python3 merge_diff_dedupe.py summary

# Preview what would be removed
python3 merge_diff_dedupe.py dedupe
```

### Example 2: Remove Large Duplicates
```bash
# Remove duplicates > 50MB
python3 merge_diff_dedupe.py dedupe --min-size 50 --execute
```

### Example 3: Compare Before Merging
```bash
# Compare two similar files
python3 merge_diff_dedupe.py diff --files file1.py file2.py

# If they're similar, merge them
python3 merge_diff_dedupe.py merge --files file1.py file2.py --output merged.py
```

### Example 4: Directory Comparison
```bash
# Compare two directories
python3 merge_diff_dedupe.py diff --dirs dir1/ dir2/ --output comparison.json
```

---

## 📝 Options Reference

| Option | Description | Example |
|--------|-------------|---------|
| `--root` | Root directory | `--root /path/to/project` |
| `--mapping` | Dedupe mapping file | `--mapping custom_mapping.csv` |
| `--execute` | Actually perform operations | `--execute` |
| `--min-size` | Minimum size in MB | `--min-size 10` |
| `--limit` | Limit number of items | `--limit 50` |
| `--output` | Output file | `--output result.txt` |
| `--strategy` | Merge strategy | `--strategy unique_lines` |

---

## 🎯 Recommended Workflow

### Step 1: Analyze
```bash
python3 merge_diff_dedupe.py summary
```

### Step 2: Preview
```bash
python3 merge_diff_dedupe.py dedupe
```

### Step 3: Compare Important Files
```bash
# Compare any files you're unsure about
python3 merge_diff_dedupe.py diff --files path1/file.py path2/file.py
```

### Step 4: Execute (if satisfied)
```bash
# Start with large files only
python3 merge_diff_dedupe.py dedupe --min-size 50 --execute

# Then smaller files
python3 merge_diff_dedupe.py dedupe --min-size 10 --execute
```

---

## 📊 Current Recommendations

Based on analysis:

1. **Start with large duplicates** (>50MB):
   ```bash
   python3 merge_diff_dedupe.py dedupe --min-size 50 --execute
   ```
   **Potential savings**: ~200MB

2. **Then medium duplicates** (>10MB):
   ```bash
   python3 merge_diff_dedupe.py dedupe --min-size 10 --execute
   ```
   **Potential savings**: ~300MB

3. **Finally small duplicates**:
   ```bash
   python3 merge_diff_dedupe.py dedupe --execute
   ```
   **Potential savings**: ~200MB

**Total potential**: **~700MB (0.70 GB)**

---

## 🔧 Troubleshooting

### Issue: "dedupe_mapping.csv not found"
**Solution**: Run `dedupe_analysis.py` first to generate the mapping file

### Issue: Permission errors
**Solution**: Check file permissions. Tool will skip files it can't access.

### Issue: Too many results
**Solution**: Use `--min-size` to filter, or `--limit` to process fewer items.

---

**Tool Location**: `/Users/steven/AVATARARTS/merge_diff_dedupe.py`  
**Status**: ✅ Ready to use  
**Last Updated**: January 3, 2026
