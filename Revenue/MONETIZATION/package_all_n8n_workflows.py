#!/usr/bin/env python3
"""
Package All n8n Workflows for Monetization
==========================================

Collects all n8n workflows from multiple locations and packages them
for Gumroad, n8n Community, and direct sales.
"""

import json
import os
import shutil
import hashlib
from pathlib import Path
from datetime import datetime
from collections import defaultdict

# Base directories
BASE_DIR = Path(__file__).parent.parent
OUTPUT_DIR = BASE_DIR / "MONETIZATION" / "n8n_complete_package"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Locations to scan
LOCATIONS = [
    "/Users/steven/AVATARARTS/Revenue/n8n_workflows",
    "/Users/steven/AVATARARTS/04_WEBSITES/ai-sites/active/n8n/n8n_workflows",
    "/Volumes/2T-Xx/ai-sites/n8n/n8n_workflows",
    "/Users/steven/AVATARARTS/00_ACTIVE/BUSINESS/passive-income-empire/automation/workflows",
    "/Users/steven/AVATARARTS/04_WEBSITES/ai-sites/active/automation/workflows",
    "/Volumes/2T-Xx/Documents",
]

# Categories
CATEGORIES = {
    "free": [],
    "premium": [],
    "ai_agents": [],
    "automation": [],
    "retention": [],
    "social_media": [],
    "analytics": [],
}

# Track unique workflows by hash
seen_hashes = set()
workflow_map = defaultdict(list)


def get_file_hash(filepath):
    """Get MD5 hash of file content."""
    with open(filepath, 'rb') as f:
        return hashlib.md5(f.read()).hexdigest()


def is_n8n_workflow(filepath):
    """Check if file is a valid n8n workflow."""
    try:
        with open(filepath, 'r') as f:
            data = json.load(f)
            return 'nodes' in data or 'workflow' in data or 'connections' in data
    except:
        return False


def categorize_workflow(filename, filepath):
    """Categorize workflow based on filename and content."""
    filename_lower = filename.lower()

    if 'free' in filename_lower:
        return 'free'
    elif 'pro' in filename_lower or 'premium' in filename_lower:
        return 'premium'
    elif 'agent' in filename_lower or 'ai' in filename_lower:
        return 'ai_agents'
    elif 'retention' in filename_lower:
        return 'retention'
    elif 'social' in filename_lower or 'scheduler' in filename_lower:
        return 'social_media'
    elif 'analytics' in filename_lower or 'report' in filename_lower:
        return 'analytics'
    elif 'automation' in filename_lower:
        return 'automation'
    else:
        return 'premium'  # Default to premium


def collect_workflows():
    """Collect all unique n8n workflows."""
    print("🔍 Scanning for n8n workflows...")

    for location in LOCATIONS:
        if not os.path.exists(location):
            continue

        print(f"  Scanning: {location}")

        for root, dirs, files in os.walk(location):
            # Skip certain directories
            dirs[:] = [d for d in dirs if d not in ['.git', 'node_modules', '__pycache__']]

            for file in files:
                if file.endswith('.json'):
                    filepath = os.path.join(root, file)

                    if is_n8n_workflow(filepath):
                        file_hash = get_file_hash(filepath)

                        # Skip duplicates
                        if file_hash not in seen_hashes:
                            seen_hashes.add(file_hash)
                            category = categorize_workflow(file, filepath)
                            CATEGORIES[category].append({
                                'path': filepath,
                                'name': file,
                                'hash': file_hash,
                                'category': category
                            })
                            print(f"    ✅ Found: {file} ({category})")

    print(f"\n✅ Total unique workflows: {sum(len(v) for v in CATEGORIES.values())}")


def create_package_structure():
    """Create organized package structure."""
    print("\n📦 Creating package structure...")

    # Create directories
    (OUTPUT_DIR / "free").mkdir(exist_ok=True)
    (OUTPUT_DIR / "premium").mkdir(exist_ok=True)
    (OUTPUT_DIR / "ai_agents").mkdir(exist_ok=True)
    (OUTPUT_DIR / "automation").mkdir(exist_ok=True)
    (OUTPUT_DIR / "retention").mkdir(exist_ok=True)
    (OUTPUT_DIR / "social_media").mkdir(exist_ok=True)
    (OUTPUT_DIR / "analytics").mkdir(exist_ok=True)
    (OUTPUT_DIR / "bundles").mkdir(exist_ok=True)
    (OUTPUT_DIR / "docs").mkdir(exist_ok=True)

    # Copy workflows
    for category, workflows in CATEGORIES.items():
        if not workflows:
            continue

        for workflow in workflows:
            dest = OUTPUT_DIR / category / workflow['name']
            shutil.copy2(workflow['path'], dest)
            print(f"  ✅ Copied: {workflow['name']} → {category}/")

    print("✅ Package structure created")


def create_bundles():
    """Create workflow bundles."""
    print("\n📦 Creating bundles...")

    # Free Bundle
    if CATEGORIES['free']:
        bundle_dir = OUTPUT_DIR / "bundles" / "free_bundle"
        bundle_dir.mkdir(exist_ok=True)
        for workflow in CATEGORIES['free']:
            shutil.copy2(workflow['path'], bundle_dir / workflow['name'])
        print(f"  ✅ Free Bundle: {len(CATEGORIES['free'])} workflows")

    # Premium Bundle
    premium_workflows = CATEGORIES['premium'] + CATEGORIES['ai_agents']
    if premium_workflows:
        bundle_dir = OUTPUT_DIR / "bundles" / "premium_bundle"
        bundle_dir.mkdir(exist_ok=True)
        for workflow in premium_workflows:
            shutil.copy2(workflow['path'], bundle_dir / workflow['name'])
        print(f"  ✅ Premium Bundle: {len(premium_workflows)} workflows")

    # Complete Bundle
    all_workflows = [w for workflows in CATEGORIES.values() for w in workflows]
    if all_workflows:
        bundle_dir = OUTPUT_DIR / "bundles" / "complete_bundle"
        bundle_dir.mkdir(exist_ok=True)
        for workflow in all_workflows:
            shutil.copy2(workflow['path'], bundle_dir / workflow['name'])
        print(f"  ✅ Complete Bundle: {len(all_workflows)} workflows")

    print("✅ Bundles created")


def create_documentation():
    """Create documentation files."""
    print("\n📝 Creating documentation...")

    # Calculate premium workflows
    premium_workflows = CATEGORIES['premium'] + CATEGORIES['ai_agents']

    # Inventory
    inventory = {
        "generated": datetime.now().isoformat(),
        "total_workflows": sum(len(v) for v in CATEGORIES.values()),
        "categories": {k: len(v) for k, v in CATEGORIES.items()},
        "workflows": {}
    }

    for category, workflows in CATEGORIES.items():
        inventory["workflows"][category] = [
            {
                "name": w['name'],
                "path": w['path'],
                "hash": w['hash']
            }
            for w in workflows
        ]

    with open(OUTPUT_DIR / "docs" / "inventory.json", 'w') as f:
        json.dump(inventory, f, indent=2)

    # README
    readme = f"""# Complete n8n Workflows Package

**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**Total Workflows:** {inventory['total_workflows']}

## 📦 Categories

"""
    for category, count in inventory['categories'].items():
        if count > 0:
            readme += f"- **{category.replace('_', ' ').title()}:** {count} workflows\n"

    readme += f"""
## 🚀 Quick Start

1. Import workflows into n8n
2. Configure credentials
3. Activate workflows

## 💰 Pricing Tiers

- **Free Bundle:** Lead generation
- **Premium Bundle:** ${len(premium_workflows) * 49}-{len(premium_workflows) * 99}
- **Complete Bundle:** $499

## 📋 Workflows Included

"""
    for category, workflows in CATEGORIES.items():
        if workflows:
            readme += f"\n### {category.replace('_', ' ').title()}\n\n"
            for workflow in workflows:
                readme += f"- {workflow['name']}\n"

    with open(OUTPUT_DIR / "README.md", 'w') as f:
        f.write(readme)

    print("✅ Documentation created")


def create_gumroad_listings():
    """Create Gumroad product listings."""
    print("\n💰 Creating Gumroad listings...")

    listings_dir = OUTPUT_DIR / "gumroad_listings"
    listings_dir.mkdir(exist_ok=True)

    # Free Bundle Listing
    if CATEGORIES['free']:
        listing = f"""# Free n8n Workflows Bundle

**Price:** FREE (Lead Generation)

## What's Included

"""
        for workflow in CATEGORIES['free']:
            listing += f"- {workflow['name']}\n"

        listing += f"""
## Description

Get started with n8n automation! This free bundle includes {len(CATEGORIES['free'])} ready-to-use workflows.

## How to Use

1. Download the bundle
2. Import workflows into n8n
3. Configure your credentials
4. Start automating!

## Upsell

Upgrade to Premium Bundle for ${len(CATEGORIES['premium'] + CATEGORIES['ai_agents']) * 49} and get {len(CATEGORIES['premium'] + CATEGORIES['ai_agents'])} premium workflows!
"""
        with open(listings_dir / "free_bundle.md", 'w') as f:
            f.write(listing)

    # Premium Bundle Listing
    premium_workflows = CATEGORIES['premium'] + CATEGORIES['ai_agents']
    if premium_workflows:
        listing = f"""# Premium n8n Workflows Bundle

**Price:** ${len(premium_workflows) * 49}-{len(premium_workflows) * 99}

## What's Included

"""
        for workflow in premium_workflows:
            listing += f"- {workflow['name']}\n"

        listing += f"""
## Description

Professional n8n workflows for serious automation. Includes {len(premium_workflows)} premium workflows with advanced features.

## Features

- ✅ Production-ready workflows
- ✅ AI-powered automation
- ✅ Complete documentation
- ✅ Setup guides
- ✅ Support included

## Value

Individual workflows: ${len(premium_workflows) * 99}
Bundle price: ${len(premium_workflows) * 49}
**Save: ${(len(premium_workflows) * 99) - (len(premium_workflows) * 49)}!**
"""
        with open(listings_dir / "premium_bundle.md", 'w') as f:
            f.write(listing)

    print("✅ Gumroad listings created")


def main():
    """Main function."""
    print("🚀 n8n Workflows Packaging Tool")
    print("=" * 50)

    collect_workflows()
    create_package_structure()
    create_bundles()
    create_documentation()
    create_gumroad_listings()

    print("\n" + "=" * 50)
    print("✅ Packaging complete!")
    print(f"📁 Output: {OUTPUT_DIR}")
    print("\nNext steps:")
    print("1. Review workflows in OUTPUT_DIR")
    print("2. Create ZIP files for Gumroad")
    print("3. Upload to n8n Community")
    print("4. Start selling! 🚀")


if __name__ == "__main__":
    main()
