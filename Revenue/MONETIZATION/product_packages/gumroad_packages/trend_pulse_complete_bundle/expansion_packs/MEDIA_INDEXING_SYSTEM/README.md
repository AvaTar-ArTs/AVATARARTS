# Media Indexing and Analysis System

**Purpose:** Index and analyze media files from `~/music/nocturnemelodies` and `~/movies`
**Based On:** Existing scripts from `~/pythons/transcribe`
**Output:** Comprehensive index, transcripts, analysis, and examples

---

## 🎯 Overview

This system:
1. **Indexes** all media files (MP3, MP4, etc.) in both directories
2. **Identifies** existing transcripts and analysis
3. **Analyzes** your existing transcription scripts for patterns
4. **Creates** examples and templates based on your code
5. **Generates** comprehensive reports and indexes

---

## 📋 What It Does

### 1. Media File Discovery
- Scans `~/music/nocturnemelodies` for audio files (MP3, WAV, M4A, etc.)
- Scans `~/movies` for video files (MP4, MOV, AVI, etc.)
- Records file metadata (size, date, path)

### 2. Transcript Detection
- Finds existing transcript files
- Matches transcripts to media files
- Identifies missing transcripts

### 3. Analysis Detection
- Finds existing analysis files
- Matches analysis to media files
- Identifies missing analysis

### 4. Script Analysis
- Analyzes `~/pythons/transcribe/` scripts
- Identifies features (WhisperX, word timestamps, speaker diarization)
- Extracts patterns and best practices

### 5. Index Generation
- Creates JSON index of all media
- Generates CSV files for easy analysis
- Creates summary reports

### 6. Example Creation
- Creates example transcription script
- Creates analysis template
- Based on your existing code patterns

---

## 🚀 Usage

### Basic Usage

```bash
cd /Users/steven/AVATARARTS/Revenue/Trend_Pulse_All_Expansion_Packs/MEDIA_INDEXING_SYSTEM
python index_and_analyze_media.py
```

### Output Structure

```
indexed_media/
├── index/
│   ├── media_index_YYYYMMDD_HHMMSS.json
│   ├── music_index_YYYYMMDD_HHMMSS.csv
│   ├── movies_index_YYYYMMDD_HHMMSS.csv
│   └── summary_YYYYMMDD_HHMMSS.txt
├── transcripts/
│   └── (future transcript files)
├── analysis/
│   └── (future analysis files)
└── examples/
    ├── example_transcription_script.py
    └── analysis_template.md
```

---

## 📊 Index Format

### JSON Index Structure

```json
{
  "music": {
    "files": [...],
    "total": 1000,
    "total_size_mb": 5000.0,
    "with_transcripts": 150,
    "with_analysis": 120,
    "transcripts": [...],
    "analysis": [...]
  },
  "movies": {
    "files": [...],
    "total": 500,
    "total_size_mb": 10000.0,
    "with_transcripts": 200,
    "with_analysis": 180,
    "transcripts": [...],
    "analysis": [...]
  },
  "scripts": {
    "transcription_scripts": [...],
    "analysis_scripts": [...],
    "patterns": {...}
  },
  "metadata": {
    "indexed_at": "2026-01-13T...",
    "total_files": 1500,
    "total_size_mb": 15000.0
  }
}
```

### CSV Format

Each CSV includes:
- `name`: File name
- `path`: Relative path
- `size_mb`: File size in MB
- `modified`: Last modified date
- `has_transcript`: Yes/No
- `has_analysis`: Yes/No

---

## 🔧 Example Scripts

### Example Transcription Script

The system creates `examples/example_transcription_script.py` based on your existing patterns:
- Environment variable loading from `~/.env.d/`
- WhisperX integration
- Word-level timestamps
- Speaker diarization
- Multiple output formats

### Analysis Template

The system creates `examples/analysis_template.md` based on your existing analysis format:
- Themes/Messages
- Emotional Tone
- Narrative Structure
- Key Points
- Technical/Artistic Elements
- Audience Impact

---

## 📈 Statistics Generated

### Summary Report Includes:

- **Total Files**: Count of all media files
- **Total Size**: Combined size in MB
- **Transcript Coverage**: Percentage with transcripts
- **Analysis Coverage**: Percentage with analysis
- **Missing Transcripts**: Files needing transcription
- **Script Features**: Detected capabilities

---

## 🔗 Integration with Expansion Packs

### For AI_Note_Taker Pack:

```python
from MEDIA_INDEXING_SYSTEM.index_and_analyze_media import MediaIndexer

# Index media
indexer = MediaIndexer()
index = indexer.create_index()

# Get files needing transcription
music_needing = [f for f in index['music']['files'] if not f['has_transcript']]
movies_needing = [f for f in index['movies']['files'] if not f['has_transcript']]

# Process with NOTEGPT integration
for file_info in music_needing[:10]:  # Process first 10
    result = transcribe_audio_note(file_info['path'])
    # Save to index
```

### For Podcast_to_Shorts_AI Pack:

```python
# Get movies with transcripts
movies_with_transcripts = [
    f for f in index['movies']['files']
    if f['has_transcript']
]

# Extract clips from transcriptions
for movie in movies_with_transcripts:
    clips = extract_clips_from_transcript(movie['path'])
    # Generate shorts
```

---

## 🎯 Next Steps

1. **Run Indexing**
   ```bash
   python index_and_analyze_media.py
   ```

2. **Review Index**
   - Check JSON index for complete file list
   - Review CSV files for easy filtering
   - Read summary report for statistics

3. **Use Examples**
   - Review example transcription script
   - Use analysis template for new analysis
   - Adapt to your needs

4. **Process Missing Files**
   - Identify files needing transcription
   - Use example script as starting point
   - Integrate with expansion packs

---

## 📚 Related Files

- `index_and_analyze_media.py` - Main indexing script
- `examples/example_transcription_script.py` - Transcription example
- `examples/analysis_template.md` - Analysis template
- `index/media_index_*.json` - Complete index
- `index/summary_*.txt` - Summary report

---

**Status:** Ready to run
**Output Location:** `MEDIA_INDEXING_SYSTEM/indexed_media/`
**Based On:** Your existing scripts in `~/pythons/transcribe/`
