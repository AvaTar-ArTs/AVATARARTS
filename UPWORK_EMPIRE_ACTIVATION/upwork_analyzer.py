#!/usr/bin/env python3
"""
AVATARARTS Upwork Job Listings Keyword Analyzer
================================================
Extracts skills, keywords, and patterns from job listings to optimize your profile.
Evolved version integrating with your 758+ script ecosystem and revenue targets.

Features:
- Keyword extraction and frequency analysis
- Technical skill identification
- Profile optimization recommendations
- Integration with your proven asset library
"""

import pandas as pd
from collections import Counter
import re
from pathlib import Path
from datetime import datetime

# Sample data for testing
SAMPLE_DATA = """Job Title,Payment Type,Budget/Rate,Level,Proposals,Location
Create AI TikTok Videos,Hourly,$15-$30,Intermediate,20 to 50,United States
Video Creator (AI or video editing),Hourly,$10-$20,Entry level,5 to 10,United States
ComfyUI Developer for AI Lingerie Images,Hourly,$10-$40,Intermediate,5 to 10,NLD
Wav File Extraction from Website,Fixed-price,$100,Intermediate,20 to 50,United Kingdom
AI Image Specialist + Expert Photoshop Editor,Fixed-price,$200,Intermediate,10 to 15,United Kingdom
AI Slideshow Creator (Nano Banana Pro),Hourly,$15-$30,Intermediate,15 to 20,Canada
AI Recordings and Explanation,Hourly,$19-$40,Intermediate,15 to 20,United States
Puzzle Creator for Logic and Visual Puzzles,Fixed-price,$30,Intermediate,5 to 10,USA
Voice Cloning for AI Avatar,Hourly,$10-$25,Intermediate,15 to 20,Netherlands
AI UGC Automation Specialist,Hourly,$5-$15,Intermediate,5 to 10,United States
Python Audio Processing + AI Automation Developer,Hourly,N/A,Intermediate,5 to 10,United States
AI Video Shot Generation Specialist,Hourly,$10-$30,Expert,5 to 10,Italy
ComfyUI Workflow Creation Specialist,Fixed-price,$60,Intermediate,5 to 10,Croatia
AI Avatar Creation Specialist,Hourly,$10-$23,Intermediate,Less than 5,United Kingdom
Automatic Workflow For Images and Videos,Fixed-price,$300,Intermediate,5 to 10,Spain"""


class UpworkJobAnalyzer:
    """Analyze Upwork job listings to extract valuable keywords and patterns"""
    
    # Common words to filter out
    STOP_WORDS = {
        'for', 'and', 'with', 'to', 'in', 'a', 'the', 'from', 'on', 'or',
        'of', 'using', 'create', 'need', 'looking', 'help', 'specialist',
        'developer', 'creator'
    }
    
    # High-value technical terms to track (expanded from your ecosystem)
    TECHNICAL_TOOLS = {
        # AI Video (your proven expertise)
        'sora', 'runway', 'kling', 'heygen', 'capcut', 'd-id', 'higgsfield',
        'veo', 'gen-3', 'luma', 'pika',
        
        # AI Image (your core competency)
        'midjourney', 'stable diffusion', 'dall-e', 'comfyui', 'nano banana',
        'leonardo', 'ideogram', 'flux',
        
        # Python & Automation (758+ scripts)
        'python', 'selenium', 'beautifulsoup', 'pandas', 'numpy',
        'opencv', 'pytorch', 'tensorflow',
        
        # Workflow Automation
        'n8n', 'make.com', 'zapier', 'activepieces',
        
        # Content & AI
        'notebooklm', 'gpt', 'claude', 'gemini', 'openai',
        
        # Design & Media
        'photoshop', 'after effects', 'premiere', 'blender', 'figma',
        
        # Other
        'api', 'automation', 'scraping', 'ai'
    }
    
    def __init__(self, csv_path=None):
        """Initialize with optional CSV path"""
        self.csv_path = csv_path
        self.df = None
        
    def load_data(self, csv_string=None):
        """Load data from CSV file or string"""
        if csv_string:
            from io import StringIO
            self.df = pd.read_csv(StringIO(csv_string))
        elif self.csv_path and Path(self.csv_path).exists():
            self.df = pd.read_csv(self.csv_path)
        else:
            raise ValueError("No valid data source provided")
            
    def extract_keywords(self, text_column='Job Title'):
        """Extract and count keywords from job titles"""
        if self.df is None:
            raise ValueError("No data loaded. Call load_data() first")
            
        words = []
        for title in self.df[text_column].dropna():
            # Clean and tokenize
            clean_title = re.sub(r'[^\w\s]', '', str(title)).lower()
            words.extend(clean_title.split())
        
        # Filter stop words
        keywords = [w for w in words if w not in self.STOP_WORDS and len(w) > 2]
        return Counter(keywords)
    
    def extract_technical_skills(self):
        """Extract mentions of specific technical tools and frameworks"""
        if self.df is None:
            raise ValueError("No data loaded")
            
        skills_found = Counter()
        
        for title in self.df['Job Title'].dropna():
            title_lower = title.lower()
            for tool in self.TECHNICAL_TOOLS:
                if tool in title_lower:
                    skills_found[tool] += 1
                    
        return skills_found
    
    def analyze_payment_patterns(self):
        """Analyze payment types and budget ranges"""
        if self.df is None:
            raise ValueError("No data loaded")
            
        payment_analysis = {
            'payment_types': self.df['Payment Type'].value_counts().to_dict(),
            'level_distribution': self.df['Level'].value_counts().to_dict()
        }
        
        # Extract hourly rates
        hourly_rates = []
        for rate in self.df[self.df['Payment Type'] == 'Hourly']['Budget/Rate'].dropna():
            # Extract numbers from strings like "$15-$30"
            numbers = re.findall(r'\d+', str(rate))
            if numbers:
                hourly_rates.extend([int(n) for n in numbers])
        
        if hourly_rates:
            payment_analysis['avg_hourly_rate'] = sum(hourly_rates) / len(hourly_rates)
            payment_analysis['hourly_range'] = (min(hourly_rates), max(hourly_rates))
            
        return payment_analysis
    
    def generate_profile_keywords(self, top_n=15):
        """Generate recommended keywords for Upwork profile"""
        keyword_counts = self.extract_keywords()
        tech_skills = self.extract_technical_skills()
        
        # Combine and prioritize
        recommendations = []
        
        # Add technical skills first (high priority)
        for skill, count in tech_skills.most_common(10):
            recommendations.append({
                'keyword': skill.title(),
                'frequency': count,
                'category': 'Technical Tool',
                'priority': 'HIGH' if count >= 3 else 'MEDIUM'
            })
        
        # Add general keywords
        for word, count in keyword_counts.most_common(top_n):
            if word not in [r['keyword'].lower() for r in recommendations]:
                recommendations.append({
                    'keyword': word.title(),
                    'frequency': count,
                    'category': 'General Skill',
                    'priority': 'HIGH' if count >= 5 else 'MEDIUM'
                })
        
        return recommendations[:top_n]
    
    def generate_ecosystem_integration(self) -> str:
        """Generate recommendations based on AVATARARTS ecosystem"""
        return """
AVATARARTS ECOSYSTEM INTEGRATION
================================

Your Proven Assets (758+ Scripts):
- AI Video Generation Suite (Sora, Runway, CapCut, Kling)
- AI Image Creation Tools (Midjourney, Stable Diffusion, ComfyUI)
- Python Automation Framework (Web scraping, APIs, Data processing)
- Workflow Automation (n8n, Make.com integration)
- Content Intelligence (NotebookLM, GPT-4, Claude, Gemini)

Revenue Targets from Your Ecosystem:
- Immediate (Week 1-4): $5K/month
- Short-term (Month 1-3): $35K/month
- Long-term (Month 4-12): $200K+/month

Competitive Advantages:
✓ 758+ production-ready scripts
✓ Proven automation frameworks
✓ Multiple AI platform integrations
✓ Scalable, tested solutions
✓ Real clients (Dr. Adu, Heavenly Hands)

Recommended Hourly Rates:
- AI Video Projects: $75-100/hour
- AI Image Work: $65-85/hour
- Python Automation: $85-120/hour
- Workflow Automation: $70-95/hour
- Content AI: $60-80/hour
"""
    
    def generate_report(self):
        """Generate comprehensive analysis report"""
        if self.df is None:
            raise ValueError("No data loaded")
            
        report = []
        report.append("=" * 70)
        report.append("UPWORK JOB LISTINGS ANALYSIS REPORT")
        report.append("=" * 70)
        report.append(f"\nTotal jobs analyzed: {len(self.df)}\n")
        
        # Top Keywords
        report.append("\n--- TOP KEYWORDS (General) ---")
        keywords = self.extract_keywords()
        for word, count in keywords.most_common(10):
            report.append(f"  {word.upper():<20} → found in {count} listings")
        
        # Technical Skills
        report.append("\n--- TECHNICAL TOOLS & FRAMEWORKS ---")
        tech_skills = self.extract_technical_skills()
        if tech_skills:
            for skill, count in tech_skills.most_common(10):
                report.append(f"  {skill.title():<20} → {count} mentions")
        else:
            report.append("  No specific technical tools detected")
        
        # Payment Analysis
        report.append("\n--- PAYMENT & BUDGET ANALYSIS ---")
        payment_info = self.analyze_payment_patterns()
        for payment_type, count in payment_info['payment_types'].items():
            report.append(f"  {payment_type}: {count} jobs")
        
        if 'avg_hourly_rate' in payment_info:
            report.append(f"  Average hourly rate: ${payment_info['avg_hourly_rate']:.2f}")
            report.append(f"  Hourly range: ${payment_info['hourly_range'][0]} - ${payment_info['hourly_range'][1]}")
        
        # Profile Recommendations
        report.append("\n--- RECOMMENDED PROFILE KEYWORDS ---")
        report.append("Add these to your Upwork profile for better matches:\n")
        recommendations = self.generate_profile_keywords()
        for i, rec in enumerate(recommendations, 1):
            priority_marker = "⭐" if rec.get('priority') == 'HIGH' else "  "
            report.append(f"{priority_marker} {i:2}. {rec['keyword']:<20} ({rec['category']}, freq: {rec['frequency']})")
        
        # Add ecosystem integration
        report.append("\n" + self.generate_ecosystem_integration())
        
        report.append("\n" + "=" * 70)
        report.append(f"Analysis completed: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append("=" * 70)
        
        return "\n".join(report)


def main():
    """Main execution"""
    print("Upwork Job Analyzer - Keyword & Skills Extraction\n")
    
    # Create analyzer
    analyzer = UpworkJobAnalyzer()
    
    # Load sample data
    print("Loading job listings data...")
    analyzer.load_data(csv_string=SAMPLE_DATA)
    
    # Generate and display report
    report = analyzer.generate_report()
    print(report)
    
    # Save to file
    output_path = Path(__file__).parent / "upwork_analysis_report.txt"
    with open(output_path, 'w') as f:
        f.write(report)
    
    print(f"\nReport saved to: {output_path}")
    
    # Export recommendations as CSV
    recommendations = analyzer.generate_profile_keywords(top_n=20)
    rec_df = pd.DataFrame(recommendations)
    csv_output = Path(__file__).parent / "profile_keywords.csv"
    rec_df.to_csv(csv_output, index=False)
    print(f"Keywords exported to: {csv_output}")


if __name__ == "__main__":
    main()
