#!/usr/bin/env python3
"""
Extract Additional Workflows from Template Files
================================================

Extracts workflows from structured template JSON files and converts
them to standard n8n workflow format.
"""

import json
import os
import shutil
from pathlib import Path

# Input files
SOURCE_FILES = [
    "/Volumes/2T-Xx/ai-sites/n8n/n8n_workflows/n8n_ai_agent_templates.json",
    "/Volumes/2T-Xx/Documents/n8n_social_media_automation.json",
    "/Volumes/2T-Xx/Documents/n8n_automation_workflows.json",
]

# Output directory
OUTPUT_DIR = Path(__file__).parent.parent / "n8n_complete_package" / "additional_workflows"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def convert_template_to_workflow(template_data, workflow_name):
    """Convert template structure to standard n8n workflow format."""
    # Standard n8n workflow structure
    workflow = {
        "name": template_data.get("name", workflow_name),
        "nodes": template_data.get("nodes", []),
        "connections": template_data.get("connections", {}),
        "settings": template_data.get("settings", {}),
        "staticData": template_data.get("staticData", {}),
        "tags": template_data.get("tags", []),
        "pinData": template_data.get("pinData", {}),
    }

    # Ensure connections is an object
    if not isinstance(workflow["connections"], dict):
        workflow["connections"] = {}

    return workflow


def extract_workflows():
    """Extract workflows from template files."""
    print("🔍 Extracting additional workflows...")

    extracted = []

    for filepath in SOURCE_FILES:
        if not os.path.exists(filepath):
            print(f"  ⚠️  Skipping (not found): {os.path.basename(filepath)}")
            continue

        print(f"\n📄 Processing: {os.path.basename(filepath)}")

        try:
            with open(filepath, 'r') as f:
                data = json.load(f)

            # Handle different structures
            if 'n8n_workflows' in data:
                workflows = data['n8n_workflows']

                for key, template in workflows.items():
                    workflow_name = template.get('name', key)

                    # Convert to standard format
                    workflow = convert_template_to_workflow(template, workflow_name)

                    # Generate filename
                    filename = f"{key}.json"
                    output_path = OUTPUT_DIR / filename

                    # Save workflow
                    with open(output_path, 'w') as out:
                        json.dump(workflow, out, indent=2)

                    print(f"  ✅ Extracted: {workflow_name}")
                    extracted.append({
                        'name': workflow_name,
                        'file': filename,
                        'source': os.path.basename(filepath)
                    })

            elif 'nodes' in data:
                # Already in workflow format
                workflow_name = data.get('name', 'workflow')
                filename = f"{workflow_name.replace(' ', '_').lower()}.json"
                output_path = OUTPUT_DIR / filename

                with open(output_path, 'w') as out:
                    json.dump(data, out, indent=2)

                print(f"  ✅ Extracted: {workflow_name}")
                extracted.append({
                    'name': workflow_name,
                    'file': filename,
                    'source': os.path.basename(filepath)
                })

            else:
                print(f"  ⚠️  Unknown structure in {os.path.basename(filepath)}")

        except Exception as e:
            print(f"  ❌ Error processing {os.path.basename(filepath)}: {e}")

    print(f"\n✅ Extracted {len(extracted)} additional workflows")
    return extracted


def create_summary(extracted):
    """Create summary of extracted workflows."""
    summary = {
        "total": len(extracted),
        "workflows": extracted,
        "categories": {
            "ai_agents": [w for w in extracted if 'ai' in w['name'].lower() or 'agent' in w['name'].lower()],
            "social_media": [w for w in extracted if 'social' in w['name'].lower() or 'behance' in w['name'].lower()],
            "automation": [w for w in extracted if 'automation' in w['name'].lower() or 'scraping' in w['name'].lower()],
        }
    }

    with open(OUTPUT_DIR / "extraction_summary.json", 'w') as f:
        json.dump(summary, f, indent=2)

    print(f"\n📋 Summary saved to: {OUTPUT_DIR / 'extraction_summary.json'}")


if __name__ == "__main__":
    extracted = extract_workflows()
    if extracted:
        create_summary(extracted)
        print(f"\n🎯 Next: Add these to your package bundles!")
