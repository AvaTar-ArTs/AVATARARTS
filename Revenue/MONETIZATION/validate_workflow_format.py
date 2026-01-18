#!/usr/bin/env python3
"""
n8n Workflow Format Validator
==============================

Validates all workflows against n8n standards and best practices.
"""

import json
import os
from pathlib import Path
from collections import defaultdict

# Directories to validate
WORKFLOWS_DIR = Path(__file__).parent.parent / "n8n_workflows"
PACKAGE_DIR = Path(__file__).parent.parent / "n8n_complete_package"

def validate_workflow(filepath):
    """Validate a single workflow file."""
    issues = []
    warnings = []

    try:
        with open(filepath, 'r') as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        return {'valid': False, 'errors': [f"Invalid JSON: {str(e)}"], 'warnings': []}
    except Exception as e:
        return {'valid': False, 'errors': [f"File error: {str(e)}"], 'warnings': []}

    # Required top-level fields
    if 'name' not in data:
        issues.append("Missing 'name' field")
    if 'nodes' not in data:
        issues.append("Missing 'nodes' field")
    if 'connections' not in data:
        issues.append("Missing 'connections' field")

    # Validate nodes
    nodes = data.get('nodes', [])
    if not nodes:
        issues.append("No nodes defined")

    node_ids = set()
    for i, node in enumerate(nodes):
        # Required node fields
        for field in ['id', 'name', 'type', 'position', 'parameters']:
            if field not in node:
                issues.append(f"Node {i} ({node.get('name', 'unnamed')}): Missing '{field}'")

        # Check for duplicate IDs
        node_id = node.get('id')
        if node_id:
            if node_id in node_ids:
                issues.append(f"Node {i}: Duplicate ID '{node_id}'")
            node_ids.add(node_id)

        # Warnings
        if 'typeVersion' not in node:
            warnings.append(f"Node {i} ({node.get('name', 'unnamed')}): Missing 'typeVersion' (recommended)")

        if 'notes' not in node and node.get('type') in ['n8n-nodes-base.code', 'n8n-nodes-base.function']:
            warnings.append(f"Node {i} ({node.get('name', 'unnamed')}): Complex node missing 'notes'")

        # Check for hardcoded credentials
        params = node.get('parameters', {})
        param_str = json.dumps(params).lower()
        if any(keyword in param_str for keyword in ['apikey', 'password', 'secret', 'token']):
            if 'credentials' not in node:
                warnings.append(f"Node {i} ({node.get('name', 'unnamed')}): Possible hardcoded credential")

    # Validate connections
    connections = data.get('connections', {})
    node_names = {node.get('name') for node in nodes}

    for source_node, conn_data in connections.items():
        if source_node not in node_names:
            warnings.append(f"Connection references unknown node: '{source_node}'")

        if 'main' in conn_data:
            for output_group in conn_data['main']:
                for conn in output_group:
                    target = conn.get('node')
                    if target and target not in node_names:
                        warnings.append(f"Connection to unknown node: '{target}'")

    return {
        'valid': len(issues) == 0,
        'errors': issues,
        'warnings': warnings,
        'node_count': len(nodes),
        'has_typeVersion': sum(1 for n in nodes if 'typeVersion' in n),
        'has_notes': sum(1 for n in nodes if 'notes' in n)
    }


def validate_all_workflows():
    """Validate all workflows in package."""
    print("🔍 Validating n8n Workflows...")
    print("=" * 60)

    results = defaultdict(list)
    total_issues = 0
    total_warnings = 0

    # Validate package workflows
    for root, dirs, files in os.walk(PACKAGE_DIR):
        # Skip certain directories
        if 'integrated_resources' in root or 'docs' in root or 'gumroad_listings' in root:
            continue

        for file in files:
            if file.endswith('.json'):
                filepath = Path(root) / file
                rel_path = filepath.relative_to(PACKAGE_DIR)

                result = validate_workflow(filepath)
                results[rel_path.parent].append({
                    'file': file,
                    'result': result
                })

                if result['errors']:
                    total_issues += len(result['errors'])
                if result['warnings']:
                    total_warnings += len(result['warnings'])

    # Print results
    valid_count = 0
    invalid_count = 0

    for category, files in results.items():
        print(f"\n📁 {category}:")
        for item in files:
            result = item['result']
            if result['valid']:
                valid_count += 1
                status = "✅"
            else:
                invalid_count += 1
                status = "❌"

            print(f"   {status} {item['file']}")
            if result['errors']:
                for error in result['errors']:
                    print(f"      ⚠️  {error}")
            if result['warnings']:
                for warning in result['warnings'][:2]:  # Show first 2
                    print(f"      💡 {warning}")
                if len(result['warnings']) > 2:
                    print(f"      ... and {len(result['warnings']) - 2} more warnings")

    print(f"\n" + "=" * 60)
    print(f"📊 Validation Summary:")
    print(f"   ✅ Valid: {valid_count}")
    print(f"   ❌ Invalid: {invalid_count}")
    print(f"   ⚠️  Total Issues: {total_issues}")
    print(f"   💡 Total Warnings: {total_warnings}")

    return {
        'valid': valid_count,
        'invalid': invalid_count,
        'issues': total_issues,
        'warnings': total_warnings
    }


if __name__ == "__main__":
    results = validate_all_workflows()

    if results['invalid'] == 0 and results['issues'] == 0:
        print("\n🎉 All workflows are valid!")
    else:
        print(f"\n⚠️  {results['invalid']} workflows need fixes")
