#!/usr/bin/env python3
"""
Example 3: Clustering Trends

This example demonstrates:
- Clustering trends by intent
- Clustering trends by score
- Clustering trends by similarity
- Getting top clusters
- Working with cluster data

Run this example:
    python examples/example_3_clustering.py
"""

import sys
import os

parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, parent_dir)

from core.trend_parser import load_trends
from core.trend_score import score_batch
from core.keyword_cluster import cluster_keywords, get_top_clusters


def main():
    print("=" * 60)
    print("Example 3: Clustering Trends")
    print("=" * 60)
    print()

    # Load and score trends
    data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'trends_sample.csv')
    trends = load_trends(data_path)
    scored_trends = score_batch(trends)
    print(f"Loaded and scored {len(scored_trends)} trends")
    print()

    # Cluster 1: By intent
    print("Cluster 1: By Intent")
    print("-" * 60)
    intent_clusters = cluster_keywords(scored_trends, method='intent')
    print(f"Found {len(intent_clusters)} intent clusters:")
    for intent, cluster_trends in intent_clusters.items():
        print(f"\n  {intent.upper()} ({len(cluster_trends)} trends):")
        for trend in cluster_trends:
            print(f"    - {trend['keyword']} (score: {trend['score']:.2f})")
    print()

    # Cluster 2: By score
    print("Cluster 2: By Score Ranges")
    print("-" * 60)
    score_clusters = cluster_keywords(scored_trends, method='score')
    print(f"Found {len(score_clusters)} score clusters:")
    for score_range, cluster_trends in sorted(score_clusters.items(), reverse=True):
        print(f"\n  Score {score_range} ({len(cluster_trends)} trends):")
        for trend in cluster_trends:
            print(f"    - {trend['keyword']}: {trend['score']:.2f}")
    print()

    # Cluster 3: By similarity
    print("Cluster 3: By Similarity")
    print("-" * 60)
    similarity_clusters = cluster_keywords(scored_trends, method='similarity')
    print(f"Found {len(similarity_clusters)} similarity clusters:")
    for cluster_id, cluster_trends in list(similarity_clusters.items())[:3]:
        print(f"\n  {cluster_id} ({len(cluster_trends)} trends):")
        for trend in cluster_trends:
            print(f"    - {trend['keyword']}")
    print()

    # Top clusters
    print("Top 3 Largest Clusters (by intent)")
    print("-" * 60)
    top_intent_clusters = get_top_clusters(intent_clusters, top_n=3)
    for intent, cluster_trends in top_intent_clusters.items():
        print(f"\n  {intent.upper()} ({len(cluster_trends)} trends):")
        # Show top 3 in each cluster
        sorted_cluster = sorted(cluster_trends, key=lambda x: x.get('score', 0), reverse=True)
        for trend in sorted_cluster[:3]:
            print(f"    - {trend['keyword']}: score={trend['score']:.2f}")
    print()

    # Working with a specific cluster
    print("Analysis: Creator Cluster Details")
    print("-" * 60)
    if 'creator' in intent_clusters:
        creator_cluster = intent_clusters['creator']
        creator_scores = [t.get('score', 0) for t in creator_cluster]
        avg_score = sum(creator_scores) / len(creator_scores) if creator_scores else 0
        print(f"Creator cluster has {len(creator_cluster)} trends")
        print(f"Average score: {avg_score:.2f}")
        print(f"Top trend: {max(creator_cluster, key=lambda x: x.get('score', 0))['keyword']}")
    print()

    print("=" * 60)
    print("Example 3 Complete!")
    print("=" * 60)


if __name__ == '__main__':
    main()
