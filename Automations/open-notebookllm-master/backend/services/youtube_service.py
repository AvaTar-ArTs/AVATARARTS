"""
YouTube video service - fetch captions and video metadata.
"""
import logging
import re
from typing import Optional, Tuple, Dict, Any, List
from urllib.parse import urlparse, parse_qs

logger = logging.getLogger(__name__)


class YouTubeService:
    """YouTube video service."""

    # YouTube URL patterns
    YOUTUBE_PATTERNS = [
        r'(?:https?://)?(?:www\.)?youtube\.com/watch\?v=([a-zA-Z0-9_-]{11})',
        r'(?:https?://)?(?:www\.)?youtu\.be/([a-zA-Z0-9_-]{11})',
        r'(?:https?://)?(?:www\.)?youtube\.com/embed/([a-zA-Z0-9_-]{11})',
        r'(?:https?://)?(?:www\.)?youtube\.com/v/([a-zA-Z0-9_-]{11})',
    ]

    def extract_video_id(self, url: str) -> Optional[str]:
        """Extract video ID from URL."""
        for pattern in self.YOUTUBE_PATTERNS:
            match = re.search(pattern, url)
            if match:
                return match.group(1)

        # Try extracting from query string
        parsed = urlparse(url)
        if 'youtube.com' in parsed.netloc:
            qs = parse_qs(parsed.query)
            if 'v' in qs:
                return qs['v'][0]

        return None

    def get_video_info(self, video_id: str) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
        """
        Get video metadata.

        Args:
            video_id: YouTube video ID

        Returns:
            (video metadata, error message)
        """
        try:
            from yt_dlp import YoutubeDL

            ydl_opts = {
                'quiet': True,
                'no_warnings': True,
                'extract_flat': False,
            }

            with YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(
                    f'https://www.youtube.com/watch?v={video_id}',
                    download=False
                )

                return {
                    'video_id': video_id,
                    'title': info.get('title'),
                    'description': info.get('description'),
                    'duration': info.get('duration'),
                    'channel': info.get('channel') or info.get('uploader'),
                    'channel_id': info.get('channel_id'),
                    'upload_date': info.get('upload_date'),
                    'view_count': info.get('view_count'),
                    'like_count': info.get('like_count'),
                    'thumbnail': info.get('thumbnail'),
                    'tags': info.get('tags', []),
                    'categories': info.get('categories', []),
                }, None

        except ImportError:
            return None, "yt-dlp is not installed. Run: pip install yt-dlp"
        except Exception as e:
            logger.error(f"Failed to get video info: {e}")
            return None, f"Failed to get video info: {str(e)}"

    def get_transcript(self, video_id: str, languages: List[str] = None) -> Tuple[Optional[str], Optional[str]]:
        """
        Get video captions/transcript.

        Args:
            video_id: YouTube video ID
            languages: preferred language list (e.g. ['zh-TW', 'zh', 'en'])

        Returns:
            (transcript text, error message)
        """
        if languages is None:
            languages = ['zh-TW', 'zh-Hant', 'zh', 'zh-Hans', 'en', 'ja', 'ko']

        # Method 1: youtube_transcript_api
        try:
            from youtube_transcript_api import YouTubeTranscriptApi
            from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound

            try:
                # Try preferred language captions
                transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)

                transcript = None

                # Prefer manually created captions
                for lang in languages:
                    try:
                        transcript = transcript_list.find_transcript([lang])
                        break
                    except NoTranscriptFound:
                        continue

                # If no manual captions, try auto-generated
                if not transcript:
                    try:
                        transcript = transcript_list.find_generated_transcript(languages)
                    except NoTranscriptFound:
                        pass

                # Fallback to any available captions
                if not transcript:
                    for t in transcript_list:
                        transcript = t
                        break

                if transcript:
                    transcript_data = transcript.fetch()
                    text_parts = [entry['text'] for entry in transcript_data]
                    return '\n'.join(text_parts), None

            except TranscriptsDisabled:
                return None, "Captions are disabled for this video"
            except NoTranscriptFound:
                pass

        except ImportError:
            logger.warning("youtube_transcript_api not installed")

        # Method 2: download captions via yt-dlp
        try:
            from yt_dlp import YoutubeDL
            import tempfile
            import os

            with tempfile.TemporaryDirectory() as tmpdir:
                ydl_opts = {
                    'quiet': True,
                    'no_warnings': True,
                    'skip_download': True,
                    'writesubtitles': True,
                    'writeautomaticsub': True,
                    'subtitleslangs': languages,
                    'subtitlesformat': 'vtt',
                    'outtmpl': os.path.join(tmpdir, '%(id)s.%(ext)s'),
                }

                with YoutubeDL(ydl_opts) as ydl:
                    ydl.download([f'https://www.youtube.com/watch?v={video_id}'])

                # Find downloaded subtitle files
                for lang in languages:
                    for ext in ['vtt', 'srt']:
                        sub_file = os.path.join(tmpdir, f'{video_id}.{lang}.{ext}')
                        if os.path.exists(sub_file):
                            with open(sub_file, 'r', encoding='utf-8') as f:
                                content = f.read()
                            return self._parse_subtitle(content, ext), None

                return None, "Unable to retrieve captions"

        except ImportError:
            return None, "yt-dlp is not installed. Run: pip install yt-dlp"
        except Exception as e:
            return None, f"Failed to get captions: {str(e)}"

    def _parse_subtitle(self, content: str, format: str) -> str:
        """Parse subtitle file and extract plain text."""
        lines = content.split('\n')
        text_lines = []

        if format == 'vtt':
            # Skip VTT header
            in_cue = False
            for line in lines:
                line = line.strip()
                if '-->' in line:
                    in_cue = True
                    continue
                if in_cue and line and not line.startswith('WEBVTT'):
                    # Remove VTT tags
                    clean = re.sub(r'<[^>]+>', '', line)
                    if clean:
                        text_lines.append(clean)
                if not line:
                    in_cue = False

        elif format == 'srt':
            for line in lines:
                line = line.strip()
                # Skip index and timestamp lines
                if line.isdigit() or '-->' in line or not line:
                    continue
                text_lines.append(line)

        # Remove duplicate lines
        unique_lines = []
        prev = None
        for line in text_lines:
            if line != prev:
                unique_lines.append(line)
                prev = line

        return '\n'.join(unique_lines)

    def process_youtube_url(self, url: str) -> Tuple[Optional[str], Optional[Dict[str, Any]], Optional[str]]:
        """
        Process YouTube URL, return metadata and captions.

        Args:
            url: YouTube URL

        Returns:
            (caption text, metadata, error message)
        """
        # Extract video ID
        video_id = self.extract_video_id(url)
        if not video_id:
            return None, None, "Invalid YouTube URL"

        # Get video metadata
        info, info_error = self.get_video_info(video_id)
        if info_error:
            logger.warning(f"Failed to get video info: {info_error}")
            info = {'video_id': video_id, 'title': f'YouTube Video {video_id}'}

        # Get captions
        transcript, trans_error = self.get_transcript(video_id)

        if not transcript:
            return None, info, trans_error or "Unable to retrieve caption content"

        # Build content
        content_parts = []

        if info.get('title'):
            content_parts.append(f"# {info['title']}")

        if info.get('channel'):
            content_parts.append(f"Channel: {info['channel']}")

        if info.get('description'):
            desc = info['description'][:500]
            if len(info['description']) > 500:
                desc += '...'
            content_parts.append(f"\n## Video Description\n{desc}")

        content_parts.append(f"\n## Captions\n{transcript}")

        metadata = {
            'video_id': video_id,
            'url': url,
            'title': info.get('title'),
            'channel': info.get('channel'),
            'duration': info.get('duration'),
            'upload_date': info.get('upload_date'),
            'thumbnail': info.get('thumbnail'),
        }

        return '\n\n'.join(content_parts), metadata, None


# Global instance
_youtube_service: Optional[YouTubeService] = None


def get_youtube_service() -> YouTubeService:
    """Get YouTube service instance."""
    global _youtube_service
    if _youtube_service is None:
        _youtube_service = YouTubeService()
    return _youtube_service
