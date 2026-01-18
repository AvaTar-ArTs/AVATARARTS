#!/usr/bin/env python3
"""
Package products discovered from /Volumes scan
Creates ready-to-sell packages for Gumroad, Apify, CodeCanyon, Etsy
"""

import os
import shutil
import zipfile
from pathlib import Path
from datetime import datetime

# Base paths
BASE_DIR = Path(__file__).parent.parent
VOLUMES_BASE = Path("/Volumes")
OUTPUT_DIR = BASE_DIR / "MONETIZATION" / "product_packages" / "volumes_products"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Product definitions
PRODUCTS = {
    "alchemyapi_bundle": {
        "name": "AlchemyAPI Complete Bundle",
        "source": "/Volumes/DeVonDaTa/gDrive/tehSiTes/AlchemyAPI",
        "files": [
            "creative_tts_generator.py",
            "emotional_tts_generator.py",
            "emotional_quiz_generator.py",
            "advanced_demo_generator.py",
            "demo_emotional_generator.py",
            "generate_mp3s.py",
            "demo_mp3_generator.py",
            "discography_merger.py",
            "simple_discography_processor.py"
        ],
        "price": 299,
        "platform": "gumroad"
    },
    "automation_empire": {
        "name": "Automation Empire Complete",
        "source": "/Volumes/2T-Xx/ai-sites/automation",
        "files": "all",  # All files in directory
        "price": 499,
        "platform": "gumroad"
    },
    "n8n_workflows_bundle": {
        "name": "n8n Workflows Bundle",
        "source": "/Volumes/2T-Xx/ai-sites/n8n",
        "files": "all",
        "price": 299,
        "platform": "gumroad"
    },
    "passive_income_empire": {
        "name": "Passive Income Empire",
        "source": "/Volumes/2T-Xx/ai-sites/passive-income-empire",
        "files": "all",
        "price": 299,
        "platform": "gumroad"
    },
    "retention_products_suite": {
        "name": "Retention Products Suite",
        "source": "/Volumes/2T-Xx/ai-sites/retention-products-suite",
        "files": "all",
        "price": 999,
        "platform": "gumroad"
    },
    "upwork_scraper": {
        "name": "Upwork Multi-Feed Scraper",
        "source": "/Volumes/DeVonDaTa/gDrive/tehSiTes/02_Business_and_Finance/upwork",
        "files": ["upwork_multi_feed_scraper.py"],
        "price": 199,
        "platform": "apify"
    }
}

def create_readme(product_key, product_info):
    """Create README for product"""
    readme_content = f"""# {product_info['name']}

**Price:** ${product_info['price']}
**Platform:** {product_info['platform']}
**Created:** {datetime.now().strftime('%Y-%m-%d')}

## Description

{product_info.get('description', 'Professional automation tool')}

## Contents

{chr(10).join(f"- {f}" for f in (product_info['files'] if isinstance(product_info['files'], list) else ['All files in source directory']))}

## Installation

1. Extract the package
2. Install dependencies: `pip install -r requirements.txt`
3. Configure environment variables
4. Run the scripts

## Usage

See individual script documentation for usage instructions.

## Support

For support, please contact the seller.

## License

See LICENSE file for details.

---
**Created by:** Trend Pulse Ecosystem
**Version:** 1.0
"""
    return readme_content

def package_product(product_key, product_info):
    """Package a single product"""
    print(f"\n📦 Packaging {product_info['name']}...")

    source_path = Path(product_info['source'])
    if not source_path.exists():
        print(f"  ⚠️  Source not found: {source_path}")
        return False

    # Create temp directory
    temp_dir = OUTPUT_DIR / f"temp_{product_key}"
    temp_dir.mkdir(exist_ok=True)

    try:
        # Copy files
        if product_info['files'] == "all":
            # Copy entire directory
            for item in source_path.rglob("*"):
                if item.is_file() and not item.name.startswith('.'):
                    rel_path = item.relative_to(source_path)
                    dest_path = temp_dir / rel_path
                    dest_path.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copy2(item, dest_path)
        else:
            # Copy specific files
            for filename in product_info['files']:
                src_file = source_path / filename
                if src_file.exists():
                    dest_file = temp_dir / filename
                    shutil.copy2(src_file, dest_file)
                else:
                    print(f"  ⚠️  File not found: {filename}")

        # Create README
        readme_content = create_readme(product_key, product_info)
        (temp_dir / "README.md").write_text(readme_content)

        # Create LICENSE
        license_content = """MIT License

Copyright (c) 2026 Trend Pulse Ecosystem

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
"""
        (temp_dir / "LICENSE").write_text(license_content)

        # Create ZIP
        platform_dir = OUTPUT_DIR / product_info['platform']
        platform_dir.mkdir(exist_ok=True)

        zip_path = platform_dir / f"{product_key}.zip"
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for file_path in temp_dir.rglob("*"):
                if file_path.is_file():
                    arcname = file_path.relative_to(temp_dir)
                    zipf.write(file_path, arcname)

        # Cleanup
        shutil.rmtree(temp_dir)

        size_mb = zip_path.stat().st_size / (1024 * 1024)
        print(f"  ✅ Created: {zip_path} ({size_mb:.2f} MB)")
        return True

    except Exception as e:
        print(f"  ❌ Error: {e}")
        if temp_dir.exists():
            shutil.rmtree(temp_dir)
        return False

def main():
    """Main packaging function"""
    print("=" * 60)
    print("📦 PACKAGING /VOLUMES PRODUCTS")
    print("=" * 60)

    success_count = 0
    total_count = len(PRODUCTS)

    for product_key, product_info in PRODUCTS.items():
        if package_product(product_key, product_info):
            success_count += 1

    print("\n" + "=" * 60)
    print(f"✅ PACKAGING COMPLETE: {success_count}/{total_count} products")
    print("=" * 60)
    print(f"\n📁 Output directory: {OUTPUT_DIR}")
    print(f"\n💰 Total value: ${sum(p['price'] for p in PRODUCTS.values())}")

if __name__ == "__main__":
    main()
