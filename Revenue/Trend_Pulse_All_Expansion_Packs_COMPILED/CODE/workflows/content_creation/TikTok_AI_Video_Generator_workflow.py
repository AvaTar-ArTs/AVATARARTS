"""
TikTok AI Video Generator Workflow

AI-driven TikTok video generation workflows.
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
    Execute TikTok AI Video Generator workflow for a keyword.

    Args:
        keyword: The trending keyword to process
        config: Optional configuration dictionary

    Returns:
        Dictionary containing TikTok video generation workflow results
    """
    if config is None:
        config = {}

    # Generate TikTok video ideas
    ideas = _generate_tiktok_ideas(keyword, config)

    # Create hooks and captions
    content = _create_content(keyword, ideas)

    # Design viral strategy
    viral_strategy = _create_viral_strategy(keyword)

    # Build posting schedule
    schedule = _create_posting_schedule(keyword, ideas, config)

    return {
        'keyword': keyword,
        'ideas': ideas,
        'content': content,
        'viral_strategy': viral_strategy,
        'posting_schedule': schedule,
        'workflow_type': 'tiktok_ai_video_generator',
        'status': 'ready'
    }


def _generate_tiktok_ideas(keyword: str, config: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Generate TikTok video ideas."""
    return [
        {
            'title': f"POV: You discover {keyword}",
            'format': 'POV',
            'duration': '15-30s',
            'hook': f"POV: You just found out about {keyword}",
            'trending_sound': True,
            'estimated_views': '100K+'
        },
        {
            'title': f"{keyword} explained to a 5-year-old",
            'format': 'Educational',
            'duration': '30-60s',
            'hook': f"Explaining {keyword} like you're 5",
            'trending_sound': True,
            'estimated_views': '50K-200K'
        },
        {
            'title': f"3 ways {keyword} changed my life",
            'format': 'Storytelling',
            'duration': '30-45s',
            'hook': f"Here's how {keyword} changed everything",
            'trending_sound': True,
            'estimated_views': '75K-300K'
        },
        {
            'title': f"{keyword} vs what I expected",
            'format': 'Comparison',
            'duration': '15-30s',
            'hook': f"{keyword} is NOT what I expected",
            'trending_sound': True,
            'estimated_views': '50K-150K'
        }
    ]


def _create_content(keyword: str, ideas: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Create hooks and captions for TikTok videos."""
    content = []
    for idea in ideas:
        content.append({
            'video_title': idea['title'],
            'hook': idea['hook'],
            'caption': f"{idea['hook']} #AI #TechTok #FYP #{keyword.replace(' ', '')}",
            'hashtags': [
                keyword.replace(' ', ''),
                'AI',
                'TechTok',
                'FYP',
                'Viral',
                'Trending',
                'Tech',
                'LearnOnTikTok'
            ],
            'call_to_action': 'Follow for more!',
            'trending_sound': idea.get('trending_sound', True),
            'visual_style': 'engaging and fast-paced'
        })
    return content


def _create_viral_strategy(keyword: str) -> Dict[str, Any]:
    """Create viral strategy for TikTok."""
    return {
        'hook_formulas': [
            'POV format',
            'Question format',
            'Controversy format',
            'Story format',
            'Transformation format'
        ],
        'timing_strategy': {
            'best_posting_times': ['6-10 AM', '7-9 PM'],
            'frequency': '1-3 times per day',
            'consistency': 'daily posting'
        },
        'engagement_tactics': [
            'Ask questions in captions',
            'Use trending sounds',
            'Jump on trends quickly',
            'Create series content',
            'Engage with comments'
        ],
        'algorithm_optimization': {
            'watch_time': 'aim for 100% completion',
            'engagement_rate': 'target 10%+',
            'shares': 'encourage sharing',
            'follows': 'strong CTA to follow'
        },
        'content_themes': [
            'Educational content',
            'Entertainment',
            'Behind-the-scenes',
            'Tips and tricks',
            'Trending challenges'
        ]
    }


def _create_posting_schedule(keyword: str,
                             ideas: List[Dict[str, Any]],
                             config: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Create posting schedule for TikTok."""
    from datetime import datetime, timedelta

    frequency = config.get('posting_frequency', 'daily')
    start_date = datetime.now()

    schedule = []
    hours_offset = 0

    for i, idea in enumerate(ideas):
        if frequency == 'daily':
            post_time = start_date + timedelta(hours=hours_offset)
            hours_offset += 8  # Post every 8 hours
        else:
            post_time = start_date + timedelta(days=i)

        schedule.append({
            'video_number': i + 1,
            'title': idea['title'],
            'post_date': post_time.strftime('%Y-%m-%d'),
            'post_time': post_time.strftime('%H:%M'),
            'status': 'scheduled'
        })

    return schedule


def process_trends_from_file(trends_path: str,
                             output_path: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Process multiple trends from a file and generate TikTok workflows.

    Args:
        trends_path: Path to trends CSV/JSON file
        output_path: Optional path to save results

    Returns:
        List of TikTok video generation workflow results
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
