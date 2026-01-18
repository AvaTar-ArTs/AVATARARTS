#!/usr/bin/env python3
"""
n8n Workflow & Template Research Tool
======================================

Comprehensive analysis of n8n workflow structure, formatting,
and best practices for monetization.
"""

import json
import os
from pathlib import Path
from collections import Counter, defaultdict
from datetime import datetime

# Directories to analyze
WORKFLOWS_DIR = Path(__file__).parent.parent / "n8n_workflows"
PACKAGE_DIR = Path(__file__).parent.parent / "n8n_complete_package"
CSV_DIR = Path.home() / "AVATARARTS" / "n8n" / "templates"


def analyze_workflow_structure():
    """Analyze workflow JSON structure."""
    print("🔍 Analyzing n8n Workflow Structure...")
    print("=" * 60)

    structures = {
        "standard": [],
        "template_wrapper": [],
        "invalid": []
    }

    node_types = Counter()
    required_fields = Counter()
    optional_fields = Counter()
    connection_patterns = []
    settings_usage = Counter()

    # Analyze all workflows
    for root, dirs, files in os.walk(WORKFLOWS_DIR):
        for file in files:
            if file.endswith('.json'):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r') as f:
                        data = json.load(f)

                    # Classify structure
                    if 'nodes' in data and 'connections' in data:
                        structures["standard"].append(file)

                        # Analyze nodes
                        nodes = data.get('nodes', [])
                        for node in nodes:
                            # Node type
                            node_type = node.get('type', 'unknown')
                            node_types[node_type] += 1

                            # Required fields
                            for field in ['id', 'name', 'type', 'position', 'parameters']:
                                if field in node:
                                    required_fields[field] += 1

                            # Optional fields
                            for field in ['typeVersion', 'notes', 'disabled', 'credentials', 'webhookId', 'executeOnce', 'retryOnFail']:
                                if field in node:
                                    optional_fields[field] += 1

                        # Analyze connections
                        connections = data.get('connections', {})
                        if connections:
                            connection_patterns.append({
                                'file': file,
                                'node_count': len(nodes),
                                'connection_count': sum(len(v.get('main', [])) for v in connections.values())
                            })

                        # Analyze settings
                        settings = data.get('settings', {})
                        if settings:
                            for key in settings.keys():
                                settings_usage[key] += 1

                    elif 'n8n_workflows' in data:
                        structures["template_wrapper"].append(file)
                    else:
                        structures["invalid"].append(file)

                except Exception as e:
                    structures["invalid"].append(f"{file} (error: {str(e)[:30]})")

    return {
        'structures': structures,
        'node_types': node_types,
        'required_fields': required_fields,
        'optional_fields': optional_fields,
        'connection_patterns': connection_patterns,
        'settings_usage': settings_usage
    }


def analyze_template_market():
    """Analyze template market data from CSV."""
    print("\n📊 Analyzing Template Market Data...")
    print("=" * 60)

    csv_file = CSV_DIR / "n8n_templates_enriched_with_links.csv"

    if not csv_file.exists():
        print("   ⚠️  CSV file not found")
        return {}

    categories = Counter()
    node_counts = []
    ai_templates = 0
    popular_templates = []

    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    for row in rows:
        # Categories
        cats = row.get('categories', '')
        if cats:
            categories.update([c.strip() for c in cats.split(',')])

        # Node counts
        try:
            count = int(row.get('num_nodes', 0) or 0)
            if count > 0:
                node_counts.append(count)
        except:
            pass

        # AI-related
        if row.get('is_ai_related', '').lower() == 'true':
            ai_templates += 1

        # Popular templates
        try:
            views = int(row.get('totalViews_clean', 0) or 0)
            if views > 0:
                popular_templates.append({
                    'name': row.get('template_name', ''),
                    'views': views,
                    'nodes': int(row.get('num_nodes', 0) or 0),
                    'categories': row.get('categories', '')
                })
        except:
            pass

    popular_templates.sort(key=lambda x: x['views'], reverse=True)

    return {
        'total_templates': len(rows),
        'categories': categories,
        'node_counts': node_counts,
        'ai_templates': ai_templates,
        'popular_templates': popular_templates[:20]
    }


def generate_research_report(workflow_data, market_data):
    """Generate comprehensive research report."""
    print("\n📝 Generating Research Report...")

    report = f"""# n8n Workflow & Template Research Report

**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**Source:** Analysis of {len(workflow_data['structures']['standard'])} workflows + {market_data.get('total_templates', 0)} market templates

---

## 📋 Executive Summary

This report analyzes n8n workflow structure, formatting standards, and market trends to optimize monetization strategy.

---

## 🔧 n8n Workflow Structure

### Standard Format

n8n workflows use a JSON structure with the following **required fields**:

```json
{{
  "name": "Workflow Name",
  "nodes": [...],
  "connections": {{...}},
  "settings": {{...}}
}}
```

### Required Fields (100% of workflows)

1. **`name`** - Workflow display name
2. **`nodes`** - Array of workflow nodes
3. **`connections`** - Object defining node connections

### Node Structure

Each node **must** contain:
- `id` - Unique node identifier
- `name` - Node display name
- `type` - Node type (e.g., `n8n-nodes-base.webhook`)
- `position` - [x, y] coordinates for UI
- `parameters` - Node configuration object

### Optional Node Fields

Common optional fields:
- `typeVersion` - Node version (for compatibility)
- `notes` - User notes/documentation
- `disabled` - Whether node is disabled
- `credentials` - Credential references
- `webhookId` - For webhook nodes
- `executeOnce` - Execute only once
- `retryOnFail` - Retry on failure

### Settings Structure

Common settings:
- `saveExecutionProgress` - Save execution state
- `saveManualExecutions` - Save manual runs
- `saveDataErrorExecution` - Save error data
- `saveDataSuccessExecution` - Save success data
- `executionTimeout` - Timeout in seconds
- `timezone` - Workflow timezone

---

## 📊 Market Analysis

### Template Statistics

- **Total Templates Analyzed:** {market_data.get('total_templates', 0):,}
- **AI-Related Templates:** {market_data.get('ai_templates', 0):,} ({market_data.get('ai_templates', 0)/max(market_data.get('total_templates', 1), 1)*100:.1f}%)
- **Average Node Count:** {sum(market_data.get('node_counts', [0]))/max(len(market_data.get('node_counts', [1])), 1):.1f} nodes

### Top Categories

"""

    if market_data.get('categories'):
        for cat, count in market_data['categories'].most_common(15):
            report += f"- **{cat}:** {count} templates\n"

    report += f"""
### Node Count Distribution

"""
    node_counts = market_data.get('node_counts', [])
    if node_counts:
        small = sum(1 for n in node_counts if n < 5)
        medium = sum(1 for n in node_counts if 5 <= n < 15)
        large = sum(1 for n in node_counts if n >= 15)
        total = len(node_counts)

        report += f"""
- **Small (<5 nodes):** {small} ({small/max(total, 1)*100:.1f}%)
- **Medium (5-14 nodes):** {medium} ({medium/max(total, 1)*100:.1f}%)
- **Large (15+ nodes):** {large} ({large/max(total, 1)*100:.1f}%)
"""

    report += f"""
### Most Popular Templates

"""
    for i, template in enumerate(market_data.get('popular_templates', [])[:10], 1):
        report += f"""
{i}. **{template['name'][:60]}**
   - Views: {template['views']:,}
   - Nodes: {template['nodes']}
   - Categories: {template['categories'][:50]}
"""

    report += f"""
---

## 🎯 Best Practices for Monetization

### 1. Workflow Structure

✅ **DO:**
- Include descriptive `name` field
- Use clear, descriptive node names
- Add `notes` to complex nodes
- Include `typeVersion` for compatibility
- Structure connections logically

❌ **DON'T:**
- Use generic names like "Node 1"
- Leave nodes without documentation
- Mix different n8n versions
- Create circular dependencies

### 2. Template Formatting

✅ **DO:**
- Use consistent naming conventions
- Include setup instructions in notes
- Document required credentials
- Add error handling nodes
- Include example data

❌ **DON'T:**
- Hardcode API keys
- Skip error handling
- Use unclear variable names
- Forget to document dependencies

### 3. Market Positioning

Based on market analysis:
- **AI-related templates** are {market_data.get('ai_templates', 0)/max(market_data.get('total_templates', 1), 1)*100:.1f}% of market
- **Average complexity:** {sum(market_data.get('node_counts', [0]))/max(len(market_data.get('node_counts', [1])), 1):.1f} nodes
- **Popular categories:** Focus on top categories for SEO

---

## 📈 Recommendations

### For Your Package:

1. **Standardize Format:**
   - Ensure all workflows use standard n8n format
   - Add `typeVersion` to all nodes
   - Include comprehensive `notes`

2. **Optimize for Market:**
   - Focus on AI-related workflows (high demand)
   - Target popular categories
   - Create workflows with 5-15 nodes (sweet spot)

3. **Documentation:**
   - Add setup guides
   - Document credentials needed
   - Include use case examples
   - Provide troubleshooting tips

4. **Quality Assurance:**
   - Test all workflows before packaging
   - Remove hardcoded credentials
   - Validate JSON structure
   - Check node compatibility

---

## 🔍 Technical Details

### Node Type Distribution

"""

    for node_type, count in workflow_data['node_types'].most_common(15):
        report += f"- `{node_type}`: {count} occurrences\n"

    report += f"""
### Connection Patterns

- Average nodes per workflow: {sum(p['node_count'] for p in workflow_data['connection_patterns'])/max(len(workflow_data['connection_patterns']), 1):.1f}
- Average connections per workflow: {sum(p['connection_count'] for p in workflow_data['connection_patterns'])/max(len(workflow_data['connection_patterns']), 1):.1f}

---

## ✅ Validation Checklist

Before monetizing, ensure each workflow:

- [ ] Uses standard n8n JSON format
- [ ] Has descriptive name
- [ ] All nodes have unique IDs
- [ ] Connections are properly defined
- [ ] No hardcoded credentials
- [ ] Includes error handling
- [ ] Has documentation/notes
- [ ] Tested and working
- [ ] Compatible with latest n8n version

---

**Status:** ✅ Research Complete
**Next:** Apply findings to optimize package
"""

    return report


def main():
    """Main research function."""
    print("🔬 n8n Workflow & Template Research")
    print("=" * 60)

    # Analyze workflows
    workflow_data = analyze_workflow_structure()

    # Analyze market
    market_data = analyze_template_market()

    # Generate report
    report = generate_research_report(workflow_data, market_data)

    # Save report
    output_file = Path(__file__).parent / "n8n_WORKFLOW_RESEARCH.md"
    with open(output_file, 'w') as f:
        f.write(report)

    print(f"\n✅ Research complete!")
    print(f"📄 Report saved to: {output_file}")

    # Print summary
    print(f"\n📊 Summary:")
    print(f"   Standard workflows: {len(workflow_data['structures']['standard'])}")
    print(f"   Template wrappers: {len(workflow_data['structures']['template_wrapper'])}")
    print(f"   Market templates: {market_data.get('total_templates', 0):,}")
    print(f"   AI templates: {market_data.get('ai_templates', 0):,}")


if __name__ == "__main__":
    import csv
    main()
