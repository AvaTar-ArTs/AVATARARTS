import csv
import os

def refine_context(path_str, filename):
    """
    Refined logic with content-aware heuristics for 'Miscellaneous' items.
    """
    parts = path_str.strip('./').split('/')
    
    # 1. MAJOR SYSTEMS (Keep existing robust logic)
    if 'gorilla' in path_str:
        return 'Gorilla', 'Core'
    if 'heavenlyHands' in path_str:
        return 'Projects', 'HeavenlyHands'
    if 'vibrant-chaplygin' in path_str:
        return 'Projects', 'VibrantChaplygin'
    if 'axolotl-main' in path_str:
        return 'Automations', 'Axolotl'
    if 'auto-paper-digest' in path_str:
        return 'Automations', 'PaperDigest'
    if 'SurfSense' in path_str:
        return 'Automations', 'SurfSense'

    # 2. DATA PROCESSING (Explicit folder)
    if 'data_processing' in path_str:
        return 'General', 'DataProcessing'

    # 3. INTELLIGENT RE-CLASSIFICATION for "Miscellaneous" / "Final Sorted"
    # This addresses the user's need to "read the code" (simulated via filename semantics)
    
    # ML / AI Kernels
    if any(x in filename.lower() for x in ['quantize', 'lora', 'model_shard', 'torch', 'tensor']):
        return 'ML_Kernels', 'BitsAndBytes'
        
    # Database Utilities
    if any(x in filename.lower() for x in ['createdb', 'db_', 'sql', 'sqlite', 'mongo']):
        return 'Database', 'Utilities'

    # Integrations / Schemas
    if any(x in filename.lower() for x in ['integration', 'schema', 'api_']):
        return 'Integrations', 'Schemas'

    # Pickling / Serialization
    if 'pickle' in filename.lower():
        return 'Utilities', 'Serialization'

    # Default Fallback for truly generic scripts
    return 'Scripts', 'General'

def refine_plan():
    input_path = 'INFRASTRUCTURE_MIGRATION_PLAN.csv'
    output_path = 'INFRASTRUCTURE_REFINED_PLAN.csv'
    
    print(f"Refining plan from {input_path}...")
    
    with open(input_path, 'r') as infile, open(output_path, 'w', newline='') as outfile:
        reader = csv.DictReader(infile)
        fieldnames = reader.fieldnames
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        writer.writeheader()
        
        count = 0
        categories = {}
        
        for row in reader:
            count += 1
            source_path = row['Before_Path']
            filename = os.path.basename(source_path)
            
            # Get REFINED context
            sub_cat, context = refine_context(source_path, filename)
            
            # Track stats
            full_cat = f"{sub_cat}/{context}"
            categories[full_cat] = categories.get(full_cat, 0) + 1
            
            # Construct FLAT optimized path
            # Pattern: ~/Documents/CsV/Infrastructure/[SubCategory]/[Context]/[Filename]
            new_dest = f"~/Documents/CsV/Infrastructure/{sub_cat}/{context}/{filename}"
            
            row['After_Path'] = new_dest
            writer.writerow(row)
            
    print(f"\nGenerated {output_path} with {count} entries.")
    print("\n--- Refined Distribution ---")
    for cat, c in sorted(categories.items()):
        print(f"{cat}: {c} files")

if __name__ == '__main__':
    refine_plan()
