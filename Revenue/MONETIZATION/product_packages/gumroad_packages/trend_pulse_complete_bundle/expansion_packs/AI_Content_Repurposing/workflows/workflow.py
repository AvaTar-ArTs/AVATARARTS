"""
AI Content Repurposing Workflow

Transforms long-form content into Shorts, Reels, and TikTok videos.
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
    Execute AI Content Repurposing workflow for a keyword.

    Args:
        keyword: The trending keyword to process
        config: Optional configuration dictionary

    Returns:
        Dictionary containing repurposing workflow results

    Example:
        >>> result = run('AI Video Generator')
        >>> 'shorts' in result
        True
    """
    if config is None:
        config = {}

    # Generate repurposing strategy
    strategy = _create_repurposing_strategy(keyword, config)

    # Create content for each platform
    shorts = _generate_shorts_content(keyword, strategy)
    reels = _generate_reels_content(keyword, strategy)
    tik_toks = _generate_tiktok_content(keyword, strategy)

    return {
        'keyword': keyword,
        'strategy': strategy,
        'shorts': shorts,
        'reels': reels,
        'tik_toks': tik_toks,
        'workflow_type': 'content_repurposing',
        'status': 'ready'
    }


def _create_repurposing_strategy(keyword: str, config: Dict[str, Any]) -> Dict[str, Any]:
    """Create repurposing strategy for the keyword."""
    return {
        'source_content_type': config.get('source_type', 'long_form_video'),
        'target_platforms': ['youtube_shorts', 'instagram_reels', 'tiktok'],
        'key_points': [
            f'Main benefit of {keyword}',
            f'How {keyword} works',
            f'Why {keyword} is trending',
            f'Best practices for {keyword}'
        ],
        'hook_strategies': [
            'Question hook',
            'Statistic hook',
            'Story hook',
            'Controversy hook'
        ],
        'call_to_action': f'Learn more about {keyword}'
    }


def _generate_shorts_content(keyword: str, strategy: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Generate YouTube Shorts content."""
    return [
        {
            'title': f"{keyword}: Quick Tip #1",
            'hook': f"Did you know {keyword} can do this?",
            'duration': '15-30s',
            'format': 'vertical',
            'key_point': strategy['key_points'][0],
            'hashtags': [keyword.replace(' ', ''), 'Shorts', 'AI', 'Tech'],
            'thumbnail_text': f'{keyword} Tip'
        },
        {
            'title': f"How {keyword} Works in 30 Seconds",
            'hook': f"{keyword} explained in 30 seconds",
            'duration': '30s',
            'format': 'vertical',
            'key_point': strategy['key_points'][1],
            'hashtags': [keyword.replace(' ', ''), 'Shorts', 'Tutorial'],
            'thumbnail_text': 'How It Works'
        }
    ]


def _generate_reels_content(keyword: str, strategy: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Generate Instagram Reels content."""
    return [
        {
            'title': f"{keyword} - Before & After",
            'hook': f"Watch how {keyword} transforms this",
            'duration': '15-30s',
            'format': 'vertical',
            'key_point': strategy['key_points'][0],
            'hashtags': [keyword.replace(' ', ''), 'Reels', 'AI', 'Tech'],
            'music_trend': 'trending_audio',
            'caption': f"Discover the power of {keyword} #AI #Tech"
        },
        {
            'title': f"3 Ways to Use {keyword}",
            'hook': f"Here are 3 ways {keyword} can help you",
            'duration': '30-60s',
            'format': 'vertical',
            'key_point': strategy['key_points'][2],
            'hashtags': [keyword.replace(' ', ''), 'Reels', 'Tips'],
            'music_trend': 'trending_audio',
            'caption': f"Unlock the potential of {keyword}"
        }
    ]


def _generate_tiktok_content(keyword: str, strategy: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Generate TikTok content."""
    return [
        {
            'title': f"POV: You discover {keyword}",
            'hook': f"POV: You just found out about {keyword}",
            'duration': '15-30s',
            'format': 'vertical',
            'key_point': strategy['key_points'][0],
            'hashtags': [keyword.replace(' ', ''), 'AI', 'TechTok', 'FYP'],
            'trending_sound': True,
            'caption': f"Game changer: {keyword} #AI #TechTok"
        },
        {
            'title': f"{keyword} explained to a 5-year-old",
            'hook': f"Explaining {keyword} like you're 5",
            'duration': '30-60s',
            'format': 'vertical',
            'key_point': strategy['key_points'][1],
            'hashtags': [keyword.replace(' ', ''), 'ELI5', 'TechTok'],
            'trending_sound': True,
            'caption': f"Simple explanation of {keyword}"
        }
    ]


def process_trends_from_file(trends_path: str,
                             output_path: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Process multiple trends from a file and generate repurposing workflows.

    Args:
        trends_path: Path to trends CSV/JSON file
        output_path: Optional path to save results

    Returns:
        List of repurposing workflow results
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
