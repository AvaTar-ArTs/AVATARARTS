# Quick Start Guide

## Setup (One-time)

```bash
cd ~/advanced_toolkit

# Install dependencies
pip install mutagen Pillow chardet sentence-transformers httpx libcst networkx astroid

# Create env.d for API keys (optional)
mkdir -p ~/env.d
```

## For Suno/AvatarArts Music

### 1. Scan Your Suno Library
```bash
python suno_organizer.py scan
```

This will show you:
- Total tracks found
- Breakdown by genre (cinematic, ambient, electronic, etc.)
- Mood distribution
- Series detection

### 2. Organize (Dry Run First!)
```bash
python suno_organizer.py organize
```

This creates a structure like:
```
SUNO_BY_GENRE/
??? CINEMATIC/
?   ??? dark/
?   ??? uplifting/
?   ??? energetic/
??? AMBIENT/
??? ELECTRONIC/
??? FOLK/

SUNO_BY_SERIES/
??? Beautiful_Mess/
??? Descriptive_Origins/
??? Heroes_Rise/
```

### 3. Execute Organization
```bash
python suno_organizer.py organize --execute
```

### 4. Generate Catalog
```bash
python suno_organizer.py catalog
```

Creates `suno_catalog.json` with:
- Full track listing
- Genre/mood breakdowns
- Series information
- Personalized recommendations

## For General File Management

### Scan Any Directory
```bash
python master_control.py scan ~/Downloads
python master_control.py scan ~/Documents
```

### Find Duplicates
```bash
python master_control.py duplicates
```

### Remove Duplicates
```bash
# Dry run first
python master_control.py remove-duplicates --dry-run

# Then execute
python master_control.py remove-duplicates
```

### Organize Files
```bash
python master_control.py organize ~/Downloads --dry-run
python master_control.py organize ~/Downloads  # execute
```

### View Statistics
```bash
python master_control.py stats
```

### Generate Visual Dashboard
```bash
python visualizer.py ~/dashboard.html
open ~/dashboard.html
```

## Understanding the Organization

### Suno Music Gets Organized By:

1. **Genre** (Primary)
   - Cinematic (epic, orchestral, dramatic)
   - Ambient (atmospheric, meditation, calm)
   - Electronic (synth, EDM, techno)
   - Folk (acoustic, indie, storytelling)
   - Rock (guitar-driven, energetic)
   - Classical (piano, violin, chamber)
   - Jazz (blues, swing, improvisation)
   - And more...

2. **Mood** (Secondary - subdirectories)
   - Dark
   - Uplifting
   - Melancholic
   - Energetic
   - Peaceful
   - Mysterious

3. **Series** (Alternate organization)
   - Multi-part tracks grouped together
   - Different versions of same song
   - Remix/cover variations

## Common Workflows

### Workflow 1: New Suno Downloads
```bash
# 1. Scan to see what's new
python suno_organizer.py scan

# 2. Organize into proper structure
python suno_organizer.py organize --execute

# 3. Update catalog
python suno_organizer.py catalog
```

### Workflow 2: Clean Up Duplicates
```bash
# 1. Scan everything
python master_control.py scan ~/Music

# 2. Find duplicates
python master_control.py duplicates

# 3. Remove them
python master_control.py remove-duplicates --dry-run
python master_control.py remove-duplicates  # if safe
```

### Workflow 3: Monthly Review
```bash
# Generate dashboard
python visualizer.py ~/music_report_$(date +%Y%m).html

# View stats
python master_control.py stats

# Generate catalog
python suno_organizer.py catalog -o ~/suno_catalog_$(date +%Y%m).json
```

## Tips

? **Always dry-run first** - Test with `--dry-run` before executing

? **Backup important files** - Duplicates moved to backup, not deleted

? **Use the catalog** - JSON catalog is great for tracking your music

? **Check the dashboard** - Visual overview of your entire collection

? **Series detection** - Automatically groups related tracks

## Troubleshooting

**"Database locked" error**
```bash
rm ~/.file_intelligence.db
python master_control.py scan ~/Music
```

**"No files found"**
- Check the path: `~/Music/nocTurneMeLoDieS/FINAL_ORGANIZED/YOUR_SUNO_SONGS`
- Verify files exist: `ls ~/Music/nocTurneMeLoDieS/FINAL_ORGANIZED/YOUR_SUNO_SONGS`

**Wrong classifications**
- The system learns from filenames and metadata
- Edit metadata with tools like `mutagen` or Music apps
- Rerun scan after metadata updates

## What Gets Detected

The system automatically detects:
- ? Suno/AvatarArts tracks (by artist/album metadata)
- ? Genre from title, metadata, and filename patterns
- ? Mood from descriptive words
- ? Series (version numbers, parts, variations)
- ? Audio quality (bitrate, format, duration)
- ? Related files (lyrics, transcripts in ~/Documents)
- ? Duplicates (exact hash matches)

## Next Steps

1. Run a scan: `python suno_organizer.py scan`
2. Review what it found
3. Try organization with dry-run
4. Execute when ready
5. Generate catalog for tracking

Happy organizing! ??
