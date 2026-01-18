#!/usr/bin/env python3
"""
Upwork Job Automation System
Automates job discovery, application tracking, and portfolio management
"""

import os
import json
import csv
import pandas as pd
from datetime import datetime
import requests
from pathlib import Path
import re
import time
from typing import List, Dict, Optional
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class UpworkAutomationSystem:
    def __init__(self, base_dir: str = "/Users/steven/AVATARARTS"):
        self.base_dir = Path(base_dir)
        self.data_dir = self.base_dir / "05_DATA" / "upwork_automation"
        self.data_dir.mkdir(parents=True, exist_ok=True)
        
        # Initialize data files
        self.jobs_file = self.data_dir / "tracked_jobs.csv"
        self.applications_file = self.data_dir / "applications.csv"
        self.portfolio_file = self.data_dir / "portfolio_items.csv"
        self.clients_file = self.data_dir / "clients.csv"
        
        # Create initial data if files don't exist
        self.initialize_data_files()
    
    def initialize_data_files(self):
        """Initialize CSV files with headers if they don't exist"""
        
        # Jobs tracking
        if not self.jobs_file.exists():
            jobs_headers = [
                "job_id", "title", "url", "budget", "duration", "posted_date", 
                "skills_required", "client_rating", "client_spent", "proposals", 
                "status", "date_added", "last_updated"
            ]
            pd.DataFrame(columns=jobs_headers).to_csv(self.jobs_file, index=False)
        
        # Applications tracking
        if not self.applications_file.exists():
            applications_headers = [
                "application_id", "job_id", "job_title", "application_date", 
                "response_received", "interview_scheduled", "job_awarded", 
                "notes", "follow_up_date"
            ]
            pd.DataFrame(columns=applications_headers).to_csv(self.applications_file, index=False)
        
        # Portfolio items
        if not self.portfolio_file.exists():
            portfolio_headers = [
                "item_id", "title", "description", "skills_demonstrated", 
                "project_type", "duration", "outcome", "rating", "date_added"
            ]
            pd.DataFrame(columns=portfolio_headers).to_csv(self.portfolio_file, index=False)
        
        # Clients
        if not self.clients_file.exists():
            clients_headers = [
                "client_id", "name", "company", "location", "total_spent", 
                "jobs_posted", "hire_rate", "last_active", "relationship_status"
            ]
            pd.DataFrame(columns=clients_headers).to_csv(self.clients_file, index=False)
    
    def load_jobs_data(self) -> pd.DataFrame:
        """Load jobs data from CSV"""
        return pd.read_csv(self.jobs_file)
    
    def load_applications_data(self) -> pd.DataFrame:
        """Load applications data from CSV"""
        return pd.read_csv(self.applications_file)
    
    def load_portfolio_data(self) -> pd.DataFrame:
        """Load portfolio data from CSV"""
        return pd.read_csv(self.portfolio_file)
    
    def load_clients_data(self) -> pd.DataFrame:
        """Load clients data from CSV"""
        return pd.read_csv(self.clients_file)
    
    def save_jobs_data(self, df: pd.DataFrame):
        """Save jobs data to CSV"""
        df.to_csv(self.jobs_file, index=False)
    
    def save_applications_data(self, df: pd.DataFrame):
        """Save applications data to CSV"""
        df.to_csv(self.applications_file, index=False)
    
    def save_portfolio_data(self, df: pd.DataFrame):
        """Save portfolio data to CSV"""
        df.to_csv(self.portfolio_file, index=False)
    
    def save_clients_data(self, df: pd.DataFrame):
        """Save clients data to CSV"""
        df.to_csv(self.clients_file, index=False)
    
    def add_job(self, job_data: Dict):
        """Add a new job to tracking"""
        df = self.load_jobs_data()
        
        # Check if job already exists
        if job_data['job_id'] in df['job_id'].values:
            logger.info(f"Job {job_data['job_id']} already exists in tracking")
            return
        
        # Add new job
        new_job = pd.DataFrame([job_data])
        df = pd.concat([df, new_job], ignore_index=True)
        self.save_jobs_data(df)
        logger.info(f"Added job {job_data['job_id']} to tracking")
    
    def add_application(self, application_data: Dict):
        """Add a new application to tracking"""
        df = self.load_applications_data()
        
        # Generate application ID if not provided
        if 'application_id' not in application_data:
            application_data['application_id'] = f"APP_{int(time.time())}_{application_data['job_id']}"
        
        new_application = pd.DataFrame([application_data])
        df = pd.concat([df, new_application], ignore_index=True)
        self.save_applications_data(df)
        logger.info(f"Added application {application_data['application_id']} for job {application_data['job_id']}")
    
    def add_portfolio_item(self, item_data: Dict):
        """Add a new portfolio item"""
        df = self.load_portfolio_data()
        
        # Generate item ID if not provided
        if 'item_id' not in item_data:
            item_data['item_id'] = f"PORT_{int(time.time())}"
        
        new_item = pd.DataFrame([item_data])
        df = pd.concat([df, new_item], ignore_index=True)
        self.save_portfolio_data(df)
        logger.info(f"Added portfolio item {item_data['item_id']}")
    
    def add_client(self, client_data: Dict):
        """Add a new client"""
        df = self.load_clients_data()
        
        # Generate client ID if not provided
        if 'client_id' not in client_data:
            client_data['client_id'] = f"CLIENT_{int(time.time())}"
        
        new_client = pd.DataFrame([client_data])
        df = pd.concat([df, new_client], ignore_index=True)
        self.save_clients_data(df)
        logger.info(f"Added client {client_data['client_id']}")
    
    def update_job_status(self, job_id: str, status: str):
        """Update job status"""
        df = self.load_jobs_data()
        if job_id in df['job_id'].values:
            df.loc[df['job_id'] == job_id, 'status'] = status
            df.loc[df['job_id'] == job_id, 'last_updated'] = datetime.now().isoformat()
            self.save_jobs_data(df)
            logger.info(f"Updated job {job_id} status to {status}")
    
    def update_application_status(self, application_id: str, **kwargs):
        """Update application status with provided fields"""
        df = self.load_applications_data()
        if application_id in df['application_id'].values:
            for key, value in kwargs.items():
                if key in df.columns:
                    df.loc[df['application_id'] == application_id, key] = value
            self.save_applications_data(df)
            logger.info(f"Updated application {application_id} with {kwargs}")
    
    def get_high_value_jobs(self, min_budget: float = 1000.0) -> pd.DataFrame:
        """Get jobs with budget above threshold"""
        df = self.load_jobs_data()
        
        # Try to extract numeric budget from budget field
        def extract_budget(budget_str):
            if pd.isna(budget_str):
                return 0.0
            # Look for numbers in the budget string
            numbers = re.findall(r'\d+(?:,\d{3})*(?:\.\d{2})?', str(budget_str))
            if numbers:
                # Return the highest number found (assuming hourly rate or fixed budget)
                return float(numbers[0].replace(',', ''))
            return 0.0
        
        df['numeric_budget'] = df['budget'].apply(extract_budget)
        high_value_df = df[df['numeric_budget'] >= min_budget].copy()
        high_value_df = high_value_df.sort_values('numeric_budget', ascending=False)
        
        return high_value_df
    
    def get_jobs_by_skill(self, skill: str) -> pd.DataFrame:
        """Get jobs that require a specific skill"""
        df = self.load_jobs_data()
        # Look for skill in skills_required column (comma-separated)
        mask = df['skills_required'].str.contains(skill, case=False, na=False)
        return df[mask]
    
    def generate_weekly_report(self) -> Dict:
        """Generate weekly performance report"""
        jobs_df = self.load_jobs_data()
        apps_df = self.load_applications_data()
        
        report = {
            'date_generated': datetime.now().isoformat(),
            'total_jobs_tracked': len(jobs_df),
            'total_applications': len(apps_df),
            'applications_per_day': len(apps_df) / 7 if len(apps_df) > 0 else 0,
            'jobs_by_status': jobs_df['status'].value_counts().to_dict() if 'status' in jobs_df.columns else {},
            'recent_applications': len(apps_df[apps_df['application_date'] >= (datetime.now().date() - pd.Timedelta(days=7))]),
            'response_rate': (apps_df['response_received'].sum() / len(apps_df)) * 100 if len(apps_df) > 0 else 0,
            'interview_rate': (apps_df['interview_scheduled'].sum() / len(apps_df)) * 100 if len(apps_df) > 0 else 0,
            'award_rate': (apps_df['job_awarded'].sum() / len(apps_df)) * 100 if len(apps_df) > 0 else 0
        }
        
        return report
    
    def export_data(self, export_dir: Optional[str] = None) -> Dict[str, str]:
        """Export all data to CSV files"""
        if export_dir is None:
            export_dir = self.data_dir / "exports" / datetime.now().strftime("%Y%m%d_%H%M%S")
        else:
            export_dir = Path(export_dir)
        
        export_dir.mkdir(parents=True, exist_ok=True)
        
        export_paths = {
            'jobs': str(export_dir / "jobs.csv"),
            'applications': str(export_dir / "applications.csv"),
            'portfolio': str(export_dir / "portfolio.csv"),
            'clients': str(export_dir / "clients.csv")
        }
        
        # Export each dataframe
        self.load_jobs_data().to_csv(export_paths['jobs'], index=False)
        self.load_applications_data().to_csv(export_paths['applications'], index=False)
        self.load_portfolio_data().to_csv(export_paths['portfolio'], index=False)
        self.load_clients_data().to_csv(export_paths['clients'], index=False)
        
        logger.info(f"Data exported to {export_dir}")
        return export_paths

def main():
    """Main function to demonstrate the automation system"""
    system = UpworkAutomationSystem()
    
    # Example: Add some sample jobs based on your AVATARARTS expertise
    sample_jobs = [
        {
            "job_id": "job_001",
            "title": "AI Video Generation Specialist for 45-Second Clip",
            "url": "https://www.upwork.com/jobs/~001",
            "budget": "$100",
            "duration": "Less than 1 week",
            "posted_date": datetime.now().date().isoformat(),
            "skills_required": "AI-Generated Video, CapCut, 2D Animation, Video Editing, Graphic Design",
            "client_rating": "5.0",
            "client_spent": "$100K+",
            "proposals": "15-20",
            "status": "new",
            "date_added": datetime.now().isoformat(),
            "last_updated": datetime.now().isoformat()
        },
        {
            "job_id": "job_002", 
            "title": "Generative AI Videos & Pictures for Marketing",
            "url": "https://www.upwork.com/jobs/~002",
            "budget": "$20-$40/hr",
            "duration": "3-6 months",
            "posted_date": datetime.now().date().isoformat(),
            "skills_required": "Machine Learning, Artificial Intelligence, Sora, DALL-E, Midjourney AI",
            "client_rating": "5.0", 
            "client_spent": "$30K+",
            "proposals": "20-50",
            "status": "new",
            "date_added": datetime.now().isoformat(),
            "last_updated": datetime.now().isoformat()
        },
        {
            "job_id": "job_003",
            "title": "AI Video Editor | Runway | Veo3 | Sora 2 | Ads Video",
            "url": "https://www.upwork.com/jobs/~003", 
            "budget": "$15-$30/hr",
            "duration": "1-3 months",
            "posted_date": datetime.now().date().isoformat(),
            "skills_required": "Video Editing, Videography, Video Production, Adobe After Effects, Motion Graphics",
            "client_rating": "4.9",
            "client_spent": "$90K+",
            "proposals": "5-10", 
            "status": "new",
            "date_added": datetime.now().isoformat(),
            "last_updated": datetime.now().isoformat()
        }
    ]
    
    # Add sample jobs
    for job in sample_jobs:
        system.add_job(job)
    
    # Example: Add sample applications
    sample_applications = [
        {
            "job_id": "job_001",
            "job_title": "AI Video Generation Specialist for 45-Second Clip",
            "application_date": datetime.now().date().isoformat(),
            "response_received": False,
            "interview_scheduled": False,
            "job_awarded": False,
            "notes": "Applied with portfolio of 100+ AI-generated videos",
            "follow_up_date": (datetime.now().date() + pd.Timedelta(days=3)).isoformat()
        },
        {
            "job_id": "job_002",
            "job_title": "Generative AI Videos & Pictures for Marketing", 
            "application_date": datetime.now().date().isoformat(),
            "response_received": False,
            "interview_scheduled": False,
            "job_awarded": False,
            "notes": "Referenced AVATARARTS automation expertise",
            "follow_up_date": (datetime.now().date() + pd.Timedelta(days=2)).isoformat()
        }
    ]
    
    # Add sample applications
    for app in sample_applications:
        system.add_application(app)
    
    # Example: Add sample portfolio items
    sample_portfolio = [
        {
            "title": "Trashcats Spotify Project",
            "description": "100+ AI-generated songs and videos published on Spotify",
            "skills_demonstrated": "AI Video Generation, Music Production, Content Creation",
            "project_type": "Creative AI",
            "duration": "6 months",
            "outcome": "Successful release with 100+ tracks",
            "rating": "5.0"
        },
        {
            "title": "AVATARARTS Automation System",
            "description": "12,382 Python scripts for automation and optimization",
            "skills_demonstrated": "Python, Automation, Scripting, Optimization",
            "project_type": "Software Development",
            "duration": "2 years",
            "outcome": "Efficient workflow automation",
            "rating": "5.0"
        }
    ]
    
    # Add sample portfolio items
    for item in sample_portfolio:
        system.add_portfolio_item(item)
    
    # Generate and print weekly report
    report = system.generate_weekly_report()
    print("Weekly Report:")
    for key, value in report.items():
        print(f"  {key}: {value}")
    
    # Export data
    export_paths = system.export_data()
    print(f"\nData exported to:")
    for name, path in export_paths.items():
        print(f"  {name}: {path}")
    
    print(f"\nUpwork Automation System initialized successfully!")
    print(f"  - Jobs tracked: {len(system.load_jobs_data())}")
    print(f"  - Applications: {len(system.load_applications_data())}")
    print(f"  - Portfolio items: {len(system.load_portfolio_data())}")
    print(f"  - Data stored in: {system.data_dir}")

if __name__ == "__main__":
    main()