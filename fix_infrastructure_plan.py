import csv
import os
from pathlib import Path

def get_meaningful_parent(path_str):
    parts = path_str.strip('./').split('/')
    
    # Logic to find the meaningful parent context
    if 'projects' in parts:
        idx = parts.index('projects')
        if idx + 1 < len(parts):
            # Return "projects/ProjectName"
            return f"projects/{parts[idx+1]}"
            
    if 'GitHub' in parts:
        idx = parts.index('GitHub')
        if idx + 1 < len(parts):
            # Return "GitHub/RepoName"
            return f"GitHub/{parts[idx+1]}"
            
    if 'Automations' in parts:
        idx = parts.index('Automations')
        if idx + 1 < len(parts):
            return f"Automations/{parts[idx+1]}"
            
    if 'final_sorted_scripts' in parts:
        idx = parts.index('final_sorted_scripts')
        if idx + 1 < len(parts):
            return f"scripts/{parts[idx+1]}"
            
    # Fallback for others - try to use the immediate parent folder name
    # unless it's generic like "pyt" or "src"
    if len(parts) > 1:
        parent = parts[-2]
        if parent not in ['pyt', 'src', 'Production', 'pythons', 'AVATARARTS']:
            return f"General/{parent}"
            
    return "General"

def fix_plan():
    input_path = 'INFRASTRUCTURE_MIGRATION_PLAN.csv'
    output_path = 'INFRASTRUCTURE_PARENT_AWARE_PLAN.csv'
    
    with open(input_path, 'r') as infile, open(output_path, 'w', newline='') as outfile:
        reader = csv.DictReader(infile)
        fieldnames = reader.fieldnames
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        writer.writeheader()
        
        for row in reader:
            source_path = row['Before_Path']
            
            # Extract meaningful parent context
            context = get_meaningful_parent(source_path)
            
            # Construct new After_Path
            # Format: ~/Documents/CsV/Infrastructure/[Context]/Production/[Filename]
            filename = os.path.basename(source_path)
            new_dest = f"~/Documents/CsV/Infrastructure/{context}/Production/{filename}"
            
            row['After_Path'] = new_dest
            writer.writerow(row)
            
    print(f"Generated {output_path}")

if __name__ == '__main__':
    fix_plan()
