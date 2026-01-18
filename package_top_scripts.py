import os
import shutil
import zipfile

# Configuration
SOURCE_LIST = "/Users/steven/AVATARARTS/REVENUE_LAUNCH_2026/01_PRODUCTS/Utilities_Tools_Collection/top_20_scripts.txt"
OUTPUT_DIR = "/Users/steven/AVATARARTS/REVENUE_LAUNCH_2026/01_PRODUCTS/Utilities_Tools_Collection/PACKAGED_FOR_SALE"

README_TEMPLATE = """# {script_name}

## Overview
This is a professional-grade Python automation script designed to streamline your workflow.

## Features
- Efficient processing
- Clean, documented code
- Easy to customize

## Installation
1. Install Python 3.x
2. Run `pip install -r requirements.txt` (if applicable)

## Usage
Run the script:
`python3 {script_name}`

## Support
For support, contact the developer.
"""

def package_scripts():
    print(f"📦 Packaging Scripts from: {SOURCE_LIST}")
    
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    try:
        with open(SOURCE_LIST, 'r') as f:
            scripts = [line.strip() for line in f if line.strip()]
    except FileNotFoundError:
        print("❌ Source list not found. Please populate top_20_scripts.txt first.")
        return

    count = 0
    for script_path in scripts:
        if not os.path.exists(script_path):
            print(f"⚠️  Skipping missing script: {script_path}")
            continue
            
        script_name = os.path.basename(script_path)
        base_name = os.path.splitext(script_name)[0]
        package_folder = os.path.join(OUTPUT_DIR, base_name)
        
        # Create folder structure
        if os.path.exists(package_folder):
            shutil.rmtree(package_folder)
        os.makedirs(package_folder)
        
        # Copy Script
        shutil.copy2(script_path, package_folder)
        
        # Create README
        with open(os.path.join(package_folder, "README.md"), 'w') as f:
            f.write(README_TEMPLATE.format(script_name=script_name))
            
        # Create ZIP
        zip_name = os.path.join(OUTPUT_DIR, f"{base_name}_v1.0.zip")
        with zipfile.ZipFile(zip_name, 'w') as zf:
            for root, dirs, files in os.walk(package_folder):
                for file in files:
                    zf.write(os.path.join(root, file), 
                             os.path.relpath(os.path.join(root, file), package_folder))
        
        print(f"✅ Packaged: {zip_name}")
        count += 1

    print(f"\n🎉 Total Packages Created: {count}")
    print(f"📂 Location: {OUTPUT_DIR}")

if __name__ == "__main__":
    package_scripts()
