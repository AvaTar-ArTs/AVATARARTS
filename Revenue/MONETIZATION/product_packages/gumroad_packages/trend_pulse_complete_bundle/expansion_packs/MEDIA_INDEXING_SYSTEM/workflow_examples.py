#!/usr/bin/env python3
"""
Workflow Examples for Using Indexed Media

Examples showing how to use the indexed media for:
- Transcription
- Analysis
- Content generation
- Integration with expansion packs
"""

import json
from pathlib import Path
from typing import Dict, List, Any

# Load environment (following your pattern)
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


class MediaWorkflowExamples:
    """
    Example workflows for using indexed media.
    """

    def __init__(self, index_path: str = None):
        """Initialize with index file."""
        if index_path is None:
            # Find latest index
            index_dir = Path(__file__).parent / "indexed_media" / "index"
            index_files = sorted(index_dir.glob("media_index_*.json"), reverse=True)
            if index_files:
                index_path = index_files[0]
            else:
                raise FileNotFoundError("No index file found. Run index_and_analyze_media.py first.")

        with open(index_path, 'r', encoding='utf-8') as f:
            self.index = json.load(f)

        print(f"✅ Loaded index: {index_path}")
        print(f"   Music files: {self.index['music']['total']}")
        print(f"   Movie files: {self.index['movies']['total']}")

    def get_files_needing_transcription(self, media_type: str = 'all', limit: int = None) -> List[Dict[str, Any]]:
        """
        Get files that need transcription.

        Args:
            media_type: 'music', 'movies', or 'all'
            limit: Maximum number of files to return

        Returns:
            List of file information dictionaries
        """
        files_needing = []

        if media_type in ['music', 'all']:
            music_needing = [
                f for f in self.index['music']['files']
                if not f['has_transcript']
            ]
            files_needing.extend(music_needing)

        if media_type in ['movies', 'all']:
            movies_needing = [
                f for f in self.index['movies']['files']
                if not f['has_transcript']
            ]
            files_needing.extend(movies_needing)

        if limit:
            files_needing = files_needing[:limit]

        return files_needing

    def get_files_with_analysis(self, media_type: str = 'all') -> List[Dict[str, Any]]:
        """Get files that have analysis available."""
        files_with_analysis = []

        if media_type in ['music', 'all']:
            music_analysis = [
                f for f in self.index['music']['files']
                if f['has_analysis']
            ]
            files_with_analysis.extend(music_analysis)

        if media_type in ['movies', 'all']:
            movies_analysis = [
                f for f in self.index['movies']['files']
                if f['has_analysis']
            ]
            files_with_analysis.extend(movies_analysis)

        return files_with_analysis

    def example_batch_transcription(self, limit: int = 10):
        """
        Example: Batch transcribe files using NOTEGPT integration.
        """
        print("\n" + "="*60)
        print("EXAMPLE 1: Batch Transcription")
        print("="*60)

        # Get files needing transcription
        files_needing = self.get_files_needing_transcription(limit=limit)

        print(f"\n📋 Found {len(files_needing)} files needing transcription")
        print(f"   Processing first {min(limit, len(files_needing))} files...\n")

        # Example workflow (commented out - requires actual transcription)
        workflow_code = '''
# Import NOTEGPT integration
from AI_Note_Taker.notegpt_integration import transcribe_audio_note

# Process each file
for file_info in files_needing:
    print(f"Transcribing: {file_info['name']}")

    try:
        # Transcribe with full features
        result = transcribe_audio_note(
            file_info['path'],
            title=file_info['stem'],
            generate_study_tools=True,
            generate_summary=True
        )

        # Save results
        output_dir = Path("transcripts") / file_info['type']
        output_dir.mkdir(parents=True, exist_ok=True)

        # Save transcript
        transcript_path = output_dir / f"{file_info['stem']}_transcript.json"
        with open(transcript_path, 'w') as f:
            json.dump(result, f, indent=2)

        print(f"  ✅ Saved to {transcript_path}")

    except Exception as e:
        print(f"  ❌ Error: {e}")
'''

        print("Workflow Code:")
        print(workflow_code)

        # Show file list
        print("\nFiles to process:")
        for i, file_info in enumerate(files_needing[:limit], 1):
            print(f"  {i}. {file_info['name']} ({file_info['size_mb']} MB)")

    def example_content_generation(self):
        """
        Example: Generate content from existing analysis.
        """
        print("\n" + "="*60)
        print("EXAMPLE 2: Content Generation from Analysis")
        print("="*60)

        # Get files with analysis
        files_with_analysis = self.get_files_with_analysis()

        print(f"\n📊 Found {len(files_with_analysis)} files with analysis")
        print("   Can generate content from these files\n")

        workflow_code = '''
# Read analysis files and generate content
for file_info in files_with_analysis[:10]:  # First 10
    # Read analysis
    analysis_path = Path(file_info['has_analysis'])
    with open(analysis_path, 'r') as f:
        analysis_content = f.read()

    # Extract themes, tone, key points
    # Generate blog post
    blog_post = generate_blog_post_from_analysis(
        file_info['name'],
        analysis_content
    )

    # Generate social media content
    social_content = generate_social_content(
        analysis_content,
        platforms=['twitter', 'instagram', 'linkedin']
    )

    # Save generated content
    save_generated_content(file_info, blog_post, social_content)
'''

        print("Workflow Code:")
        print(workflow_code)

        # Show example files
        print("\nExample files with analysis:")
        for i, file_info in enumerate(files_with_analysis[:5], 1):
            print(f"  {i}. {file_info['name']}")
            if file_info['has_analysis']:
                print(f"     Analysis: {file_info['has_analysis']}")

    def example_study_tools_generation(self):
        """
        Example: Generate study tools from transcripts.
        """
        print("\n" + "="*60)
        print("EXAMPLE 3: Study Tools Generation")
        print("="*60)

        # Get files with transcripts
        files_with_transcripts = [
            f for f in self.index['music']['files'] + self.index['movies']['files']
            if f['has_transcript']
        ]

        print(f"\n📚 Found {len(files_with_transcripts)} files with transcripts")
        print("   Can generate study tools from these\n")

        workflow_code = '''
# Generate study tools from transcripts
for file_info in files_with_transcripts[:10]:
    # Load transcript
    transcript_path = Path(file_info['has_transcript'])
    with open(transcript_path, 'r') as f:
        transcript = json.load(f)  # or read as text

    # Generate flashcards
    flashcards = generate_flashcards(transcript, num_cards=20)

    # Generate quiz
    quiz = generate_quiz(transcript, num_questions=10)

    # Generate summary
    summary = generate_summary(transcript)

    # Export for Anki/Quizlet
    export_to_anki(flashcards, file_info['stem'])
    export_to_quizlet(quiz, file_info['stem'])
'''

        print("Workflow Code:")
        print(workflow_code)

    def example_seo_content_creation(self):
        """
        Example: Create SEO-optimized content from media.
        """
        print("\n" + "="*60)
        print("EXAMPLE 4: SEO Content Creation")
        print("="*60)

        workflow_code = '''
# Create SEO-optimized content from indexed media
for file_info in self.index['music']['files'][:20]:
    if file_info['has_analysis']:
        # Read analysis
        analysis_path = Path(file_info['has_analysis'])
        with open(analysis_path, 'r') as f:
            analysis = f.read()

        # Generate SEO blog post
        blog_post = {
            'title': f"Song Analysis: {file_info['stem']}",
            'meta_description': extract_meta_from_analysis(analysis),
            'content': generate_seo_content(analysis),
            'keywords': extract_keywords(analysis),
            'tags': extract_tags(analysis)
        }

        # Save for website
        save_blog_post(blog_post, file_info['stem'])
'''

        print("Workflow Code:")
        print(workflow_code)

    def example_integration_with_expansion_packs(self):
        """
        Example: Integrate with expansion packs.
        """
        print("\n" + "="*60)
        print("EXAMPLE 5: Expansion Pack Integration")
        print("="*60)

        workflow_code = '''
# Integration with AI_Note_Taker
from AI_Note_Taker.notegpt_integration import transcribe_audio_note

# Transcribe and create notes
for file_info in files_needing[:10]:
    result = transcribe_audio_note(file_info['path'])
    note = convert_to_note(result, file_info)
    save_note(note)

# Integration with Podcast_to_Shorts_AI
from Podcast_to_Shorts_AI.workflows.workflow import extract_clips

# Extract clips from movie transcriptions
for file_info in self.index['movies']['files']:
    if file_info['has_transcript']:
        clips = extract_clips_from_transcript(file_info['path'])
        generate_shorts(clips)

# Integration with AI_Content_Repurposing
from AI_Content_Repurposing.workflows.workflow import repurpose_content

# Repurpose music/movie content
for file_info in files_with_analysis:
    repurposed = repurpose_content(
        file_info['path'],
        formats=['blog', 'social', 'video']
    )
'''

        print("Workflow Code:")
        print(workflow_code)

    def generate_workflow_report(self):
        """Generate comprehensive workflow report."""
        report = []
        report.append("="*60)
        report.append("MEDIA WORKFLOW EXAMPLES REPORT")
        report.append("="*60)
        report.append("")

        # Statistics
        music_needing = len([f for f in self.index['music']['files'] if not f['has_transcript']])
        movies_needing = len([f for f in self.index['movies']['files'] if not f['has_transcript']])

        report.append("📊 WORKFLOW OPPORTUNITIES")
        report.append("")
        report.append(f"1. Batch Transcription")
        report.append(f"   - {music_needing} music files need transcription")
        report.append(f"   - {movies_needing} movie files need transcription")
        report.append(f"   - Use NOTEGPT integration for processing")
        report.append("")

        report.append(f"2. Content Generation")
        report.append(f"   - {len(self.get_files_with_analysis())} files have analysis")
        report.append(f"   - Generate blog posts, social media, SEO content")
        report.append("")

        report.append(f"3. Study Tools")
        report.append(f"   - {len([f for f in self.index['music']['files'] + self.index['movies']['files'] if f['has_transcript']])} files have transcripts")
        report.append(f"   - Generate flashcards, quizzes, summaries")
        report.append("")

        report.append("="*60)

        return "\n".join(report)


if __name__ == "__main__":
    # Initialize
    examples = MediaWorkflowExamples()

    # Run examples
    examples.example_batch_transcription(limit=10)
    examples.example_content_generation()
    examples.example_study_tools_generation()
    examples.example_seo_content_creation()
    examples.example_integration_with_expansion_packs()

    # Generate report
    report = examples.generate_workflow_report()
    print("\n" + report)

    # Save report
    report_path = Path(__file__).parent / "indexed_media" / "workflow_examples_report.txt"
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write(report)
    print(f"\n💾 Saved workflow report to: {report_path}")
