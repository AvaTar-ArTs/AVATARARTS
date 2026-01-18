"""
Trend Scoring Module

Calculates trend scores using multiple factors including growth, difficulty,
and AEO compatibility.
"""

from typing import Dict, Any, Optional
from datetime import datetime, timedelta


def score_trend(trend: Dict[str, Any],
                include_aeo: bool = True,
                time_decay: bool = False) -> float:
    """
    Calculate a comprehensive trend score.

    Args:
        trend: Dictionary containing trend data
        include_aeo: Whether to include AEO compatibility in score
        time_decay: Whether to apply time-based decay

    Returns:
        Trend score (0-100 scale)

    Example:
        >>> trend = {'keyword': 'AI Video', 'growth': 6700, 'difficulty': 2}
        >>> score_trend(trend)
        95.5
    """
    growth = float(trend.get('growth', 0))
    difficulty = float(trend.get('difficulty', 1))

    # Base score: growth / difficulty ratio
    base_score = growth / max(difficulty, 1)

    # Normalize to 0-100 scale (assuming max growth ~10000)
    normalized_score = min((base_score / 100) * 100, 100)

    # Apply AEO bonus if enabled
    if include_aeo:
        aeo_score = calculate_aeo_score(trend)
        normalized_score = (normalized_score * 0.7) + (aeo_score * 0.3)

    # Apply time decay if enabled
    if time_decay and 'timestamp' in trend:
        decay_factor = calculate_time_decay(trend['timestamp'])
        normalized_score *= decay_factor

    return round(normalized_score, 2)


def calculate_aeo_score(trend: Dict[str, Any]) -> float:
    """
    Calculate AEO (Answer Engine Optimization) compatibility score.

    Args:
        trend: Dictionary containing trend data

    Returns:
        AEO score (0-100)
    """
    score = 50  # Base score

    keyword = str(trend.get('keyword', '')).lower()

    # Question keywords boost AEO score
    question_words = ['how', 'what', 'why', 'when', 'where', 'which', 'who']
    if any(keyword.startswith(word) for word in question_words):
        score += 20

    # Long-tail keywords (3+ words) are better for AEO
    word_count = len(keyword.split())
    if word_count >= 3:
        score += 15
    elif word_count >= 2:
        score += 10

    # Intent-based scoring
    intent = trend.get('intent', '').lower()
    aeo_friendly_intents = ['howto', 'tutorial', 'guide', 'explain']
    if intent in aeo_friendly_intents:
        score += 15

    return min(score, 100)


def calculate_time_decay(timestamp: str,
                        half_life_days: int = 7) -> float:
    """
    Calculate time decay factor for trend freshness.

    Args:
        timestamp: ISO format timestamp string
        half_life_days: Days for score to decay by 50%

    Returns:
        Decay factor (0-1)
    """
    try:
        trend_time = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
        now = datetime.now(trend_time.tzinfo)
        age_days = (now - trend_time).days

        # Exponential decay
        decay_factor = 0.5 ** (age_days / half_life_days)
        return max(decay_factor, 0.1)  # Minimum 10% of original score
    except:
        return 1.0  # No decay if timestamp invalid


def score_batch(trends: list[Dict[str, Any]],
                **kwargs) -> list[Dict[str, Any]]:
    """
    Score multiple trends and return sorted by score.

    Args:
        trends: List of trend dictionaries
        **kwargs: Additional arguments passed to score_trend()

    Returns:
        List of trends with 'score' field added, sorted by score (descending)
    """
    scored = []
    for trend in trends:
        trend_copy = trend.copy()
        trend_copy['score'] = score_trend(trend, **kwargs)
        scored.append(trend_copy)

    return sorted(scored, key=lambda x: x['score'], reverse=True)
