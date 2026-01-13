# Advanced File Management Toolkit

A comprehensive Python toolkit for intelligent file management, organization, and analysis.

## Features

- **File Intelligence**: Deep analysis of files with metadata extraction, hashing, and relationship detection
- **Smart Organization**: ML-based categorization and intelligent file organization
- **Duplicate Detection**: Find and remove duplicate files efficiently
- **Content Grouping**: Automatically group related files together
- **AvatarArts Organizer**: Specialized organizer for YOUR_SUNO_SONGS music collection
- **Visualizations**: Generate interactive HTML dashboards
- **API Integration**: Uses ~/env.d for API keys and configuration

## Installation

```bash
# Install dependencies
pip install mutagen Pillow chardet sentence-transformers httpx libcst networkx astroid

# Set up configuration
mkdir -p ~/env.d
```

## Configuration

Create API key files in `~/env.d/`:

```bash
# ~/env.d/music.env
SPOTIFY_API_KEY=your_key_here
ACOUSTID_API_KEY=your_key_here
MUSICBRAINZ_TOKEN=your_token_here

# ~/env.d/config.json
{
  "music_base_dir": "/Users/steven/Music/nocTurneMeLoDieS/FINAL_ORGANIZED",
  "auto_backup": true,
  "organize_on_scan": false
}
```

## Usage

### Master Control Center

```bash
# Scan a directory
python master_control.py scan ~/Music

# Show statistics
python master_control.py stats

# Find duplicates
python master_control.py duplicates

# Remove duplicates (dry run first!)
python master_control.py remove-duplicates --dry-run
python master_control.py remove-duplicates  # actually remove

# Organize files
python master_control.py organize ~/Downloads --dry-run
python master_control.py organize ~/Downloads  # execute

# Analyze a specific file
python master_control.py analyze ~/Music/song.mp3

# Find related files
python master_control.py related ~/Documents/report.pdf

# Export report
python master_control.py export -o report.json
```

### AvatarArts Music Organizer

```bash
# Scan YOUR_SUNO_SONGS
python avatararts_organizer.py scan

# Organize (dry run)
python avatararts_organizer.py organize

# Execute organization
python avatararts_organizer.py organize --execute

# Create collection index
python avatararts_organizer.py index
```

### Generate Dashboard

```bash
python visualizer.py ~/dashboard.html
open ~/dashboard.html
```

## Architecture

```
advanced_toolkit/
??? file_intelligence.py     # Core file analysis and fingerprinting
??? smart_organizer.py        # Intelligent organization rules
??? master_control.py         # Main CLI interface
??? avatararts_organizer.py   # Specialized music organizer
??? config_manager.py         # Configuration and API keys
??? visualizer.py             # HTML dashboard generation
??? README.md                 # This file
```

## File Organization Structure

The toolkit organizes files into a logical structure:

```
~/Music/nocTurneMeLoDieS/FINAL_ORGANIZED/
??? BY_ARTIST/
?   ??? avatararts/
?   ?   ??? cinematic/
?   ?   ??? ambient/
?   ?   ??? electronic/
?   ?   ??? folk/
?   ??? [other artists]/
??? BY_ALBUM/
??? AUDIOBOOKS/
??? UNCATEGORIZED/
```

## Database

The toolkit maintains a SQLite database at `~/.file_intelligence.db` containing:

- File fingerprints (MD5, SHA256)
- Metadata (audio tags, image EXIF, etc.)
- Relationships between files
- Content embeddings for similarity search
- Tags and classifications

## How It Works

1. **Scanning**: Recursively walks directories, analyzing each file
2. **Fingerprinting**: Calculates hashes, extracts metadata, detects file type
3. **Intelligence**: Uses heuristics and ML to classify and categorize
4. **Organization**: Applies rules to determine optimal file placement
5. **Execution**: Safely moves files with backup options

## Advanced Features

### Duplicate Detection
- Finds exact duplicates using SHA256 hashing
- Intelligently chooses best version to keep
- Considers file location, naming, and modification time

### Content Analysis
- Extracts audio metadata (title, artist, album, duration)
- Analyzes images (dimensions, format, EXIF)
- Detects programming languages
- Identifies file relationships

### Smart Grouping
- Groups related files (audio + lyrics, images + metadata)
- Detects multi-part series
- Finds different versions of same content

## Examples

### Example 1: Organize YOUR_SUNO_SONGS

```python
from avatararts_organizer import AvatarArtsOrganizer

organizer = AvatarArtsOrganizer()
organizer.organize_avatararts_collection(dry_run=False)
organizer.create_collection_index()
```

### Example 2: Find and Remove Duplicates

```python
from master_control import MasterControl

control = MasterControl()
control.find_duplicates()
control.remove_duplicates(dry_run=False)
```

### Example 3: Custom Organization Rules

```python
from smart_organizer import OrganizationRule, SmartOrganizer

# Add custom rule
rule = OrganizationRule(
    name="my_photos",
    condition=lambda fp: fp.mime_type.startswith('image/') and '2024' in fp.path.name,
    target_pattern="Photos/2024/{month}",
    priority=1
)

organizer = SmartOrganizer(analyzer, base_dir)
organizer.rules.append(rule)
```

## Safety Features

- **Dry Run Mode**: Test organization without moving files
- **Backup System**: Automatically backs up before major operations
- **Collision Detection**: Prevents overwriting existing files
- **Undo Capability**: Removed duplicates moved to backup, not deleted

## Performance

- Uses SQLite for fast queries
- Caches file hashes to avoid recalculation
- Batch processing for large directories
- Progress indicators for long operations

## Troubleshooting

### Database locked error
```bash
# Close all instances and rebuild
rm ~/.file_intelligence.db
python master_control.py scan ~/Music
```

### Missing dependencies
```bash
pip install -r requirements.txt
```

### API key issues
```bash
# Check loaded keys
python -c "from config_manager import get_config; print(get_config().list_available_services())"
```

## Future Enhancements

- [ ] Cloud storage integration
- [ ] Machine learning for better categorization
- [ ] Playlist generation
- [ ] Audio fingerprinting (AcoustID)
- [ ] Face detection in images
- [ ] OCR for documents
- [ ] Web interface

## Contributing

Feel free to extend and customize for your needs!

## License

MIT License - Use freely
