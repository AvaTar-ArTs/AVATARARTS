"""
Instagram Reel Generator Workflow

AI-powered Instagram Reel creation pipelines.
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
    Execute Instagram Reel Generator workflow for a keyword.

    Args:
        keyword: The trending keyword to process
        config: Optional configuration dictionary

    Returns:
        Dictionary containing Instagram Reel workflow results
    """
    if config is None:
        config = {}

    # Generate Reel ideas
    ideas = _generate_reel_ideas(keyword, config)

    # Create content strategy
    content_strategy = _create_content_strategy(keyword, ideas)

    # Design visual approach
    visual_approach = _create_visual_approach(keyword, config)

    # Build posting plan
    posting_plan = _create_posting_plan(keyword, ideas, config)

    return {
        'keyword': keyword,
        'ideas': ideas,
        'content_strategy': content_strategy,
        'visual_approach': visual_approach,
        'posting_plan': posting_plan,
        'workflow_type': 'instagram_reel_generator',
        'status': 'ready'
    }


def _generate_reel_ideas(keyword: str, config: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Generate Instagram Reel ideas."""
    return [
        {
            'title': f"3 Ways to Use {keyword}",
            'format': 'tips_list',
            'duration': '15-30s',
            'hook': f"Here are 3 ways {keyword} can help you",
            'trending_audio': True,
            'estimated_reach': '10K-50K'
        },
        {
            'title': f"{keyword} Before & After",
            'format': 'transformation',
            'duration': '30-60s',
            'hook': f"Watch how {keyword} transforms this",
            'trending_audio': True,
            'estimated_reach': '20K-100K'
        },
        {
            'title': f"{keyword} Explained Simply",
            'format': 'educational',
            'duration': '30-45s',
            'hook': f"Let me explain {keyword} in simple terms",
            'trending_audio': True,
            'estimated_reach': '15K-75K'
        }
    ]


def _create_content_strategy(keyword: str, ideas: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Create content strategy for Reels."""
    return {
        'content_themes': [
            'Tips and tutorials',
            'Before and after',
            'Quick facts',
            'Behind the scenes',
            'Trending challenges'
        ],
        'caption_strategy': {
            'hook_line': f"Discover {keyword}",
            'include_hashtags': True,
            'call_to_action': 'Save this post!',
            'engagement_questions': True
        },
        'hashtag_strategy': {
            'primary_hashtags': [keyword.replace(' ', ''), 'Reels', 'AI', 'Tech'],
            'trending_hashtags': ['Reels', 'Viral', 'FYP', 'Trending'],
            'niche_hashtags': ['Tech', 'AI', 'Innovation'],
            'total_hashtags': 10
        },
        'audio_strategy': {
            'use_trending_audio': True,
            'audio_selection': 'trending in niche',
            'sync_with_visuals': True
        }
    }


def _create_visual_approach(keyword: str, config: Dict[str, Any]) -> Dict[str, Any]:
    """Create visual approach for Reels."""
    return {
        'format_specs': {
            'aspect_ratio': '9:16 (vertical)',
            'resolution': '1080x1920',
            'duration': '15-90 seconds',
            'orientation': 'portrait'
        },
        'visual_elements': [
            'Text overlays for key points',
            'Bold, readable fonts',
            'High contrast colors',
            'Fast-paced cuts',
            'Engaging transitions'
        ],
        'style_guidelines': {
            'color_scheme': 'vibrant and modern',
            'text_style': 'large and bold',
            'transition_style': 'smooth and quick',
            'branding': 'consistent throughout'
        },
        'tools_recommended': [
            'Canva (templates)',
            'CapCut (editing)',
            'InShot (mobile editing)',
            'Unfold (stories/reels)'
        ]
    }


def _create_posting_plan(keyword: str,
                        ideas: List[Dict[str, Any]],
                        config: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Create posting plan for Reels."""
    from datetime import datetime, timedelta

    frequency = config.get('posting_frequency', 'daily')
    start_date = datetime.now()

    plan = []
    days_offset = 0

    for i, idea in enumerate(ideas):
        if frequency == 'daily':
            post_date = start_date + timedelta(days=days_offset)
            days_offset += 1
        else:
            post_date = start_date + timedelta(days=i)

        plan.append({
            'reel_number': i + 1,
            'title': idea['title'],
            'post_date': post_date.strftime('%Y-%m-%d'),
            'post_time': config.get('optimal_time', '18:00'),
            'format': idea['format'],
            'status': 'scheduled'
        })

    return plan


def process_trends_from_file(trends_path: str,
                             output_path: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Process multiple trends from a file and generate Reel workflows.

    Args:
        trends_path: Path to trends CSV/JSON file
        output_path: Optional path to save results

    Returns:
        List of Instagram Reel workflow results
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
