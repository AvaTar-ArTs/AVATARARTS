#!/usr/bin/env python3
"""
Create Product Packages for Multiple Platforms

Automates packaging of Trend Pulse assets for:
- Gumroad
- CodeCanyon
- Etsy
- Apify
- Other marketplaces
"""

import os
import shutil
import json
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any

# Source directories
SOURCE_DIR = Path("/Users/steven/AVATARARTS/Revenue")
EXPANSION_PACKS = SOURCE_DIR / "Trend_Pulse_All_Expansion_Packs"
N8N_WORKFLOWS = SOURCE_DIR / "n8n_workflows"
TREND_PULSE_OS = SOURCE_DIR / "trend-pulse-os"

# Output directories
OUTPUT_DIR = Path("/Users/steven/AVATARARTS/Revenue/MONETIZATION/product_packages")
OUTPUT_DIR.mkdir(exist_ok=True)

# Platform directories
PLATFORMS = {
    'gumroad': OUTPUT_DIR / 'gumroad_packages',
    'codecanyon': OUTPUT_DIR / 'codecanyon_packages',
    'etsy': OUTPUT_DIR / 'etsy_packages',
    'apify': OUTPUT_DIR / 'apify_packages'
}

for platform_dir in PLATFORMS.values():
    platform_dir.mkdir(exist_ok=True)


class ProductPackager:
    """Package products for different platforms."""

    def __init__(self):
        self.stats = {
            'packages_created': 0,
            'files_packaged': 0,
            'errors': []
        }

    def create_gumroad_bundle(self):
        """Create Gumroad complete bundle."""
        print("📦 Creating Gumroad Complete Bundle...")

        bundle_dir = PLATFORMS['gumroad'] / 'trend_pulse_complete_bundle'
        bundle_dir.mkdir(exist_ok=True)

        # Copy expansion packs
        packs_dir = bundle_dir / 'expansion_packs'
        if EXPANSION_PACKS.exists():
            shutil.copytree(EXPANSION_PACKS, packs_dir, dirs_exist_ok=True)
            self.stats['files_packaged'] += 1

        # Copy n8n workflows
        workflows_dir = bundle_dir / 'n8n_workflows'
        if N8N_WORKFLOWS.exists():
            shutil.copytree(N8N_WORKFLOWS, workflows_dir, dirs_exist_ok=True)
            self.stats['files_packaged'] += 1

        # Copy trend-pulse-os
        os_dir = bundle_dir / 'trend_pulse_os'
        if TREND_PULSE_OS.exists():
            shutil.copytree(TREND_PULSE_OS, os_dir, dirs_exist_ok=True)
            self.stats['files_packaged'] += 1

        # Create README
        readme_content = self._create_bundle_readme()
        with open(bundle_dir / 'README.md', 'w') as f:
            f.write(readme_content)

        # Create LICENSE
        license_content = self._create_license()
        with open(bundle_dir / 'LICENSE', 'w') as f:
            f.write(license_content)

        # Create ZIP
        zip_path = PLATFORMS['gumroad'] / 'trend_pulse_complete_bundle.zip'
        shutil.make_archive(
            str(zip_path).replace('.zip', ''),
            'zip',
            bundle_dir
        )

        self.stats['packages_created'] += 1
        print(f"  ✅ Created: {zip_path}")

    def create_n8n_bundle(self):
        """Create n8n workflow bundle."""
        print("📦 Creating n8n Workflow Bundle...")

        bundle_dir = PLATFORMS['gumroad'] / 'n8n_workflow_bundle'
        bundle_dir.mkdir(exist_ok=True)

        # Copy workflows
        if N8N_WORKFLOWS.exists():
            shutil.copytree(N8N_WORKFLOWS, bundle_dir / 'workflows', dirs_exist_ok=True)
            self.stats['files_packaged'] += 1

        # Create setup guide
        guide_content = self._create_n8n_setup_guide()
        with open(bundle_dir / 'SETUP_GUIDE.md', 'w') as f:
            f.write(guide_content)

        # Create ZIP
        zip_path = PLATFORMS['gumroad'] / 'n8n_workflow_bundle.zip'
        shutil.make_archive(
            str(zip_path).replace('.zip', ''),
            'zip',
            bundle_dir
        )

        self.stats['packages_created'] += 1
        print(f"  ✅ Created: {zip_path}")

    def create_codecanyon_scripts(self):
        """Create CodeCanyon script packages."""
        print("📦 Creating CodeCanyon Scripts...")

        scripts = [
            'trend_analyzer',
            'content_repurposing',
            'youtube_shorts_generator',
            'ai_note_taker',
            'media_indexer'
        ]

        for script_name in scripts:
            script_dir = PLATFORMS['codecanyon'] / script_name
            script_dir.mkdir(exist_ok=True)

            # Create script file (placeholder - would copy actual scripts)
            script_file = script_dir / f'{script_name}.py'
            with open(script_file, 'w') as f:
                f.write(f"# {script_name.replace('_', ' ').title()} Script\n")
                f.write("# CodeCanyon Package\n")

            # Create README
            readme = self._create_script_readme(script_name)
            with open(script_dir / 'README.md', 'w') as f:
                f.write(readme)

            # Create ZIP
            zip_path = PLATFORMS['codecanyon'] / f'{script_name}.zip'
            shutil.make_archive(
                str(zip_path).replace('.zip', ''),
                'zip',
                script_dir
            )

            self.stats['packages_created'] += 1
            print(f"  ✅ Created: {zip_path}")

    def create_etsy_templates(self):
        """Create Etsy template packages."""
        print("📦 Creating Etsy Templates...")

        templates = [
            'notion_ai_automation',
            'airtable_workflow',
            'prompt_library',
            'content_planner',
            'trend_tracker'
        ]

        for template_name in templates:
            template_dir = PLATFORMS['etsy'] / template_name
            template_dir.mkdir(exist_ok=True)

            # Create template file
            template_file = template_dir / f'{template_name}.json'
            with open(template_file, 'w') as f:
                json.dump({
                    'name': template_name,
                    'type': 'template',
                    'version': '1.0'
                }, f, indent=2)

            # Create instructions
            instructions = self._create_template_instructions(template_name)
            with open(template_dir / 'INSTRUCTIONS.md', 'w') as f:
                f.write(instructions)

            # Create ZIP
            zip_path = PLATFORMS['etsy'] / f'{template_name}.zip'
            shutil.make_archive(
                str(zip_path).replace('.zip', ''),
                'zip',
                template_dir
            )

            self.stats['packages_created'] += 1
            print(f"  ✅ Created: {zip_path}")

    def _create_bundle_readme(self) -> str:
        """Create bundle README."""
        return """# Trend Pulse Complete Bundle

**Version:** 1.0
**Date:** 2026-01-13

## What's Included

- 18 Expansion Packs
- n8n Workflow Templates
- Python Automation Scripts
- Complete Documentation
- Media Indexing System

## Quick Start

1. Extract this ZIP file
2. Read SETUP_GUIDE.md
3. Follow installation instructions
4. Start automating!

## Support

Email: support@quantumforgelabs.ai
Documentation: See DOCUMENTATION/ folder

---

**Thank you for your purchase!** 🚀
"""

    def _create_license(self) -> str:
        """Create license file."""
        return """MIT License

Copyright (c) 2026 Steven Chaplinski

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

    def _create_n8n_setup_guide(self) -> str:
        """Create n8n setup guide."""
        return """# n8n Workflow Setup Guide

## Quick Start

1. Open n8n
2. Go to Workflows → Import from File
3. Select a JSON file from workflows/
4. Configure credentials
5. Activate workflow

## Configuration

### Required
- OpenAI API key (for AI features)
- n8n account

### Optional
- Google Sheets (for data storage)
- Webhook URLs (for triggers)

## Support

See README.md in workflows/ for detailed instructions.

---
"""

    def _create_script_readme(self, script_name: str) -> str:
        """Create script README."""
        return f"""# {script_name.replace('_', ' ').title()}

**CodeCanyon Script Package**

## Installation

1. Extract files
2. Install dependencies: `pip install -r requirements.txt`
3. Configure settings
4. Run script

## Usage

```python
python {script_name}.py
```

## Support

Email: support@quantumforgelabs.ai

---
"""

    def _create_template_instructions(self, template_name: str) -> str:
        """Create template instructions."""
        return f"""# {template_name.replace('_', ' ').title()} Template

## How to Use

1. Import template file
2. Follow setup instructions
3. Customize as needed
4. Start using!

## Support

Email: support@quantumforgelabs.ai

---
"""

    def generate_summary(self):
        """Generate packaging summary."""
        print("\n" + "="*60)
        print("📦 PACKAGING SUMMARY")
        print("="*60)
        print(f"✅ Packages Created: {self.stats['packages_created']}")
        print(f"✅ Files Packaged: {self.stats['files_packaged']}")
        if self.stats['errors']:
            print(f"⚠️  Errors: {len(self.stats['errors'])}")
        print(f"\n📁 Output Directory: {OUTPUT_DIR}")
        print("="*60)

    def run(self):
        """Run complete packaging."""
        print("="*60)
        print("📦 CREATING PRODUCT PACKAGES")
        print("="*60)

        self.create_gumroad_bundle()
        self.create_n8n_bundle()
        self.create_codecanyon_scripts()
        self.create_etsy_templates()

        self.generate_summary()


if __name__ == "__main__":
    packager = ProductPackager()
    packager.run()
