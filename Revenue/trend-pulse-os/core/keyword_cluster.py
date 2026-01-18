"""
Keyword Clustering Module

Groups and clusters keywords by intent, similarity, and other factors.
"""

from typing import List, Dict, Any, Optional
from collections import defaultdict


def cluster_keywords(trends: List[Dict[str, Any]],
                    method: str = 'intent') -> Dict[str, List[Dict[str, Any]]]:
    """
    Cluster keywords by specified method.

    Args:
        trends: List of trend dictionaries
        method: Clustering method ('intent', 'similarity', 'score')

    Returns:
        Dictionary mapping cluster keys to lists of trends

    Example:
        >>> trends = [{'keyword': 'AI Video', 'intent': 'creator'}, ...]
        >>> clusters = cluster_keywords(trends, method='intent')
        >>> 'creator' in clusters
        True
    """
    if method == 'intent':
        return cluster_by_intent(trends)
    elif method == 'score':
        return cluster_by_score(trends)
    elif method == 'similarity':
        return cluster_by_similarity(trends)
    else:
        raise ValueError(f"Unknown clustering method: {method}")


def cluster_by_intent(trends: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
    """
    Cluster trends by intent category.

    Args:
        trends: List of trend dictionaries

    Returns:
        Dictionary mapping intent to list of trends
    """
    clusters = defaultdict(list)
    for trend in trends:
        intent = trend.get('intent', 'general').lower()
        clusters[intent].append(trend)
    return dict(clusters)


def cluster_by_score(trends: List[Dict[str, Any]],
                     bins: int = 5) -> Dict[str, List[Dict[str, Any]]]:
    """
    Cluster trends by score ranges.

    Args:
        trends: List of trend dictionaries (must have 'score' field)
        bins: Number of score bins

    Returns:
        Dictionary mapping score ranges to lists of trends
    """
    from .trend_score import score_batch

    # Score trends if not already scored
    if not trends or 'score' not in trends[0]:
        trends = score_batch(trends)

    # Find score range
    scores = [t.get('score', 0) for t in trends]
    min_score, max_score = min(scores), max(scores)
    bin_size = (max_score - min_score) / bins if max_score > min_score else 1

    clusters = defaultdict(list)
    for trend in trends:
        score = trend.get('score', 0)
        bin_num = min(int((score - min_score) / bin_size), bins - 1)
        bin_label = f"{min_score + bin_num * bin_size:.0f}-{min_score + (bin_num + 1) * bin_size:.0f}"
        clusters[bin_label].append(trend)

    return dict(clusters)


def cluster_by_similarity(trends: List[Dict[str, Any]],
                          threshold: float = 0.5) -> Dict[str, List[Dict[str, Any]]]:
    """
    Cluster trends by keyword similarity (simple word overlap).

    Args:
        trends: List of trend dictionaries
        threshold: Similarity threshold (0-1)

    Returns:
        Dictionary mapping cluster IDs to lists of trends
    """
    clusters = {}
    cluster_id = 0

    for trend in trends:
        keyword = trend.get('keyword', '').lower()
        words = set(keyword.split())

        # Find matching cluster
        assigned = False
        for cid, cluster_trends in clusters.items():
            # Check similarity with first trend in cluster
            cluster_keyword = cluster_trends[0].get('keyword', '').lower()
            cluster_words = set(cluster_keyword.split())

            # Simple Jaccard similarity
            intersection = len(words & cluster_words)
            union = len(words | cluster_words)
            similarity = intersection / union if union > 0 else 0

            if similarity >= threshold:
                clusters[cid].append(trend)
                assigned = True
                break

        if not assigned:
            clusters[f"cluster_{cluster_id}"] = [trend]
            cluster_id += 1

    return clusters


def get_top_clusters(clusters: Dict[str, List[Dict[str, Any]]],
                     top_n: int = 5) -> Dict[str, List[Dict[str, Any]]]:
    """
    Get top N clusters by size.

    Args:
        clusters: Dictionary of clusters
        top_n: Number of top clusters to return

    Returns:
        Dictionary of top N clusters
    """
    sorted_clusters = sorted(clusters.items(),
                           key=lambda x: len(x[1]),
                           reverse=True)
    return dict(sorted_clusters[:top_n])
