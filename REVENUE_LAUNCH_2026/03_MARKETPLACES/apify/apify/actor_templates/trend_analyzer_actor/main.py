"""
Trend Analyzer Actor for Apify

Analyzes trending keywords with SEO/AEO scoring.
Monetization: Pay-per-Result ($0.50/result)
"""

from apify import Actor
import json
import csv
from typing import Dict, Any, List
import requests


async def main():
    """
    Main actor function.
    Analyzes trends and calculates SEO/AEO scores.
    """
    async with Actor:
        # Get input
        input_data = await Actor.get_input() or {}
        keywords = input_data.get('keywords', [])
        api_key = input_data.get('openai_api_key')

        if not keywords:
            await Actor.set_status_message('No keywords provided')
            await Actor.push_data([{
                'error': 'Keywords required',
                'example': {'keywords': ['AI automation', 'Python workflows']}
            }])
            return

        results = []

        for keyword in keywords:
            try:
                # Analyze keyword
                analysis = await analyze_keyword(keyword, api_key)

                # Calculate scores
                scores = calculate_scores(analysis)

                # Create result
                result = {
                    'keyword': keyword,
                    'growth': scores['growth'],
                    'difficulty': scores['difficulty'],
                    'seo_score': scores['seo_score'],
                    'aeo_score': scores['aeo_score'],
                    'overall_score': scores['overall_score'],
                    'recommendation': scores['recommendation'],
                    'timestamp': analysis.get('timestamp')
                }

                results.append(result)

            except Exception as e:
                await Actor.log.error(f"Error processing {keyword}: {e}")
                results.append({
                    'keyword': keyword,
                    'error': str(e)
                })

        # Push results (monetization: Pay-per-Result)
        await Actor.push_data(results)

        # Set status
        await Actor.set_status_message(f'Analyzed {len(results)} keywords')


async def analyze_keyword(keyword: str, api_key: str = None) -> Dict[str, Any]:
    """
    Analyze keyword using AI (optional) or basic metrics.
    """
    # Basic analysis (can be enhanced with OpenAI API)
    analysis = {
        'keyword': keyword,
        'search_volume': estimate_search_volume(keyword),
        'competition': estimate_competition(keyword),
        'trend': estimate_trend(keyword),
        'timestamp': json.dumps({'timestamp': '2026-01-13'})
    }

    # If API key provided, use AI for deeper analysis
    if api_key:
        try:
            ai_analysis = await get_ai_analysis(keyword, api_key)
            analysis.update(ai_analysis)
        except Exception as e:
            Actor.log.warning(f"AI analysis failed: {e}")

    return analysis


def calculate_scores(analysis: Dict[str, Any]) -> Dict[str, Any]:
    """
    Calculate SEO/AEO scores from analysis.
    """
    growth = analysis.get('growth', 50)
    difficulty = max(analysis.get('difficulty', 5), 1)
    search_volume = analysis.get('search_volume', 1000)

    # SEO Score (0-100)
    seo_score = min(100, (search_volume / 10000) * 50 + (100 - difficulty * 10))

    # AEO Score (0-100) - based on question format, how-to potential
    aeo_score = calculate_aeo_score(analysis['keyword'])

    # Overall Score
    overall_score = (seo_score * 0.4 + aeo_score * 0.6)

    # Recommendation
    if overall_score > 70:
        recommendation = 'High Priority - Immediate Action'
    elif overall_score > 50:
        recommendation = 'Medium Priority - Consider'
    elif overall_score > 30:
        recommendation = 'Low Priority - Monitor'
    else:
        recommendation = 'Not Recommended'

    return {
        'growth': round(growth, 2),
        'difficulty': round(difficulty, 2),
        'seo_score': round(seo_score, 2),
        'aeo_score': round(aeo_score, 2),
        'overall_score': round(overall_score, 2),
        'recommendation': recommendation
    }


def calculate_aeo_score(keyword: str) -> float:
    """
    Calculate AEO score based on keyword characteristics.
    """
    score = 50  # Base score

    # Question format bonus
    if any(word in keyword.lower() for word in ['how', 'what', 'why', 'when', 'where']):
        score += 20

    # How-to bonus
    if 'how to' in keyword.lower():
        score += 15

    # Action-oriented bonus
    if any(word in keyword.lower() for word in ['create', 'build', 'make', 'generate', 'automate']):
        score += 15

    return min(100, score)


def estimate_search_volume(keyword: str) -> int:
    """
    Estimate search volume (simplified - use real API in production).
    """
    # Simplified estimation
    base_volume = 1000
    word_count = len(keyword.split())
    return int(base_volume / word_count)


def estimate_competition(keyword: str) -> float:
    """
    Estimate competition level (0-10).
    """
    # Simplified estimation
    common_words = ['ai', 'automation', 'python', 'workflow']
    has_common = any(word in keyword.lower() for word in common_words)
    return 3.0 if has_common else 5.0


def estimate_trend(keyword: str) -> str:
    """
    Estimate trend direction.
    """
    trending_keywords = ['ai', 'automation', 'workflow', 'python', 'agent']
    has_trending = any(word in keyword.lower() for word in trending_keywords)
    return 'Rising' if has_trending else 'Stable'


async def get_ai_analysis(keyword: str, api_key: str) -> Dict[str, Any]:
    """
    Get AI-powered analysis using OpenAI API.
    """
    # This would call OpenAI API for deeper analysis
    # Placeholder for now
    return {
        'ai_analysis': f'AI analysis for {keyword}',
        'insights': ['Insight 1', 'Insight 2']
    }


if __name__ == '__main__':
    import asyncio
    asyncio.run(main())
