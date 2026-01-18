#!/usr/bin/env python3
"""
Example Transcription Script
Based on patterns from ~/pythons/transcribe scripts
"""

# Load environment variables (following your pattern)
from pathlib import Path as PathLib
import os

def load_env_d():
    """Load all .env files from ~/.env.d directory"""
    env_d_path = PathLib.home() / ".env.d"
    if env_d_path.exists():
        for env_file in env_d_path.glob("*.env"):
            try:
                with open(env_file) as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith("#") and "=" in line:
                            if line.startswith("export "):
                                line = line[7:]
                            key, value = line.split("=", 1)
                            key = key.strip()
                            value = value.strip().strip('\'').strip("\"")
                            if not key.startswith("source"):
                                os.environ[key] = value
            except Exception as e:
                print(f"Warning: Error loading {env_file}: {e}")

load_env_d()

try:
    from dotenv import load_dotenv
    load_dotenv(os.path.expanduser("~/.env"))
except ImportError:
    pass

import whisperx
from pathlib import Path
import json

def transcribe_media_file(media_path: str, output_dir: str = "transcripts"):
    """
    Transcribe media file with WhisperX (word-level timestamps, speaker diarization).
    
    Args:
        media_path: Path to audio/video file
        output_dir: Directory to save transcript
    
    Returns:
        Transcription result dictionary
    """
    media_path = Path(media_path)
    output_dir = Path(output_dir)
    output_dir.mkdir(exist_ok=True)
    
    # Load model
    device = "cpu"  # or "cuda" for GPU
    model = whisperx.load_model("base", device=device)
    
    # Load audio
    audio = whisperx.load_audio(str(media_path), device=device)
    
    # Transcribe
    result = model.transcribe(audio, language="en")
    detected_language = result.get("language", "en")
    
    # Align for word-level timestamps
    model_a, metadata = whisperx.load_align_model(detected_language, device=device)
    result = whisperx.align(
        result["segments"], 
        model_a, 
        metadata, 
        audio, 
        device,
        return_char_alignments=False
    )
    
    # Speaker diarization (optional)
    try:
        diarize_model = whisperx.DiarizationPipeline(use_auth_token=None, device=device)
        diarize_segments = diarize_model(audio)
        result = whisperx.assign_word_speakers(diarize_segments, result)
    except Exception as e:
        print(f"Warning: Speaker diarization failed: {e}")
    
    # Save transcript
    output_path = output_dir / f"{media_path.stem}_transcript.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    
    # Save text version
    text_path = output_dir / f"{media_path.stem}_transcript.txt"
    with open(text_path, "w", encoding="utf-8") as f:
        f.write(result.get("text", ""))
    
    return result

if __name__ == "__main__":
    # Example usage
    media_file = "path/to/your/audio.mp3"
    result = transcribe_media_file(media_file)
    print(f"Transcription complete: {result.get('text', '')[:100]}...")
