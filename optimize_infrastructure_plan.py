import csv
import os
import re

def clean_context(path_str):
    """
    Intelligent flattening logic.
    Returns (SubCategory, ShortContext)
    """
    parts = path_str.strip('./').split('/')
    
    # CASE 1: Gorilla (GitHub)
    if 'gorilla' in path_str:
        return 'Gorilla', 'Core'

    # CASE 2: HeavenlyHands (Projects)
    if 'heavenlyHands' in path_str:
        return 'Projects', 'HeavenlyHands'
        
    # CASE 3: Vibrant Chaplygin
    if 'vibrant-chaplygin' in path_str:
        return 'Projects', 'VibrantChaplygin'

    # CASE 4: Axolotl (Automations)
    if 'axolotl-main' in path_str:
        return 'Automations', 'Axolotl'

    # CASE 5: Auto Paper Digest
    if 'auto-paper-digest' in path_str:
        return 'Automations', 'PaperDigest'
        
    # CASE 6: SurfSense
    if 'SurfSense' in path_str:
        return 'Automations', 'SurfSense'

    # CASE 7: Miscellaneous Scripts
    if 'final_sorted_scripts' in path_str:
        # Extract subcategory if possible (e.g., 'miscellaneous')
        for part in parts:
            if part in ['miscellaneous', 'utilities', 'tools']:
                return 'Scripts', part.capitalize()
        return 'Scripts', 'General'

    # CASE 8: Data Processing (General)
    if 'data_processing' in path_str:
        return 'General', 'DataProcessing'

    # Default Fallback
    return 'General', 'Misc'

def optimize_plan():
    input_path = 'INFRASTRUCTURE_MIGRATION_PLAN.csv'
    output_path = 'INFRASTRUCTURE_OPTIMIZED_PLAN.csv'
    
    print(f"Reading from {input_path}...")
    
    with open(input_path, 'r') as infile, open(output_path, 'w', newline='') as outfile:
        reader = csv.DictReader(infile)
        
        # Add 'SubContext' to fieldnames for clarity if needed, 
        # but for now we stick to the required schema
        fieldnames = reader.fieldnames
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        writer.writeheader()
        
        count = 0
        categories = {}
        
        for row in reader:
            count += 1
            source_path = row['Before_Path']
            filename = os.path.basename(source_path)
            
            # Get optimized context
            sub_cat, context = clean_context(source_path)
            
            # Track stats
            full_cat = f"{sub_cat}/{context}"
            categories[full_cat] = categories.get(full_cat, 0) + 1
            
            # Construct FLAT optimized path
            # Pattern: ~/Documents/CsV/Infrastructure/[SubCategory]/[Context]/[Filename]
            # Example: ~/Documents/CsV/Infrastructure/Projects/HeavenlyHands/demo_system.py
            
            new_dest = f"~/Documents/CsV/Infrastructure/{sub_cat}/{context}/{filename}"
            
            row['After_Path'] = new_dest
            writer.writerow(row)
            
    print(f"\nGenerated {output_path} with {count} entries.")
    print("\n--- Distribution ---")
    for cat, c in sorted(categories.items()):
        print(f"{cat}: {c} files")

if __name__ == '__main__':
    optimize_plan()
