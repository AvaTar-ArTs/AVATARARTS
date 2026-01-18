#!/usr/bin/env python3
"""
Example 1: Basic Trend Analysis

This example demonstrates:
- Loading trend data from CSV
- Scoring individual trends
- Scoring batches of trends
- Viewing results

Run this example:
    python examples/example_1_basic_analysis.py
"""

import os
import sys

# Add parent directory to path to import modules
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, parent_dir)

from core.trend_parser import load_trends
from core.trend_score import score_batch, score_trend


def main():
    print("=" * 60)
    print("Example 1: Basic Trend Analysis")
    print("=" * 60)
    print()

    # Step 1: Load trends
    print("Step 1: Loading trends from CSV...")
    data_path = os.path.join(
        os.path.dirname(__file__), "..", "data", "trends_sample.csv"
    )
    trends = load_trends(data_path)
    print(f"✓ Loaded {len(trends)} trends")
    print()

    # Step 2: Score a single trend
    print("Step 2: Scoring a single trend...")
    first_trend = trends[0]
    score = score_trend(first_trend)
    print(f"Trend: {first_trend['keyword']}")
    print(f"  Growth: {first_trend.get('growth', 'N/A')}")
    print(f"  Difficulty: {first_trend.get('difficulty', 'N/A')}")
    print(f"  Intent: {first_trend.get('intent', 'N/A')}")
    print(f"  Score: {score}")
    print()

    # Step 3: Score all trends
    print("Step 3: Scoring all trends...")
    scored_trends = score_batch(trends)
    print(f"✓ Scored {len(scored_trends)} trends")
    print()

    # Step 4: Display top trends
    print("Step 4: Top 5 Scored Trends:")
    print("-" * 60)
    for i, trend in enumerate(scored_trends[:5], 1):
        print(f"{i}. {trend['keyword']}")
        print(
            f"   Score: {trend['score']:.2f} | Growth: {trend.get('growth')} | "
            f"Difficulty: {trend.get('difficulty')} | Intent: {trend.get('intent')}"
        )
    print()

    # Step 5: Score comparison
    print("Step 5: Comparing scores with and without AEO:")
    print("-" * 60)
    test_trend = trends[0]
    score_with_aeo = score_trend(test_trend, include_aeo=True)
    score_without_aeo = score_trend(test_trend, include_aeo=False)
    print(f"Trend: {test_trend['keyword']}")
    print(f"  Score with AEO: {score_with_aeo:.2f}")
    print(f"  Score without AEO: {score_without_aeo:.2f}")
    print(f"  Difference: {score_with_aeo - score_without_aeo:.2f}")
    print()

    print("=" * 60)
    print("Example 1 Complete!")
    print("=" * 60)


if __name__ == "__main__":
    main()
