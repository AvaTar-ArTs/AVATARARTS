# 🎨 Creative Asset Orchestrator

A powerful Claude skill for managing, analyzing, and transforming your creative multimedia assets. Integrates seamlessly with your Pictures, Movies, Music, and AI-generated content workflows.

## ✨ What Makes This Amazing

This skill transforms Claude into your personal creative asset manager with:

- **🔍 Smart Discovery**: Automatically scan and catalog your entire media collection
- **🤖 AI Art Integration**: Work with Avatar Arts (Disco, DALL-E, etc.) and organize AI-generated content
- **🐍 Python Automation**: Generate custom scripts for batch processing any task
- **📊 Intelligent Analysis**: Extract metadata, find duplicates, and generate reports
- **🎯 Contextual Understanding**: Knows your directory structure and workflow preferences

## 🚀 Quick Start

### Installation

1. Place `SKILL.md` in your Claude skills directory
2. Enable the skill in your Claude interface
3. Start using natural language commands!

### First Commands to Try

```
"Analyze my photo collection"
"Find all videos larger than 100MB"
"Create a gallery of my AI art"
"Generate a script to resize all PNGs"
"What's in my Music folder?"
```

## 💡 Example Use Cases

### 1. Photo Organization

**You say**: "I need to organize my Photos folder by date"

**Claude will**:
- Scan your Pictures directory
- Extract EXIF data with dates
- Create year/month folder structure
- Move files while preserving originals
- Generate a report of what was organized

### 2. AI Art Gallery

**You say**: "Build an HTML gallery from my avatararts.org pages"

**Claude will**:
- Fetch content from your AI art URLs
- Download images
- Extract prompts and parameters
- Create responsive HTML gallery
- Generate markdown catalog

### 3. Video Asset Management

**You say**: "Analyze all my videos and find ones that need compression"

**Claude will**:
- Scan Movies folder
- Extract metadata (duration, codec, resolution, bitrate)
- Identify large/inefficient files
- Generate FFmpeg compression script
- Provide size reduction estimates

### 4. Batch Processing

**You say**: "Convert all my HEIC photos to JPEG"

**Claude will**:
- Find all HEIC files
- Generate Python conversion script
- Include progress bar and error handling
- Preserve EXIF data
- Create backup recommendations

## 🎯 Command Patterns

The skill recognizes natural language. Here are some patterns that work great:

### Discovery
- "What images do I have from 2024?"
- "Show me all MP4 files"
- "Find large files in Pictures"
- "List all music by [artist]"

### Analysis
- "Analyze my photo metadata"
- "Find duplicate images"
- "What's taking up space in Movies?"
- "Check my music library for missing tags"

### Organization
- "Organize photos by camera type"
- "Sort videos by resolution"
- "Group AI art by style"
- "Create project folders"

### Automation
- "Make a script to watermark images"
- "Batch convert videos to H.265"
- "Resize all photos to web size"
- "Extract audio from videos"

### AI Art Workflow
- "Download images from my Disco Diffusion page"
- "Create prompt library from DALL-E generations"
- "Build inspiration board from recent AI art"
- "Catalog all Avatar Arts creations"

## 🛠️ Advanced Features

### Python REPL Integration

The skill can start Python environments for complex operations:

```python
# Claude will execute:
start_process("python3 -i")
interact_with_process(pid, """
from PIL import Image
import os

# Your custom processing here
""")
```

### Batch Operations

Process hundreds of files efficiently:

- Automatic batching (100 files at a time)
- Progress indicators
- Error recovery
- Dry-run mode for testing

### Metadata Extraction

- **Images**: EXIF data, camera info, GPS, dates
- **Videos**: Codec, resolution, bitrate, duration
- **Audio**: ID3 tags, artist, album, genre
- **Documents**: Creation date, author, format

### Smart Search

- Semantic search: "photos of sunsets"
- Technical search: "images wider than 4000px"
- Date-based: "videos from last month"
- Combined: "large JPEGs from 2024"

## 📁 Directory Structure

The skill works with your existing structure:

```
/Users/steven/
├── Pictures/          # Photo analysis & organization
├── Movies/            # Video processing & metadata
├── Music/             # Audio library management
├── Documents/         # Reports & generated scripts
│   └── ai-sites/      # Avatar Arts integration
└── creative-asset-orchestrator-skill/
    ├── SKILL.md       # The skill definition
    ├── demo.py        # Demonstration script
    └── README.md      # This file
```

## 🎬 Demo Script

Run the included demo to see the skill in action:

```bash
python3 /Users/steven/Documents/creative-asset-orchestrator-skill/demo.py
```

This will:
1. Scan your Pictures, Movies, Music, and ai-sites directories
2. Analyze all files and extract metadata
3. Generate a comprehensive report
4. Export data as JSON
5. Show file type breakdowns and statistics

## 🎓 Best Practices

### When Working with Original Files

✅ **DO**:
- Always work on copies for destructive operations
- Use dry-run mode first
- Review generated scripts before execution
- Keep backups of important content

❌ **DON'T**:
- Delete originals without confirmation
- Process recursively without depth limits
- Assume file formats without checking
- Skip validation steps

### Performance Tips

- Process large collections in batches
- Use content search sparingly (expensive)
- Cache metadata results
- Limit search depth when possible

### Security

- All operations stay within your directories
- No external code execution
- File paths validated
- Permissions respected

## 🔮 Future Enhancements

Ideas for extending the skill:

- [ ] Machine learning for image classification
- [ ] Face detection and tagging
- [ ] Video scene analysis
- [ ] Audio transcription
- [ ] Cloud backup integration
- [ ] Duplicate content removal
- [ ] Style transfer automation
- [ ] Smart playlist generation

## 🤝 Integration Points

### With Avatar Arts

- Automatically fetch new generations
- Track prompts and parameters
- Build style libraries
- Generate comparison galleries

### With Python Ecosystem

- PIL/Pillow for images
- FFmpeg for videos
- Mutagen for audio
- BeautifulSoup for web scraping
- Pandas for data analysis

### With Your Workflow

- Generates scripts you can customize
- Creates reports you can share
- Produces galleries you can publish
- Builds databases you can query

## 📚 Learn More

The skill adapts to your needs. Try saying:

- "Show me what you can do with my photos"
- "What AI art features do you have?"
- "Help me batch process videos"
- "Create a custom workflow for [task]"

## 🎉 Get Creative!

This skill is designed to be powerful yet easy to use. Just describe what you want to do with your creative assets, and Claude will figure out the best approach using the tools available.

**Remember**: You're in control. Claude will always explain what it's about to do before making changes to your files.

---

Made with ✨ by Claude using the skill-creator skill
