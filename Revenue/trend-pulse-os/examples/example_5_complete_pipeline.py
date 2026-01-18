#!/usr/bin/env python3
"""
Example 5: Complete Analysis Pipeline

This example demonstrates a complete end-to-end workflow:
1. Load trends
2. Score all trends
3. Filter high-scoring trends
4. Cluster by intent
5. Generate workflows
6. Export results

Run this example:
    python examples/example_5_complete_pipeline.py
"""

import sys
import os

parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, parent_dir)

from core.trend_parser import load_trends, filter_trends
from core.trend_score import score_batch
from core.keyword_cluster import cluster_keywords, get_top_clusters
from core.export_engine import export_csv, export_json
from workflows.ai_video_generator import generate_batch_ideas


def main():
    print("=" * 70)
    print("Example 5: Complete Analysis Pipeline")
    print("=" * 70)
    print()

    # Setup output directory
    output_dir = os.path.join(os.path.dirname(__file__), 'output')
    os.makedirs(output_dir, exist_ok=True)

    # Step 1: Load trends
    print("STEP 1: Loading Trends")
    print("-" * 70)
    data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'trends_sample.csv')
    trends = load_trends(data_path)
    print(f"✓ Loaded {len(trends)} trends from {data_path}")
    print()

    # Step 2: Score all trends
    print("STEP 2: Scoring Trends")
    print("-" * 70)
    scored_trends = score_batch(trends, include_aeo=True)
    print(f"✓ Scored {len(scored_trends)} trends")
    print(f"  Score range: {min(t['score'] for t in scored_trends):.2f} - "
          f"{max(t['score'] for t in scored_trends):.2f}")
    print(f"  Average score: {sum(t['score'] for t in scored_trends) / len(scored_trends):.2f}")
    print()

    # Step 3: Filter high-scoring trends
    print("STEP 3: Filtering High-Scoring Trends")
    print("-" * 70)
    high_scoring = [t for t in scored_trends if t['score'] >= 70]
    print(f"✓ Found {len(high_scoring)} high-scoring trends (score >= 70)")
    print("  Top 5:")
    for i, trend in enumerate(high_scoring[:5], 1):
        print(f"    {i}. {trend['keyword']}: {trend['score']:.2f}")
    print()

    # Step 4: Cluster by intent
    print("STEP 4: Clustering by Intent")
    print("-" * 70)
    clusters = cluster_keywords(scored_trends, method='intent')
    print(f"✓ Created {len(clusters)} intent clusters")
    for intent, cluster_trends in clusters.items():
        avg_score = sum(t.get('score', 0) for t in cluster_trends) / len(cluster_trends)
        print(f"  {intent}: {len(cluster_trends)} trends (avg score: {avg_score:.2f})")
    print()

    # Step 5: Get top clusters
    print("STEP 5: Top Clusters")
    print("-" * 70)
    top_clusters = get_top_clusters(clusters, top_n=3)
    print(f"✓ Top 3 clusters:")
    for intent, cluster_trends in top_clusters.items():
        print(f"  {intent.upper()}: {len(cluster_trends)} trends")
    print()

    # Step 6: Generate video ideas
    print("STEP 6: Generating Video Ideas")
    print("-" * 70)
    top_5_trends = high_scoring[:5]
    video_ideas = generate_batch_ideas(top_5_trends, style='tutorial')
    print(f"✓ Generated {len(video_ideas)} video ideas")
    print("  Sample ideas:")
    for i, idea in enumerate(video_ideas[:3], 1):
        print(f"    {i}. {idea['title']}")
        print(f"       Estimated Views: {idea['estimated_views']}")
    print()

    # Step 7: Export results
    print("STEP 7: Exporting Results")
    print("-" * 70)

    # Export all scored trends
    all_scored_path = os.path.join(output_dir, 'all_scored_trends.csv')
    export_csv(scored_trends, all_scored_path)
    print(f"✓ Exported all scored trends to: {all_scored_path}")

    # Export high-scoring trends
    high_score_path = os.path.join(output_dir, 'high_score_trends.csv')
    export_csv(high_scoring, high_score_path)
    print(f"✓ Exported high-scoring trends to: {high_score_path}")

    # Export clusters
    cluster_list = [
        {
            'cluster_name': name,
            'trend_count': len(trends_list),
            'average_score': sum(t.get('score', 0) for t in trends_list) / len(trends_list),
            'trends': trends_list
        }
        for name, trends_list in clusters.items()
    ]
    clusters_path = os.path.join(output_dir, 'clusters.json')
    export_json(cluster_list, clusters_path)
    print(f"✓ Exported clusters to: {clusters_path}")

    # Export video ideas
    ideas_path = os.path.join(output_dir, 'video_ideas.json')
    export_json(video_ideas, ideas_path)
    print(f"✓ Exported video ideas to: {ideas_path}")
    print()

    # Summary
    print("=" * 70)
    print("PIPELINE SUMMARY")
    print("=" * 70)
    print(f"Total trends analyzed: {len(trends)}")
    print(f"High-scoring trends (≥70): {len(high_scoring)}")
    print(f"Intent clusters created: {len(clusters)}")
    print(f"Video ideas generated: {len(video_ideas)}")
    print(f"Output files created: 4")
    print()
    print("Output Directory: examples/output/")
    print("=" * 70)
    print("Complete Pipeline Finished!")
    print("=" * 70)


if __name__ == '__main__':
    main()
