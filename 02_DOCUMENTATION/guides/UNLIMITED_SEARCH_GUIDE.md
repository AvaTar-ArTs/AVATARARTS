# Unlimited Depth Search Tool - Quick Reference Guide

**Tool**: `unlimited_depth_search.py`  
**Purpose**: Search through unlimited folder depth with powerful filters

---

## 🚀 Quick Start

### Basic Usage
```bash
python3 unlimited_depth_search.py [OPTIONS]
```

### Most Common Searches

#### 1. Complete Structure Analysis
```bash
python3 unlimited_depth_search.py --analyze
```
**Output**: Max depth, total files/dirs, top file types, largest files/directories

#### 2. Find Files by Type
```bash
# Find all Python files
python3 unlimited_depth_search.py --type py

# Find multiple types
python3 unlimited_depth_search.py --type py js md json
```

#### 3. Find Files by Name Pattern (Regex)
```bash
# Find all README files
python3 unlimited_depth_search.py --pattern "README"

# Find files with "revenue" in name
python3 unlimited_depth_search.py --pattern ".*revenue.*"

# Case sensitive search
python3 unlimited_depth_search.py --pattern "Revenue" --case-sensitive
```

#### 4. Find Large Files
```bash
# Files larger than 100MB
python3 unlimited_depth_search.py --min-size 100MB

# Files between 10MB and 100MB
python3 unlimited_depth_search.py --min-size 10MB --max-size 100MB

# Files larger than 1GB
python3 unlimited_depth_search.py --min-size 1GB
```

#### 5. Search File Content
```bash
# Find files containing "revenue"
python3 unlimited_depth_search.py --content "revenue"

# Search only in Python and Markdown files
python3 unlimited_depth_search.py --content "revenue" --content-ext py md

# Case sensitive content search
python3 unlimited_depth_search.py --content "Revenue" --case-sensitive
```

#### 6. Find Duplicates
```bash
# Find duplicate file names
python3 unlimited_depth_search.py --duplicates

# Find duplicate file content (by hash)
python3 unlimited_depth_search.py --duplicates-by-content
```

#### 7. Find Empty Directories
```bash
python3 unlimited_depth_search.py --empty-dirs
```

#### 8. Find Large Directories
```bash
# Directories larger than 100MB
python3 unlimited_depth_search.py --large-dirs 100MB

# Directories larger than 1GB
python3 unlimited_depth_search.py --large-dirs 1GB
```

---

## 📊 Export Results

### Export to JSON
```bash
python3 unlimited_depth_search.py --type py --export results.json --format json
```

### Export to CSV
```bash
python3 unlimited_depth_search.py --pattern "README" --export results.csv --format csv
```

### Export Analysis
```bash
python3 unlimited_depth_search.py --analyze --export analysis.json
```

---

## 🎯 Advanced Examples

### Find Large Python Files
```bash
python3 unlimited_depth_search.py --type py --min-size 1MB --export large_py_files.json
```

### Find All Configuration Files
```bash
python3 unlimited_depth_search.py --pattern ".*config.*|.*\.env|.*\.ini" --export configs.json
```

### Find Files Mentioning Revenue in Code
```bash
python3 unlimited_depth_search.py --content "revenue" --content-ext py js --export revenue_files.json
```

### Find Duplicate Large Files (Save Space)
```bash
python3 unlimited_depth_search.py --duplicates-by-content --min-size 10MB --export duplicates.json
```

### Complete Project Analysis
```bash
python3 unlimited_depth_search.py --analyze --export complete_analysis.json
```

---

## 📈 Current Project Stats

Based on analysis of AVATARARTS:

- **Max Depth**: 11 levels
- **Total Files**: 14,218
- **Total Directories**: 2,122
- **Top File Types**:
  - `.md`: 4,834 files (159 MB)
  - `.jpg`: 1,758 files (299 MB)
  - `.py`: 1,316 files (21 MB)
  - `.json`: 805 files (479 MB)
  - `.csv`: 358 files (687 MB)

### Largest Files Found:
1. `ai-sites/disco/mp3.zip` - 683.74 MB
2. `enhanced_vector_search.db` - 278.45 MB (duplicate)
3. `pro-behance-Automation-Sora-epic.html` - 104.62 MB

### Largest Directories:
1. `ai-sites/disco/` - 698.49 MB
2. `ai-sites/heavenlyHands copy/intelligent-organization-system/` - 279.05 MB
3. `ARCHIVES_BACKUPS/2025_databases_archived/` - 278.63 MB

---

## 🔍 Search Options Reference

| Option | Description | Example |
|--------|-------------|---------|
| `--root` | Root directory to search | `--root /path/to/search` |
| `--pattern` | Regex pattern for names | `--pattern "README"` |
| `--type` | File extensions | `--type py js md` |
| `--min-size` | Minimum file size | `--min-size 100MB` |
| `--max-size` | Maximum file size | `--max-size 1GB` |
| `--content` | Search text in files | `--content "revenue"` |
| `--content-ext` | Extensions to search | `--content-ext py md` |
| `--duplicates` | Find duplicate names | `--duplicates` |
| `--duplicates-by-content` | Find duplicate content | `--duplicates-by-content` |
| `--empty-dirs` | Find empty directories | `--empty-dirs` |
| `--large-dirs` | Find large directories | `--large-dirs 100MB` |
| `--analyze` | Complete analysis | `--analyze` |
| `--export` | Export to file | `--export results.json` |
| `--format` | Export format (json/csv) | `--format json` |
| `--limit` | Limit results shown | `--limit 50` |
| `--case-sensitive` | Case sensitive search | `--case-sensitive` |

---

## 💡 Use Cases

### 1. Cleanup & Organization
```bash
# Find large files to archive
python3 unlimited_depth_search.py --min-size 100MB --export large_files.json

# Find empty directories to remove
python3 unlimited_depth_search.py --empty-dirs --export empty_dirs.json

# Find duplicates to remove
python3 unlimited_depth_search.py --duplicates-by-content --export duplicates.json
```

### 2. Project Analysis
```bash
# Complete structure analysis
python3 unlimited_depth_search.py --analyze --export project_analysis.json

# Find all documentation
python3 unlimited_depth_search.py --pattern "README|\.md$" --export docs.json

# Find all scripts
python3 unlimited_depth_search.py --type py sh js --export scripts.json
```

### 3. Content Discovery
```bash
# Find files mentioning specific topics
python3 unlimited_depth_search.py --content "DNA Cold Case" --export dna_files.json

# Find revenue-related files
python3 unlimited_depth_search.py --content "revenue" --content-ext py md csv --export revenue_files.json
```

### 4. Security & Maintenance
```bash
# Find configuration files
python3 unlimited_depth_search.py --pattern ".*\.env|.*config.*|.*secret.*" --export configs.json

# Find large databases
python3 unlimited_depth_search.py --type db sqlite --min-size 10MB --export databases.json
```

---

## ⚡ Performance Tips

1. **Use `--limit`** to reduce output for large result sets
2. **Combine filters** to narrow results (e.g., `--type py --min-size 1MB`)
3. **Export to file** for large searches instead of printing
4. **Use `--content-ext`** to limit content search to specific file types
5. **For very large directories**, consider searching specific subdirectories with `--root`

---

## 🎨 Output Format

### Console Output
- Color-coded results
- Formatted file sizes
- Match information
- Progress indicators

### JSON Export
- Complete file information
- Metadata (size, dates, depth)
- Structured format for processing

### CSV Export
- Tabular format
- Easy to import into spreadsheets
- All file attributes as columns

---

## 🔧 Troubleshooting

### Issue: Search is too slow
**Solution**: 
- Use `--limit` to reduce results
- Add `--type` or `--content-ext` filters
- Search specific subdirectories with `--root`

### Issue: Permission errors
**Solution**: 
- Tool automatically skips inaccessible files
- Check file permissions if needed

### Issue: Too many results
**Solution**: 
- Use more specific filters
- Export to file instead of printing
- Use `--limit` option

---

## 📝 Examples for AVATARARTS

### Find All Revenue-Related Files
```bash
python3 unlimited_depth_search.py --content "revenue" --export revenue_analysis.json
```

### Find All Business System Files
```bash
python3 unlimited_depth_search.py --pattern ".*business.*|.*revenue.*|.*income.*" --export business_files.json
```

### Find Large Duplicate Files (Space Savings)
```bash
python3 unlimited_depth_search.py --duplicates-by-content --min-size 10MB --export large_duplicates.json
```

### Complete Project Inventory
```bash
python3 unlimited_depth_search.py --analyze --export complete_inventory.json
```

---

**Tool Location**: `/Users/steven/AVATARARTS/unlimited_depth_search.py`  
**Status**: ✅ Ready to use  
**Last Updated**: January 3, 2026
