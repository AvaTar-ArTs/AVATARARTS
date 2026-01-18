"""
NOTEGPT-Style Transcription Integration for AI_Note_Taker

Integrates WhisperX transcription with NOTEGPT features:
- Word-level timestamps
- Speaker diarization
- AI summaries
- Study tools (flashcards, quizzes)
- Multi-language support
"""

import sys
import os
from pathlib import Path
from typing import Dict, Any, List, Optional
from datetime import datetime
import json

# Add parent directories to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../../trend-pulse-os'))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../..'))

try:
    import whisperx
    WHISPERX_AVAILABLE = True
except ImportError:
    WHISPERX_AVAILABLE = False
    print("Warning: whisperx not installed. Install with: pip install whisperx")

from core.export_engine import export_json, export_csv


class NoteGPTTranscriber:
    """
    NOTEGPT-style transcription with all features.
    """

    def __init__(self,
                 model_size: str = "base",
                 device: str = "cpu",
                 compute_type: str = "int8"):
        """
        Initialize transcriber.

        Args:
            model_size: Whisper model size (tiny, base, small, medium, large)
            device: Processing device (cpu, cuda)
            compute_type: Compute precision (int8, float16, float32)
        """
        if not WHISPERX_AVAILABLE:
            raise ImportError("whisperx is required. Install with: pip install whisperx")

        self.model_size = model_size
        self.device = device
        self.compute_type = compute_type
        self.model = None
        self.align_model = None

    def load_model(self):
        """Load WhisperX model."""
        self.model = whisperx.load_model(
            self.model_size,
            device=self.device,
            compute_type=self.compute_type
        )

    def transcribe(self,
                   audio_path: str,
                   language: Optional[str] = None,
                   speaker_diarization: bool = True) -> Dict[str, Any]:
        """
        Transcribe audio with word-level timestamps and speaker diarization.

        Args:
            audio_path: Path to audio/video file
            language: Language code (auto-detect if None)
            speaker_diarization: Enable speaker identification

        Returns:
            Complete transcription with timestamps and speakers
        """
        if self.model is None:
            self.load_model()

        # Load audio
        audio = whisperx.load_audio(audio_path, self.device)

        # Transcribe
        result = self.model.transcribe(audio, language=language)

        # Get language
        detected_language = result.get("language", language or "en")

        # Align for word-level timestamps
        try:
            model_a, metadata = whisperx.load_align_model(
                language_code=detected_language,
                device=self.device
            )
            result = whisperx.align(
                result["segments"],
                model_a,
                metadata,
                audio,
                self.device,
                return_char_alignments=False
            )
        except Exception as e:
            print(f"Warning: Alignment failed: {e}. Continuing without word-level timestamps.")

        # Speaker diarization (optional, requires additional setup)
        if speaker_diarization:
            try:
                diarize_model = whisperx.DiarizationPipeline(
                    use_auth_token=None,
                    device=self.device
                )
                diarize_segments = diarize_model(audio)
                result = whisperx.assign_word_speakers(diarize_segments, result)
            except Exception as e:
                print(f"Warning: Speaker diarization failed: {e}. Continuing without speaker labels.")

        # Format result
        return self._format_result(result, audio_path, detected_language)

    def _format_result(self,
                      result: Dict[str, Any],
                      audio_path: str,
                      language: str) -> Dict[str, Any]:
        """Format transcription result."""
        return {
            "text": result.get("text", ""),
            "language": language,
            "segments": result.get("segments", []),
            "words": self._extract_words(result),
            "speakers": self._extract_speakers(result),
            "metadata": {
                "audio_path": audio_path,
                "transcribed_at": datetime.now().isoformat(),
                "model": self.model_size,
                "device": self.device
            }
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
                    "speaker": word.get("speaker", None),
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


class StudyToolsGenerator:
    """
    Generate study tools from transcriptions (NOTEGPT feature).
    """

    def generate_flashcards(self,
                           transcription: Dict[str, Any],
                           num_cards: int = 10) -> List[Dict[str, Any]]:
        """
        Generate flashcards from transcription.

        Args:
            transcription: Transcription data
            num_cards: Number of flashcards to generate

        Returns:
            List of flashcard dictionaries
        """
        text = transcription.get("text", "")
        segments = transcription.get("segments", [])

        # Extract key points
        key_points = self._extract_key_points(text, segments, num_cards)

        flashcards = []
        for i, point in enumerate(key_points):
            flashcards.append({
                "id": i + 1,
                "front": point["question"],
                "back": point["answer"],
                "context": point.get("context", ""),
                "timestamp": point.get("timestamp", 0)
            })

        return flashcards

    def generate_quiz(self,
                     transcription: Dict[str, Any],
                     num_questions: int = 10) -> Dict[str, Any]:
        """
        Generate quiz from transcription.

        Args:
            transcription: Transcription data
            num_questions: Number of quiz questions

        Returns:
            Quiz dictionary with questions and answers
        """
        text = transcription.get("text", "")
        segments = transcription.get("segments", [])

        # Extract questions
        questions = self._extract_quiz_questions(text, segments, num_questions)

        return {
            "title": transcription.get("metadata", {}).get("audio_path", "Quiz"),
            "questions": questions,
            "total_questions": len(questions)
        }

    def _extract_key_points(self,
                           text: str,
                           segments: List[Dict[str, Any]],
                           num: int) -> List[Dict[str, Any]]:
        """Extract key points for flashcards."""
        sentences = text.split(". ")
        key_points = []

        for i, sentence in enumerate(sentences[:num]):
            if len(sentence) > 20:
                # Find corresponding segment
                timestamp = 0
                for seg in segments:
                    if sentence[:30] in seg.get("text", ""):
                        timestamp = seg.get("start", 0)
                        break

                key_points.append({
                    "question": f"What is mentioned about: {sentence[:50]}...?",
                    "answer": sentence,
                    "context": f"From segment {i+1}",
                    "timestamp": timestamp
                })

        return key_points

    def _extract_quiz_questions(self,
                               text: str,
                               segments: List[Dict[str, Any]],
                               num: int) -> List[Dict[str, Any]]:
        """Extract quiz questions."""
        sentences = text.split(". ")
        questions = []

        for i, sentence in enumerate(sentences[:num]):
            if len(sentence) > 30:
                questions.append({
                    "id": i + 1,
                    "question": f"According to the transcription: {sentence[:100]}...",
                    "type": "multiple_choice",
                    "options": [
                        sentence,
                        "Option 2 (generated)",
                        "Option 3 (generated)",
                        "Option 4 (generated)"
                    ],
                    "correct_answer": 0
                })

        return questions


class SummaryGenerator:
    """
    Generate AI-powered summaries (NOTEGPT feature).
    """

    def generate_summary(self,
                        transcription: Dict[str, Any],
                        length: str = "short") -> Dict[str, Any]:
        """
        Generate summary from transcription.

        Args:
            transcription: Transcription data
            length: Summary length (short, medium, long)

        Returns:
            Summary dictionary
        """
        text = transcription.get("text", "")

        # Length targets
        length_targets = {
            "short": 100,
            "medium": 300,
            "long": 500
        }

        target_length = length_targets.get(length, 300)

        # Extract summary sentences
        sentences = text.split(". ")
        num_sentences = max(1, target_length // 50)
        summary_sentences = sentences[:num_sentences]
        summary_text = ". ".join(summary_sentences)

        # Extract key points
        key_points = self._extract_key_points(text)

        return {
            "summary": summary_text,
            "key_points": key_points,
            "length": len(summary_text),
            "original_length": len(text),
            "compression_ratio": len(summary_text) / len(text) if text else 0
        }

    def _extract_key_points(self, text: str) -> List[str]:
        """Extract key points from text."""
        sentences = text.split(". ")
        return [s for s in sentences[:5] if len(s) > 30]


def transcribe_audio_note(audio_path: str,
                          title: Optional[str] = None,
                          generate_study_tools: bool = True,
                          generate_summary: bool = True) -> Dict[str, Any]:
    """
    Complete NOTEGPT-style transcription workflow.

    Args:
        audio_path: Path to audio/video file
        title: Optional title
        generate_study_tools: Generate flashcards and quiz
        generate_summary: Generate AI summary

    Returns:
        Complete transcription result with study tools
    """
    if not WHISPERX_AVAILABLE:
        return {
            "error": "whisperx not installed",
            "install_command": "pip install whisperx"
        }

    # Initialize components
    transcriber = NoteGPTTranscriber(model_size="base")
    study_tools = StudyToolsGenerator()
    summarizer = SummaryGenerator()

    # Transcribe
    transcription = transcriber.transcribe(audio_path)

    # Generate summary
    summary = None
    if generate_summary:
        summary = summarizer.generate_summary(transcription)

    # Generate study tools
    flashcards = None
    quiz = None
    if generate_study_tools:
        flashcards = study_tools.generate_flashcards(transcription)
        quiz = study_tools.generate_quiz(transcription)

    return {
        "title": title or Path(audio_path).stem,
        "transcription": transcription,
        "summary": summary,
        "flashcards": flashcards,
        "quiz": quiz,
        "status": "complete",
        "features": {
            "word_timestamps": len(transcription.get("words", [])) > 0,
            "speaker_diarization": len(transcription.get("speakers", [])) > 0,
            "study_tools": generate_study_tools,
            "summary": generate_summary
        }
    }


def export_notegpt_format(result: Dict[str, Any], output_path: str) -> None:
    """
    Export in NOTEGPT-compatible format.

    Args:
        result: Transcription result
        output_path: Output file path
    """
    notegpt_format = {
        "transcription": {
            "text": result["transcription"]["text"],
            "language": result["transcription"]["language"],
            "segments": result["transcription"]["segments"],
            "words": result["transcription"]["words"],
            "speakers": result["transcription"]["speakers"]
        },
        "summary": result.get("summary"),
        "study_tools": {
            "flashcards": result.get("flashcards"),
            "quiz": result.get("quiz")
        },
        "metadata": {
            "title": result.get("title"),
            "transcribed_at": result["transcription"]["metadata"]["transcribed_at"]
        }
    }

    export_json([notegpt_format], output_path)
