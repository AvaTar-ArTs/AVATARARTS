#!/usr/bin/env python3
"""
AVATARARTS Project Reorganization Tool
======================================
Systematically reorganizes the project structure to eliminate clutter,
consolidate duplicates, and create a clear, scalable organization.
"""

import os
import shutil
import json
from pathlib import Path
from collections import defaultdict
import argparse
from datetime import datetime
import subprocess


class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'


class ProjectReorganizer:
    def __init__(self, root_dir=None, dry_run=True):
        self.root = Path(root_dir) if root_dir else Path.cwd()
        self.dry_run = dry_run
        self.moves = []
        self.errors = []
        self.stats = {
            'directories_created': 0,
            'files_moved': 0,
            'directories_moved': 0,
            'duplicates_removed': 0,
            'space_saved': 0
        }
        
    def log(self, message, color=None):
        """Log a message"""
        prefix = "[DRY RUN] " if self.dry_run else ""
        if color:
            print(f"{color}{prefix}{message}{Colors.ENDC}")
        else:
            print(f"{prefix}{message}")
    
    def safe_move(self, source, dest, description=""):
        """Safely move a file or directory"""
        source_path = self.root / source
        dest_path = self.root / dest
        
        if not source_path.exists():
            self.log(f"⚠️  Source not found: {source}", Colors.YELLOW)
            return False
        
        try:
            if self.dry_run:
                self.log(f"Would move: {source} → {dest}", Colors.CYAN)
                if description:
                    self.log(f"  └─ {description}", Colors.CYAN)
                self.moves.append((str(source), str(dest), description))
            else:
                # Create destination directory if needed
                dest_path.parent.mkdir(parents=True, exist_ok=True)
                
                # Handle existing destination
                if dest_path.exists():
                    if dest_path.is_dir() and source_path.is_dir():
                        # Merge directories
                        self.log(f"Merging: {source} → {dest}", Colors.BLUE)
                        for item in source_path.iterdir():
                            item_dest = dest_path / item.name
                            if item_dest.exists():
                                if item.is_file():
                                    # Skip if same size
                                    if item.stat().st_size == item_dest.stat().st_size:
                                        continue
                            shutil.move(str(item), str(item_dest))
                        source_path.rmdir()
                    else:
                        self.log(f"⚠️  Destination exists, skipping: {dest}", Colors.YELLOW)
                        return False
                else:
                    shutil.move(str(source_path), str(dest_path))
                    self.log(f"✅ Moved: {source} → {dest}", Colors.GREEN)
                
                if source_path.is_file():
                    self.stats['files_moved'] += 1
                else:
                    self.stats['directories_moved'] += 1
                
            return True
        except Exception as e:
            self.errors.append((str(source), str(dest), str(e)))
            self.log(f"❌ Error moving {source}: {e}", Colors.RED)
            return False
    
    def create_structure(self):
        """Create the new directory structure"""
        structure = [
            "00_ACTIVE/BUSINESS",
            "00_ACTIVE/DEVELOPMENT",
            "00_ACTIVE/CLIENT_PROJECTS",
            "00_ACTIVE/CONTENT",
            "01_TOOLS/scripts",
            "01_TOOLS/data",
            "01_TOOLS/dashboards",
            "02_DOCUMENTATION/guides",
            "02_DOCUMENTATION/research",
            "02_DOCUMENTATION/analysis",
            "02_DOCUMENTATION/business-plans",
            "03_ARCHIVES/old-projects",
            "03_ARCHIVES/backups",
            "04_WEBSITES/ai-sites/active",
            "04_WEBSITES/ai-sites/templates",
            "04_WEBSITES/ai-sites/archived",
            "04_WEBSITES/ai-sites/media",
            "05_DATA/databases",
            "05_DATA/exports",
            "06_SEO_MARKETING",
            "07_MISC"
        ]
        
        self.log(f"\n{Colors.HEADER}{'='*80}{Colors.ENDC}")
        self.log(f"{Colors.BOLD}Creating New Directory Structure{Colors.ENDC}")
        self.log(f"{Colors.HEADER}{'='*80}{Colors.ENDC}\n")
        
        for dir_path in structure:
            full_path = self.root / dir_path
            if self.dry_run:
                if not full_path.exists():
                    self.log(f"Would create: {dir_path}", Colors.CYAN)
                    self.stats['directories_created'] += 1
            else:
                full_path.mkdir(parents=True, exist_ok=True)
                if not full_path.exists():
                    self.log(f"✅ Created: {dir_path}", Colors.GREEN)
                    self.stats['directories_created'] += 1
    
    def move_analysis_scripts(self):
        """Move all analysis and organization scripts to 01_TOOLS/scripts"""
        self.log(f"\n{Colors.HEADER}{'='*80}{Colors.ENDC}")
        self.log(f"{Colors.BOLD}Moving Analysis Scripts{Colors.ENDC}")
        self.log(f"{Colors.HEADER}{'='*80}{Colors.ENDC}\n")
        
        script_patterns = [
            "analyze_*.py",
            "create_*.py",
            "dedupe_*.py",
            "generate_*.py",
            "deepdive_*.py",
            "safe_dedupe_script.py",
            "unlimited_depth_search.py",
            "merge_diff_dedupe.py",
            "merge_and_combine.py",
            "list_all_*.py",
            "remove_duplicates_*.py",
            "execute_merge_*.py"
        ]
        
        scripts_moved = 0
        for pattern in script_patterns:
            for script in self.root.glob(pattern):
                if script.is_file() and script.name != "reorganize_project.py":
                    dest = f"01_TOOLS/scripts/{script.name}"
                    if self.safe_move(script, dest, "Analysis script"):
                        scripts_moved += 1
        
        self.log(f"\n📊 Moved {scripts_moved} scripts\n", Colors.CYAN)
    
    def move_data_files(self):
        """Move CSV, JSON data files to 01_TOOLS/data"""
        self.log(f"\n{Colors.HEADER}{'='*80}{Colors.ENDC}")
        self.log(f"{Colors.BOLD}Moving Data Files{Colors.ENDC}")
        self.log(f"{Colors.HEADER}{'='*80}{Colors.ENDC}\n")
        
        data_patterns = ["*.csv", "*.json"]
        data_moved = 0
        
        for pattern in data_patterns:
            for data_file in self.root.glob(pattern):
                if data_file.is_file():
                    # Skip if already in a subdirectory
                    if len(data_file.parts) == 1:
                        dest = f"01_TOOLS/data/{data_file.name}"
                        if self.safe_move(data_file, dest, "Data file"):
                            data_moved += 1
        
        self.log(f"\n📊 Moved {data_moved} data files\n", Colors.CYAN)
    
    def move_dashboards(self):
        """Move dashboard scripts to 01_TOOLS/dashboards"""
        self.log(f"\n{Colors.HEADER}{'='*80}{Colors.ENDC}")
        self.log(f"{Colors.BOLD}Moving Dashboards{Colors.ENDC}")
        self.log(f"{Colors.HEADER}{'='*80}{Colors.ENDC}\n")
        
        dashboard_files = [
            "master_revenue_dashboard.py"
        ]
        
        for dashboard in dashboard_files:
            dashboard_path = self.root / dashboard
            if dashboard_path.exists():
                dest = f"01_TOOLS/dashboards/{dashboard}"
                self.safe_move(dashboard, dest, "Dashboard script")
    
    def move_documentation(self):
        """Move documentation files to 02_DOCUMENTATION"""
        self.log(f"\n{Colors.HEADER}{'='*80}{Colors.ENDC}")
        self.log(f"{Colors.BOLD}Moving Documentation{Colors.ENDC}")
        self.log(f"{Colors.HEADER}{'='*80}{Colors.ENDC}\n")
        
        doc_patterns = ["*.md", "*.txt"]
        doc_moved = 0
        
        for pattern in doc_patterns:
            for doc_file in self.root.glob(pattern):
                if doc_file.is_file():
                    # Skip if already in a subdirectory
                    if len(doc_file.parts) == 1:
                        # Categorize documentation
                        name_lower = doc_file.name.lower()
                        if any(x in name_lower for x in ['guide', 'howto', 'tutorial']):
                            dest = f"02_DOCUMENTATION/guides/{doc_file.name}"
                        elif any(x in name_lower for x in ['analysis', 'report', 'summary']):
                            dest = f"02_DOCUMENTATION/analysis/{doc_file.name}"
                        elif any(x in name_lower for x in ['business', 'plan', 'strategy']):
                            dest = f"02_DOCUMENTATION/business-plans/{doc_file.name}"
                        else:
                            dest = f"02_DOCUMENTATION/{doc_file.name}"
                        
                        if self.safe_move(doc_file, dest, "Documentation"):
                            doc_moved += 1
        
        # Move documentation directories
        doc_dirs = ["DOCUMENTATION", "Master_Documentation_Index"]
        for doc_dir in doc_dirs:
            doc_path = self.root / doc_dir
            if doc_path.exists() and doc_path.is_dir():
                # Move contents
                for item in doc_path.iterdir():
                    dest = f"02_DOCUMENTATION/{item.name}"
                    self.safe_move(f"{doc_dir}/{item.name}", dest, f"From {doc_dir}")
        
        self.log(f"\n📊 Moved {doc_moved} documentation files\n", Colors.CYAN)
    
    def move_business_systems(self):
        """Move business systems to 00_ACTIVE/BUSINESS"""
        self.log(f"\n{Colors.HEADER}{'='*80}{Colors.ENDC}")
        self.log(f"{Colors.BOLD}Moving Business Systems{Colors.ENDC}")
        self.log(f"{Colors.HEADER}{'='*80}{Colors.ENDC}\n")
        
        # Move BUSINESS directory
        if (self.root / "BUSINESS").exists():
            for item in (self.root / "BUSINESS").iterdir():
                dest = f"00_ACTIVE/BUSINESS/{item.name}"
                self.safe_move(f"BUSINESS/{item.name}", dest, "Business system")
        
        # Move heavenlyHands
        if (self.root / "heavenlyHands").exists():
            dest = "00_ACTIVE/BUSINESS/heavenlyHands"
            self.safe_move("heavenlyHands", dest, "Heavenly Hands business")
        
        # Move BUSINESS_PROJECTS
        if (self.root / "BUSINESS_PROJECTS").exists():
            for item in (self.root / "BUSINESS_PROJECTS").iterdir():
                dest = f"00_ACTIVE/BUSINESS/projects/{item.name}"
                self.safe_move(f"BUSINESS_PROJECTS/{item.name}", dest, "Business project")
    
    def move_development(self):
        """Move development projects to 00_ACTIVE/DEVELOPMENT"""
        self.log(f"\n{Colors.HEADER}{'='*80}{Colors.ENDC}")
        self.log(f"{Colors.BOLD}Moving Development Projects{Colors.ENDC}")
        self.log(f"{Colors.HEADER}{'='*80}{Colors.ENDC}\n")
        
        if (self.root / "DEVELOPMENT").exists():
            for item in (self.root / "DEVELOPMENT").iterdir():
                dest = f"00_ACTIVE/DEVELOPMENT/{item.name}"
                self.safe_move(f"DEVELOPMENT/{item.name}", dest, "Development project")
    
    def move_client_projects(self):
        """Move client projects to 00_ACTIVE/CLIENT_PROJECTS"""
        self.log(f"\n{Colors.HEADER}{'='*80}{Colors.ENDC}")
        self.log(f"{Colors.BOLD}Moving Client Projects{Colors.ENDC}")
        self.log(f"{Colors.HEADER}{'='*80}{Colors.ENDC}\n")
        
        if (self.root / "CLIENT_PROJECTS").exists():
            for item in (self.root / "CLIENT_PROJECTS").iterdir():
                dest = f"00_ACTIVE/CLIENT_PROJECTS/{item.name}"
                self.safe_move(f"CLIENT_PROJECTS/{item.name}", dest, "Client project")
    
    def move_content_assets(self):
        """Move content assets to 00_ACTIVE/CONTENT"""
        self.log(f"\n{Colors.HEADER}{'='*80}{Colors.ENDC}")
        self.log(f"{Colors.BOLD}Moving Content Assets{Colors.ENDC}")
        self.log(f"{Colors.HEADER}{'='*80}{Colors.ENDC}\n")
        
        if (self.root / "CONTENT_ASSETS").exists():
            for item in (self.root / "CONTENT_ASSETS").iterdir():
                # Skip ai-sites duplicate (will be handled separately)
                if item.name != "ai-sites":
                    dest = f"00_ACTIVE/CONTENT/{item.name}"
                    self.safe_move(f"CONTENT_ASSETS/{item.name}", dest, "Content asset")
    
    def move_websites(self):
        """Move website projects to 04_WEBSITES"""
        self.log(f"\n{Colors.HEADER}{'='*80}{Colors.ENDC}")
        self.log(f"{Colors.BOLD}Moving Website Projects{Colors.ENDC}")
        self.log(f"{Colors.HEADER}{'='*80}{Colors.ENDC}\n")
        
        # Move ai-sites (consolidate from root and CONTENT_ASSETS)
        if (self.root / "ai-sites").exists():
            # Move large media first
            disco_path = self.root / "ai-sites" / "disco"
            if disco_path.exists():
                dest = "04_WEBSITES/ai-sites/media/disco"
                self.safe_move("ai-sites/disco", dest, "Large media files")
            
            # Move other ai-sites content
            for item in (self.root / "ai-sites").iterdir():
                if item.name != "disco":
                    # Categorize
                    name_lower = item.name.lower()
                    if any(x in name_lower for x in ['template', 'example', 'demo']):
                        dest = f"04_WEBSITES/ai-sites/templates/{item.name}"
                    elif any(x in name_lower for x in ['old', 'archive', 'backup', 'copy']):
                        dest = f"04_WEBSITES/ai-sites/archived/{item.name}"
                    else:
                        dest = f"04_WEBSITES/ai-sites/active/{item.name}"
                    
                    self.safe_move(f"ai-sites/{item.name}", dest, "Website project")
        
        # Move GitHub pages
        if (self.root / "AvaTar-ArTs.github.io").exists():
            dest = "04_WEBSITES/AvaTar-ArTs.github.io"
            self.safe_move("AvaTar-ArTs.github.io", dest, "GitHub Pages site")
    
    def move_archives(self):
        """Move archives to 03_ARCHIVES"""
        self.log(f"\n{Colors.HEADER}{'='*80}{Colors.ENDC}")
        self.log(f"{Colors.BOLD}Moving Archives{Colors.ENDC}")
        self.log(f"{Colors.HEADER}{'='*80}{Colors.ENDC}\n")
        
        if (self.root / "ARCHIVES_BACKUPS").exists():
            for item in (self.root / "ARCHIVES_BACKUPS").iterdir():
                if item.name == "2025_databases_archived":
                    dest = f"03_ARCHIVES/backups/{item.name}"
                else:
                    dest = f"03_ARCHIVES/{item.name}"
                self.safe_move(f"ARCHIVES_BACKUPS/{item.name}", dest, "Archive")
    
    def move_data_analytics(self):
        """Move data analytics to 05_DATA"""
        self.log(f"\n{Colors.HEADER}{'='*80}{Colors.ENDC}")
        self.log(f"{Colors.BOLD}Moving Data Analytics{Colors.ENDC}")
        self.log(f"{Colors.HEADER}{'='*80}{Colors.ENDC}\n")
        
        if (self.root / "DATA_ANALYTICS").exists():
            for item in (self.root / "DATA_ANALYTICS").iterdir():
                if item.name == "data":
                    # Move CSV files to exports
                    csv_dir = item / "csv"
                    if csv_dir.exists():
                        for csv_file in csv_dir.rglob("*.csv"):
                            rel_path = csv_file.relative_to(self.root / "DATA_ANALYTICS")
                            dest = f"05_DATA/exports/{rel_path}"
                            self.safe_move(str(rel_path), dest, "Data export")
                else:
                    dest = f"05_DATA/{item.name}"
                    self.safe_move(f"DATA_ANALYTICS/{item.name}", dest, "Data analytics")
    
    def move_seo_marketing(self):
        """Move SEO marketing to 06_SEO_MARKETING"""
        self.log(f"\n{Colors.HEADER}{'='*80}{Colors.ENDC}")
        self.log(f"{Colors.BOLD}Moving SEO Marketing{Colors.ENDC}")
        self.log(f"{Colors.HEADER}{'='*80}{Colors.ENDC}\n")
        
        if (self.root / "SEO_MARKETING").exists():
            for item in (self.root / "SEO_MARKETING").iterdir():
                dest = f"06_SEO_MARKETING/{item.name}"
                self.safe_move(f"SEO_MARKETING/{item.name}", dest, "SEO/Marketing tool")
    
    def move_misc(self):
        """Move miscellaneous items to 07_MISC"""
        self.log(f"\n{Colors.HEADER}{'='*80}{Colors.ENDC}")
        self.log(f"{Colors.BOLD}Moving Miscellaneous{Colors.ENDC}")
        self.log(f"{Colors.HEADER}{'='*80}{Colors.ENDC}\n")
        
        misc_dirs = ["OTHER_MISC", "other", "docs-demos", "docs-sphinx"]
        for misc_dir in misc_dirs:
            if (self.root / misc_dir).exists():
                if (self.root / misc_dir).is_dir():
                    for item in (self.root / misc_dir).iterdir():
                        dest = f"07_MISC/{item.name}"
                        self.safe_move(f"{misc_dir}/{item.name}", dest, f"From {misc_dir}")
                else:
                    dest = f"07_MISC/{misc_dir}"
                    self.safe_move(misc_dir, dest, "Miscellaneous")
    
    def cleanup_empty_dirs(self):
        """Remove empty directories after moves"""
        self.log(f"\n{Colors.HEADER}{'='*80}{Colors.ENDC}")
        self.log(f"{Colors.BOLD}Cleaning Up Empty Directories{Colors.ENDC}")
        self.log(f"{Colors.HEADER}{'='*80}{Colors.ENDC}\n")
        
        dirs_to_check = [
            "BUSINESS", "DEVELOPMENT", "CLIENT_PROJECTS", "CONTENT_ASSETS",
            "ARCHIVES_BACKUPS", "DATA_ANALYTICS", "SEO_MARKETING",
            "OTHER_MISC", "other", "ai-sites", "DOCUMENTATION",
            "Master_Documentation_Index", "BUSINESS_PROJECTS"
        ]
        
        for dir_name in dirs_to_check:
            dir_path = self.root / dir_name
            if dir_path.exists() and dir_path.is_dir():
                try:
                    # Check if empty
                    if not any(dir_path.iterdir()):
                        if self.dry_run:
                            self.log(f"Would remove empty directory: {dir_name}", Colors.CYAN)
                        else:
                            dir_path.rmdir()
                            self.log(f"✅ Removed empty directory: {dir_name}", Colors.GREEN)
                except Exception as e:
                    self.log(f"⚠️  Could not remove {dir_name}: {e}", Colors.YELLOW)
    
    def generate_report(self):
        """Generate reorganization report"""
        self.log(f"\n{Colors.HEADER}{'='*80}{Colors.ENDC}")
        self.log(f"{Colors.BOLD}Reorganization Report{Colors.ENDC}")
        self.log(f"{Colors.HEADER}{'='*80}{Colors.ENDC}\n")
        
        self.log(f"Directories Created: {self.stats['directories_created']}", Colors.CYAN)
        self.log(f"Files Moved: {self.stats['files_moved']}", Colors.CYAN)
        self.log(f"Directories Moved: {self.stats['directories_moved']}", Colors.CYAN)
        self.log(f"Total Operations: {len(self.moves)}", Colors.CYAN)
        self.log(f"Errors: {len(self.errors)}", Colors.RED if self.errors else Colors.GREEN)
        
        if self.errors:
            self.log(f"\n{Colors.RED}Errors:{Colors.ENDC}")
            for source, dest, error in self.errors:
                self.log(f"  {source} → {dest}: {error}", Colors.RED)
        
        # Save report
        report = {
            'timestamp': datetime.now().isoformat(),
            'dry_run': self.dry_run,
            'stats': self.stats,
            'moves': self.moves,
            'errors': self.errors
        }
        
        report_file = self.root / f"reorganization_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        if not self.dry_run:
            with open(report_file, 'w') as f:
                json.dump(report, f, indent=2)
            self.log(f"\n✅ Report saved to: {report_file}", Colors.GREEN)
    
    def reorganize(self):
        """Execute full reorganization"""
        self.log(f"\n{Colors.BOLD}{'='*80}{Colors.ENDC}")
        self.log(f"{Colors.BOLD}AVATARARTS Project Reorganization{Colors.ENDC}")
        self.log(f"{Colors.BOLD}{'='*80}{Colors.ENDC}\n")
        
        if self.dry_run:
            self.log(f"{Colors.YELLOW}DRY RUN MODE - No files will be moved{Colors.ENDC}\n")
        
        # Execute reorganization phases
        self.create_structure()
        self.move_analysis_scripts()
        self.move_data_files()
        self.move_dashboards()
        self.move_documentation()
        self.move_business_systems()
        self.move_development()
        self.move_client_projects()
        self.move_content_assets()
        self.move_websites()
        self.move_archives()
        self.move_data_analytics()
        self.move_seo_marketing()
        self.move_misc()
        self.cleanup_empty_dirs()
        self.generate_report()
        
        if self.dry_run:
            self.log(f"\n{Colors.YELLOW}This was a DRY RUN. Use --execute to perform actual reorganization.{Colors.ENDC}\n")


def main():
    parser = argparse.ArgumentParser(
        description='Reorganize AVATARARTS project structure',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Dry run (preview changes)
  python3 reorganize_project.py

  # Execute reorganization
  python3 reorganize_project.py --execute

  # Custom root directory
  python3 reorganize_project.py --root /path/to/project --execute
        """
    )
    
    parser.add_argument('--root', default='.', help='Root directory to reorganize')
    parser.add_argument('--execute', action='store_true', 
                       help='Execute reorganization (default is dry-run)')
    
    args = parser.parse_args()
    
    reorganizer = ProjectReorganizer(root_dir=args.root, dry_run=not args.execute)
    reorganizer.reorganize()


if __name__ == '__main__':
    main()
