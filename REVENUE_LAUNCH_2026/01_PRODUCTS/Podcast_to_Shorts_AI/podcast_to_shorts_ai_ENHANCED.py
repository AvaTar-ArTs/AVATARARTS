#!/usr/bin/env python3
"""
Podcast to Shorts AI - Complete Automation Pipeline (ENHANCED VERSION)
Converts podcast audio into YouTube Shorts with AI-powered transcription, analysis, and video generation

Strategic Position: AvatarArts.org Creative Expression Pillar
AEO Target: "Convert podcast to YouTube Shorts automatically"

ENHANCED VERSION - Key Improvements:
- Production-ready environment loading (works in hosted environments)
- Retry logic with exponential backoff for API calls
- Enhanced, detailed prompts with comprehensive analysis
- Optional local dev support via ~/.env.d (fails silently if missing)

This version uses improved patterns from reference scripts:
- load_env_d() for optional local dev support
- Retry logic with exponential backoff and jitter
- Enhanced, detailed prompts with comprehensive analysis
"""

import argparse
import json
import os
import random
import sys
import time
from pathlib import Path
from typing import Dict, List, Optional


# Load environment variables (production-ready with local dev support)
# Priority: 1) Environment variables (set by hosting platform)
#           2) .env file in current directory (standard pattern)
#           3) ~/.env.d/*.env files (optional local dev convenience)

def load_env_d():
    """Load all .env files from ~/.env.d directory (optional, local dev only)"""
    try:
        env_d_path = Path.home() / ".env.d"
        if env_d_path.exists():
            for env_file in env_d_path.glob("*.env"):
                try:
                    with open(env_file, encoding="utf-8") as f:
                        for line in f:
                            line = line.strip()
                            if line and not line.startswith("#") and "=" in line:
                                if line.startswith("export "):
                                    line = line[7:]
                                key, value = line.split("=", 1)
                                key = key.strip()
                                value = value.strip().strip("'").strip('"')
                                if not key.startswith("source"):
                                    os.environ[key] = value
                except Exception:
                    pass  # Silently skip files that can't be read
    except Exception:
        pass  # Silently fail if ~/.env.d doesn't exist (normal in production)


# Load environment variables in priority order
# 1. Standard environment variables (highest priority - set by hosting platform)
# 2. .env file in current directory (standard pattern for most hosting)
try:
    from dotenv import load_dotenv

    load_dotenv(Path(".env"), override=False)  # Don't override existing env vars
except ImportError:
    pass

# 3. Optional: ~/.env.d files (local dev convenience only, fails silently)
load_env_d()

# Get API key from environment
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    print("=" * 80)
    print("❌ ERROR: OpenAI API key not found!")
    print("=" * 80)
    print("\n📝 To set up your API key, use ONE of these methods:\n")
    print("Method 1: Environment variable (recommended for production)")
    print("  export OPENAI_API_KEY='your-api-key-here'")
    print("  # Or set in your hosting platform's environment variables")
    print("\nMethod 2: Create .env file in project directory")
    print("  cp env.template .env")
    print("  # Then edit .env and add your key")
    print("\n💡 Get your API key at: https://platform.openai.com/api-keys")
    print("=" * 80)
    sys.exit(1)

from openai import OpenAI

client = OpenAI(api_key=OPENAI_API_KEY)

# Chat model can be overridden by environment variable (optional)
CHAT_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")


def _format_timestamp(seconds: float) -> str:
    """Convert seconds to MM:SS."""
    minutes = int(seconds // 60)
    secs = int(seconds % 60)
    return f"{minutes:02d}:{secs:02d}"


def _read_text_file(path: Path) -> str:
    """Best-effort read of a text file."""
    return path.read_text(encoding="utf-8", errors="replace")


def retry_with_backoff(
    func, *args, max_attempts=4, base_delay=1.0, cap=10.0, **kwargs
):
    """
    Exponential backoff with full jitter for API calls.
    Pattern adapted from reference scripts.
    """
    for attempt in range(1, max_attempts + 1):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            if attempt == max_attempts:
                raise
            sleep_time = min(cap, base_delay * (2 ** (attempt - 1)))
            sleep_time = random.uniform(0, sleep_time)  # Full jitter
            print(
                f"⚠️  Attempt {attempt} failed with {e!r}; waiting {sleep_time:.2f}s before retry."
            )
            time.sleep(sleep_time)


class PodcastToShortsAI:
    """Complete pipeline for converting podcasts to YouTube Shorts"""

    def __init__(
        self,
        output_dir: Optional[Path] = None,
        *,
        style_text: Optional[str] = None,
        persona: Optional[str] = None,
        emotional_depth: int = 0,
        timestamps: bool = False,
    ):
        if output_dir:
            self.output_dir = Path(output_dir)
        else:
            # Default to current directory + output folder
            self.output_dir = Path.cwd() / "output" / "podcast_to_shorts"
        self.output_dir.mkdir(parents=True, exist_ok=True)

        self.style_text = style_text
        self.persona = persona
        self.emotional_depth = max(0, int(emotional_depth or 0))
        self.timestamps = bool(timestamps)
        self.style_guide: Optional[Dict[str, object]] = None

    def transcribe_podcast(self, audio_file: Path) -> str:
        """Transcribe podcast audio to text using OpenAI Whisper API"""
        print(f"📝 Transcribing: {audio_file.name}")

        try:
            # Check file size (OpenAI has 25MB limit)
            file_size = audio_file.stat().st_size / (1024 * 1024)  # MB
            if file_size > 25:
                print(f"⚠️  Warning: File size ({file_size:.1f}MB) exceeds 25MB limit.")
                print(
                    "   Consider compressing the audio or splitting into smaller chunks."
                )

            def _call():
                with open(audio_file, "rb") as audio:
                    if self.timestamps:
                        return client.audio.transcriptions.create(
                            model="whisper-1",
                            file=audio,
                            response_format="verbose_json",
                        )
                    else:
                        return client.audio.transcriptions.create(
                            model="whisper-1",
                            file=audio,
                            response_format="text",
                        )

            # Use retry logic for transcription
            transcript_data = retry_with_backoff(_call, max_attempts=3)

            if self.timestamps:
                # Save raw transcript JSON for debugging/traceability
                raw_file = (
                    self.output_dir / f"{audio_file.stem}_transcript_verbose.json"
                )
                raw_file.write_text(
                    json.dumps(transcript_data, indent=2), encoding="utf-8"
                )

                # Build transcript with timecodes
                segments = (
                    transcript_data.get("segments", [])
                    if isinstance(transcript_data, dict)
                    else getattr(transcript_data, "segments", [])
                )
                lines: List[str] = []
                for seg in segments or []:
                    start = seg.get("start", 0)
                    end = seg.get("end", 0)
                    text = (seg.get("text") or "").strip()
                    if not text:
                        continue
                    lines.append(
                        f"{_format_timestamp(float(start))} -- {_format_timestamp(float(end))}: {text}"
                    )
                transcript = "\n".join(lines).strip()
            else:
                transcript = transcript_data

            # Save transcript
            transcript_file = self.output_dir / f"{audio_file.stem}_transcript.txt"
            transcript_file.write_text(transcript, encoding="utf-8")
            print(f"✅ Transcript saved: {transcript_file}")

            return transcript

        except Exception as e:
            print(f"❌ Error transcribing audio: {e}")
            print("   Make sure:")
            print("   1. OpenAI API key is set (OPENAI_API_KEY)")
            print("   2. Audio file is in supported format (MP3, WAV, M4A, etc.)")
            print("   3. File size is under 25MB")
            raise

    def _build_style_guide(self, transcript: str) -> Optional[Dict[str, object]]:
        """
        Build a compact style guide (persona + emotional arc rules) to make output more "you".
        This is optional and only runs when emotional_depth > 0 or persona/style_text provided.
        """
        if self.emotional_depth <= 0 and not self.persona and not self.style_text:
            return None

        transcript_sample = transcript[:6000] if len(transcript) > 6000 else transcript
        style_seed = (self.style_text or "").strip()
        persona = (self.persona or "").strip()

        system_prompt = """You are an expert brand voice editor and short-form storytelling specialist.
Your expertise lies in analyzing content and creating style guides that capture the unique voice,
emotional palette, and narrative structure of creators. You understand how to translate longer-form
content into compelling short-form formats while preserving authenticity and emotional resonance."""

        user_prompt = f"""Create a comprehensive style guide to rewrite podcast moments into YouTube Shorts
with strong emotional arc and a consistent, authentic voice.

Inputs:
- persona (optional): {persona if persona else "N/A"}
- style_seed (optional, may include notes/lyrics/tone references): {style_seed[:2000] if style_seed else "N/A"}

Use the transcript sample to infer speaking cadence, vocabulary patterns, and natural language flow.
Do NOT invent facts or characteristics not present in the sample.

Transcript sample:
{transcript_sample}

Return valid JSON with this structure:
{{
  "voice": {{
    "tone": "description of overall tone",
    "pace": "description of pacing (fast/slow/varies)",
    "vocabulary_level": "description of word choice complexity",
    "signature_phrases": ["array", "of", "distinctive", "phrases"],
    "do": ["preferred", "writing", "patterns"],
    "dont": ["patterns", "to", "avoid"]
  }},
  "emotional_palette": {{
    "primary": ["main", "emotions"],
    "secondary": ["supporting", "emotions"],
    "avoid": ["emotions", "to", "minimize"]
  }},
  "narrative_arc": {{
    "beats": ["key", "story", "beats"],
    "preferred_tension_curve": "description of tension structure",
    "payoff_style": "description of how resolutions work"
  }},
  "hook_patterns": ["3-7 short template patterns"],
  "cta_patterns": ["3-7 short call-to-action templates"],
  "formatting": {{
    "line_break_style": "description",
    "subtitle_style_notes": "description"
  }}
}}"""

        try:

            def _call():
                return client.chat.completions.create(
                    model=CHAT_MODEL,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                    response_format={"type": "json_object"},
                    temperature=0.7,
                )

            resp = retry_with_backoff(_call, max_attempts=3)
            guide = json.loads(resp.choices[0].message.content)
            if isinstance(guide, dict):
                return guide
        except Exception as e:
            print(f"⚠️  Style guide generation failed (continuing without it): {e}")
        return None

    def extract_key_moments(
        self, transcript: str, max_moments: int = 5, audio_file: Optional[Path] = None
    ) -> List[Dict]:
        """Extract key moments from transcript for Shorts creation"""
        print(f"🔍 Extracting {max_moments} key moments...")

        # Limit transcript length to avoid token limits (keep first 8000 chars)
        transcript_sample = transcript[:8000] if len(transcript) > 8000 else transcript

        style_guide_snippet = ""
        if self.style_guide and self.emotional_depth > 0:
            style_guide_snippet = f"\n\nStyle Guide (apply for selection criteria):\n{json.dumps(self.style_guide, indent=2)[:2000]}\n"

        system_prompt = """You are an expert content strategist specializing in identifying viral-worthy moments
in podcast content for YouTube Shorts. Your expertise includes:
- Understanding YouTube Shorts algorithm preferences
- Recognizing emotional beats that resonate with audiences
- Identifying hooks that drive engagement and shares
- Balancing educational value with entertainment
- Understanding timing and pacing for short-form content

Always respond with valid JSON."""

        user_prompt = f"""Analyze this podcast transcript and identify the {max_moments} most engaging,
shareable moments that would work exceptionally well as YouTube Shorts.{style_guide_snippet}

For each moment, provide a comprehensive analysis:
1. Start timestamp (estimated, in MM:SS format)
2. End timestamp (estimated, in MM:SS format)
3. Key quote or summary (max 50 words) - the core content
4. Why it's engaging (hook, emotion, value) - detailed explanation
5. Suggested Shorts title - optimized for clicks and shares
6. Emotional beat (e.g., curiosity→tension→release) and why it works - narrative analysis
7. Suggested hook angle (one line) - the opening approach

Transcript:
{transcript_sample}

Format as JSON with a "moments" array. Each moment should have:
- start_time (string, MM:SS format)
- end_time (string, MM:SS format)
- quote (string, key quote/summary)
- engagement_reason (string, detailed explanation)
- suggested_title (string, optimized title)
- emotional_beat (string, emotional progression and analysis)
- hook_angle (string, opening approach)"""

        try:

            def _call():
                return client.chat.completions.create(
                    model=CHAT_MODEL,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                    response_format={"type": "json_object"},
                    temperature=0.7,
                )

            response = retry_with_backoff(_call, max_attempts=3)
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

    def generate_shorts_scripts(
        self, moments: List[Dict], audio_file: Optional[Path] = None
    ) -> List[Dict]:
        """Generate YouTube Shorts scripts for each key moment"""
        print(f"✍️  Generating Shorts scripts for {len(moments)} moments...")

        style_guide_snippet = ""
        if self.style_guide and self.emotional_depth > 0:
            style_guide_snippet = f"\n\nStyle Guide (must follow):\n{json.dumps(self.style_guide, indent=2)[:2500]}\n"

        scripts = []
        for i, moment in enumerate(moments, 1):
            print(f"   Generating script {i}/{len(moments)}...")

            system_prompt = """You are an expert YouTube Shorts scriptwriter who creates viral-worthy content.
Your expertise includes:
- Crafting hooks that capture attention in the first 3 seconds
- Structuring content for maximum engagement and retention
- Balancing information with entertainment
- Creating clear, compelling calls to action
- Understanding YouTube Shorts algorithm optimization
- Writing in a natural, conversational tone that resonates with viewers"""

            emotional_requirements = ""
            if self.emotional_depth > 0:
                emotional_requirements = """
- Add a clear emotional arc (tension → pivot → payoff) that creates viewer investment
- Use vivid, human language that feels authentic and relatable (avoid corporate or overly formal tone)
- Infuse personality and warmth into the script
- Create moments of genuine connection with the audience"""

            user_prompt = f"""Create a YouTube Shorts script (15-60 seconds) based on this key moment:{style_guide_snippet}

Key Moment Details:
- Quote: {moment.get('quote', '')}
- Engagement Reason: {moment.get('engagement_reason', '')}
- Emotional Beat: {moment.get('emotional_beat', '')}
- Hook Angle: {moment.get('hook_angle', '')}

Script Requirements:
- Hook in first 3 seconds (must be compelling and attention-grabbing)
- Clear value proposition (what viewer learns/gains)
- Call to action (what viewer should do next)
- Optimized for 15-60 second format
- Engaging and shareable{emotional_requirements}

Provide a complete script with:
1. Hook (first 3 seconds) - exact wording
2. Main content (15-50 seconds) - structured narrative
3. CTA (last 3 seconds) - clear action
4. Suggested visuals/imagery - what should appear on screen
5. Hashtags (5-10 relevant) - optimized for discovery"""

            try:

                def _call():
                    return client.chat.completions.create(
                        model=CHAT_MODEL,
                        messages=[
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_prompt},
                        ],
                        temperature=0.8,
                    )

                response = retry_with_backoff(_call, max_attempts=3)
                script_content = response.choices[0].message.content

                script = {
                    "moment_number": i,
                    "original_moment": moment,
                    "script": script_content,
                    "duration_estimate": "30-60 seconds",
                }
                scripts.append(script)

            except Exception as e:
                print(f"⚠️  Error generating script for moment {i}: {e}")

        # Save scripts
        if audio_file:
            scripts_file = self.output_dir / f"{audio_file.stem}_shorts_scripts.json"
        else:
            scripts_file = self.output_dir / "shorts_scripts.json"
        scripts_file.write_text(json.dumps(scripts, indent=2), encoding="utf-8")
        print(f"✅ Scripts saved: {scripts_file}")

        return scripts

    def generate_shorts_titles(self, scripts: List[Dict]) -> List[Dict]:
        """Generate catchy YouTube Shorts titles"""
        print(f"📌 Generating titles for {len(scripts)} Shorts...")

        system_prompt = """You are an expert at creating viral YouTube Shorts titles. Your expertise includes:
- Understanding YouTube Shorts algorithm preferences
- Using power words and numbers effectively
- Creating curiosity gaps that drive clicks
- Balancing SEO optimization with engagement
- Recognizing trending title patterns
- Optimizing for mobile viewing (character limits matter)"""

        titles = []
        for script in scripts:
            script_text = script.get("script", "")[:500]  # Limit length

            user_prompt = f"""Generate 5 catchy, trending YouTube Shorts titles based on this script:

{script_text}

Requirements for each title:
- Under 60 characters (optimal for mobile and algorithm)
- Include numbers or power words when possible (e.g., "5 Ways", "The Secret", "This Changed Everything")
- Create curiosity or urgency (make viewers want to know more)
- Optimized for YouTube Shorts algorithm (trend-aware, keyword-rich)
- Trend-aligned (reference current YouTube Shorts patterns when relevant)

Format as a numbered list (1-5), with the best title first."""

            try:

                def _call():
                    return client.chat.completions.create(
                        model=CHAT_MODEL,
                        messages=[
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_prompt},
                        ],
                        temperature=0.9,
                    )

                response = retry_with_backoff(_call, max_attempts=3)
                title_options = response.choices[0].message.content
                # Extract first title as recommended
                lines = title_options.strip().split("\n")
                recommended = lines[0].strip()
                # Remove numbering if present
                if recommended and recommended[0].isdigit():
                    recommended = recommended.split(".", 1)[-1].strip()

                titles.append(
                    {
                        "moment_number": script["moment_number"],
                        "title_options": title_options,
                        "recommended": recommended,
                    }
                )

            except Exception as e:
                print(f"⚠️  Error generating titles: {e}")

        return titles

    def generate_shorts_descriptions(self, scripts: List[Dict]) -> List[Dict]:
        """Generate YouTube Shorts descriptions"""
        print(f"📝 Generating descriptions for {len(scripts)} Shorts...")

        system_prompt = """You are an expert at writing engaging YouTube Shorts descriptions. Your expertise includes:
- Crafting compelling hooks that encourage reading
- Structuring descriptions for maximum engagement
- Optimizing for SEO without sacrificing readability
- Creating effective calls to action
- Using hashtags strategically for discovery
- Writing in a tone that matches the content"""

        descriptions = []
        for script in scripts:
            script_text = script.get("script", "")[:500]  # Limit length

            user_prompt = f"""Create a YouTube Shorts description (150-200 words) based on this script:

{script_text}

Include in your description:
- Compelling hook (first line that grabs attention)
- Key value points (what viewer learns/gains - 2-3 main points)
- Call to action (what viewer should do - subscribe, comment, share, etc.)
- 5-10 relevant hashtags (optimized for discovery, mix of broad and niche)
- Engagement questions (encourage comments with thoughtful questions)

Write in a natural, engaging tone that complements the script."""

            try:

                def _call():
                    return client.chat.completions.create(
                        model=CHAT_MODEL,
                        messages=[
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_prompt},
                        ],
                        temperature=0.8,
                    )

                response = retry_with_backoff(_call, max_attempts=3)
                description = response.choices[0].message.content
                descriptions.append(
                    {
                        "moment_number": script["moment_number"],
                        "description": description,
                    }
                )

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
            "output_dir": str(self.output_dir),
        }

        # Step 1: Transcribe
        transcript = self.transcribe_podcast(audio_file)
        results["transcript"] = (
            transcript[:500] + "..." if len(transcript) > 500 else transcript
        )

        # Optional: build style guide for persona/emotional depth
        self.style_guide = self._build_style_guide(transcript)
        if self.style_guide:
            guide_file = self.output_dir / f"{audio_file.stem}_style_guide.json"
            guide_file.write_text(
                json.dumps(self.style_guide, indent=2), encoding="utf-8"
            )
            results["style_guide_file"] = str(guide_file)

        # Step 2: Extract key moments
        moments = self.extract_key_moments(
            transcript, max_moments=max_shorts, audio_file=audio_file
        )
        results["key_moments"] = moments

        if not moments:
            print("⚠️  No key moments extracted. Cannot proceed.")
            return results

        # Step 3: Generate scripts
        scripts = self.generate_shorts_scripts(moments, audio_file=audio_file)
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
        print("\n💡 Next Steps:")
        print(f"   1. Review scripts in: {self.output_dir}")
        print("   2. Use the scripts to create videos")
        print("   3. Upload to YouTube with generated titles/descriptions")

        return results


def main():
    parser = argparse.ArgumentParser(
        description="Podcast to Shorts AI - Convert podcasts to YouTube Shorts automatically",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Process a single podcast
  python podcast_to_shorts_ai_ENHANCED.py --audio podcast.mp3

  # Process with custom output directory
  python podcast_to_shorts_ai_ENHANCED.py --audio podcast.mp3 --output ./shorts_output

  # Generate 10 Shorts from one podcast
  python podcast_to_shorts_ai_ENHANCED.py --audio podcast.mp3 --max-shorts 10
        """,
    )

    parser.add_argument(
        "--audio",
        "-a",
        type=str,
        required=True,
        help="Path to podcast audio file (MP3, WAV, M4A)",
    )

    parser.add_argument(
        "--output", "-o", type=str, help="Output directory for generated content"
    )

    parser.add_argument(
        "--max-shorts",
        "-m",
        type=int,
        default=5,
        help="Maximum number of Shorts to generate (default: 5)",
    )

    parser.add_argument(
        "--timestamps",
        action="store_true",
        help="Include timecoded transcript (MM:SS -- MM:SS) to improve clip extraction (also saves transcript_verbose.json)",
    )

    parser.add_argument(
        "--persona",
        type=str,
        default=None,
        help="Optional persona/voice direction (e.g., 'NocturneMelodies: poetic, gritty, hopeful')",
    )

    parser.add_argument(
        "--style-file",
        type=str,
        default=None,
        help="Optional text file (notes/lyrics/style bible) used to guide voice + emotional arc",
    )

    parser.add_argument(
        "--emotional-depth",
        type=int,
        default=0,
        help="0=default (viral/neutral), 1=more human/expressive, 2=high emotional arc + signature voice",
    )

    args = parser.parse_args()

    audio_file = Path(args.audio)
    if not audio_file.exists():
        print(f"❌ Error: Audio file not found: {audio_file}")
        sys.exit(1)

    output_dir = Path(args.output) if args.output else None

    style_text = None
    if args.style_file:
        style_path = Path(args.style_file)
        if not style_path.exists():
            print(f"❌ Error: style file not found: {style_path}")
            sys.exit(1)
        style_text = _read_text_file(style_path)

    processor = PodcastToShortsAI(
        output_dir=output_dir,
        style_text=style_text,
        persona=args.persona,
        emotional_depth=args.emotional_depth,
        timestamps=args.timestamps,
    )
    processor.process_podcast(audio_file, max_shorts=args.max_shorts)

    print(f"\n✅ Complete results saved to: {processor.output_dir}")


if __name__ == "__main__":
    main()
