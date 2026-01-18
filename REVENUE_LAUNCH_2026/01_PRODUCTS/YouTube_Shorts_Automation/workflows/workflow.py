"""
YouTube Shorts Automation Workflow

Automated ideation, creation, and publishing workflows for YouTube Shorts.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
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
    Execute YouTube Shorts Automation workflow for a keyword.

    Args:
        keyword: The trending keyword to process
        config: Optional configuration dictionary

    Returns:
        Dictionary containing Shorts automation workflow results
    """
    if config is None:
        config = {}

    # Generate Shorts ideas
    ideas = _generate_shorts_ideas(keyword, config)

    # Create content plan
    content_plan = _create_content_plan(keyword, ideas)

    # Generate publishing schedule
    schedule = _create_publishing_schedule(keyword, ideas, config)

    # Create optimization strategy
    optimization = _create_optimization_strategy(keyword)

    return {
        'keyword': keyword,
        'ideas': ideas,
        'content_plan': content_plan,
        'publishing_schedule': schedule,
        'optimization': optimization,
        'workflow_type': 'youtube_shorts_automation',
        'status': 'ready'
    }


def _generate_shorts_ideas(keyword: str, config: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Generate YouTube Shorts ideas for the keyword."""
    return [
        {
            'title': f"{keyword}: Quick Tip #1",
            'hook': f"Did you know {keyword} can do this?",
            'description': f"Learn a quick tip about {keyword} in under 60 seconds.",
            'duration': '15-30s',
            'format': 'vertical',
            'thumbnail_text': f'{keyword} Tip',
            'hashtags': [keyword.replace(' ', ''), 'Shorts', 'AI', 'Tech', 'QuickTip'],
            'call_to_action': 'Subscribe for more tips!',
            'estimated_views': '10K-50K'
        },
        {
            'title': f"How {keyword} Works in 60 Seconds",
            'hook': f"{keyword} explained in 60 seconds",
            'description': f"Complete guide to {keyword} in just one minute.",
            'duration': '60s',
            'format': 'vertical',
            'thumbnail_text': 'How It Works',
            'hashtags': [keyword.replace(' ', ''), 'Shorts', 'Tutorial', 'HowTo'],
            'call_to_action': 'Like if this helped!',
            'estimated_views': '50K-100K'
        },
        {
            'title': f"{keyword} vs Traditional Methods",
            'hook': f"See the difference {keyword} makes",
            'description': f"Compare {keyword} with traditional approaches.",
            'duration': '30-45s',
            'format': 'vertical',
            'thumbnail_text': 'Comparison',
            'hashtags': [keyword.replace(' ', ''), 'Shorts', 'Comparison', 'Tech'],
            'call_to_action': 'Which do you prefer?',
            'estimated_views': '20K-80K'
        }
    ]


def _create_content_plan(keyword: str, ideas: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Create content plan for Shorts."""
    return {
        'series_name': f'{keyword} Shorts Series',
        'total_videos': len(ideas),
        'content_themes': [
            'Quick tips and tricks',
            'How-to tutorials',
            'Comparisons and reviews',
            'Behind-the-scenes',
            'Common mistakes'
        ],
        'visual_style': {
            'format': 'vertical (9:16)',
            'resolution': '1080x1920',
            'text_overlay': True,
            'subtitles': True,
            'branding': 'consistent'
        },
        'audio_strategy': {
            'background_music': 'trending',
            'voice_over': 'clear and energetic',
            'sound_effects': 'minimal'
        }
    }


def _create_publishing_schedule(keyword: str,
                               ideas: List[Dict[str, Any]],
                               config: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Create publishing schedule for Shorts."""
    frequency = config.get('publishing_frequency', 'daily')
    start_date = datetime.now()

    schedule = []
    days_offset = 0

    for i, idea in enumerate(ideas):
        if frequency == 'daily':
            publish_date = start_date + timedelta(days=days_offset)
            days_offset += 1
        elif frequency == 'weekly':
            publish_date = start_date + timedelta(weeks=days_offset)
            days_offset += 1
        else:
            publish_date = start_date + timedelta(days=i)

        schedule.append({
            'video_number': i + 1,
            'title': idea['title'],
            'publish_date': publish_date.strftime('%Y-%m-%d'),
            'publish_time': config.get('optimal_time', '14:00'),
            'status': 'scheduled'
        })

    return schedule


def _create_optimization_strategy(keyword: str) -> Dict[str, Any]:
    """Create optimization strategy for Shorts."""
    return {
        'title_optimization': {
            'include_keyword': True,
            'keep_under_60_chars': True,
            'use_numbers': True,
            'add_emoji': False
        },
        'description_optimization': {
            'first_line_hook': True,
            'include_keyword': True,
            'add_hashtags': True,
            'call_to_action': True
        },
        'thumbnail_optimization': {
            'bright_colors': True,
            'large_text': True,
            'face_or_object': True,
            'high_contrast': True
        },
        'engagement_strategy': {
            'ask_questions': True,
            'use_polls': True,
            'encourage_comments': True,
            'pin_top_comment': True
        },
        'seo_optimization': {
            'target_keywords': [keyword, f'{keyword} tutorial', f'{keyword} tips'],
            'tags': [keyword, 'Shorts', 'AI', 'Tech', 'Tutorial'],
            'category': 'Science & Technology'
        }
    }


def process_trends_from_file(trends_path: str,
                             output_path: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Process multiple trends from a file and generate Shorts workflows.

    Args:
        trends_path: Path to trends CSV/JSON file
        output_path: Optional path to save results

    Returns:
        List of Shorts automation workflow results
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
