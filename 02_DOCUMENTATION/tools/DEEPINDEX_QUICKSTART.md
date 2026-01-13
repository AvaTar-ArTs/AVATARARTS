# Deep Directory Indexer - Quick Start Guide 🚀

A powerful Python toolkit for analyzing and indexing directory structures with unlimited depth.

## 📦 What You've Got

Three powerful tools for directory analysis:

1. **`deepindex.py`** - Main indexer (analyzes directories)
2. **`deepindex_compare.py`** - Comparison tool (tracks changes)
3. **`deepindex_examples.sh`** - Usage examples

## ⚡ Quick Start

### Basic Usage
```bash
# Index a directory
./deepindex.py ~/Documents

# Index with all features
./deepindex.py ~/Projects \
  --include-hidden \
  --content-analysis \
  --format json,csv,markdown \
  --output my_analysis
```

### Common Patterns

#### 1. Analyze Your AVATARARTS Folder
```bash
./deepindex.py ~/AVATARARTS \
  --output avatararts_analysis \
  --format markdown \
  --content-analysis
```

Result: `avatararts_analysis.md` with complete statistics

#### 2. Find Large Files
```bash
./deepindex.py ~/ \
  --exclude "Library,Applications,.Trash" \
  --format json \
  --output home_scan

# View top 20 largest files
cat home_scan.json | python3 -c '
import json, sys
data = json.load(sys.stdin)
for f in data["statistics"]["largest_files"][:20]:
    print(f"{f[\"size_human\"]:>10} - {f[\"path\"]}")
'
```

#### 3. Code Project Analysis
```bash
./deepindex.py ~/myproject \
  --exclude "node_modules,venv,.git,__pycache__,dist" \
  --content-analysis \
  --format markdown,csv
```

#### 4. Security Audit with Checksums
```bash
./deepindex.py /sensitive/data \
  --include-hidden \
  --checksums \
  --format json,csv \
  --output security_audit
```

#### 5. Compare Before/After Changes
```bash
# Before changes
./deepindex.py ~/project --format json --output before

# ... make changes ...

# After changes
./deepindex.py ~/project --format json --output after

# Compare
./deepindex_compare.py before.json after.json
```

## 📊 Output Formats

### JSON Format
Complete hierarchical structure with full metadata
- Best for: Programmatic access, further processing
- File: `output.json`

### CSV Format
Flat file list for spreadsheet analysis
- Best for: Excel/Sheets, data analysis, sorting
- File: `output.csv`

### Markdown Format
Human-readable report with statistics
- Best for: Documentation, reports, sharing
- File: `output.md`

## 🎯 Real-World Examples

### Daily Workflow

#### Morning: Check project status
```bash
./deepindex.py ~/current-project \
  --exclude ".git,node_modules" \
  --format markdown \
  --output daily/$(date +%Y%m%d)
```

#### Weekly: Archive analysis
```bash
for dir in ~/Documents ~/Pictures ~/Projects; do
  ./deepindex.py "$dir" \
    --output "backups/$(basename $dir)_$(date +%Y%m%d)" \
    --format json,markdown
done
```

#### When needed: Find what changed
```bash
./deepindex_compare.py \
  backups/Documents_20260101.json \
  backups/Documents_20260112.json
```

### Specific Use Cases

#### Find duplicate candidates (by size)
```bash
./deepindex.py /data --format csv --output data_files
awk -F',' 'NR>1 {print $4, $1}' data_files.csv | sort -n | uniq -d -w10
```

#### Track disk usage over time
```bash
# Create snapshots
mkdir -p ~/.dir_snapshots
./deepindex.py ~/ \
  --format json \
  --output ~/.dir_snapshots/home_$(date +%Y%m%d)

# Compare with last week
./deepindex_compare.py \
  ~/.dir_snapshots/home_20260105.json \
  ~/.dir_snapshots/home_20260112.json
```

#### Code metrics dashboard
```bash
./deepindex.py ~/code/myapp \
  --content-analysis \
  --exclude ".git,node_modules,dist" \
  --format csv

# Import into Excel/Sheets for pivot tables
```

## 🔧 Command-Line Options

```
positional arguments:
  path                  Directory to index

optional arguments:
  -h, --help           Show help
  -o, --output         Output path prefix (default: ./directory_index)
  -f, --format         Formats: json,csv,markdown (default: json,markdown)
  --follow-symlinks    Follow symbolic links
  --include-hidden     Include hidden files/directories
  --checksums          Calculate SHA256 checksums (slower)
  --content-analysis   Analyze text file contents
  --exclude            Patterns to exclude (comma-separated)
  --pretty             Pretty print JSON (default: True)
```

## 📈 What Gets Tracked

For each file:
- Full path and filename
- Extension and MIME type
- File size (bytes + human-readable)
- Timestamps (created, modified, accessed)
- Permissions
- Symlink status
- Optional: SHA256 checksum
- Optional: Line/word/char counts (text files)

For the directory:
- Total file and directory counts
- Total size
- File type distribution
- Extension frequency
- Depth distribution
- Top 100 largest files
- Errors encountered

## ⚡ Performance Tips

### Speed Optimization
```bash
# Fast scan (no checksums, no content analysis)
./deepindex.py /large/directory --format json

# Exclude large directories
./deepindex.py ~/ --exclude "node_modules,venv,.git,Library"
```

### Memory Efficiency
- Uses streaming architecture
- Processes files incrementally
- Safe for millions of files
- Can handle multi-TB directories

### Typical Speed
- ~10,000 files/second (basic scan)
- ~1,000 files/second (with checksums)
- AVATARARTS folder: 14,156 files in 1.14s

## 🐍 Python Integration

```python
import json

# Load index
with open('index.json') as f:
    data = json.load(f)

# Analyze
print(f"Total files: {data['statistics']['total_files']:,}")
print(f"Total size: {data['statistics']['total_size_human']}")

# Find Python files
def find_files(node, ext):
    results = []
    if node.get('type') != 'directory':
        if node.get('extension') == ext:
            results.append(node)
    else:
        for child in node.get('children', []):
            results.extend(find_files(child, ext))
    return results

py_files = find_files(data['tree'], '.py')
print(f"Python files: {len(py_files)}")
```

## 🔍 Integration Examples

### With jq (JSON processor)
```bash
# Find all Python files
cat index.json | jq '.tree | .. | select(.extension? == ".py")'

# Get files larger than 1MB
cat index.json | jq '.tree | .. | select(.size? > 1048576)'

# Top 10 by size
cat index.json | jq '.statistics.largest_files[:10]'
```

### With pandas
```python
import pandas as pd

# Load CSV
df = pd.read_csv('directory_index.csv')

# Total size by extension
print(df.groupby('extension')['size'].sum().sort_values(ascending=False))

# Files modified in last week
df['modified'] = pd.to_datetime(df['modified'])
recent = df[df['modified'] > '2026-01-05']
print(f"Recently modified: {len(recent)} files")
```

## 🎓 Learning More

- Full documentation: `deepindex_README.md`
- Examples: `./deepindex_examples.sh`
- Source code: `deepindex.py` (well-commented)

## 💡 Pro Tips

1. **Create aliases** for common patterns:
   ```bash
   alias scan-project='./deepindex.py . --exclude "node_modules,.git,venv"'
   alias scan-full='./deepindex.py . --include-hidden --content-analysis'
   ```

2. **Automate with cron** for scheduled snapshots:
   ```bash
   0 0 * * 0 /path/to/deepindex.py ~/ --output ~/snapshots/$(date +\%Y\%m\%d)
   ```

3. **Use exclusions** to speed up scans:
   ```bash
   --exclude "node_modules,venv,.git,__pycache__,dist,build,Library,Applications"
   ```

4. **Chain with other tools**:
   ```bash
   ./deepindex.py /data --format csv | grep "\.mp4$" | wc -l  # Count MP4 files
   ```

5. **JSON output** is most flexible - use it when unsure

## 🚨 Common Issues

**"ModuleNotFoundError: No module named 'magic'"**
- Optional dependency - works without it
- Install: `pip install python-magic`
- macOS: Also need `brew install libmagic`

**"Permission denied" errors**
- Normal for system directories
- Check the `errors` field in output
- Use exclusions to skip restricted areas

**Slow performance**
- Remove `--checksums` flag
- Remove `--content-analysis` flag
- Add `--exclude` for large dirs

## 📞 Quick Reference Card

```
# Most common command
./deepindex.py <directory> --output <name>

# With exclusions (recommended)
./deepindex.py <directory> \
  --exclude "node_modules,.git,venv" \
  --output <name>

# Full analysis
./deepindex.py <directory> \
  --include-hidden \
  --content-analysis \
  --format json,csv,markdown \
  --output <name>

# Compare two snapshots
./deepindex_compare.py before.json after.json
```

---

**Happy Indexing!** 🎉

For detailed documentation, see: `deepindex_README.md`
