#!/usr/bin/env python3
"""
UPWORK AUTOMATION SUITE
Integrates your AVATARARTS ecosystem with Upwork market intelligence
Automates job scanning, keyword matching, and proposal generation
"""

import json
import re
from collections import Counter
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple

import pandas as pd


class UpworkJobAnalyzer:
    """Analyzes Upwork jobs and matches them to your existing capabilities"""

    def __init__(self):
        self.trending_keywords = {
            'ai_automation': ['n8n', 'python automation', 'workflow', 'pipeline'],
            'character_consistency': ['soulid', 'character lock', 'consistent', 'same person'],
            'video_generation': ['higgsfield', 'cinematic', 'ai video', 'runway', 'kling'],
            'bulk_content': ['bulk generation', 'mass production', 'high volume', '100+ images'],
            'technical_stack': ['comfyui', 'stable diffusion', 'controlnet', 'ip-adapter']
        }

        self.your_capabilities = {
            'python_scripts': 758,
            'active_clients': 2,
            'seo_assets': 2300,
            'ai_products': 19,
            'saas_platform': 'Retention Suite'
        }

        self.rate_tiers = {
            'tier_1_system_architect': (45, 100),
            'tier_2_tool_specialist': (25, 50),
            'tier_3_prompt_engineer': (10, 20)
        }

    def analyze_job_fit(self, job_title: str, job_description: str) -> Dict:
        """Analyze how well a job matches your capabilities"""

        combined_text = f"{job_title} {job_description}".lower()

        # Calculate keyword match scores
        match_scores = {}
        for category, keywords in self.trending_keywords.items():
            matches = sum(1 for kw in keywords if kw in combined_text)
            match_scores[category] = matches

        # Determine tier based on keywords
        tier = self._determine_tier(combined_text)

        # Extract budget if mentioned
        budget = self._extract_budget(job_description)

        # Calculate overall fit score (0-100)
        total_matches = sum(match_scores.values())
        fit_score = min(100, total_matches * 15)

        return {
            'fit_score': fit_score,
            'tier': tier,
            'estimated_rate': self.rate_tiers.get(tier, (15, 30)),
            'keyword_matches': match_scores,
            'budget': budget,
            'priority': 'HIGH' if fit_score >= 70 else 'MEDIUM' if fit_score >= 40 else 'LOW'
        }

    def _determine_tier(self, text: str) -> str:
        """Determine pricing tier based on job complexity"""

        tier_1_keywords = ['system', 'architecture', 'enterprise', 'pipeline', 'infrastructure']
        tier_2_keywords = ['automation', 'workflow', 'integration', 'api']

        tier_1_count = sum(1 for kw in tier_1_keywords if kw in text)
        tier_2_count = sum(1 for kw in tier_2_keywords if kw in text)

        if tier_1_count >= 2:
            return 'tier_1_system_architect'
        elif tier_2_count >= 2:
            return 'tier_2_tool_specialist'
        else:
            return 'tier_3_prompt_engineer'

    def _extract_budget(self, description: str) -> str:
        """Extract budget information from job description"""

        # Look for common budget patterns
        budget_patterns = [
            r'\$(\d+)-\$(\d+)',
            r'\$(\d+)',
            r'budget.*?\$(\d+)',
            r'(\d+)/hr',
            r'fixed.*?\$(\d+)'
        ]

        for pattern in budget_patterns:
            match = re.search(pattern, description, re.IGNORECASE)
            if match:
                return match.group(0)

        return 'Not specified'

    def generate_proposal_outline(self, job_data: Dict, analysis: Dict) -> str:
        """Generate customized proposal outline based on job analysis"""

        job_title = job_data.get('title', 'the project')
        tier = analysis['tier']
        keywords = [cat for cat, score in analysis['keyword_matches'].items() if score > 0]

        # Select appropriate template based on tier
        if tier == 'tier_1_system_architect':
            template = self._system_architect_proposal(job_title, keywords)
        elif tier == 'tier_2_tool_specialist':
            template = self._tool_specialist_proposal(job_title, keywords)
        else:
            template = self._prompt_engineer_proposal(job_title, keywords)

        return template

    def _system_architect_proposal(self, job_title: str, keywords: List[str]) -> str:
        return f"""
PROPOSAL TEMPLATE: System Architecture (Tier 1)

Subject: Enterprise AI Pipeline for {job_title}

Hi [Client Name],

I've built this exact type of system twice - once for my SaaS product (Retention Suite, $50-150K/month potential) and once for an active client in [similar industry].

WHAT I'LL DELIVER:

1. Complete System Architecture
   - {'n8n workflow integration' if 'ai_automation' in keywords else 'Python-based automation pipeline'}
   - {'Character consistency system (SoulID/LoRA)' if 'character_consistency' in keywords else 'Quality control mechanisms'}
   - Google Workspace API integration (Sheets, Drive)
   - Automated error handling and logging

2. Technical Implementation
   - {'Higgsfield Cinema Studio for cinematic output' if 'video_generation' in keywords else 'Stable Diffusion/ComfyUI workflows'}
   - {'Bulk processing system (100+ assets/day)' if 'bulk_content' in keywords else 'Scalable processing architecture'}
   - API documentation and testing suite

3. Handoff & Training
   - Complete code documentation
   - Video walkthrough (15-20 min)
   - 30-day support for tweaks

TECHNICAL STACK:
- Python 3.11+ (758+ production scripts in my library)
- n8n or custom automation framework
- {', '.join(['ComfyUI', 'Stable Diffusion', 'ControlNet']) if 'technical_stack' in keywords else 'Industry-standard AI tools'}

TIMELINE:
- Days 1-2: Architecture and setup
- Days 3-4: Development and testing
- Day 5: Documentation and handoff

PROOF OF CAPABILITY:
- 2 active paying clients
- 2,300+ managed assets
- Top 1-5% SEO ranking systems

I can have a working prototype ready within 48 hours of project start.

Rate: $[45-100/hr] or fixed-price $[500-800] depending on scope.

Best,
[Your Name]

Portfolio: [Link to relevant demo]
"""

    def _tool_specialist_proposal(self, job_title: str, keywords: List[str]) -> str:
        return f"""
PROPOSAL TEMPLATE: Tool Specialist (Tier 2)

Subject: AI Automation Solution for {job_title}

Hi [Client Name],

I specialize in {'AI video automation' if 'video_generation' in keywords else 'AI content generation'} with proven workflows used by my 2 active clients.

SOLUTION APPROACH:

1. {'Video Pipeline' if 'video_generation' in keywords else 'Content Generation Pipeline'}
   - {'Higgsfield Cinema Studio for professional output' if 'video_generation' in keywords else 'Nano Banana Pro for character consistency'}
   - {'SoulID character locking across scenes' if 'character_consistency' in keywords else 'Quality validation system'}
   - Batch processing {'via n8n workflows' if 'ai_automation' in keywords else 'with Python scripts'}

2. Integration & Automation
   - Google Sheets input management
   - Automated Drive sync
   - Progress tracking and notifications

3. Quality Controls
   - {'Character drift detection' if 'character_consistency' in keywords else 'Output validation'}
   - Error logging and retry logic
   - Duplicate detection

DELIVERABLES:
- Turnkey automation system
- Documentation and training video
- 30 days support

TIMELINE: [3-5 days typical]

Rate: $[25-50/hr] or fixed-price $[300-500]

Portfolio: [Link to case study]
"""

    def _prompt_engineer_proposal(self, job_title: str, keywords: List[str]) -> str:
        return f"""
PROPOSAL TEMPLATE: Prompt Engineering (Tier 3)

Subject: Professional AI Content for {job_title}

Hi [Client Name],

I deliver {'cinematic-quality AI video' if 'video_generation' in keywords else 'high-quality AI-generated content'} with technical precision that most freelancers miss.

WHAT MAKES MY WORK DIFFERENT:

{'- Director-level camera control (dolly, crane, tracking)' if 'video_generation' in keywords else '- SEO-optimized content (Top 1-5% ranking capability)'}
{'- Character consistency via SoulID technology' if 'character_consistency' in keywords else '- Brand-consistent output'}
- Professional post-processing
- Fast turnaround

SAMPLE WORKFLOW:
1. {'Shot planning and storyboarding' if 'video_generation' in keywords else 'Content strategy and keyword research'}
2. {'Higgsfield generation with cinematic controls' if 'video_generation' in keywords else 'AI generation with quality controls'}
3. Post-processing and delivery

PORTFOLIO:
I have examples showing {'7 different cinematic scenarios' if 'video_generation' in keywords else '2,300+ managed assets'} - happy to share.

Rate: $[10-20/hr] or per-asset pricing

Best,
[Your Name]
"""


class KeywordTrendTracker:
    """Track trending keywords from Upwork job postings"""

    def __init__(self):
        self.keyword_history = []

    def analyze_batch(self, jobs: List[Dict]) -> Dict:
        """Analyze a batch of jobs for trending keywords"""

        all_text = ' '.join([
            f"{job.get('title', '')} {job.get('description', '')}"
            for job in jobs
        ]).lower()

        # Clean and tokenize
        clean_text = re.sub(r'[^\w\s]', '', all_text)
        words = clean_text.split()

        # Remove stop words
        stop_words = {
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
            'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during'
        }
        filtered_words = [w for w in words if w not in stop_words and len(w) > 2]

        # Count frequencies
        keyword_counts = Counter(filtered_words)

        # Extract bigrams for phrases
        bigrams = []
        for i in range(len(filtered_words) - 1):
            bigrams.append(f"{filtered_words[i]} {filtered_words[i+1]}")
        bigram_counts = Counter(bigrams)

        # Combine and sort
        top_keywords = keyword_counts.most_common(20)
        top_bigrams = bigram_counts.most_common(10)

        return {
            'top_keywords': top_keywords,
            'top_phrases': top_bigrams,
            'total_jobs': len(jobs),
            'analyzed_at': datetime.now().isoformat()
        }

    def generate_profile_keywords(self, trend_data: Dict) -> str:
        """Generate optimized keyword list for Upwork profile"""

        top_keywords = [kw for kw, count in trend_data['top_keywords'][:15]]
        top_phrases = [phrase for phrase, count in trend_data['top_phrases'][:5]]

        # Your core capabilities
        core_skills = [
            'AI Automation', 'Python', 'n8n', 'ComfyUI', 'Character Consistency',
            'Higgsfield Cinema Studio', 'Stable Diffusion', 'Video Generation',
            'Workflow Architecture', 'SEO Optimization'
        ]

        # Combine with trending keywords
        optimized_keywords = list(set(core_skills + top_keywords))

        return ', '.join(optimized_keywords[:25])


def main():
    """Example usage"""

    analyzer = UpworkJobAnalyzer()
    tracker = KeywordTrendTracker()

    # Example job data
    sample_job = {
        'title': 'AI Video Automation with n8n and Character Consistency',
        'description': '''
        Looking for expert to build automated AI video generation system.
        Must have experience with:
        - n8n workflow automation
        - Character consistency (SoulID or similar)
        - Higgsfield Cinema Studio
        - Python scripting
        - Google Sheets integration

        Budget: $300-500 fixed price
        Timeline: 5 days
        '''
    }

    # Analyze job fit
    analysis = analyzer.analyze_job_fit(
        sample_job['title'],
        sample_job['description']
    )

    print("=" * 70)
    print("JOB ANALYSIS RESULTS")
    print("=" * 70)
    print(f"\nJob Title: {sample_job['title']}")
    print(f"\nFit Score: {analysis['fit_score']}/100")
    print(f"Priority: {analysis['priority']}")
    print(f"Tier: {analysis['tier']}")
    print(f"Estimated Rate: ${analysis['estimated_rate'][0]}-${analysis['estimated_rate'][1]}/hr")
    print(f"Budget: {analysis['budget']}")

    print("\nKeyword Matches:")
    for category, count in analysis['keyword_matches'].items():
        if count > 0:
            print(f"  - {category}: {count} matches")

    # Generate proposal
    print("\n" + "=" * 70)
    print("GENERATED PROPOSAL OUTLINE")
    print("=" * 70)
    proposal = analyzer.generate_proposal_outline(sample_job, analysis)
    print(proposal)

    # Keyword trending analysis
    sample_jobs = [sample_job]  # In production, load from CSV
    trend_data = tracker.analyze_batch(sample_jobs)

    print("\n" + "=" * 70)
    print("TRENDING KEYWORDS FOR PROFILE OPTIMIZATION")
    print("=" * 70)
    profile_keywords = tracker.generate_profile_keywords(trend_data)
    print(f"\nOptimized Keywords:\n{profile_keywords}")

    print("\n" + "=" * 70)
    print("NEXT STEPS")
    print("=" * 70)
    print("""
1. Load your Upwork job CSV into this script
2. Run analysis on all jobs to find high-fit opportunities
3. Use generated proposals as templates
4. Update your Upwork profile with optimized keywords
5. Apply to Priority: HIGH jobs first
    """)


if __name__ == "__main__":
    main()
