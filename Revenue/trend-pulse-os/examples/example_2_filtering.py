#!/usr/bin/env python3
"""
Example 2: Filtering Trends

This example demonstrates:
- Filtering trends by growth
- Filtering trends by difficulty
- Filtering trends by intent
- Combining multiple filters
- Filtering scored trends

Run this example:
    python examples/example_2_filtering.py
"""

import sys
import os

parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, parent_dir)

from core.trend_parser import load_trends, filter_trends
from core.trend_score import score_batch


def main():
    print("=" * 60)
    print("Example 2: Filtering Trends")
    print("=" * 60)
    print()

    # Load trends
    data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'trends_sample.csv')
    trends = load_trends(data_path)
    print(f"Loaded {len(trends)} total trends")
    print()

    # Filter 1: By minimum growth
    print("Filter 1: Trends with growth >= 7000")
    print("-" * 60)
    high_growth = filter_trends(trends, min_growth=7000)
    print(f"Found {len(high_growth)} trends:")
    for trend in high_growth:
        print(f"  - {trend['keyword']}: growth={trend.get('growth')}")
    print()

    # Filter 2: By maximum difficulty
    print("Filter 2: Easy trends (difficulty <= 2)")
    print("-" * 60)
    easy_trends = filter_trends(trends, max_difficulty=2)
    print(f"Found {len(easy_trends)} trends:")
    for trend in easy_trends:
        print(f"  - {trend['keyword']}: difficulty={trend.get('difficulty')}")
    print()

    # Filter 3: By intent
    print("Filter 3: Creator intent trends")
    print("-" * 60)
    creator_trends = filter_trends(trends, intent='creator')
    print(f"Found {len(creator_trends)} trends:")
    for trend in creator_trends:
        print(f"  - {trend['keyword']}: intent={trend.get('intent')}")
    print()

    # Filter 4: Combined filters
    print("Filter 4: High-growth, easy, creator trends")
    print("-" * 60)
    optimal_trends = filter_trends(
        trends,
        min_growth=6000,
        max_difficulty=2,
        intent='creator'
    )
    print(f"Found {len(optimal_trends)} optimal trends:")
    for trend in optimal_trends:
        print(f"  - {trend['keyword']}: growth={trend.get('growth')}, "
              f"difficulty={trend.get('difficulty')}")
    print()

    # Filter 5: High-scoring trends
    print("Filter 5: High-scoring trends (score >= 70)")
    print("-" * 60)
    scored_trends = score_batch(trends)
    high_scoring = [t for t in scored_trends if t['score'] >= 70]
    print(f"Found {len(high_scoring)} high-scoring trends:")
    for trend in high_scoring:
        print(f"  - {trend['keyword']}: score={trend['score']:.2f}")
    print()

    print("=" * 60)
    print("Example 2 Complete!")
    print("=" * 60)


if __name__ == '__main__':
    main()
