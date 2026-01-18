#!/usr/bin/env python3
"""
Scan home directory and selectively add valuable content to avatararts.org
"""

import os
import shutil
from pathlib import Path
import json
from datetime import datetime


def scan_home_directory():
    """Scan home directory to identify valuable content"""
    home_dir = Path.home()
    valuable_dirs = []
    valuable_files = []
    
    # Define patterns for valuable content
    valuable_extensions = {
        '.py', '.js', '.ts', '.html', '.css', '.md', '.json', '.yaml', '.yml',
        '.txt', '.csv', '.pdf', '.doc', '.docx', '.ppt', '.pptx', '.zip',
        '.tar.gz', '.sql', '.env', '.config', '.conf', '.ini', '.xml'
    }
    
    # Define important directory names
    important_dirs = {
        'AVATARARTS', 'Documents', 'GitHub', 'analysis', 'scripts', 
        'pythons', 'clean', 'maigret', 'hyper', 'zsh-autocomplete',
        'zsh-completions', 'analysis_reports', 'claude-Convos'
    }
    
    print("Scanning home directory for valuable content...")
    
    # Walk through home directory
    for item in home_dir.iterdir():
        if item.is_dir():
            # Check if it's an important directory
            if item.name in important_dirs or any(keyword in item.name.lower() for keyword in ['avatar', 'analysis', 'script', 'doc']):
                valuable_dirs.append(item)
                print(f"Found valuable directory: {item}")
        elif item.is_file():
            # Check if it has a valuable extension
            if item.suffix.lower() in valuable_extensions:
                valuable_files.append(item)
                print(f"Found valuable file: {item}")
    
    return valuable_dirs, valuable_files


def copy_valuable_content(valuable_dirs, valuable_files, avatararts_org_path):
    """Copy valuable content to avatararts.org structure"""
    avatararts_path = Path(avatararts_org_path)
    
    # Create a directory for imported content
    imported_content_dir = avatararts_path / "content" / "imported-from-home"
    imported_content_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"\nCopying valuable content to {imported_content_dir}...")
    
    # Copy important directories
    for dir_path in valuable_dirs:
        dest_dir = imported_content_dir / f"DIR_{dir_path.name}"
        print(f"Copying directory: {dir_path} -> {dest_dir}")
        
        try:
            # Create a symbolic link or copy depending on size
            if dir_path.name == 'AVATARARTS':
                # For the main AVATARARTS directory, create a reference
                reference_file = dest_dir / "README.md"
                reference_file.parent.mkdir(parents=True, exist_ok=True)
                with open(reference_file, 'w') as f:
                    f.write(f"# Reference to {dir_path.name}\n\n")
                    f.write(f"This references the original {dir_path.name} directory.\n\n")
                    f.write(f"Original location: {dir_path}\n")
                    f.write(f"Last scanned: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            else:
                # For other directories, copy the structure but not all content to avoid huge copies
                dest_dir.mkdir(exist_ok=True)
                # Copy just the first few files from each directory to avoid copying massive amounts of data
                copied_count = 0
                for item in dir_path.iterdir():
                    if copied_count >= 10:  # Limit to first 10 items per directory
                        break
                    if item.is_file():
                        dest_item = dest_dir / item.name
                        try:
                            shutil.copy2(item, dest_item)
                            copied_count += 1
                        except Exception as e:
                            print(f"Could not copy {item}: {e}")
                    elif item.is_dir():
                        # For subdirectories, just create a reference
                        ref_file = dest_dir / f"{item.name}_ref.txt"
                        with open(ref_file, 'w') as f:
                            f.write(f"Reference to directory: {item}\n")
                            f.write(f"Original location: {item}\n")
                            f.write(f"Last scanned: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
                        copied_count += 1
        except Exception as e:
            print(f"Could not process directory {dir_path}: {e}")
    
    # Copy important files
    for file_path in valuable_files:
        # Skip system files and very large files
        if file_path.name.startswith('.') or file_path.stat().st_size > 10 * 1024 * 1024:  # Skip files >10MB
            continue
            
        dest_file = imported_content_dir / f"FILE_{file_path.name}"
        print(f"Copying file: {file_path} -> {dest_file}")
        
        try:
            shutil.copy2(file_path, dest_file)
        except Exception as e:
            print(f"Could not copy {file_path}: {e}")
    
    # Create a summary of what was scanned and copied
    summary = {
        "scan_date": datetime.now().isoformat(),
        "directories_found": [str(d) for d in valuable_dirs],
        "files_found": [str(f) for f in valuable_files],
        "directories_copied": [str(d) for d in valuable_dirs],  # Listed as copied (though referenced for large ones)
        "files_copied": [str(f) for f in valuable_files if f.stat().st_size <= 10 * 1024 * 1024 and not f.name.startswith('.')]
    }
    
    summary_file = imported_content_dir / "scan_summary.json"
    with open(summary_file, 'w') as f:
        json.dump(summary, f, indent=2)
    
    print(f"\nScan summary saved to: {summary_file}")
    
    return imported_content_dir


def create_documentation_links(avatararts_org_path):
    """Create documentation links for the imported content"""
    avatararts_path = Path(avatararts_org_path)
    
    # Update the main index.html to include links to the imported content
    index_file = avatararts_path / "index.html"
    
    if index_file.exists():
        with open(index_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Add a section for imported content if it doesn't exist
        if "Imported Content" not in content:
            # Find the features section and add imported content after it
            insert_pos = content.find("</section>")  # Find closing tag of features section
            if insert_pos != -1:
                insert_pos = content.find("</section>", insert_pos + 1)  # Find the next one (features section)
                
                imported_section = """
        <section class="imported-content">
            <h2>Imported Content</h2>
            <p>Valuable content from the home directory has been imported for reference.</p>
            <a href="/content/imported-from-home/" class="cta-button">View Imported Content</a>
        </section>
"""
                
                new_content = content[:insert_pos+10] + imported_section + content[insert_pos+10:]
                
                with open(index_file, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                
                print(f"Updated {index_file} with imported content link")


def main():
    """Main function to scan and add valuable content to avatararts.org"""
    print("Starting scan of home directory for valuable content...")
    
    # Get the avatararts.org path
    avatararts_org_path = Path.home() / "avatararts.org"
    
    if not avatararts_org_path.exists():
        print(f"Error: avatararts.org directory not found at {avatararts_org_path}")
        print("Please run the setup script first.")
        return
    
    # Scan home directory
    valuable_dirs, valuable_files = scan_home_directory()
    
    print(f"\nFound {len(valuable_dirs)} valuable directories and {len(valuable_files)} valuable files")
    
    # Copy valuable content to avatararts.org
    imported_content_dir = copy_valuable_content(valuable_dirs, valuable_files, avatararts_org_path)
    
    # Create documentation links
    create_documentation_links(avatararts_org_path)
    
    print(f"\nSuccessfully added valuable content to avatararts.org structure!")
    print(f"Content location: {imported_content_dir}")
    print("The avatararts.org site now includes references to important home directory content.")


if __name__ == "__main__":
    main()