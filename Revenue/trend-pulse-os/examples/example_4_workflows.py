#!/usr/bin/env python3
"""
Example 4: Using Workflows

This example demonstrates:
- Generating video ideas from trends
- Using different video styles
- Batch workflow generation
- Working with workflow outputs

Run this example:
    python examples/example_4_workflows.py
"""

import sys
import os

parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, parent_dir)

from core.trend_parser import load_trends
from core.trend_score import score_batch
from workflows.ai_video_generator import generate_video_ideas, generate_batch_ideas


def main():
    print("=" * 60)
    print("Example 4: Using Workflows")
    print("=" * 60)
    print()

    # Load and score trends
    data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'trends_sample.csv')
    trends = load_trends(data_path)
    scored_trends = score_batch(trends)
    top_trend = scored_trends[0]

    print(f"Using top trend: {top_trend['keyword']} (score: {top_trend['score']:.2f})")
    print()

    # Workflow 1: Generate tutorial video idea
    print("Workflow 1: Tutorial Video Idea")
    print("-" * 60)
    tutorial_idea = generate_video_ideas(top_trend, style='tutorial')
    print(f"Title: {tutorial_idea['title']}")
    print(f"Hook: {tutorial_idea['hook']}")
    print(f"Description: {tutorial_idea['description']}")
    print(f"Tags: {', '.join(tutorial_idea['tags'])}")
    print(f"Estimated Views: {tutorial_idea['estimated_views']}")
    print(f"Target Audience: {tutorial_idea['target_audience']}")
    print()

    # Workflow 2: Generate review video idea
    print("Workflow 2: Review Video Idea")
    print("-" * 60)
    review_idea = generate_video_ideas(top_trend, style='review')
    print(f"Title: {review_idea['title']}")
    print(f"Hook: {review_idea['hook']}")
    print(f"Estimated Views: {review_idea['estimated_views']}")
    print()

    # Workflow 3: Generate comparison video idea
    print("Workflow 3: Comparison Video Idea")
    print("-" * 60)
    comparison_idea = generate_video_ideas(top_trend, style='comparison')
    print(f"Title: {comparison_idea['title']}")
    print(f"Hook: {comparison_idea['hook']}")
    print(f"Estimated Views: {comparison_idea['estimated_views']}")
    print()

    # Workflow 4: Batch generation
    print("Workflow 4: Batch Video Ideas (Top 3 Trends)")
    print("-" * 60)
    top_3_trends = scored_trends[:3]
    batch_ideas = generate_batch_ideas(top_3_trends, style='tutorial')
    print(f"Generated {len(batch_ideas)} video ideas:\n")
    for i, idea in enumerate(batch_ideas, 1):
        print(f"{i}. {idea['title']}")
        print(f"   Audience: {idea['target_audience']}")
        print(f"   Estimated Views: {idea['estimated_views']}")
        print(f"   Trend Score: {idea['trend_score']:.2f}")
        print()

    # Workflow 5: All styles for one trend
    print("Workflow 5: All Video Styles for Top Trend")
    print("-" * 60)
    styles = ['tutorial', 'news', 'review', 'comparison']
    for style in styles:
        idea = generate_video_ideas(top_trend, style=style)
        print(f"\n{style.upper()}:")
        print(f"  {idea['title']}")
    print()

    print("=" * 60)
    print("Example 4 Complete!")
    print("=" * 60)


if __name__ == '__main__':
    main()
