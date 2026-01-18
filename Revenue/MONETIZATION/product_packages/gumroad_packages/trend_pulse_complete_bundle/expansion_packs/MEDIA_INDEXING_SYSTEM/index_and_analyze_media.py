#!/usr/bin/env python3
"""
Comprehensive Media Indexing and Analysis System

Indexes ~/music/nocturnemelodies and ~/movies directories
Creates transcripts, analysis, and examples based on existing patterns
"""

import os
import json
import csv
from pathlib import Path
from datetime import datetime
from collections import defaultdict
from typing import Dict, List, Any, Optional
import hashlib

# Load environment variables (following your pattern)
from pathlib import Path as PathLib

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


class MediaIndexer:
    """
    Comprehensive media indexing and analysis system.
    Based on patterns from ~/pythons/transcribe scripts.
    """

    def __init__(self):
        self.home = Path.home()
        self.music_dir = self.home / "music" / "nocturnemelodies"
        self.movies_dir = self.home / "movies"
        self.pythons_dir = self.home / "pythons"

        # Output directories
        self.output_dir = Path(__file__).parent / "indexed_media"
        self.output_dir.mkdir(exist_ok=True)

        self.transcripts_dir = self.output_dir / "transcripts"
        self.analysis_dir = self.output_dir / "analysis"
        self.examples_dir = self.output_dir / "examples"
        self.index_dir = self.output_dir / "index"

        for dir in [self.transcripts_dir, self.analysis_dir, self.examples_dir, self.index_dir]:
            dir.mkdir(exist_ok=True)

        # Media file extensions
        self.audio_extensions = {'.mp3', '.wav', '.m4a', '.ogg', '.flac', '.aac'}
        self.video_extensions = {'.mp4', '.mov', '.avi', '.webm', '.mkv', '.m4v'}

        # Index data
        self.media_index = {
            'music': [],
            'movies': [],
            'transcripts': [],
            'analysis': [],
            'metadata': {
                'indexed_at': datetime.now().isoformat(),
                'total_files': 0,
                'total_size': 0
            }
        }

    def scan_directory(self, directory: Path, media_type: str) -> List[Dict[str, Any]]:
        """
        Scan directory for media files.

        Args:
            directory: Directory to scan
            media_type: 'music' or 'movies'

        Returns:
            List of media file information
        """
        media_files = []
        extensions = self.audio_extensions if media_type == 'music' else self.video_extensions

        if not directory.exists():
            print(f"⚠️  Directory not found: {directory}")
            return media_files

        print(f"📂 Scanning {directory}...")

        for file_path in directory.rglob("*"):
            if not file_path.is_file():
                continue

            if file_path.suffix.lower() in extensions:
                try:
                    stat = file_path.stat()
                    media_files.append({
                        'path': str(file_path),
                        'relative_path': str(file_path.relative_to(directory)),
                        'name': file_path.name,
                        'stem': file_path.stem,
                        'extension': file_path.suffix.lower(),
                        'size': stat.st_size,
                        'size_mb': round(stat.st_size / (1024 * 1024), 2),
                        'modified': datetime.fromtimestamp(stat.st_mtime).isoformat(),
                        'type': media_type,
                        'directory': str(file_path.parent),
                        'has_transcript': self._check_transcript(file_path),
                        'has_analysis': self._check_analysis(file_path)
                    })
                except Exception as e:
                    print(f"⚠️  Error processing {file_path}: {e}")

        print(f"   Found {len(media_files)} {media_type} files")
        return media_files

    def _check_transcript(self, media_path: Path) -> Optional[str]:
        """Check if transcript exists for media file."""
        # Check common transcript locations
        transcript_patterns = [
            media_path.parent / f"{media_path.stem}_transcript.txt",
            media_path.parent / f"{media_path.stem}_transcript.md",
            media_path.parent / "transcript" / f"{media_path.stem}.txt",
            media_path.parent / "transcripts" / f"{media_path.stem}.txt",
            media_path.parent.parent / "transcript" / f"{media_path.stem}.txt",
        ]

        for pattern in transcript_patterns:
            if pattern.exists():
                return str(pattern)

        return None

    def _check_analysis(self, media_path: Path) -> Optional[str]:
        """Check if analysis exists for media file."""
        # Check common analysis locations
        analysis_patterns = [
            media_path.parent / f"{media_path.stem}_analysis.txt",
            media_path.parent / f"{media_path.stem}_analysis.md",
            media_path.parent / "analysis" / f"{media_path.stem}_analysis.txt",
            media_path.parent.parent / "analysis" / f"{media_path.stem}_analysis.txt",
        ]

        for pattern in analysis_patterns:
            if pattern.exists():
                return str(pattern)

        return None

    def find_existing_transcripts(self) -> Dict[str, List[str]]:
        """Find all existing transcript files."""
        transcripts = {
            'music': [],
            'movies': []
        }

        # Scan music directory
        if self.music_dir.exists():
            for transcript_file in self.music_dir.rglob("*transcript*"):
                if transcript_file.is_file() and transcript_file.suffix in ['.txt', '.md', '.json']:
                    transcripts['music'].append(str(transcript_file))

        # Scan movies directory
        if self.movies_dir.exists():
            for transcript_file in self.movies_dir.rglob("*transcript*"):
                if transcript_file.is_file() and transcript_file.suffix in ['.txt', '.md', '.json']:
                    transcripts['movies'].append(str(transcript_file))

        return transcripts

    def find_existing_analysis(self) -> Dict[str, List[str]]:
        """Find all existing analysis files."""
        analysis = {
            'music': [],
            'movies': []
        }

        # Scan music directory
        if self.music_dir.exists():
            for analysis_file in self.music_dir.rglob("*analysis*"):
                if analysis_file.is_file() and analysis_file.suffix in ['.txt', '.md', '.json']:
                    analysis['music'].append(str(analysis_file))

        # Scan movies directory
        if self.movies_dir.exists():
            for analysis_file in self.movies_dir.rglob("*analysis*"):
                if analysis_file.is_file() and analysis_file.suffix in ['.txt', '.md', '.json']:
                    analysis['movies'].append(str(analysis_file))

        return analysis

    def analyze_existing_scripts(self) -> Dict[str, Any]:
        """Analyze existing transcription scripts from ~/pythons."""
        scripts_info = {
            'transcription_scripts': [],
            'analysis_scripts': [],
            'patterns': {
                'env_loading': [],
                'api_usage': [],
                'output_formats': [],
                'features': []
            }
        }

        transcribe_dir = self.pythons_dir / "transcribe"
        if not transcribe_dir.exists():
            print(f"⚠️  Transcription scripts directory not found: {transcribe_dir}")
            return scripts_info

        # Find all Python scripts
        for script_file in transcribe_dir.rglob("*.py"):
            try:
                with open(script_file, 'r', encoding='utf-8') as f:
                    content = f.read()

                script_info = {
                    'path': str(script_file),
                    'name': script_file.name,
                    'size': script_file.stat().st_size,
                    'features': []
                }

                # Detect features
                if 'whisper' in content.lower():
                    script_info['features'].append('whisper')
                if 'openai' in content.lower():
                    script_info['features'].append('openai')
                if 'whisperx' in content.lower():
                    script_info['features'].append('whisperx')
                if 'word_timestamps' in content.lower() or 'word-level' in content.lower():
                    script_info['features'].append('word_timestamps')
                if 'speaker' in content.lower() and 'diarization' in content.lower():
                    script_info['features'].append('speaker_diarization')
                if 'analysis' in content.lower():
                    script_info['features'].append('analysis')

                # Detect output formats
                if '.srt' in content:
                    script_info['features'].append('srt_export')
                if '.vtt' in content:
                    script_info['features'].append('vtt_export')
                if '.json' in content:
                    script_info['features'].append('json_export')

                if 'transcribe' in script_file.name.lower():
                    scripts_info['transcription_scripts'].append(script_info)
                if 'analyze' in script_file.name.lower():
                    scripts_info['analysis_scripts'].append(script_info)

            except Exception as e:
                print(f"⚠️  Error reading {script_file}: {e}")

        return scripts_info

    def create_index(self) -> Dict[str, Any]:
        """Create comprehensive index of all media files."""
        print("\n" + "="*60)
        print("🔍 MEDIA INDEXING SYSTEM")
        print("="*60)

        # Scan directories
        music_files = self.scan_directory(self.music_dir, 'music')
        movie_files = self.scan_directory(self.movies_dir, 'movies')

        # Find existing transcripts and analysis
        print("\n📄 Finding existing transcripts...")
        transcripts = self.find_existing_transcripts()
        print(f"   Music transcripts: {len(transcripts['music'])}")
        print(f"   Movie transcripts: {len(transcripts['movies'])}")

        print("\n📊 Finding existing analysis...")
        analysis = self.find_existing_analysis()
        print(f"   Music analysis: {len(analysis['music'])}")
        print(f"   Movie analysis: {len(analysis['movies'])}")

        # Analyze existing scripts
        print("\n🔧 Analyzing existing scripts...")
        scripts_info = self.analyze_existing_scripts()
        print(f"   Transcription scripts: {len(scripts_info['transcription_scripts'])}")
        print(f"   Analysis scripts: {len(scripts_info['analysis_scripts'])}")

        # Build index
        self.media_index = {
            'music': {
                'files': music_files,
                'total': len(music_files),
                'total_size_mb': sum(f['size_mb'] for f in music_files),
                'with_transcripts': len([f for f in music_files if f['has_transcript']]),
                'with_analysis': len([f for f in music_files if f['has_analysis']]),
                'transcripts': transcripts['music'],
                'analysis': analysis['music']
            },
            'movies': {
                'files': movie_files,
                'total': len(movie_files),
                'total_size_mb': sum(f['size_mb'] for f in movie_files),
                'with_transcripts': len([f for f in movie_files if f['has_transcript']]),
                'with_analysis': len([f for f in movie_files if f['has_analysis']]),
                'transcripts': transcripts['movies'],
                'analysis': analysis['movies']
            },
            'scripts': scripts_info,
            'metadata': {
                'indexed_at': datetime.now().isoformat(),
                'total_files': len(music_files) + len(movie_files),
                'total_size_mb': sum(f['size_mb'] for f in music_files + movie_files),
                'music_files': len(music_files),
                'movie_files': len(movie_files),
                'total_transcripts': len(transcripts['music']) + len(transcripts['movies']),
                'total_analysis': len(analysis['music']) + len(analysis['movies'])
            }
        }

        return self.media_index

    def save_index(self):
        """Save index to JSON and CSV formats."""
        # Save JSON
        json_path = self.index_dir / f"media_index_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(self.media_index, f, indent=2, ensure_ascii=False)
        print(f"\n💾 Saved index to: {json_path}")

        # Save CSV for music
        if self.media_index['music']['files']:
            csv_path = self.index_dir / f"music_index_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
            with open(csv_path, 'w', newline='', encoding='utf-8') as f:
                writer = csv.DictWriter(f, fieldnames=[
                    'name', 'path', 'size_mb', 'modified', 'has_transcript', 'has_analysis'
                ])
                writer.writeheader()
                for file_info in self.media_index['music']['files']:
                    writer.writerow({
                        'name': file_info['name'],
                        'path': file_info['relative_path'],
                        'size_mb': file_info['size_mb'],
                        'modified': file_info['modified'],
                        'has_transcript': 'Yes' if file_info['has_transcript'] else 'No',
                        'has_analysis': 'Yes' if file_info['has_analysis'] else 'No'
                    })
            print(f"💾 Saved music index to: {csv_path}")

        # Save CSV for movies
        if self.media_index['movies']['files']:
            csv_path = self.index_dir / f"movies_index_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
            with open(csv_path, 'w', newline='', encoding='utf-8') as f:
                writer = csv.DictWriter(f, fieldnames=[
                    'name', 'path', 'size_mb', 'modified', 'has_transcript', 'has_analysis'
                ])
                writer.writeheader()
                for file_info in self.media_index['movies']['files']:
                    writer.writerow({
                        'name': file_info['name'],
                        'path': file_info['relative_path'],
                        'size_mb': file_info['size_mb'],
                        'modified': file_info['modified'],
                        'has_transcript': 'Yes' if file_info['has_transcript'] else 'No',
                        'has_analysis': 'Yes' if file_info['has_analysis'] else 'No'
                    })
            print(f"💾 Saved movies index to: {csv_path}")

    def generate_summary_report(self) -> str:
        """Generate human-readable summary report."""
        report = []
        report.append("="*60)
        report.append("MEDIA INDEXING SUMMARY REPORT")
        report.append("="*60)
        report.append(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append("")

        # Music summary
        music = self.media_index['music']
        report.append("🎵 MUSIC FILES (nocturnemelodies)")
        report.append(f"   Total files: {music['total']}")
        report.append(f"   Total size: {music['total_size_mb']:.2f} MB")
        report.append(f"   With transcripts: {music['with_transcripts']} ({music['with_transcripts']/music['total']*100:.1f}%)" if music['total'] > 0 else "   With transcripts: 0")
        report.append(f"   With analysis: {music['with_analysis']} ({music['with_analysis']/music['total']*100:.1f}%)" if music['total'] > 0 else "   With analysis: 0")
        report.append(f"   Existing transcripts: {len(music['transcripts'])}")
        report.append(f"   Existing analysis: {len(music['analysis'])}")
        report.append("")

        # Movies summary
        movies = self.media_index['movies']
        report.append("🎬 MOVIE FILES")
        report.append(f"   Total files: {movies['total']}")
        report.append(f"   Total size: {movies['total_size_mb']:.2f} MB")
        report.append(f"   With transcripts: {movies['with_transcripts']} ({movies['with_transcripts']/movies['total']*100:.1f}%)" if movies['total'] > 0 else "   With transcripts: 0")
        report.append(f"   With analysis: {movies['with_analysis']} ({movies['with_analysis']/movies['total']*100:.1f}%)" if movies['total'] > 0 else "   With analysis: 0")
        report.append(f"   Existing transcripts: {len(movies['transcripts'])}")
        report.append(f"   Existing analysis: {len(movies['analysis'])}")
        report.append("")

        # Scripts summary
        scripts = self.media_index['scripts']
        report.append("🔧 TRANSCRIPTION SCRIPTS")
        report.append(f"   Transcription scripts: {len(scripts['transcription_scripts'])}")
        report.append(f"   Analysis scripts: {len(scripts['analysis_scripts'])}")
        report.append("")

        # Overall summary
        meta = self.media_index['metadata']
        report.append("📊 OVERALL SUMMARY")
        report.append(f"   Total media files: {meta['total_files']}")
        report.append(f"   Total size: {meta['total_size_mb']:.2f} MB")
        report.append(f"   Total transcripts: {meta['total_transcripts']}")
        report.append(f"   Total analysis: {meta['total_analysis']}")
        report.append("")

        # Recommendations
        report.append("💡 RECOMMENDATIONS")
        music_needs = music['total'] - music['with_transcripts']
        movies_needs = movies['total'] - movies['with_transcripts']

        if music_needs > 0:
            report.append(f"   ⚠️  {music_needs} music files need transcription")
        if movies_needs > 0:
            report.append(f"   ⚠️  {movies_needs} movie files need transcription")

        if music_needs == 0 and movies_needs == 0:
            report.append("   ✅ All files have transcripts!")

        report.append("")
        report.append("="*60)

        return "\n".join(report)

    def create_example_transcription_script(self):
        """Create example transcription script based on existing patterns."""
        example_script = '''#!/usr/bin/env python3
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
                            value = value.strip().strip('\\'').strip("\\"")
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
'''

        example_path = self.examples_dir / "example_transcription_script.py"
        with open(example_path, 'w', encoding='utf-8') as f:
            f.write(example_script)
        print(f"📝 Created example script: {example_path}")

    def create_example_analysis_template(self):
        """Create example analysis template based on existing patterns."""
        template = '''# Media Analysis Template

**File:** {filename}
**Type:** {media_type}
**Duration:** {duration}
**Transcribed:** {transcribed_date}

## Transcription Summary

{transcription_text}

## Content Analysis

### Themes/Messages
{themes}

### Emotional Tone
{tone}

### Narrative Structure
{structure}

### Key Points
{key_points}

### Technical/Artistic Elements
{technical}

### Audience Impact
{impact}

## Recommendations

{recommendations}
'''

        template_path = self.examples_dir / "analysis_template.md"
        with open(template_path, 'w', encoding='utf-8') as f:
            f.write(template)
        print(f"📝 Created analysis template: {template_path}")

    def run(self):
        """Run complete indexing and analysis."""
        # Create index
        index = self.create_index()

        # Save index
        self.save_index()

        # Generate summary
        summary = self.generate_summary_report()
        summary_path = self.index_dir / f"summary_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
        with open(summary_path, 'w', encoding='utf-8') as f:
            f.write(summary)
        print(f"\n📄 Summary report: {summary_path}")

        # Create examples
        print("\n📝 Creating examples...")
        self.create_example_transcription_script()
        self.create_example_analysis_template()

        # Print summary
        print("\n" + summary)

        return index


if __name__ == "__main__":
    indexer = MediaIndexer()
    index = indexer.run()
