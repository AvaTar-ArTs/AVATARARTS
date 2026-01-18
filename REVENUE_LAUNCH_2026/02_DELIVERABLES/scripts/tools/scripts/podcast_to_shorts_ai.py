#!/usr/bin/env python3
"""
Podcast to Shorts AI - Complete Automation Pipeline
Converts podcast audio into YouTube Shorts with AI-powered transcription, analysis, and video generation

Strategic Position: AvatarArts.org Creative Expression Pillar
AEO Target: "Convert podcast to YouTube Shorts automatically"
"""

import argparse
import json
import os
import sys
from pathlib import Path
from typing import Dict, List, Optional
import subprocess

# Add project to path
PROJECT_ROOT = Path(__file__).parent.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))
sys.path.insert(0, str(PROJECT_ROOT / "mp3-analyze-transcribe" / "python" / "mp4-mp3-trans-keys"))

# Load environment
def load_env_d():
    """Load all .env files from ~/.env.d directory."""
    env_d_path = Path.home() / ".env.d"
    if not env_d_path.exists():
        return

    all_env_files = list(env_d_path.glob("*.env"))
    priority_files = []
    other_files = []

    for env_file in all_env_files:
        if env_file.name == "llm-apis.env":
            priority_files.insert(0, env_file)
        elif env_file.name == "MASTER_CONSOLIDATED.env":
            priority_files.append(env_file)
        else:
            other_files.append(env_file)

    other_files.sort(key=lambda x: x.name)

    for env_file in priority_files + other_files:
        try:
            with open(env_file, encoding="utf-8") as f:
                for line_num, line in enumerate(f, 1):
                    line = line.strip()
                    if not line or line.startswith("#"):
                        continue
                    if line.startswith("export "):
                        line = line[7:].strip()
                    if line.startswith("source "):
                        continue
                    if "=" in line:
                        key, value = line.split("=", 1)
                        key = key.strip()
                        value = value.strip()
                        if value.startswith('"') and value.endswith('"'):
                            value = value[1:-1]
                        elif value.startswith("'") and value.endswith("'"):
                            value = value[1:-1]
                        if key and not key.startswith("#"):
                            os.environ[key] = value
        except Exception as e:
            print(f"Warning: Error loading {env_file.name}: {e}")

load_env_d()

# Import transcription and analysis tools
try:
    from transcribe import transcribe_audio
    from analyze import analyze_text
except ImportError:
    # Fallback to project scripts
    sys.path.insert(0, str(PROJECT_ROOT / "mp3-analyze-transcribe" / "python" / "mp4-mp3-trans-keys"))
    from transcribe import transcribe_audio
    from analyze import analyze_text

try:
    from create_missing_transcripts import transcribe_audio as transcribe_audio_advanced
    from create_missing_transcripts import analyze_transcript as analyze_transcript_advanced
    USE_ADVANCED = True
except ImportError:
    USE_ADVANCED = False

from openai import OpenAI

client = OpenAI()


class PodcastToShortsAI:
    """Complete pipeline for converting podcasts to YouTube Shorts"""
    
    def __init__(self, output_dir: Optional[Path] = None):
        self.output_dir = output_dir or PROJECT_ROOT / "output" / "podcast_to_shorts"
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
    def transcribe_podcast(self, audio_file: Path) -> str:
        """Transcribe podcast audio to text with timestamps"""
        print(f"📝 Transcribing: {audio_file.name}")
        
        if USE_ADVANCED:
            transcript = transcribe_audio_advanced(audio_file)
        else:
            transcript = transcribe_audio(str(audio_file))
        
        # Save transcript
        transcript_file = self.output_dir / f"{audio_file.stem}_transcript.txt"
        transcript_file.write_text(transcript, encoding="utf-8")
        print(f"✅ Transcript saved: {transcript_file}")
        
        return transcript
    
    def extract_key_moments(self, transcript: str, max_moments: int = 5, audio_file: Optional[Path] = None) -> List[Dict]:
        """Extract key moments from transcript for Shorts creation"""
        print(f"🔍 Extracting {max_moments} key moments...")
        
        prompt = f"""Analyze this podcast transcript and identify the {max_moments} most engaging, shareable moments that would work well as YouTube Shorts.

For each moment, provide:
1. Start timestamp (MM:SS format)
2. End timestamp (MM:SS format)
3. Key quote or summary (max 50 words)
4. Why it's engaging (hook, emotion, value)
5. Suggested Shorts title

Transcript:
{transcript[:4000]}  # Limit to avoid token limits

Format as JSON with a "moments" array. Each moment should have: start_time, end_time, quote, engagement_reason, suggested_title"""

        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an expert at identifying viral-worthy moments in podcast content for YouTube Shorts."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.7
            )
            
            result = json.loads(response.choices[0].message.content)
            moments = result.get("moments", [])
            
            # Save key moments
            if audio_file:
                moments_file = self.output_dir / f"{audio_file.stem}_key_moments.json"
            else:
                moments_file = self.output_dir / "key_moments.json"
            moments_file.write_text(json.dumps(moments, indent=2), encoding="utf-8")
            print(f"✅ Key moments saved: {moments_file}")
            
            return moments
        except Exception as e:
            print(f"⚠️  Error extracting key moments: {e}")
            return []
    
    def generate_shorts_scripts(self, moments: List[Dict]) -> List[Dict]:
        """Generate YouTube Shorts scripts for each key moment"""
        print(f"✍️  Generating Shorts scripts for {len(moments)} moments...")
        
        scripts = []
        for i, moment in enumerate(moments, 1):
            print(f"   Generating script {i}/{len(moments)}...")
            
            prompt = f"""Create a YouTube Shorts script (15-60 seconds) based on this key moment:

Quote: {moment.get('quote', '')}
Engagement Reason: {moment.get('engagement_reason', '')}

Requirements:
- Hook in first 3 seconds
- Clear value proposition
- Call to action
- Optimized for 15-60 second format
- Engaging and shareable

Provide:
1. Hook (first 3 seconds)
2. Main content (15-50 seconds)
3. CTA (last 3 seconds)
4. Suggested visuals/imagery
5. Hashtags (5-10 relevant)"""

            try:
                response = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": "You are an expert YouTube Shorts scriptwriter who creates viral-worthy content."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.8
                )
                
                script_content = response.choices[0].message.content
                
                script = {
                    "moment_number": i,
                    "original_moment": moment,
                    "script": script_content,
                    "duration_estimate": "30-60 seconds"
                }
                scripts.append(script)
                
            except Exception as e:
                print(f"⚠️  Error generating script for moment {i}: {e}")
        
        # Save scripts
        scripts_file = self.output_dir / f"{audio_file.stem}_shorts_scripts.json"
        scripts_file.write_text(json.dumps(scripts, indent=2), encoding="utf-8")
        print(f"✅ Scripts saved: {scripts_file}")
        
        return scripts
    
    def generate_shorts_titles(self, scripts: List[Dict]) -> List[Dict]:
        """Generate catchy YouTube Shorts titles"""
        print(f"📌 Generating titles for {len(scripts)} Shorts...")
        
        titles = []
        for script in scripts:
            prompt = f"""Generate 5 catchy, trending YouTube Shorts titles based on this script:

{script.get('script', '')[:500]}

Requirements:
- Under 60 characters
- Include numbers or power words when possible
- Create curiosity or urgency
- Optimized for YouTube Shorts algorithm
- Trend-aligned"""

            try:
                response = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": "You are an expert at creating viral YouTube Shorts titles."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.9
                )
                
                title_options = response.choices[0].message.content
                titles.append({
                    "moment_number": script["moment_number"],
                    "title_options": title_options,
                    "recommended": title_options.split("\n")[0] if "\n" in title_options else title_options
                })
                
            except Exception as e:
                print(f"⚠️  Error generating titles: {e}")
        
        return titles
    
    def generate_shorts_descriptions(self, scripts: List[Dict]) -> List[Dict]:
        """Generate YouTube Shorts descriptions"""
        print(f"📝 Generating descriptions for {len(scripts)} Shorts...")
        
        descriptions = []
        for script in scripts:
            prompt = f"""Create a YouTube Shorts description (150-200 words) based on this script:

{script.get('script', '')[:500]}

Include:
- Compelling hook
- Key value points
- Call to action
- 5-10 relevant hashtags
- Engagement questions"""

            try:
                response = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": "You are an expert at writing engaging YouTube Shorts descriptions."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.8
                )
                
                description = response.choices[0].message.content
                descriptions.append({
                    "moment_number": script["moment_number"],
                    "description": description
                })
                
            except Exception as e:
                print(f"⚠️  Error generating description: {e}")
        
        return descriptions
    
    def process_podcast(self, audio_file: Path, max_shorts: int = 5) -> Dict:
        """Complete pipeline: Podcast → Shorts"""
        
        print(f"\n🎬 Processing Podcast: {audio_file.name}")
        print("=" * 80)
        
        results = {
            "audio_file": str(audio_file),
            "transcript": None,
            "key_moments": [],
            "shorts_scripts": [],
            "titles": [],
            "descriptions": [],
            "output_dir": str(self.output_dir)
        }
        
        # Step 1: Transcribe
        transcript = self.transcribe_podcast(audio_file)
        results["transcript"] = transcript[:500] + "..." if len(transcript) > 500 else transcript
        
        # Step 2: Extract key moments
        moments = self.extract_key_moments(transcript, max_moments=max_shorts, audio_file=audio_file)
        results["key_moments"] = moments
        
        if not moments:
            print("⚠️  No key moments extracted. Cannot proceed.")
            return results
        
        # Step 3: Generate scripts
        scripts = self.generate_shorts_scripts(moments)
        results["shorts_scripts"] = scripts
        
        # Step 4: Generate titles
        titles = self.generate_shorts_titles(scripts)
        results["titles"] = titles
        
        # Step 5: Generate descriptions
        descriptions = self.generate_shorts_descriptions(scripts)
        results["descriptions"] = descriptions
        
        # Save complete results
        results_file = self.output_dir / f"{audio_file.stem}_complete_results.json"
        results_file.write_text(json.dumps(results, indent=2), encoding="utf-8")
        
        print("\n" + "=" * 80)
        print("✅ PODCAST TO SHORTS PROCESSING COMPLETE!")
        print("=" * 80)
        print(f"\n📁 Output Directory: {self.output_dir}")
        print(f"📊 Generated {len(scripts)} Shorts scripts")
        print(f"📌 Generated {len(titles)} title sets")
        print(f"📝 Generated {len(descriptions)} descriptions")
        print(f"\n💡 Next Steps:")
        print(f"   1. Review scripts in: {self.output_dir}")
        print(f"   2. Use create_video.py to generate actual videos")
        print(f"   3. Upload to YouTube with generated titles/descriptions")
        
        return results


def main():
    parser = argparse.ArgumentParser(
        description="Podcast to Shorts AI - Convert podcasts to YouTube Shorts automatically",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Process a single podcast
  python podcast_to_shorts_ai.py --audio podcast.mp3
  
  # Process with custom output directory
  python podcast_to_shorts_ai.py --audio podcast.mp3 --output ./shorts_output
  
  # Generate 10 Shorts from one podcast
  python podcast_to_shorts_ai.py --audio podcast.mp3 --max-shorts 10
        """
    )
    
    parser.add_argument(
        "--audio", "-a",
        type=str,
        required=True,
        help="Path to podcast audio file (MP3, WAV, M4A)"
    )
    
    parser.add_argument(
        "--output", "-o",
        type=str,
        help="Output directory for generated content"
    )
    
    parser.add_argument(
        "--max-shorts", "-m",
        type=int,
        default=5,
        help="Maximum number of Shorts to generate (default: 5)"
    )
    
    args = parser.parse_args()
    
    audio_file = Path(args.audio)
    if not audio_file.exists():
        print(f"❌ Error: Audio file not found: {audio_file}")
        sys.exit(1)
    
    output_dir = Path(args.output) if args.output else None
    
    processor = PodcastToShortsAI(output_dir=output_dir)
    results = processor.process_podcast(audio_file, max_shorts=args.max_shorts)
    
    print(f"\n✅ Complete results saved to: {processor.output_dir}")


if __name__ == "__main__":
    main()
