"""
Export Engine Module

Exports processed trend data to various formats (CSV, JSON, Excel).
"""

import csv
import json
import os
from typing import List, Dict, Any, Optional


def export_csv(data: List[Dict[str, Any]],
               path: str,
               fieldnames: Optional[List[str]] = None) -> None:
    """
    Export data to CSV file.

    Args:
        data: List of dictionaries to export
        path: Output file path
        fieldnames: Optional list of field names (uses all keys if not provided)

    Raises:
        ValueError: If data is empty or invalid

    Example:
        >>> data = [{'keyword': 'AI', 'score': 95}]
        >>> export_csv(data, 'output.csv')
    """
    if not data:
        raise ValueError("Cannot export empty data")

    # Ensure directory exists
    os.makedirs(os.path.dirname(path) if os.path.dirname(path) else '.', exist_ok=True)

    # Determine fieldnames
    if fieldnames is None:
        fieldnames = list(data[0].keys())

    with open(path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction='ignore')
        writer.writeheader()
        writer.writerows(data)


def export_json(data: List[Dict[str, Any]],
               path: str,
               indent: int = 2) -> None:
    """
    Export data to JSON file.

    Args:
        data: List of dictionaries to export
        path: Output file path
        indent: JSON indentation level

    Raises:
        ValueError: If data is empty or invalid
    """
    if not data:
        raise ValueError("Cannot export empty data")

    # Ensure directory exists
    os.makedirs(os.path.dirname(path) if os.path.dirname(path) else '.', exist_ok=True)

    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=indent, ensure_ascii=False)


def export_formatted(data: List[Dict[str, Any]],
                    path: str,
                    format_type: str = 'csv') -> None:
    """
    Export data in specified format.

    Args:
        data: List of dictionaries to export
        path: Output file path
        format_type: Export format ('csv', 'json')

    Raises:
        ValueError: If format is unsupported
    """
    format_type = format_type.lower()

    if format_type == 'csv':
        export_csv(data, path)
    elif format_type == 'json':
        export_json(data, path)
    else:
        raise ValueError(f"Unsupported format: {format_type}. Use 'csv' or 'json'")


def export_summary(data: List[Dict[str, Any]],
                  path: str) -> None:
    """
    Export a summary report of trends.

    Args:
        data: List of trend dictionaries
        path: Output file path
    """
    if not data:
        return

    summary = {
        'total_trends': len(data),
        'top_keywords': [t.get('keyword') for t in sorted(
            data,
            key=lambda x: float(x.get('score', 0)),
            reverse=True
        )[:10]],
        'intent_distribution': {},
        'average_score': sum(float(t.get('score', 0)) for t in data) / len(data) if data else 0
    }

    # Calculate intent distribution
    from collections import Counter
    intents = [t.get('intent', 'unknown') for t in data]
    summary['intent_distribution'] = dict(Counter(intents))

    export_json([summary], path)
