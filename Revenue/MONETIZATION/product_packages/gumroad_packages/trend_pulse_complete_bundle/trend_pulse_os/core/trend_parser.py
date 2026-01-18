"""
Trend Parser Module

Loads and parses trend data from various sources (CSV, JSON, etc.)
"""

import csv
import json
import os
from typing import List, Dict, Any, Optional


def load_trends(path: str) -> List[Dict[str, Any]]:
    """
    Load trend data from a CSV or JSON file.

    Args:
        path: File path to the trend data file

    Returns:
        List of dictionaries containing trend data

    Raises:
        FileNotFoundError: If the file doesn't exist
        ValueError: If the file format is unsupported or data is invalid

    Example:
        >>> trends = load_trends('data/trends_sample.csv')
        >>> len(trends)
        5
    """
    if not os.path.exists(path):
        raise FileNotFoundError(f"Trend data file not found: {path}")

    file_ext = os.path.splitext(path)[1].lower()

    try:
        if file_ext == '.csv':
            return _load_csv(path)
        elif file_ext == '.json':
            return _load_json(path)
        else:
            raise ValueError(f"Unsupported file format: {file_ext}. Use .csv or .json")
    except Exception as e:
        raise ValueError(f"Error loading trend data: {str(e)}")


def _load_csv(path: str) -> List[Dict[str, Any]]:
    """Load trends from CSV file."""
    trends = []
    with open(path, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Validate required fields
            if not row.get('keyword'):
                continue
            trends.append(row)
    return trends


def _load_json(path: str) -> List[Dict[str, Any]]:
    """Load trends from JSON file."""
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        if isinstance(data, list):
            return data
        elif isinstance(data, dict) and 'trends' in data:
            return data['trends']
        else:
            raise ValueError("JSON file must contain a list or dict with 'trends' key")


def validate_trend(trend: Dict[str, Any]) -> bool:
    """
    Validate that a trend dictionary has required fields.

    Args:
        trend: Dictionary containing trend data

    Returns:
        True if valid, False otherwise
    """
    required_fields = ['keyword']
    return all(field in trend and trend[field] for field in required_fields)


def filter_trends(trends: List[Dict[str, Any]],
                  min_growth: Optional[float] = None,
                  max_difficulty: Optional[float] = None,
                  intent: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Filter trends based on criteria.

    Args:
        trends: List of trend dictionaries
        min_growth: Minimum growth value
        max_difficulty: Maximum difficulty value
        intent: Filter by intent category

    Returns:
        Filtered list of trends
    """
    filtered = trends

    if min_growth is not None:
        filtered = [t for t in filtered
                   if float(t.get('growth', 0)) >= min_growth]

    if max_difficulty is not None:
        filtered = [t for t in filtered
                   if float(t.get('difficulty', 10)) <= max_difficulty]

    if intent:
        filtered = [t for t in filtered
                   if t.get('intent', '').lower() == intent.lower()]

    return filtered
