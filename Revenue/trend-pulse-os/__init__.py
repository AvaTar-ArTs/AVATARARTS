"""
Trend Pulse OS

Core trend analysis engine for identifying and processing trending topics.
"""

__version__ = "1.0.0"
__author__ = "AvaTar-ArTs"

from .core.trend_parser import load_trends, validate_trend, filter_trends
from .core.trend_score import score_trend, score_batch, calculate_aeo_score
from .core.keyword_cluster import cluster_keywords, get_top_clusters
from .core.export_engine import export_csv, export_json, export_formatted

__all__ = [
    'load_trends',
    'validate_trend',
    'filter_trends',
    'score_trend',
    'score_batch',
    'calculate_aeo_score',
    'cluster_keywords',
    'get_top_clusters',
    'export_csv',
    'export_json',
    'export_formatted',
]
