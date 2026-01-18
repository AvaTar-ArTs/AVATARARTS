# Step-by-Step Guide: Deploying NOTEGPT-Style Transcription System

**Target Sites:**
- avatararts.org
- quantumforgelabs.org
- gptjunkie.com
- aiworkflowalchemy.com

**Based on:** [AI Workflow Alchemy](https://aiworkflowalchemy.com/) existing infrastructure

---

## 📋 Table of Contents

1. [Pre-Deployment Planning](#pre-deployment-planning)
2. [Backend Setup](#backend-setup)
3. [Frontend Implementation](#frontend-implementation)
4. [API Integration](#api-integration)
5. [Deployment Options](#deployment-options)
6. [Domain-Specific Configurations](#domain-specific-configurations)
7. [Testing & Launch](#testing--launch)

---

## 1. Pre-Deployment Planning

### 1.1 Choose Deployment Site

**Recommended:** Start with **aiworkflowalchemy.com** (already has AI infrastructure)

**Reasons:**
- Existing Claude AI integration
- Presentation generator infrastructure
- JavaScript/Python stack already in place
- Apify template experience

### 1.2 Technology Stack Decision

**Option A: Full Stack (Recommended)**
- **Backend:** Python (Flask/FastAPI) - matches existing codebase
- **Frontend:** React/Next.js or Vanilla JS (like current site)
- **Database:** SQLite (local) or PostgreSQL (production)
- **Storage:** Local filesystem or S3/Cloud storage

**Option B: Serverless**
- **Backend:** AWS Lambda / Vercel Functions
- **Frontend:** Next.js / React
- **Database:** Supabase / PlanetScale
- **Storage:** S3 / Cloudflare R2

### 1.3 Feature Set Planning

**Phase 1 (MVP):**
- ✅ Audio/Video upload
- ✅ Transcription with WhisperX
- ✅ Word-level timestamps
- ✅ Basic summary generation
- ✅ Download transcriptions

**Phase 2:**
- ✅ Speaker diarization
- ✅ Study tools (flashcards, quizzes)
- ✅ Multi-language support
- ✅ Cloud storage

**Phase 3:**
- ✅ AI-powered summaries (Claude integration)
- ✅ Mind mapping
- ✅ Translation
- ✅ Team collaboration

---

## 2. Backend Setup

### Step 2.1: Create Project Structure

```bash
# Navigate to your project directory
cd /Users/steven/AVATARARTS/Revenue

# Create transcription service directory
mkdir -p transcription-service
cd transcription-service

# Create directory structure
mkdir -p {backend,frontend,static,uploads,exports}
mkdir -p backend/{api,core,utils,models}
mkdir -p frontend/{src,public,components}
```

### Step 2.2: Backend Dependencies

**Create `backend/requirements.txt`:**

```txt
# Core Framework
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6
pydantic==2.5.0

# Transcription
whisperx==3.1.1
torch==2.1.0
torchaudio==2.1.0
ffmpeg-python==0.2.0

# Database
sqlalchemy==2.0.23
sqlite3  # Built-in

# File Handling
aiofiles==23.2.1
python-magic==0.4.27

# AI Integration (for summaries)
openai==1.3.0
anthropic==0.7.0

# Utilities
python-dotenv==1.0.0
pydantic-settings==2.1.0
```

### Step 2.3: Backend API Structure

**Create `backend/api/main.py`:**

```python
"""
FastAPI Backend for NOTEGPT-Style Transcription
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from typing import Optional
import os
from pathlib import Path

from core.transcriber import TranscriptionService
from core.database import TranscriptionDB
from models.schemas import TranscriptionRequest, TranscriptionResponse

app = FastAPI(
    title="NOTEGPT Transcription API",
    description="AI-powered transcription with study tools",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://aiworkflowalchemy.com",
        "https://avatararts.org",
        "https://quantumforgelabs.org",
        "https://gptjunkie.com",
        "http://localhost:3000",
        "http://localhost:8000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
transcription_service = TranscriptionService()
db = TranscriptionDB("transcriptions.db")

# Configuration
UPLOAD_DIR = Path("uploads")
EXPORT_DIR = Path("exports")
UPLOAD_DIR.mkdir(exist_ok=True)
EXPORT_DIR.mkdir(exist_ok=True)

MAX_FILE_SIZE = 500 * 1024 * 1024  # 500MB


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "online",
        "service": "NOTEGPT Transcription API",
        "version": "1.0.0"
    }


@app.post("/api/transcribe", response_model=TranscriptionResponse)
async def transcribe_audio(
    file: UploadFile = File(...),
    title: Optional[str] = None,
    language: Optional[str] = None,
    generate_summary: bool = True,
    generate_study_tools: bool = True,
    speaker_diarization: bool = True
):
    """
    Transcribe audio/video file with NOTEGPT features.

    Args:
        file: Audio/video file to transcribe
        title: Optional title for transcription
        language: Language code (auto-detect if None)
        generate_summary: Generate AI summary
        generate_study_tools: Generate flashcards and quiz
        speaker_diarization: Enable speaker identification
    """
    try:
        # Validate file
        if file.size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail=f"File too large. Maximum size: {MAX_FILE_SIZE / 1024 / 1024}MB"
            )

        # Save uploaded file
        file_path = UPLOAD_DIR / file.filename
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)

        # Transcribe
        result = await transcription_service.transcribe(
            str(file_path),
            language=language,
            speaker_diarization=speaker_diarization
        )

        # Generate additional features
        summary = None
        if generate_summary:
            summary = await transcription_service.generate_summary(result)

        flashcards = None
        quiz = None
        if generate_study_tools:
            flashcards = await transcription_service.generate_flashcards(result)
            quiz = await transcription_service.generate_quiz(result)

        # Save to database
        record_uid = db.save_transcription(
            result,
            str(file_path),
            title or file.filename
        )

        return TranscriptionResponse(
            record_uid=record_uid,
            transcription=result,
            summary=summary,
            flashcards=flashcards,
            quiz=quiz,
            status="complete"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/transcription/{record_uid}")
async def get_transcription(record_uid: str):
    """Get transcription by record UID."""
    transcription = db.get_transcription(record_uid)
    if not transcription:
        raise HTTPException(status_code=404, detail="Transcription not found")
    return transcription


@app.get("/api/transcriptions")
async def list_transcriptions(limit: int = 20, offset: int = 0):
    """List all transcriptions."""
    records = db.list_all_records(limit=limit, offset=offset)
    return {"transcriptions": records, "total": len(records)}


@app.post("/api/export/{record_uid}")
async def export_transcription(
    record_uid: str,
    format: str = "json"  # json, csv, markdown, notegpt
):
    """Export transcription in specified format."""
    transcription = db.get_transcription(record_uid)
    if not transcription:
        raise HTTPException(status_code=404, detail="Transcription not found")

    # Export based on format
    export_path = transcription_service.export(
        transcription,
        format=format,
        output_dir=EXPORT_DIR
    )

    return FileResponse(
        export_path,
        media_type="application/octet-stream",
        filename=f"transcription_{record_uid}.{format}"
    )


@app.delete("/api/transcription/{record_uid}")
async def delete_transcription(record_uid: str):
    """Delete transcription."""
    success = db.delete_transcription(record_uid)
    if not success:
        raise HTTPException(status_code=404, detail="Transcription not found")
    return {"status": "deleted", "record_uid": record_uid}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### Step 2.4: Core Transcription Service

**Create `backend/core/transcriber.py`:**

```python
"""
Transcription Service using WhisperX
"""

import whisperx
from typing import Dict, Any, Optional, List
from pathlib import Path
import asyncio
from concurrent.futures import ThreadPoolExecutor

executor = ThreadPoolExecutor(max_workers=2)


class TranscriptionService:
    """Async transcription service."""

    def __init__(self, model_size: str = "base", device: str = "cpu"):
        self.model_size = model_size
        self.device = device
        self.model = None
        self._model_loaded = False

    async def _load_model(self):
        """Load WhisperX model asynchronously."""
        if not self._model_loaded:
            loop = asyncio.get_event_loop()
            self.model = await loop.run_in_executor(
                executor,
                whisperx.load_model,
                self.model_size,
                self.device,
                "int8"
            )
            self._model_loaded = True

    async def transcribe(
        self,
        audio_path: str,
        language: Optional[str] = None,
        speaker_diarization: bool = True
    ) -> Dict[str, Any]:
        """Transcribe audio file."""
        await self._load_model()

        loop = asyncio.get_event_loop()

        # Load audio
        audio = await loop.run_in_executor(
            executor,
            whisperx.load_audio,
            audio_path,
            self.device
        )

        # Transcribe
        result = await loop.run_in_executor(
            executor,
            self.model.transcribe,
            audio,
            language
        )

        # Get language
        detected_language = result.get("language", language or "en")

        # Align for word-level timestamps
        try:
            model_a, metadata = await loop.run_in_executor(
                executor,
                whisperx.load_align_model,
                detected_language,
                self.device
            )
            result = await loop.run_in_executor(
                executor,
                whisperx.align,
                result["segments"],
                model_a,
                metadata,
                audio,
                self.device,
                False
            )
        except Exception as e:
            print(f"Alignment warning: {e}")

        # Speaker diarization
        if speaker_diarization:
            try:
                diarize_model = whisperx.DiarizationPipeline(
                    use_auth_token=None,
                    device=self.device
                )
                diarize_segments = await loop.run_in_executor(
                    executor,
                    diarize_model,
                    audio
                )
                result = whisperx.assign_word_speakers(
                    diarize_segments,
                    result
                )
            except Exception as e:
                print(f"Diarization warning: {e}")

        return {
            "text": result.get("text", ""),
            "language": detected_language,
            "segments": result.get("segments", []),
            "words": self._extract_words(result),
            "speakers": self._extract_speakers(result)
        }

    def _extract_words(self, result: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Extract word-level data."""
        words = []
        for segment in result.get("segments", []):
            for word in segment.get("words", []):
                words.append({
                    "word": word.get("word", ""),
                    "start": word.get("start", 0),
                    "end": word.get("end", 0),
                    "speaker": word.get("speaker"),
                    "score": word.get("score", 0)
                })
        return words

    def _extract_speakers(self, result: Dict[str, Any]) -> List[str]:
        """Extract unique speakers."""
        speakers = set()
        for segment in result.get("segments", []):
            for word in segment.get("words", []):
                if word.get("speaker"):
                    speakers.add(word["speaker"])
        return sorted(list(speakers))

    async def generate_summary(self, transcription: Dict[str, Any]) -> Dict[str, Any]:
        """Generate AI summary."""
        # Simplified - integrate with Claude/OpenAI for better summaries
        text = transcription.get("text", "")
        sentences = text.split(". ")
        summary_text = ". ".join(sentences[:5])

        return {
            "summary": summary_text,
            "key_points": sentences[:5],
            "length": len(summary_text)
        }

    async def generate_flashcards(
        self,
        transcription: Dict[str, Any],
        num_cards: int = 10
    ) -> List[Dict[str, Any]]:
        """Generate flashcards."""
        text = transcription.get("text", "")
        sentences = text.split(". ")

        flashcards = []
        for i, sentence in enumerate(sentences[:num_cards]):
            if len(sentence) > 20:
                flashcards.append({
                    "id": i + 1,
                    "front": f"What is mentioned about: {sentence[:50]}...?",
                    "back": sentence,
                    "timestamp": i * 10
                })

        return flashcards

    async def generate_quiz(
        self,
        transcription: Dict[str, Any],
        num_questions: int = 10
    ) -> Dict[str, Any]:
        """Generate quiz."""
        text = transcription.get("text", "")
        sentences = text.split(". ")

        questions = []
        for i, sentence in enumerate(sentences[:num_questions]):
            if len(sentence) > 30:
                questions.append({
                    "id": i + 1,
                    "question": f"According to the transcription: {sentence[:100]}...",
                    "type": "multiple_choice",
                    "options": [sentence, "Option 2", "Option 3", "Option 4"],
                    "correct_answer": 0
                })

        return {
            "title": "Transcription Quiz",
            "questions": questions,
            "total_questions": len(questions)
        }

    def export(
        self,
        transcription: Dict[str, Any],
        format: str = "json",
        output_dir: Path = None
    ) -> str:
        """Export transcription in specified format."""
        output_dir = output_dir or Path("exports")
        record_uid = transcription.get("uid", "unknown")

        if format == "json":
            import json
            output_path = output_dir / f"{record_uid}.json"
            with open(output_path, "w") as f:
                json.dump(transcription, f, indent=2)

        elif format == "markdown":
            output_path = output_dir / f"{record_uid}.md"
            with open(output_path, "w") as f:
                f.write(f"# {transcription.get('title', 'Transcription')}\n\n")
                f.write(f"{transcription.get('text', '')}\n")

        elif format == "csv":
            import csv
            output_path = output_dir / f"{record_uid}.csv"
            with open(output_path, "w", newline="") as f:
                writer = csv.writer(f)
                writer.writerow(["Word", "Start", "End", "Speaker"])
                for word in transcription.get("words", []):
                    writer.writerow([
                        word.get("word", ""),
                        word.get("start", 0),
                        word.get("end", 0),
                        word.get("speaker", "")
                    ])

        return str(output_path)
```

### Step 2.5: Database Models

**Create `backend/models/schemas.py`:**

```python
"""
Pydantic schemas for API
"""

from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class TranscriptionRequest(BaseModel):
    title: Optional[str] = None
    language: Optional[str] = None
    generate_summary: bool = True
    generate_study_tools: bool = True
    speaker_diarization: bool = True


class Word(BaseModel):
    word: str
    start: float
    end: float
    speaker: Optional[str] = None
    score: float = 0.0


class Segment(BaseModel):
    id: int
    start: float
    end: float
    text: str
    words: List[Word] = []


class TranscriptionData(BaseModel):
    text: str
    language: str
    segments: List[Segment]
    words: List[Word]
    speakers: List[str] = []


class Summary(BaseModel):
    summary: str
    key_points: List[str]
    length: int


class Flashcard(BaseModel):
    id: int
    front: str
    back: str
    timestamp: float


class QuizQuestion(BaseModel):
    id: int
    question: str
    type: str
    options: List[str]
    correct_answer: int


class Quiz(BaseModel):
    title: str
    questions: List[QuizQuestion]
    total_questions: int


class TranscriptionResponse(BaseModel):
    record_uid: str
    transcription: TranscriptionData
    summary: Optional[Summary] = None
    flashcards: Optional[List[Flashcard]] = None
    quiz: Optional[Quiz] = None
    status: str
```

---

## 3. Frontend Implementation

### Step 3.1: Frontend Structure (React/Next.js)

**Create `frontend/package.json`:**

```json
{
  "name": "notegpt-transcription-frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "axios": "1.6.0",
    "react-dropzone": "14.2.3",
    "react-player": "2.13.0"
  }
}
```

### Step 3.2: Main Transcription Component

**Create `frontend/src/components/TranscriptionUploader.jsx`:**

```jsx
/**
 * Transcription Uploader Component
 * Similar to AI Workflow Alchemy presentation generator
 */

import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function TranscriptionUploader() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transcription, setTranscription] = useState(null);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState({
    title: '',
    language: '',
    generateSummary: true,
    generateStudyTools: true,
    speakerDiarization: true
  });

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError(null);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.ogg'],
      'video/*': ['.mp4', '.mov', '.avi', '.webm']
    },
    maxSize: 500 * 1024 * 1024 // 500MB
  });

  const handleTranscribe = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', settings.title || file.name);
      formData.append('language', settings.language || '');
      formData.append('generate_summary', settings.generateSummary);
      formData.append('generate_study_tools', settings.generateStudyTools);
      formData.append('speaker_diarization', settings.speakerDiarization);

      const response = await axios.post(
        `${API_BASE_URL}/api/transcribe`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`Upload: ${percentCompleted}%`);
          }
        }
      );

      setTranscription(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleExport = async (format) => {
    if (!transcription) return;

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/export/${transcription.record_uid}?format=${format}`,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transcription.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">
        NOTEGPT-Style Transcription
      </h1>

      {/* Settings Panel - Similar to AI Workflow Alchemy */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Transcription Settings</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Title (Optional)
            </label>
            <input
              type="text"
              value={settings.title}
              onChange={(e) => setSettings({...settings, title: e.target.value})}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Enter transcription title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Language (Auto-detect if empty)
            </label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({...settings, language: e.target.value})}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="">Auto-detect</option>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="zh">Chinese</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.generateSummary}
                onChange={(e) => setSettings({...settings, generateSummary: e.target.checked})}
                className="mr-2"
              />
              Generate AI Summary
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.generateStudyTools}
                onChange={(e) => setSettings({...settings, generateStudyTools: e.target.checked})}
                className="mr-2"
              />
              Generate Study Tools
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.speakerDiarization}
                onChange={(e) => setSettings({...settings, speakerDiarization: e.target.checked})}
                className="mr-2"
              />
              Speaker Diarization
            </label>
          </div>
        </div>
      </div>

      {/* File Upload - Similar to AI Workflow Alchemy */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
        >
          <input {...getInputProps()} />
          {file ? (
            <div>
              <p className="text-lg font-medium">{file.name}</p>
              <p className="text-sm text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div>
              <p className="text-lg">
                {isDragActive
                  ? 'Drop the file here'
                  : 'Drag & drop audio/video file, or click to select'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Supports: MP3, WAV, M4A, MP4, MOV, AVI (Max 500MB)
              </p>
            </div>
          )}
        </div>

        {file && (
          <button
            onClick={handleTranscribe}
            disabled={uploading}
            className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? 'Transcribing...' : 'Transcribe Audio/Video'}
          </button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Results Display */}
      {transcription && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Transcription Results</h2>

          {/* Transcription Text */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Full Transcription</h3>
            <div className="bg-gray-50 p-4 rounded-md max-h-96 overflow-y-auto">
              <p className="whitespace-pre-wrap">{transcription.transcription.text}</p>
            </div>
          </div>

          {/* Summary */}
          {transcription.summary && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">AI Summary</h3>
              <div className="bg-blue-50 p-4 rounded-md">
                <p>{transcription.summary.summary}</p>
              </div>
            </div>
          )}

          {/* Study Tools */}
          {transcription.flashcards && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">
                Flashcards ({transcription.flashcards.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {transcription.flashcards.map((card) => (
                  <div key={card.id} className="bg-yellow-50 p-4 rounded-md">
                    <p className="font-medium mb-2">{card.front}</p>
                    <p className="text-sm text-gray-600">{card.back}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Export Options */}
          <div className="flex space-x-4">
            <button
              onClick={() => handleExport('json')}
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
            >
              Export JSON
            </button>
            <button
              onClick={() => handleExport('markdown')}
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
            >
              Export Markdown
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
            >
              Export CSV
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 4. Deployment Options

### Option A: Deploy to aiworkflowalchemy.com (Recommended)

**Step 4.1: Add to Existing Site**

Since [aiworkflowalchemy.com](https://aiworkflowalchemy.com/) already has:
- Claude AI integration
- Presentation generator
- JavaScript/Python infrastructure

**Integration Steps:**

1. **Add Transcription Route:**
   ```bash
   # In your existing site structure
   mkdir -p transcription
   # Copy backend and frontend files
   ```

2. **Update Navigation:**
   ```html
   <!-- Add to main navigation -->
   <a href="/transcription">AI Transcription</a>
   ```

3. **Create Landing Page:**
   ```html
   <!-- transcription/index.html -->
   <!DOCTYPE html>
   <html>
   <head>
     <title>AI Transcription - AI Workflow Alchemy</title>
     <!-- Use same styling as presentation generator -->
   </head>
   <body>
     <div id="transcription-app"></div>
     <script src="/transcription/app.js"></script>
   </body>
   </html>
   ```

### Option B: Standalone Deployment

**Step 4.2: Deploy Backend (Python/FastAPI)**

```bash
# Install dependencies
cd backend
pip install -r requirements.txt

# Run with uvicorn
uvicorn api.main:app --host 0.0.0.0 --port 8000

# Or use gunicorn for production
gunicorn api.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

**Step 4.3: Deploy Frontend (Next.js)**

```bash
cd frontend
npm install
npm run build
npm start
```

### Option C: Serverless Deployment (Vercel/Netlify)

**Step 4.4: Vercel Deployment**

1. **Create `vercel.json`:**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "frontend/package.json",
         "use": "@vercel/next"
       },
       {
         "src": "backend/api/main.py",
         "use": "@vercel/python"
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "backend/api/main.py"
       },
       {
         "src": "/(.*)",
         "dest": "frontend/$1"
       }
     ]
   }
   ```

2. **Deploy:**
   ```bash
   vercel deploy
   ```

---

## 5. Domain-Specific Configurations

### 5.1 aiworkflowalchemy.com

**Configuration:**
- Use existing Claude API key
- Match presentation generator UI/UX
- Add to main navigation
- Use same branding

**File: `config/aiworkflowalchemy.json`:**
```json
{
  "site": "aiworkflowalchemy.com",
  "branding": {
    "name": "AI Workflow Alchemy",
    "color": "#6366f1",
    "logo": "/logo.png"
  },
  "features": {
    "claude_integration": true,
    "presentation_generator": true,
    "transcription": true
  },
  "api_keys": {
    "claude": "${CLAUDE_API_KEY}",
    "openai": "${OPENAI_API_KEY}"
  }
}
```

### 5.2 avatararts.org

**Configuration:**
- Focus on creative/art use cases
- Emphasize video transcription
- Integration with art portfolio

**File: `config/avatararts.json`:**
```json
{
  "site": "avatararts.org",
  "branding": {
    "name": "AvatarArts",
    "color": "#8b5cf6",
    "logo": "/avatararts-logo.png"
  },
  "features": {
    "video_transcription": true,
    "art_portfolio": true,
    "creative_tools": true
  }
}
```

### 5.3 quantumforgelabs.org

**Configuration:**
- Technical/scientific focus
- Advanced features enabled
- Integration with quantum computing content

**File: `config/quantumforgelabs.json`:**
```json
{
  "site": "quantumforgelabs.org",
  "branding": {
    "name": "QuantumForgeLab",
    "color": "#06b6d4",
    "logo": "/quantumforgelabs-logo.png"
  },
  "features": {
    "advanced_transcription": true,
    "scientific_accuracy": true,
    "technical_documentation": true
  }
}
```

### 5.4 gptjunkie.com

**Configuration:**
- AI/ML focused
- Community features
- Integration with GPT tools

**File: `config/gptjunkie.json`:**
```json
{
  "site": "gptjunkie.com",
  "branding": {
    "name": "GPT Junkie",
    "color": "#10b981",
    "logo": "/gptjunkie-logo.png"
  },
  "features": {
    "ai_integration": true,
    "community_features": true,
    "gpt_tools": true
  }
}
```

---

## 6. Testing & Launch

### Step 6.1: Local Testing

```bash
# Terminal 1: Backend
cd backend
python -m uvicorn api.main:app --reload

# Terminal 2: Frontend
cd frontend
npm run dev

# Test at http://localhost:3000
```

### Step 6.2: Production Checklist

- [ ] Environment variables set
- [ ] API keys configured
- [ ] CORS configured correctly
- [ ] File upload limits set
- [ ] Database initialized
- [ ] SSL certificates installed
- [ ] Error handling tested
- [ ] Performance optimized
- [ ] Mobile responsive
- [ ] Browser compatibility tested

### Step 6.3: Launch Steps

1. **Deploy Backend:**
   ```bash
   # SSH to server
   ssh user@your-domain.com

   # Clone repository
   git clone <repo-url>
   cd transcription-service

   # Install dependencies
   pip install -r backend/requirements.txt

   # Run with systemd
   sudo systemctl start transcription-api
   ```

2. **Deploy Frontend:**
   ```bash
   # Build and deploy
   cd frontend
   npm run build
   # Upload to web server or deploy to Vercel/Netlify
   ```

3. **Update DNS:**
   - Point subdomain to server (e.g., transcription.aiworkflowalchemy.com)
   - Or add route to existing domain

4. **Monitor:**
   - Check logs
   - Monitor API usage
   - Track errors
   - Monitor performance

---

## 7. Additional Features (Future Enhancements)

### 7.1 Claude AI Integration (Like Presentation Generator)

```python
# backend/core/claude_summarizer.py
import anthropic

class ClaudeSummarizer:
    def __init__(self, api_key: str):
        self.client = anthropic.Anthropic(api_key=api_key)

    async def generate_summary(self, transcription: Dict[str, Any]) -> Dict[str, Any]:
        prompt = f"""
        Summarize this transcription in a clear, concise way:

        {transcription['text']}

        Provide:
        1. Main points
        2. Key takeaways
        3. Action items (if any)
        """

        message = await self.client.messages.create(
            model="claude-3-sonnet-20240229",
            max_tokens=1000,
            messages=[{"role": "user", "content": prompt}]
        )

        return {
            "summary": message.content[0].text,
            "model": "claude-3-sonnet"
        }
```

### 7.2 Apify Template (Like Presentation Generator)

Create Apify actor for transcription service:

```javascript
// apify/main.js
const Apify = require('apify');
const { whisperx } = require('whisperx');

Apify.main(async () => {
    const input = await Apify.getInput();

    // Process transcription
    const result = await transcribe(input.audioUrl, {
        language: input.language,
        speakerDiarization: input.speakerDiarization
    });

    await Apify.pushData(result);
});
```

---

## 📚 Resources

- **FastAPI Docs:** https://fastapi.tiangolo.com/
- **WhisperX:** https://github.com/m-bain/whisperX
- **Next.js:** https://nextjs.org/
- **AI Workflow Alchemy:** https://aiworkflowalchemy.com/ (reference implementation)

---

**Implementation Status:** Ready for deployment
**Recommended Start:** aiworkflowalchemy.com (existing infrastructure)
**Estimated Time:** 2-3 days for full implementation

---

*This guide provides a complete step-by-step implementation for deploying NOTEGPT-style transcription across all your domains.*
