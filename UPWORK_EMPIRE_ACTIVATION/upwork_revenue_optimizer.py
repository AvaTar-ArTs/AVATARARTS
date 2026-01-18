#!/usr/bin/env python3
"""
AVATARARTS Upwork Revenue Optimizer
===================================
Analyzes Upwork opportunities through your revenue lens:
- Maps jobs to your 758+ existing scripts
- Calculates ROI based on your hourly rate goals
- Identifies which jobs maximize your $162K-495K/month potential
- Auto-generates proposals using your proven capabilities

Integrates with:
- Your Python automation library (758+ scripts)
- Revenue tracking system
- API integrations (Gemini, OpenAI, etc.)
"""

import os
import sys
import json
import logging
from pathlib import Path
from dataclasses import dataclass, asdict
from typing import List, Dict, Optional
from collections import defaultdict
from datetime import datetime

import pandas as pd
from dotenv import load_dotenv

# Load your environment
env_dir = Path.home() / ".env.d"
for env_file in env_dir.glob("*.env"):
    load_dotenv(env_file)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@dataclass
class JobOpportunity:
    """Represents an Upwork job with revenue potential"""
    title: str
    payment_type: str
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None
    level: str = "Intermediate"
    proposals: str = "5 to 10"
    location: str = "Unknown"
    skills: List[str] = None
    full_description: str = ""
    link: str = ""
    
    # Revenue analysis
    estimated_hours: float = 0.0
    hourly_rate: float = 0.0
    revenue_potential: float = 0.0
    roi_score: float = 0.0  # 0-100
    match_score: float = 0.0  # 0-100
    reusable_assets: List[str] = None
    
    def __post_init__(self):
        if self.skills is None:
            self.skills = []
        if self.reusable_assets is None:
            self.reusable_assets = []


class UpworkRevenueOptimizer:
    """
    Analyzes Upwork opportunities through the AVATARARTS revenue framework
    """
    
    # Your proven asset categories
    ASSET_LIBRARY = {
        'ai_video': {
            'tools': ['Sora', 'Runway', 'CapCut', 'Kling', 'HeyGen', 'D-ID'],
            'scripts': ['video_generator.py', 'caption_generator.py', 'tiktok_automation.py'],
            'hourly_value': 75,  # Your rate for AI video work
        },
        'ai_image': {
            'tools': ['Midjourney', 'Stable Diffusion', 'DALL-E', 'ComfyUI', 'Nano Banana'],
            'scripts': ['image_generator.py', 'batch_image_processor.py'],
            'hourly_value': 65,
        },
        'python_automation': {
            'tools': ['Python', 'Selenium', 'Pandas', 'Beautiful Soup'],
            'scripts': ['web_scraper.py', 'data_processor.py', 'api_integrator.py'],
            'hourly_value': 85,
        },
        'workflow_automation': {
            'tools': ['n8n', 'Make.com', 'Zapier'],
            'scripts': ['workflow_builder.py', 'automation_framework.py'],
            'hourly_value': 70,
        },
        'content_ai': {
            'tools': ['NotebookLM', 'GPT-4', 'Claude', 'Gemini'],
            'scripts': ['content_generator.py', 'seo_optimizer.py'],
            'hourly_value': 60,
        },
    }
    
    # Revenue targets from your ecosystem
    REVENUE_TARGETS = {
        'immediate': 5000,  # $5K/month (Week 1-4)
        'short_term': 35000,  # $35K/month (Month 1-3)
        'long_term': 200000,  # $200K/month (Month 4-12)
    }
    
    # Effort estimation based on job type
    EFFORT_ESTIMATES = {
        'ai video creation': 4,  # hours
        'ai image generation': 2,
        'python script': 6,
        'web scraping': 8,
        'automation workflow': 10,
        'content creation': 3,
    }
    
    def __init__(self, target_monthly_revenue: int = 5000):
        """
        Initialize optimizer
        
        Args:
            target_monthly_revenue: Your monthly revenue goal
        """
        self.target_revenue = target_monthly_revenue
        self.jobs = []
        self.output_dir = Path(__file__).parent / "upwork_revenue_analysis"
        self.output_dir.mkdir(exist_ok=True)
        
    def load_jobs_from_csv(self, csv_path: Path) -> List[JobOpportunity]:
        """Load jobs from CSV export"""
        df = pd.read_csv(csv_path)
        jobs = []
        
        for _, row in df.iterrows():
            # Parse budget
            budget_str = str(row.get('Budget/Rate', 'N/A'))
            budget_min, budget_max = self._parse_budget(budget_str)
            
            job = JobOpportunity(
                title=row.get('Job Title', ''),
                payment_type=row.get('Payment Type', 'Unknown'),
                budget_min=budget_min,
                budget_max=budget_max,
                level=row.get('Level', 'Intermediate'),
                proposals=row.get('Proposals', '5 to 10'),
                location=row.get('Location', 'Unknown'),
                link=row.get('Link', ''),
            )
            jobs.append(job)
        
        self.jobs = jobs
        logger.info(f"Loaded {len(jobs)} jobs from {csv_path}")
        return jobs
    
    def _parse_budget(self, budget_str: str) -> tuple:
        """Parse budget string like '$15-$30' or '$100'"""
        try:
            if '-' in budget_str:
                parts = budget_str.replace('$', '').split('-')
                return float(parts[0]), float(parts[1])
            elif '$' in budget_str:
                amount = float(budget_str.replace('$', ''))
                return amount, amount
        except:
            pass
        return None, None
    
    def analyze_job_match(self, job: JobOpportunity) -> JobOpportunity:
        """
        Analyze how well a job matches your capabilities
        and calculate revenue potential
        """
        title_lower = job.title.lower()
        full_text = title_lower + ' ' + job.full_description.lower()
        
        # Identify matching asset categories
        matched_categories = []
        total_match_score = 0
        
        for category, data in self.ASSET_LIBRARY.items():
            # Check if job mentions any tools from this category
            tools_mentioned = sum(1 for tool in data['tools'] if tool.lower() in full_text)
            if tools_mentioned > 0:
                matched_categories.append(category)
                total_match_score += tools_mentioned * 10
                job.reusable_assets.extend([f"{category}: {tool}" for tool in data['tools'][:2]])
        
        job.match_score = min(total_match_score, 100)
        
        # Estimate effort and revenue
        effort_hours = self._estimate_effort(job, matched_categories)
        hourly_rate = self._calculate_hourly_rate(matched_categories)
        
        job.estimated_hours = effort_hours
        job.hourly_rate = hourly_rate
        
        # Calculate revenue potential
        if job.payment_type == 'Fixed-price' and job.budget_max:
            job.revenue_potential = job.budget_max
        else:
            job.revenue_potential = effort_hours * hourly_rate
        
        # Calculate ROI score (revenue / effort * match quality)
        if effort_hours > 0:
            roi_base = job.revenue_potential / effort_hours
            job.roi_score = min((roi_base / hourly_rate) * (job.match_score / 100) * 100, 100)
        
        return job
    
    def _estimate_effort(self, job: JobOpportunity, categories: List[str]) -> float:
        """Estimate hours needed based on job type and your capabilities"""
        title_lower = job.title.lower()
        
        # Find matching effort estimate
        for job_type, hours in self.EFFORT_ESTIMATES.items():
            if job_type in title_lower:
                # Reduce hours if you have reusable assets
                reduction = 0.3 * len(categories)  # 30% reduction per matching category
                return hours * (1 - min(reduction, 0.6))  # Max 60% reduction
        
        # Default estimate
        return 8.0 if job.payment_type == 'Fixed-price' else 10.0
    
    def _calculate_hourly_rate(self, categories: List[str]) -> float:
        """Calculate your hourly rate based on required skills"""
        if not categories:
            return 50.0  # Baseline rate
        
        rates = [self.ASSET_LIBRARY[cat]['hourly_value'] for cat in categories]
        return max(rates)  # Use highest rate category
    
    def generate_revenue_plan(self, top_n: int = 10) -> Dict:
        """
        Generate a revenue plan based on analyzed jobs
        
        Args:
            top_n: Number of top jobs to include
            
        Returns:
            Revenue plan dictionary
        """
        # Analyze all jobs
        for job in self.jobs:
            self.analyze_job_match(job)
        
        # Sort by ROI score
        sorted_jobs = sorted(self.jobs, key=lambda j: j.roi_score, reverse=True)
        top_jobs = sorted_jobs[:top_n]
        
        # Calculate totals
        total_revenue = sum(j.revenue_potential for j in top_jobs)
        total_hours = sum(j.estimated_hours for j in top_jobs)
        avg_hourly = total_revenue / total_hours if total_hours > 0 else 0
        
        plan = {
            'target_monthly_revenue': self.target_revenue,
            'top_opportunities': [asdict(j) for j in top_jobs],
            'summary': {
                'total_jobs_analyzed': len(self.jobs),
                'top_jobs_count': len(top_jobs),
                'total_revenue_potential': total_revenue,
                'total_effort_hours': total_hours,
                'average_hourly_rate': avg_hourly,
                'weeks_to_target': total_hours / 40 if total_hours > 0 else 0,
            }
        }
        
        return plan
    
    def generate_proposal_template(self, job: JobOpportunity) -> str:
        """
        Generate a proposal template based on your capabilities
        """
        # Analyze the job first
        job = self.analyze_job_match(job)
        
        proposal = f"""
Hi there,

I'm a Python automation specialist with 758+ production scripts and extensive experience in {', '.join(job.reusable_assets[:3])}.

**Why I'm a Perfect Fit:**

"""
        
        # Add relevant capabilities
        if 'ai_video' in ' '.join(job.reusable_assets).lower():
            proposal += """
✓ AI Video Generation Expert
  - Proficient with Sora, Runway, CapCut, Kling
  - Created 100+ automated video workflows
  - Experience with viral content optimization
"""
        
        if 'ai_image' in ' '.join(job.reusable_assets).lower():
            proposal += """
✓ AI Image Specialist
  - Expert in Midjourney, Stable Diffusion, ComfyUI
  - Developed batch processing systems
  - Photorealistic generation with consistency
"""
        
        if 'python' in job.title.lower():
            proposal += """
✓ Python Automation Engineer
  - 758+ production-ready scripts
  - Web scraping, API integration, data processing
  - Scalable, maintainable code
"""
        
        proposal += f"""

**My Approach:**

1. Review requirements and clarify scope ({job.estimated_hours:.1f} hours estimated)
2. Leverage existing automation framework for faster delivery
3. Deliver production-ready solution with documentation
4. Provide ongoing support and optimization

**Timeline:** {int(job.estimated_hours / 8)} days for initial delivery

I'm available to start immediately and can share relevant portfolio samples.

Looking forward to discussing your project!

Best regards,
Steven Chaplinski
Python Automation & AI Specialist
"""
        return proposal
    
    def save_analysis(self, plan: Dict):
        """Save revenue plan to files"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Save JSON
        json_path = self.output_dir / f"revenue_plan_{timestamp}.json"
        with open(json_path, 'w') as f:
            json.dump(plan, f, indent=2)
        
        # Save CSV
        if plan['top_opportunities']:
            df = pd.DataFrame(plan['top_opportunities'])
            csv_path = self.output_dir / f"top_opportunities_{timestamp}.csv"
            df.to_csv(csv_path, index=False)
        
        # Save summary report
        report_path = self.output_dir / f"revenue_report_{timestamp}.txt"
        with open(report_path, 'w') as f:
            f.write(self._generate_report(plan))
        
        logger.info(f"✅ Saved analysis to {self.output_dir}")
        return report_path
    
    def _generate_report(self, plan: Dict) -> str:
        """Generate text report"""
        summary = plan['summary']
        
        report = f"""
UPWORK REVENUE OPTIMIZATION REPORT
{'='*70}
Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

REVENUE TARGET: ${self.target_revenue:,.0f}/month

SUMMARY
-------
Total Jobs Analyzed: {summary['total_jobs_analyzed']}
Top Opportunities: {summary['top_jobs_count']}
Total Revenue Potential: ${summary['total_revenue_potential']:,.2f}
Total Effort Hours: {summary['total_effort_hours']:.1f}
Average Hourly Rate: ${summary['average_hourly_rate']:.2f}
Weeks to Complete: {summary['weeks_to_target']:.1f}

TOP OPPORTUNITIES
-----------------
"""
        
        for i, job in enumerate(plan['top_opportunities'][:5], 1):
            report += f"""
{i}. {job['title']}
   Revenue: ${job['revenue_potential']:.2f}
   Effort: {job['estimated_hours']:.1f} hours
   ROI Score: {job['roi_score']:.0f}/100
   Match Score: {job['match_score']:.0f}/100
   Rate: ${job['hourly_rate']:.2f}/hour
   Reusable Assets: {', '.join(job['reusable_assets'][:2])}
"""
        
        report += f"""

RECOMMENDATIONS
---------------
1. Focus on jobs with ROI score > 70
2. Prioritize opportunities matching your existing assets
3. Target ${summary['average_hourly_rate']:.0f}/hour minimum
4. Leverage your 758+ scripts for faster delivery

NEXT STEPS
----------
1. Review top opportunities above
2. Customize proposal templates
3. Submit within 24 hours of posting
4. Track win rate and adjust pricing

{'='*70}
"""
        return report


def main():
    """Example usage"""
    # Initialize optimizer with your monthly target
    optimizer = UpworkRevenueOptimizer(target_monthly_revenue=5000)
    
    # Load jobs from CSV (from your earlier scrape)
    csv_files = list(Path(__file__).parent.glob("upwork_data/upwork_jobs_*.csv"))
    if not csv_files:
        logger.error("No job CSV files found. Run upwork_complete_automation.py first.")
        return
    
    latest_csv = max(csv_files, key=lambda p: p.stat().st_mtime)
    logger.info(f"Loading jobs from {latest_csv}")
    
    optimizer.load_jobs_from_csv(latest_csv)
    
    # Generate revenue plan
    plan = optimizer.generate_revenue_plan(top_n=15)
    
    # Save results
    report_path = optimizer.save_analysis(plan)
    
    # Print report
    with open(report_path) as f:
        print(f.read())
    
    # Generate sample proposal for top job
    if optimizer.jobs:
        top_job = max(optimizer.jobs, key=lambda j: j.roi_score)
        print("\n" + "="*70)
        print("SAMPLE PROPOSAL (Top ROI Job)")
        print("="*70)
        print(optimizer.generate_proposal_template(top_job))


if __name__ == "__main__":
    main()
