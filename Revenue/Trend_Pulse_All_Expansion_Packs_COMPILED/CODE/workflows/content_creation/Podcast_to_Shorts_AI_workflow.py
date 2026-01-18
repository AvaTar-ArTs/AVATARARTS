"""
Podcast to Shorts AI Workflow

Podcast clipping and short-form automation.
"""

from typing import Dict, Any, List, Optional
import sys
import os

# Add parent directory to path to import trend-pulse-os modules
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../../trend-pulse-os'))

from core.trend_parser import load_trends, validate_trend
from core.trend_score import score_trend
from core.export_engine import export_json


def run(keyword: str,
        config: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    Execute Podcast to Shorts AI workflow for a keyword.

    Args:
        keyword: The trending keyword to process
        config: Optional configuration dictionary

    Returns:
        Dictionary containing podcast-to-shorts workflow results
    """
    if config is None:
        config = {}

    # Identify clip-worthy moments
    clip_moments = _identify_clip_moments(keyword, config)

    # Generate short-form content
    shorts_content = _generate_shorts_content(keyword, clip_moments)

    # Create editing plan
    editing_plan = _create_editing_plan(keyword, clip_moments)

    # Build distribution strategy
    distribution = _create_distribution_strategy(keyword, shorts_content)

    return {
        'keyword': keyword,
        'clip_moments': clip_moments,
        'shorts_content': shorts_content,
        'editing_plan': editing_plan,
        'distribution_strategy': distribution,
        'workflow_type': 'podcast_to_shorts_ai',
        'status': 'ready'
    }


def _identify_clip_moments(keyword: str, config: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Identify clip-worthy moments from podcast."""
    return [
        {
            'timestamp': '00:05:30',
            'topic': f'Introduction to {keyword}',
            'duration': '60s',
            'clip_type': 'hook',
            'value': 'high',
            'quote': f'{keyword} is revolutionizing how we approach this field'
        },
        {
            'timestamp': '00:12:45',
            'topic': f'Key benefits of {keyword}',
            'duration': '45s',
            'clip_type': 'educational',
            'value': 'high',
            'quote': f'The main advantage of {keyword} is its efficiency'
        },
        {
            'timestamp': '00:25:10',
            'topic': f'Real-world example of {keyword}',
            'duration': '90s',
            'clip_type': 'story',
            'value': 'medium',
            'quote': f'Here\'s how {keyword} transformed this project'
        },
        {
            'timestamp': '00:38:20',
            'topic': f'Common mistakes with {keyword}',
            'duration': '60s',
            'clip_type': 'tips',
            'value': 'high',
            'quote': f'Avoid these mistakes when using {keyword}'
        }
    ]


def _generate_shorts_content(keyword: str, clip_moments: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Generate short-form content from clips."""
    shorts = []
    for i, moment in enumerate(clip_moments):
        shorts.append({
            'title': f"{keyword} Clip #{i+1}: {moment['topic']}",
            'hook': moment['quote'],
            'duration': moment['duration'],
            'platform': 'youtube_shorts',
            'format': 'vertical',
            'caption': f"{moment['quote']} #Podcast #Shorts #{keyword.replace(' ', '')}",
            'hashtags': [
                keyword.replace(' ', ''),
                'Podcast',
                'Shorts',
                'AI',
                'Tech',
                'Learn'
            ],
            'thumbnail_text': moment['topic'],
            'call_to_action': 'Watch full episode!'
        })
    return shorts


def _create_editing_plan(keyword: str, clip_moments: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Create editing plan for clips."""
    return {
        'editing_approach': {
            'add_hook': 'First 3 seconds critical',
            'text_overlays': 'Key quotes highlighted',
            'subtitles': 'Auto-generated and edited',
            'background_music': 'Subtle and professional',
            'transitions': 'Smooth cuts',
            'visuals': 'Speaker + relevant B-roll'
        },
        'tools_recommended': [
            'Descript (transcription)',
            'CapCut (editing)',
            'Headliner (auto-clipping)',
            'Rev (transcription)',
            'Otter.ai (transcription)'
        ],
        'workflow_steps': [
            'Transcribe podcast episode',
            'Identify key moments (AI-powered)',
            'Extract audio clips',
            'Add visuals and text overlays',
            'Create thumbnails',
            'Export and upload'
        ],
        'quality_standards': {
            'audio_quality': 'Clear and crisp',
            'video_resolution': '1080x1920 (vertical)',
            'subtitle_accuracy': '98%+',
            'hook_timing': 'First 3 seconds'
        }
    }


def _create_distribution_strategy(keyword: str, shorts_content: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Create distribution strategy for shorts."""
    return {
        'platforms': [
            'YouTube Shorts',
            'Instagram Reels',
            'TikTok',
            'Twitter/X',
            'LinkedIn'
        ],
        'publishing_schedule': {
            'frequency': '2-3 clips per week',
            'optimal_times': ['14:00', '18:00', '20:00'],
            'cross_promotion': True
        },
        'promotion_tactics': [
            'Tease in full podcast description',
            'Share in podcast social media',
            'Create playlist of clips',
            'Link back to full episode',
            'Engage with comments'
        ],
        'analytics_tracking': {
            'metrics': ['views', 'engagement', 'click-through', 'subscribers'],
            'goals': ['Drive podcast listens', 'Build audience', 'Increase engagement']
        }
    }


def process_trends_from_file(trends_path: str,
                             output_path: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Process multiple trends from a file and generate podcast-to-shorts workflows.

    Args:
        trends_path: Path to trends CSV/JSON file
        output_path: Optional path to save results

    Returns:
        List of podcast-to-shorts workflow results
    """
    trends = load_trends(trends_path)
    results = []

    for trend in trends:
        if validate_trend(trend):
            keyword = trend.get('keyword')
            result = run(keyword)
            result['trend_data'] = trend
            results.append(result)

    if output_path:
        export_json(results, output_path)

    return results
