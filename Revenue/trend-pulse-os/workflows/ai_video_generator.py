"""
AI Video Generator Workflow

Generates AEO-optimized, top 1-5% SEO video ideas and content from trending topics.
Optimized for YouTube search, answer engines (ChatGPT, Perplexity, Google AI Overview),
and hot rising trends (300%+ YoY growth).
"""

from datetime import datetime
from typing import Any, Dict, List


def generate_video_ideas(
    trend: Dict[str, Any], style: str = "tutorial"
) -> Dict[str, Any]:
    """
    Generate video ideas from a trend.

    Args:
        trend: Dictionary containing trend data
        style: Video style ('tutorial', 'news', 'review', 'comparison')

    Returns:
        Dictionary with video idea details

    Example:
        >>> trend = {'keyword': 'AI Video Generator', 'score': 95}
        >>> idea = generate_video_ideas(trend, style='tutorial')
        >>> 'title' in idea
        True
    """
    keyword = trend.get("keyword", "Topic")
    score = trend.get("score", 0)
    intent = trend.get("intent", "general")

    # AEO-Optimized: Titles answer questions, include keyword in first 30 chars
    # Top 1-5% SEO: Question-based formats, trending signals, comprehensive coverage
    templates = {
        "tutorial": {
            "title": f"How to Use {keyword} in 2026: Complete Guide",  # AEO: Question format
            "hook": f"{keyword} just exploded — here's why everyone's using it",  # AEO: Direct answer preview
            "description": f"{keyword} is one of the hottest trends right now. Learn everything about {keyword} in this comprehensive tutorial that covers what it is, how it works, and why it matters.",  # AEO: Answers what/how/why
            "tags": [
                keyword,
                "tutorial",
                "how-to",
                "guide",
                f"{keyword} explained",
                f"what is {keyword}",
                f"how to {keyword}",
                keyword.replace(" ", ""),
                "trending",
                "2024",
            ],
        },
        "news": {
            "title": f"{keyword}: The Trend Everyone's Talking About",  # AEO: Direct statement
            "hook": f"{keyword} is trending — here's what you need to know",  # AEO: Direct answer
            "description": f"{keyword} is trending now. Here's what {keyword} is, why it's trending, and what you need to know about this hot topic.",  # AEO: Comprehensive answer
            "tags": [
                keyword,
                "news",
                "trending",
                "update",
                f"{keyword} trend",
                f"{keyword} 2024",
                keyword.replace(" ", ""),
                "hot",
                "breaking",
            ],
        },
        "review": {
            "title": f"{keyword} Review: Is It Worth It?",  # AEO: Question format
            "hook": f"I tested {keyword} so you don't have to",  # AEO: Value proposition
            "description": f"Is {keyword} worth it? I tested {keyword} extensively. Here's my honest review of what {keyword} is, how it works, and whether it's worth your time.",  # AEO: Answers question directly
            "tags": [
                keyword,
                "review",
                "test",
                "honest",
                f"{keyword} review",
                f"is {keyword} worth it",
                keyword.replace(" ", ""),
                "honest review",
                "tested",
            ],
        },
        "comparison": {
            "title": f"{keyword} vs Alternatives: Which is Best?",  # AEO: Question format
            "hook": f"I compared {keyword} with top alternatives — here's the winner",  # AEO: Direct answer preview
            "description": f"Which is best: {keyword} or alternatives? I compared {keyword} with the top alternatives. Here's what {keyword} is, how it compares, and which option wins.",  # AEO: Answers comparison question
            "tags": [
                keyword,
                "comparison",
                "vs",
                "alternatives",
                f"{keyword} vs",
                f"best {keyword}",
                keyword.replace(" ", ""),
                "compare",
                "alternatives",
            ],
        },
    }

    template = templates.get(style, templates["tutorial"])

    # AEO-Optimized output: Includes SEO signals, answer engine optimization
    return {
        "title": template["title"],  # AEO: Keyword in first 30 chars, question format
        "hook": template["hook"],  # AEO: Direct answer preview
        "description": template[
            "description"
        ],  # AEO: First 125 words answer main question
        "tags": template[
            "tags"
        ],  # Top 1-5% SEO: 10-15 tags including question-based, trending
        "style": style,
        "trend_score": score,
        "intent": intent,
        "generated_at": datetime.now().isoformat(),
        "estimated_views": _estimate_views(score),
        "target_audience": _determine_audience(intent),
        "seo_optimized": True,  # Top 1-5% SEO signal
        "aeo_optimized": True,  # Answer Engine Optimization signal
        "keyword_in_title": keyword
        in template["title"][:30],  # Top 1-5% SEO: Keyword in first 30 chars
    }


def _estimate_views(score: float) -> str:
    """Estimate potential views based on trend score."""
    if score >= 90:
        return "100K+"
    elif score >= 70:
        return "50K-100K"
    elif score >= 50:
        return "10K-50K"
    else:
        return "1K-10K"


def _determine_audience(intent: str) -> str:
    """Determine target audience based on intent."""
    audience_map = {
        "creator": "Content Creators",
        "education": "Students & Educators",
        "productivity": "Professionals",
        "hardware": "Tech Enthusiasts",
        "general": "General Audience",
    }
    return audience_map.get(intent.lower(), "General Audience")


def generate_batch_ideas(
    trends: List[Dict[str, Any]], style: str = "tutorial"
) -> List[Dict[str, Any]]:
    """
    Generate video ideas for multiple trends.

    Args:
        trends: List of trend dictionaries
        style: Video style to use for all

    Returns:
        List of video idea dictionaries
    """
    return [generate_video_ideas(trend, style) for trend in trends]
