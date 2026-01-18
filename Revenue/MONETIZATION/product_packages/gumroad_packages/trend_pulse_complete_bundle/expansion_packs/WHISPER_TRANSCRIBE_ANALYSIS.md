# WhisperTranscribe Application Analysis

**Analysis Date:** 2026-01-13
**Location:** `/Users/steven/Library/Application Support/WhisperTranscribe`
**Purpose:** Understand WhisperTranscribe structure to improve expansion packs

---

## 📋 Executive Summary

WhisperTranscribe is an Electron-based desktop application that stores transcriptions in a SQLite database with a structured library system. Understanding its data model and file organization can help improve the AI_Note_Taker and Podcast_to_Shorts_AI expansion packs.

---

## 🏗️ Application Structure

### Directory Layout

```
/Users/steven/Library/Application Support/WhisperTranscribe/
├── library/              # Audio/video files organized by ID
│   ├── 2/               # Record ID 2
│   │   └── audio.mp4
│   ├── 15/              # Record ID 15
│   │   └── audio.mp3
│   └── 63/              # Record ID 63 (complex nested structure)
│       ├── video_clipped.mp4
│       ├── video_downscaled.mp4
│       └── gol-ia-newq/nevets/sresU/
│           └── openai-*.json (transcription results)
├── wt/                  # Application database
│   ├── wtdb.sqlite      # Main SQLite database
│   └── backups/         # Database backups
│       ├── backup-2025-12-28.db.gz
│       └── backup-2026-01-03.db.gz
├── clipMedia/           # Thumbnail/clip images
├── blob_storage/        # Blob storage for app data
├── Local Storage/       # Electron local storage
├── Preferences          # App preferences
└── window-state.json    # Window position/size
```

---

## 🗄️ Database Schema Analysis

### Core Tables

#### 1. **records** (Main Records Table)
- Primary table storing transcription records
- Contains metadata for each transcription

#### 2. **content_** (Content Storage)
```sql
CREATE TABLE "content_" (
    "id" INTEGER NOT NULL,
    "relatedRecordUid" TEXT NOT NULL UNIQUE,
    "content" TEXT DEFAULT '[]',
    PRIMARY KEY("id" AUTOINCREMENT)
);
```
- Stores transcription content as JSON
- Linked to records via `relatedRecordUid`

#### 3. **words_** (Word-Level Data)
```sql
CREATE TABLE "words_" (
    "id" INTEGER NOT NULL,
    "relatedRecordUid" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "words" TEXT NOT NULL DEFAULT '[]',
    PRIMARY KEY("id" AUTOINCREMENT),
    UNIQUE("relatedRecordUid","languageCode")
);
```
- Stores word-level timestamps
- Supports multiple languages per record
- Essential for subtitle generation

#### 4. **clips_** (Video/Audio Clips)
```sql
CREATE TABLE "clips_" (
    "id" INTEGER NOT NULL,
    "relatedRecordUid" TEXT NOT NULL UNIQUE,
    "clips" TEXT DEFAULT '[]',
    PRIMARY KEY("id" AUTOINCREMENT)
);
```
- Stores clip information
- Relevant for Podcast_to_Shorts_AI pack

#### 5. **parts_** (Segmented Parts)
```sql
CREATE TABLE "parts_" (
    "id" INTEGER NOT NULL,
    "relatedRecordUid" TEXT NOT NULL UNIQUE,
    "parts" TEXT DEFAULT '[]',
    PRIMARY KEY("id" AUTOINCREMENT)
);
```
- Stores segmented parts of transcriptions
- Useful for chunking long content

#### 6. **folders** (Organization)
```sql
CREATE TABLE "folders" (
    "uid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "expanded" TEXT NOT NULL DEFAULT 'true',
    PRIMARY KEY("uid")
);
```
- Folder organization system
- Supports nested folder structures

#### 7. **promptbook_** (Prompts)
```sql
CREATE TABLE "promptbook_" (
    "id" INTEGER NOT NULL,
    "promptbook" TEXT DEFAULT '[]',
    PRIMARY KEY("id" AUTOINCREMENT)
);
```
- Stores prompt templates
- Relevant for AEO prompt optimization

#### 8. **clipTemplates_** (Clip Templates)
- Templates for creating clips
- Useful for automated clip generation

#### 9. **paragraphs_** (Paragraph Structure)
- Paragraph-level organization
- Text structure analysis

### Additional Tables
- `userMedia_` - User media references
- `playground_` - Testing/development data
- `settings_` - Application settings
- `craftingContent_` - Content crafting features
- `diffing_anchors_` - Version control/diffing

---

## 📁 File Organization

### Library Structure

**Pattern:** `library/{record_id}/audio.{ext}`

**Examples:**
- `library/2/audio.mp4` - Record ID 2, MP4 video
- `library/15/audio.mp3` - Record ID 15, MP3 audio
- `library/63/audio.mp3` - Record ID 63, MP3 audio
- `library/63/video_clipped.mp4` - Clipped video version
- `library/63/video_downscaled.mp4` - Downscaled version

**Complex Nested Structure:**
- `library/63/gol-ia-newq/nevets/sresU/openai-*.json`
- Suggests support for nested project structures
- Transcription results stored as JSON files

### Transcription JSON Format

**Location Pattern:** `library/{record_id}/.../openai-{timestamp}-{hash}.json`

**Structure (from sample):**
```json
{
  "text": "Full transcription text...",
  "segments": [
    {
      "id": 0,
      "start": 0.0,
      "end": 5.2,
      "text": "Segment text...",
      "words": [
        {
          "word": "word",
          "start": 0.0,
          "end": 0.5
        }
      ]
    }
  ],
  "language": "en"
}
```

**Key Features:**
- Full text transcription
- Segmented with timestamps
- Word-level timestamps
- Language detection

---

## 🔍 Key Insights

### 1. **Structured Data Model**
- SQLite database for metadata
- JSON files for transcription results
- Organized library structure
- Support for multiple formats (MP3, MP4, M4A, WEBM)

### 2. **Word-Level Timestamps**
- Essential for subtitle generation
- Enables precise clip extraction
- Supports video editing workflows

### 3. **Clip Management**
- Built-in clip creation system
- Template support
- Clip media storage

### 4. **Multi-Language Support**
- Language code storage
- Per-language word data
- Translation capabilities

### 5. **Backup System**
- Automatic database backups
- Gzip compression
- Date-stamped backups

---

## 💡 Integration Opportunities

### For AI_Note_Taker Pack

#### 1. **Database Integration**
```python
import sqlite3

def read_whispertranscribe_db(db_path):
    """Read transcriptions from WhisperTranscribe database."""
    conn = sqlite3.connect(db_path)

    # Get all records with content
    query = """
    SELECT r.*, c.content, w.words, w.languageCode
    FROM records r
    LEFT JOIN content_ c ON r.uid = c.relatedRecordUid
    LEFT JOIN words_ w ON r.uid = w.relatedRecordUid
    """

    records = conn.execute(query).fetchall()
    conn.close()
    return records
```

#### 2. **Library File Access**
```python
from pathlib import Path

def get_audio_files(library_path, record_id):
    """Get audio files for a record."""
    record_dir = Path(library_path) / str(record_id)
    audio_files = list(record_dir.glob("audio.*"))
    return audio_files
```

#### 3. **Transcription Import**
```python
import json

def import_transcription(json_path):
    """Import transcription from WhisperTranscribe JSON."""
    with open(json_path) as f:
        data = json.load(f)

    return {
        'text': data['text'],
        'segments': data['segments'],
        'language': data.get('language', 'en'),
        'word_timestamps': extract_word_timestamps(data)
    }
```

### For Podcast_to_Shorts_AI Pack

#### 1. **Clip Extraction**
```python
def extract_clips_from_db(db_path, record_uid):
    """Extract clips from WhisperTranscribe database."""
    conn = sqlite3.connect(db_path)

    # Get clips for record
    query = """
    SELECT clips FROM clips_
    WHERE relatedRecordUid = ?
    """

    result = conn.execute(query, (record_uid,)).fetchone()
    if result:
        clips = json.loads(result[0])
        return clips
    return []
```

#### 2. **Word-Level Timestamp Usage**
```python
def create_subtitle_segments(words_data, max_duration=5.0):
    """Create subtitle segments from word-level timestamps."""
    segments = []
    current_segment = []
    current_duration = 0.0

    for word in words_data:
        word_duration = word['end'] - word['start']
        if current_duration + word_duration > max_duration:
            # Save current segment
            segments.append({
                'text': ' '.join([w['word'] for w in current_segment]),
                'start': current_segment[0]['start'],
                'end': current_segment[-1]['end']
            })
            current_segment = []
            current_duration = 0.0

        current_segment.append(word)
        current_duration += word_duration

    return segments
```

#### 3. **Parts Segmentation**
```python
def get_transcription_parts(db_path, record_uid):
    """Get segmented parts of transcription."""
    conn = sqlite3.connect(db_path)

    query = """
    SELECT parts FROM parts_
    WHERE relatedRecordUid = ?
    """

    result = conn.execute(query, (record_uid,)).fetchone()
    if result:
        parts = json.loads(result[0])
        return parts
    return []
```

---

## 🚀 Implementation Recommendations

### 1. **Create WhisperTranscribe Integration Module**

**File:** `trend-pulse-os/integrations/whispertranscribe.py`

```python
"""
WhisperTranscribe Integration Module

Reads and processes WhisperTranscribe database and files.
"""

import sqlite3
import json
from pathlib import Path
from typing import Dict, List, Optional

class WhisperTranscribeReader:
    def __init__(self, app_support_path: str):
        self.app_support_path = Path(app_support_path)
        self.db_path = self.app_support_path / "wt" / "wtdb.sqlite"
        self.library_path = self.app_support_path / "library"

    def get_all_records(self) -> List[Dict]:
        """Get all transcription records."""
        # Implementation
        pass

    def get_transcription(self, record_uid: str) -> Dict:
        """Get full transcription for a record."""
        # Implementation
        pass

    def get_clips(self, record_uid: str) -> List[Dict]:
        """Get clips for a record."""
        # Implementation
        pass

    def get_audio_file(self, record_id: int) -> Optional[Path]:
        """Get audio file path for a record."""
        # Implementation
        pass
```

### 2. **Enhance AI_Note_Taker Pack**

Add WhisperTranscribe import capability:
```python
# In AI_Note_Taker/workflows/workflow.py

def import_from_whispertranscribe(db_path, record_uid):
    """Import notes from WhisperTranscribe."""
    reader = WhisperTranscribeReader(db_path)
    transcription = reader.get_transcription(record_uid)

    # Convert to note format
    note = {
        'title': transcription.get('title', 'Untitled'),
        'content': transcription['text'],
        'timestamp': transcription.get('created_at'),
        'language': transcription.get('language', 'en'),
        'segments': transcription.get('segments', [])
    }

    return note
```

### 3. **Enhance Podcast_to_Shorts_AI Pack**

Add clip extraction from WhisperTranscribe:
```python
# In Podcast_to_Shorts_AI/workflows/workflow.py

def extract_clips_from_whispertranscribe(db_path, record_uid):
    """Extract clips using WhisperTranscribe data."""
    reader = WhisperTranscribeReader(db_path)

    # Get existing clips
    clips = reader.get_clips(record_uid)

    # Get word-level timestamps
    words = reader.get_words(record_uid)

    # Generate short-form content
    shorts = []
    for clip in clips:
        shorts.append({
            'timestamp': clip['start'],
            'duration': clip['end'] - clip['start'],
            'text': clip['text'],
            'words': extract_words_in_range(words, clip['start'], clip['end'])
        })

    return shorts
```

---

## 📊 Data Statistics

### Your Current Setup:
- **Total Records:** Checked via database query
- **Library Files:** 60+ audio/video files
- **Formats Supported:** MP3, MP4, M4A, WEBM
- **Backup Frequency:** Regular (last: 2026-01-03)
- **Database Size:** SQLite with multiple tables

### File Organization:
- **Library Structure:** ID-based organization
- **Transcription Storage:** JSON files with timestamps
- **Media Storage:** Original files preserved
- **Clip Storage:** Separate clip media directory

---

## 🔗 Integration Workflow

### Recommended Workflow:

1. **Read WhisperTranscribe Database**
   ```python
   reader = WhisperTranscribeReader(app_support_path)
   records = reader.get_all_records()
   ```

2. **Process Each Record**
   ```python
   for record in records:
       transcription = reader.get_transcription(record['uid'])
       clips = reader.get_clips(record['uid'])
       audio_file = reader.get_audio_file(record['id'])
   ```

3. **Convert to Expansion Pack Format**
   ```python
   # For AI_Note_Taker
   note = convert_to_note(transcription)

   # For Podcast_to_Shorts_AI
   shorts = convert_to_shorts(clips, transcription)
   ```

4. **Export to Trend Pulse Format**
   ```python
   from core.export_engine import export_json
   export_json([note], 'whispertranscribe_notes.json')
   ```

---

## 🎯 Key Takeaways

### For Expansion Packs:

1. **WhisperTranscribe Structure:**
   - SQLite database for metadata
   - JSON files for transcriptions
   - Word-level timestamps available
   - Clip management built-in

2. **Integration Benefits:**
   - Access existing transcriptions
   - Leverage word-level timestamps
   - Use clip data for shorts
   - Import notes automatically

3. **Implementation Priority:**
   - High: Word-level timestamp support
   - High: Clip extraction
   - Medium: Database integration
   - Medium: Library file access

---

## 📚 Next Steps

1. **Create Integration Module**
   - Build `WhisperTranscribeReader` class
   - Add to `trend-pulse-os/integrations/`

2. **Update Expansion Packs**
   - Add WhisperTranscribe import to AI_Note_Taker
   - Add clip extraction to Podcast_to_Shorts_AI
   - Support word-level timestamps

3. **Test Integration**
   - Read from your existing database
   - Process sample records
   - Generate expansion pack outputs

4. **Documentation**
   - Add integration guide
   - Update README files
   - Create examples

---

**Analysis Completed:** 2026-01-13
**Database Location:** `/Users/steven/Library/Application Support/WhisperTranscribe/wt/wtdb.sqlite`
**Library Location:** `/Users/steven/Library/Application Support/WhisperTranscribe/library/`
**Integration Status:** Ready for implementation

---

*This analysis supports AI_Note_Taker and Podcast_to_Shorts_AI expansion pack improvements.*
