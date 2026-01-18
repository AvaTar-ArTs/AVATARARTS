# Creative Asset Orchestrator Skill

## Overview
A comprehensive skill for managing, analyzing, and transforming creative multimedia assets across pictures, videos, music, and AI-generated content. Integrates with Python workflows and provides intelligent organization, metadata analysis, and batch processing capabilities.

## Core Capabilities

### 1. Intelligent Asset Discovery
- Recursively scan multimedia directories (Pictures, Movies, Music)
- Extract metadata (EXIF, ID3 tags, video properties)
- Build searchable asset databases
- Detect duplicates and similar content

### 2. AI Art Integration
- Interface with web-based AI art tools (Disco Diffusion, DALL-E)
- Download and organize AI-generated images
- Track prompts and generation parameters
- Build prompt libraries and style guides

### 3. Python Workflow Automation
- Generate Python scripts for batch processing
- Image manipulation (resize, convert, filter)
- Video editing automation (FFmpeg)
- Audio processing (format conversion, metadata)

### 4. Smart Organization
- Auto-categorize by content type, date, or AI-detected themes
- Create directory structures based on projects
- Generate contact sheets and galleries
- Build markdown documentation of assets

## When to Use This Skill

Use this skill when:
- "Organize my creative files"
- "Find all images from [date/event]"
- "Batch process photos/videos"
- "Download and organize AI art"
- "Create a gallery of my work"
- "Generate Python script to..."
- "Analyze my media collection"
- "Find duplicates in my files"

## Tool Selection Guide

### For Asset Discovery
```python
# Use start_process with Python for complex analysis
start_process("python3 -i", timeout_ms=5000)
interact_with_process(pid, """
import os
from PIL import Image
from PIL.ExifTags import TAGS
# Image metadata extraction
""")
```

### For Directory Operations
```python
# Use list_directory for exploration
list_directory(path="/Users/steven/Pictures", depth=2)

# Use search for finding specific files
start_search(
    path="/Users/steven/Pictures",
    pattern="*.jpg",
    searchType="files"
)
```

### For Batch Processing
```python
# Use read_multiple_files for metadata gathering
read_multiple_files(paths=[...image_paths])

# Use write_file for generating scripts
write_file(
    path="/Users/steven/Documents/process_images.py",
    content=generated_script
)
```

## Example Workflows

### Workflow 1: Smart Photo Organization
```
1. list_directory(/Users/steven/Pictures, depth=2)
2. start_search(pattern="*.jpg|*.png", searchType="files")
3. start_process("python3 -i")
4. Extract EXIF data using PIL
5. Group by date/camera
6. create_directory for new structure
7. move_file to organize
```

### Workflow 2: AI Art Gallery Builder
```
1. Read web pages from avatararts.org
2. Extract image URLs
3. Download using Python requests
4. Analyze with PIL for dimensions/format
5. Generate HTML gallery
6. Create markdown catalog with prompts
```

### Workflow 3: Video Asset Management
```
1. list_directory(/Users/steven/Movies)
2. start_process with ffprobe
3. Extract video metadata (duration, codec, resolution)
4. Generate summary report
5. Identify videos needing conversion
6. Create batch processing script
```

### Workflow 4: Music Library Analysis
```
1. start_search in /Users/steven/Music
2. Use Python mutagen for ID3 tags
3. Build artist/album database
4. Find missing metadata
5. Generate playlist files
6. Create music catalog
```

## Python Libraries to Leverage

Essential libraries for this skill:
- **PIL/Pillow**: Image manipulation and EXIF data
- **mutagen**: Audio metadata (MP3, FLAC, etc.)
- **ffmpeg-python**: Video processing wrapper
- **requests/beautifulsoup4**: Web scraping AI art sites
- **pandas**: Data analysis of media collections
- **pathlib**: Modern file path handling

## Best Practices

### Always:
- Use absolute paths starting with /Users/steven/
- Check file existence before operations
- Preserve original files (copy, don't move)
- Generate backups before batch operations
- Use descriptive output filenames with timestamps

### Never:
- Delete files without explicit confirmation
- Overwrite originals without backup
- Process files recursively without depth limits
- Make assumptions about file formats

## Advanced Features

### Image Analysis Pipeline
1. Load image with PIL
2. Extract dimensions, format, mode
3. Read EXIF data (camera, date, GPS)
4. Detect faces/objects (if using CV2)
5. Calculate perceptual hash for duplicates
6. Generate thumbnail
7. Store metadata in JSON

### Video Processing Pipeline
1. Use ffprobe for metadata
2. Extract key frames
3. Generate preview clips
4. Detect scene changes
5. Create animated thumbnails
6. Batch transcode if needed

### AI Art Prompt Library
1. Scan ai-sites directory for HTML files
2. Extract prompts from page source
3. Download associated images
4. Tag by style/technique
5. Build searchable database
6. Generate inspiration boards

## Output Formats

### Asset Reports
Generate markdown reports with:
- File count by type
- Size statistics
- Date ranges
- Missing metadata
- Duplicate files
- Recommendations

### Gallery HTML
Create responsive galleries:
- Thumbnail grid
- Lightbox view
- Filter by category
- Sort by date/name
- Responsive design

### Processing Scripts
Generate Python scripts:
- Well-commented
- Configurable parameters
- Error handling
- Progress reporting
- Dry-run mode

## Integration with User's Workflow

Since the user has:
- **Pictures**: Focus on photo organization and EXIF analysis
- **Movies**: Video metadata and conversion tools
- **Music**: Audio library management
- **Documents**: Store generated reports and scripts
- **ai-sites**: Integrate with Avatar Arts workflows

## Error Handling

Always include:
- File existence checks
- Format validation
- Graceful failures with informative messages
- Rollback capabilities
- Detailed logging

## Performance Optimization

For large collections:
- Process in batches (100 files at a time)
- Use progress indicators
- Cache metadata results
- Parallelize when possible
- Stream large files

## Security Considerations

- Validate file paths within user directories
- Sanitize filenames
- Check file permissions
- Avoid executing untrusted code
- Verify web sources before downloading

---

## Quick Reference Commands

**Scan Pictures**: "Analyze my photo collection"
**Find Duplicates**: "Find duplicate images in Pictures"
**Build Gallery**: "Create an HTML gallery of my recent photos"
**Download AI Art**: "Get images from my Avatar Arts pages"
**Batch Resize**: "Resize all photos to max 1920px width"
**Video Info**: "Analyze my video files"
**Music Catalog**: "Create a catalog of my music library"
**Generate Script**: "Make a Python script to convert PNGs to JPEGs"

This skill transforms Claude into a powerful creative asset manager with deep integration into your multimedia workflow!
