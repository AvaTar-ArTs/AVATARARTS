# Deep Directory Indexer 🗂️

A powerful Python tool for analyzing and indexing directory structures with unlimited depth. Generates comprehensive reports in multiple formats with detailed statistics and metadata.

## Features

### Core Capabilities
- **Unlimited Depth Traversal** - Recursively scans directories to any depth
- **Comprehensive Metadata** - Collects size, timestamps, permissions, MIME types
- **Multiple Output Formats** - JSON, CSV, and Markdown reports
- **Content Analysis** - Optional text file analysis (line/word counts)
- **Checksum Calculation** - Optional SHA256 hash generation
- **Smart Statistics** - File type distribution, largest files, depth analysis

### Safety Features
- Symlink handling (optional following)
- Hidden file filtering
- Pattern-based exclusions
- Permission error handling
- Memory-efficient streaming

## Installation

### Requirements
```bash
pip install python-magic
```

**Note:** On macOS, you may also need:
```bash
brew install libmagic
```

## Usage

### Basic Usage
```bash
# Index current directory
./deepindex.py .

# Index specific directory
./deepindex.py /path/to/directory

# Output to specific location
./deepindex.py ~/Documents --output ~/Desktop/docs_index
```

### Advanced Options

```bash
# Include hidden files and calculate checksums
./deepindex.py ~/Projects --include-hidden --checksums

# Exclude common directories
./deepindex.py . --exclude "node_modules,.git,venv,__pycache__"

# Content analysis for text files
./deepindex.py ~/code --content-analysis

# Follow symlinks
./deepindex.py /data --follow-symlinks

# Export in all formats
./deepindex.py . --format json,csv,markdown
```

### Complete Example
```bash
./deepindex.py ~/Documents \
  --output ~/Desktop/documents_index \
  --format json,csv,markdown \
  --include-hidden \
  --content-analysis \
  --exclude ".DS_Store,Thumbs.db"
```

## Output Formats

### JSON Format
Complete hierarchical structure with full metadata:
```json
{
  "metadata": {
    "root_path": "/path/to/directory",
    "indexed_at": "2026-01-12T10:30:00",
    "duration_seconds": 2.45
  },
  "statistics": {
    "total_files": 1234,
    "total_size_bytes": 52428800,
    "file_types": {...},
    "largest_files": [...]
  },
  "tree": {...}
}
```

### CSV Format
Flat file list for spreadsheet analysis:
```csv
path,name,extension,size,depth,created,modified,mime_type
/path/file.txt,file.txt,.txt,1024,2,2026-01-12T10:00:00,...
```

### Markdown Format
Human-readable report with statistics and tree visualization:
```markdown
# Directory Index Report

**Path:** `/path/to/directory`
**Generated:** 2026-01-12T10:30:00

## Statistics
- Total Files: 1,234
- Total Size: 50.00 MB
- Max Depth: 8

## File Types Distribution
- text/plain: 450
- image/jpeg: 230
...
```

## Statistics Collected

### File-Level Metadata
- Full path and filename
- Extension and MIME type
- File size (bytes + human-readable)
- Timestamps (created, modified, accessed)
- Permissions (octal format)
- Symlink status
- Optional: SHA256 checksum
- Optional: Content statistics (text files)

### Directory Statistics
- Total file and directory counts
- Total size aggregation
- File type distribution
- Extension frequency
- Depth distribution histogram
- Top 100 largest files
- Error tracking

## Use Cases

### Development Projects
```bash
# Analyze codebase structure
./deepindex.py ~/myproject \
  --exclude "node_modules,dist,build,.git" \
  --content-analysis \
  --output project_analysis
```

### Data Organization
```bash
# Catalog large data directories
./deepindex.py /data/archives \
  --checksums \
  --format json,csv
```

### Security Audits
```bash
# Find all files with full metadata
./deepindex.py /sensitive/data \
  --include-hidden \
  --checksums \
  --follow-symlinks
```

### Backup Planning
```bash
# Analyze storage usage
./deepindex.py ~ \
  --exclude ".Trash,Library,Applications" \
  --format markdown
```

## Performance Considerations

### Speed Optimization
- **Disable checksums** for faster indexing (enabled with `--checksums`)
- **Disable content analysis** unless needed (enabled with `--content-analysis`)
- **Use exclusions** to skip large irrelevant directories

### Memory Usage
- Streaming architecture minimizes memory footprint
- Tree structure held in memory incrementally
- Safe for directories with millions of files

### Typical Performance
- ~10,000 files/second (without checksums)
- ~1,000 files/second (with checksums)
- Depends on disk I/O, file sizes, and options

## Error Handling

The indexer gracefully handles:
- Permission denied errors
- Broken symlinks
- Special files (devices, sockets)
- Encoding issues
- Filesystem errors

All errors are logged in the output under the `errors` field.

## Examples with Real Directories

### Index your Documents folder
```bash
./deepindex.py ~/Documents \
  --output ~/Desktop/documents_index \
  --format markdown \
  --exclude ".DS_Store"
```

### Analyze a code repository
```bash
./deepindex.py ~/projects/myapp \
  --exclude "node_modules,venv,.git,__pycache__,dist,build" \
  --content-analysis \
  --format json,markdown
```

### Find duplicate files by size
```bash
# Generate CSV, then use spreadsheet to sort by size
./deepindex.py /data --format csv --output data_files
```

## Command-Line Reference

```
usage: deepindex.py [-h] [-o OUTPUT] [-f FORMAT] [--follow-symlinks]
                    [--include-hidden] [--checksums] [--content-analysis]
                    [--exclude EXCLUDE] [--pretty]
                    path

Arguments:
  path                  Directory path to index

Options:
  -h, --help           Show help message
  -o, --output         Output path prefix (default: ./directory_index)
  -f, --format         Output formats: json,csv,markdown (default: json,markdown)
  --follow-symlinks    Follow symbolic links
  --include-hidden     Include hidden files and directories
  --checksums          Calculate SHA256 checksums (slower)
  --content-analysis   Analyze text file contents
  --exclude            Comma-separated patterns to exclude
  --pretty             Pretty print JSON (default: True)
```

## Integration Examples

### Use with jq (JSON processing)
```bash
# Find all Python files
./deepindex.py ~/code --format json -o index
cat index.json | jq '.tree | .. | select(.extension? == ".py")'

# Get top 10 largest files
cat index.json | jq '.statistics.largest_files[:10]'
```

### Import CSV into Python
```python
import pandas as pd

df = pd.read_csv('directory_index.csv')
print(f"Total size: {df['size'].sum() / 1e9:.2f} GB")
print(df.groupby('extension')['size'].sum().sort_values(ascending=False))
```

### Automation Script
```bash
#!/bin/bash
# Weekly backup analysis

for dir in ~/Documents ~/Pictures ~/Projects; do
    ./deepindex.py "$dir" \
        --output "~/backups/$(basename $dir)_$(date +%Y%m%d)" \
        --format json,markdown \
        --exclude ".DS_Store,.Trash"
done
```

## Troubleshooting

### ImportError: No module named 'magic'
```bash
pip install python-magic
# macOS users:
brew install libmagic
```

### Permission Denied Errors
- Normal for system directories
- Check output errors section
- Use `sudo` if analyzing system paths (not recommended)

### Memory Issues
- Exclude large directories with `--exclude`
- Process subdirectories separately
- Disable content analysis

### Slow Performance
- Remove `--checksums` flag
- Remove `--content-analysis` flag
- Use `--exclude` for node_modules, venv, etc.

## License

MIT License - Free to use and modify

## Contributing

This tool is designed to be extended. Key extension points:
- Add new export formats in `IndexExporter`
- Add new analysis types in `analyze_file()`
- Add new statistics in `DirectoryIndexer.stats`

---

**Happy Indexing!** 🚀
