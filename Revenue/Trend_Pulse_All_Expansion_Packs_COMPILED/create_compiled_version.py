#!/usr/bin/env python3
"""
Create Compiled Version of Trend Pulse Expansion Packs

This script:
1. Copies all packs to organized structure
2. Consolidates code files
3. Organizes documentation
4. Creates master index
"""

import os
import shutil
from pathlib import Path
from typing import Dict, List, Any
import json
from datetime import datetime

# Source and destination
SOURCE_DIR = Path("/Users/steven/AVATARARTS/Revenue/Trend_Pulse_All_Expansion_Packs")
DEST_DIR = Path("/Users/steven/AVATARARTS/Revenue/Trend_Pulse_All_Expansion_Packs_COMPILED")

# Pack categories
PACK_CATEGORIES = {
    'CONTENT_CREATION': [
        'AI_Content_Repurposing',
        'YouTube_Shorts_Automation',
        'Faceless_YouTube_AI',
        'TikTok_AI_Video_Generator',
        'Instagram_Reel_Generator',
        'Podcast_to_Shorts_AI'
    ],
    'AI_AUTOMATION': [
        'AI_Agents_Framework',
        'AI_Workflow_Automation',
        'AI_Knowledge_Base'
    ],
    'KNOWLEDGE_MANAGEMENT': [
        'Obsidian_AI_Automation',
        'Second_Brain_AI',
        'AI_Note_Taker'
    ],
    'LOCAL_PRIVATE_AI': [
        'Local_AI_Assistant',
        'Local_LLM_Workflow',
        'Offline_AI_Assistant',
        'Private_AI_Chat',
        'Private_GPT_Alternative'
    ],
    'SETUP_HARDWARE': [
        'AI_Mini_PC_Setup'
    ]
}

# Documentation files to organize
DOC_FILES = {
    'RESEARCH': [
        'NOTEGPT_RESEARCH.md',
        'WHISPER_RESEARCH.md',
        'TRENDING_KEYWORDS_RESEARCH.md',
        'WHISPER_TRANSCRIBE_ANALYSIS.md'
    ],
    'IMPLEMENTATION': [
        'NOTEGPT_STYLE_IMPLEMENTATION.md',
        'NOTEGPT_IMPLEMENTATION_SUMMARY.md',
        'WHISPER_TRANSCRIBE_OPTIMIZATION_INSIGHTS.md'
    ],
    'DEPLOYMENT': [
        'WEB_DEPLOYMENT_GUIDE.md',
        'SEO_AEO_DEPLOYMENT_GUIDE.md',
        'DEPLOYMENT_CHECKLIST.md'
    ],
    'MEDIA': [
        'MEDIA_INDEXING_COMPLETE.md'
    ]
}


class Compiler:
    """Compile and organize expansion packs."""

    def __init__(self):
        self.source = SOURCE_DIR
        self.dest = DEST_DIR
        self.stats = {
            'packs_copied': 0,
            'code_files': 0,
            'docs_copied': 0,
            'errors': []
        }

    def create_structure(self):
        """Create directory structure."""
        print("📁 Creating directory structure...")

        # Create main directories
        dirs = [
            'PACKS/CONTENT_CREATION',
            'PACKS/AI_AUTOMATION',
            'PACKS/KNOWLEDGE_MANAGEMENT',
            'PACKS/LOCAL_PRIVATE_AI',
            'PACKS/SETUP_HARDWARE',
            'CODE/workflows/content_creation',
            'CODE/workflows/ai_automation',
            'CODE/workflows/knowledge_management',
            'CODE/workflows/local_private_ai',
            'CODE/workflows/setup_hardware',
            'CODE/integrations',
            'CODE/prompts/content_creation',
            'CODE/prompts/ai_automation',
            'CODE/prompts/knowledge_management',
            'CODE/prompts/local_private_ai',
            'CODE/prompts/setup_hardware',
            'CODE/utilities',
            'DOCUMENTATION/RESEARCH',
            'DOCUMENTATION/IMPLEMENTATION',
            'DOCUMENTATION/DEPLOYMENT',
            'DOCUMENTATION/MEDIA',
            'EXAMPLES',
            'RESOURCES/config_templates',
            'RESOURCES/data_samples'
        ]

        for dir_path in dirs:
            (self.dest / dir_path).mkdir(parents=True, exist_ok=True)

        print("✅ Directory structure created")

    def copy_packs(self):
        """Copy all packs to organized structure."""
        print("\n📦 Copying expansion packs...")

        pack_number = 1

        for category, packs in PACK_CATEGORIES.items():
            category_dir = self.dest / 'PACKS' / category

            for pack_name in packs:
                source_pack = self.source / pack_name
                if not source_pack.exists():
                    print(f"⚠️  Pack not found: {pack_name}")
                    continue

                # Create numbered pack directory
                numbered_name = f"{pack_number:02d}_{pack_name}"
                dest_pack = category_dir / numbered_name
                dest_pack.mkdir(exist_ok=True)

                # Copy entire pack
                try:
                    shutil.copytree(source_pack, dest_pack, dirs_exist_ok=True)
                    self.stats['packs_copied'] += 1
                    print(f"  ✅ {pack_number:02d}. {pack_name} → {category}")
                    pack_number += 1
                except Exception as e:
                    error_msg = f"Error copying {pack_name}: {e}"
                    self.stats['errors'].append(error_msg)
                    print(f"  ❌ {error_msg}")

    def consolidate_code(self):
        """Consolidate all code files."""
        print("\n💻 Consolidating code files...")

        category_map = {
            'CONTENT_CREATION': 'content_creation',
            'AI_AUTOMATION': 'ai_automation',
            'KNOWLEDGE_MANAGEMENT': 'knowledge_management',
            'LOCAL_PRIVATE_AI': 'local_private_ai',
            'SETUP_HARDWARE': 'setup_hardware'
        }

        for category, packs in PACK_CATEGORIES.items():
            code_category = category_map[category]

            for pack_name in packs:
                pack_dir = self.dest / 'PACKS' / category
                numbered_packs = [d for d in pack_dir.iterdir() if d.is_dir() and pack_name in d.name]

                if not numbered_packs:
                    continue

                pack_path = numbered_packs[0]

                # Copy workflow
                workflow_source = pack_path / 'workflows' / 'workflow.py'
                if workflow_source.exists():
                    workflow_dest = self.dest / 'CODE' / 'workflows' / code_category / f"{pack_name}_workflow.py"
                    shutil.copy2(workflow_source, workflow_dest)
                    self.stats['code_files'] += 1

                # Copy prompt
                prompt_source = pack_path / 'prompts' / 'aeo_prompt.txt'
                if prompt_source.exists():
                    prompt_dest = self.dest / 'CODE' / 'prompts' / code_category / f"{pack_name}_prompt.txt"
                    shutil.copy2(prompt_source, prompt_dest)
                    self.stats['code_files'] += 1

                # Copy integration files
                for file in pack_path.glob("*.py"):
                    if 'integration' in file.name.lower() or 'notegpt' in file.name.lower():
                        dest = self.dest / 'CODE' / 'integrations' / file.name
                        shutil.copy2(file, dest)
                        self.stats['code_files'] += 1

        print(f"✅ Consolidated {self.stats['code_files']} code files")

    def organize_documentation(self):
        """Organize documentation files."""
        print("\n📚 Organizing documentation...")

        for doc_category, files in DOC_FILES.items():
            dest_dir = self.dest / 'DOCUMENTATION' / doc_category

            for file_name in files:
                source_file = self.source / file_name
                if source_file.exists():
                    dest_file = dest_dir / file_name
                    shutil.copy2(source_file, dest_file)
                    self.stats['docs_copied'] += 1
                    print(f"  ✅ {file_name} → {doc_category}")

        # Copy MEDIA_INDEXING_SYSTEM
        media_source = self.source / 'MEDIA_INDEXING_SYSTEM'
        if media_source.exists():
            media_dest = self.dest / 'DOCUMENTATION' / 'MEDIA' / 'MEDIA_INDEXING_SYSTEM'
            shutil.copytree(media_source, media_dest, dirs_exist_ok=True)
            self.stats['docs_copied'] += 1
            print(f"  ✅ MEDIA_INDEXING_SYSTEM → MEDIA")

        # Copy SEO_CONTENT
        seo_source = self.source / 'SEO_CONTENT'
        if seo_source.exists():
            seo_dest = self.dest / 'SEO_CONTENT'
            shutil.copytree(seo_source, seo_dest, dirs_exist_ok=True)
            self.stats['docs_copied'] += 1
            print(f"  ✅ SEO_CONTENT → root")

        print(f"✅ Organized {self.stats['docs_copied']} documentation files")

    def create_master_index(self):
        """Create master index file."""
        print("\n📋 Creating master index...")

        index_content = self._generate_index_content()
        index_path = self.dest / '00_MASTER_INDEX.md'
        with open(index_path, 'w', encoding='utf-8') as f:
            f.write(index_content)

        print("✅ Master index created")

    def _generate_index_content(self) -> str:
        """Generate master index content."""
        content = []
        content.append("# Trend Pulse Expansion Packs - Master Index")
        content.append("")
        content.append(f"**Compiled:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        content.append(f"**Total Packs:** {sum(len(packs) for packs in PACK_CATEGORIES.values())}")
        content.append("")
        content.append("---")
        content.append("")
        content.append("## 📚 Quick Navigation")
        content.append("")
        content.append("- [Quick Start Guide](01_QUICK_START.md)")
        content.append("- [Installation Instructions](02_INSTALLATION.md)")
        content.append("- [Compilation Structure](COMPILATION_STRUCTURE.md)")
        content.append("")
        content.append("---")
        content.append("")

        pack_number = 1

        for category, packs in PACK_CATEGORIES.items():
            content.append(f"## {category.replace('_', ' ').title()}")
            content.append("")

            for pack_name in packs:
                numbered_name = f"{pack_number:02d}_{pack_name}"
                pack_path = f"PACKS/{category}/{numbered_name}"

                # Check if pack exists
                pack_dir = self.dest / pack_path
                status = "✅" if pack_dir.exists() else "⏳"

                content.append(f"### {pack_number}. {pack_name} {status}")
                content.append("")
                content.append(f"- **Path:** `{pack_path}/`")
                content.append(f"- **Workflow:** `CODE/workflows/{category.lower()}/{pack_name}_workflow.py`")
                content.append(f"- **Prompt:** `CODE/prompts/{category.lower()}/{pack_name}_prompt.txt`")
                content.append(f"- **README:** `{pack_path}/README.md`")
                content.append("")

                pack_number += 1

        content.append("---")
        content.append("")
        content.append("## 📁 Directory Structure")
        content.append("")
        content.append("```")
        content.append("Trend_Pulse_All_Expansion_Packs_COMPILED/")
        content.append("├── 00_MASTER_INDEX.md          # This file")
        content.append("├── 01_QUICK_START.md           # Quick start guide")
        content.append("├── 02_INSTALLATION.md          # Installation")
        content.append("├── PACKS/                       # All packs by category")
        content.append("├── CODE/                       # Consolidated code")
        content.append("├── DOCUMENTATION/               # All documentation")
        content.append("├── SEO_CONTENT/                # SEO articles")
        content.append("└── EXAMPLES/                    # Usage examples")
        content.append("```")
        content.append("")

        return "\n".join(content)

    def create_quick_start(self):
        """Create quick start guide."""
        print("\n🚀 Creating quick start guide...")

        content = """# Quick Start Guide

**Get started with Trend Pulse Expansion Packs in 5 minutes!**

---

## 🎯 Step 1: Choose a Pack

Browse the [Master Index](00_MASTER_INDEX.md) and select a pack that matches your needs.

**Popular Packs:**
- **AI_Content_Repurposing** - Repurpose any content
- **YouTube_Shorts_Automation** - Scale Shorts production
- **TikTok_AI_Video_Generator** - Create viral TikTok content
- **AI_Agents_Framework** - Build agentic AI systems

---

## 📦 Step 2: Navigate to Pack

```bash
cd PACKS/CONTENT_CREATION/01_AI_Content_Repurposing
```

---

## 💻 Step 3: Run Workflow

```python
from workflows.workflow import run

# Execute workflow
result = run('AI Video Generator')

# Access results
print(result)
```

---

## 🔄 Step 4: Batch Processing

```python
from workflows.workflow import process_trends_from_file

# Process multiple trends
results = process_trends_from_file('trends.csv', 'output.json')
```

---

## 📚 Next Steps

- Read pack-specific README
- Check [Installation Guide](02_INSTALLATION.md)
- Explore [Examples](EXAMPLES/)
- Review [Documentation](DOCUMENTATION/)

---

**Ready to automate? Pick a pack and start!** 🚀
"""

        quick_start_path = self.dest / '01_QUICK_START.md'
        with open(quick_start_path, 'w', encoding='utf-8') as f:
            f.write(content)

        print("✅ Quick start guide created")

    def create_installation_guide(self):
        """Create installation guide."""
        print("\n📥 Creating installation guide...")

        content = """# Installation Guide

**Set up Trend Pulse Expansion Packs**

---

## Prerequisites

1. **Python 3.8+**
   ```bash
   python --version
   ```

2. **trend-pulse-os** (parent directory)
   - Ensure `trend-pulse-os` is in parent directory
   - Or adjust import paths in workflows

---

## Installation Steps

### 1. Install Dependencies

```bash
cd ../trend-pulse-os
pip install -r requirements.txt
```

### 2. Verify Installation

```python
# Test import
import sys
sys.path.insert(0, '../trend-pulse-os')
from core.trend_parser import load_trends
print("✅ Installation successful!")
```

### 3. Run Test Workflow

```python
from PACKS.CONTENT_CREATION.01_AI_Content_Repurposing.workflows.workflow import run

result = run('test keyword')
print(result)
```

---

## Configuration

### Environment Variables

Create `~/.env` or use `~/.env.d/` directory:

```bash
# OpenAI API (if needed)
OPENAI_API_KEY=your_key_here

# Other API keys
OTHER_API_KEY=your_key_here
```

---

## Troubleshooting

### Import Errors

```python
# Add trend-pulse-os to path
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../../trend-pulse-os'))
```

### Missing Dependencies

```bash
pip install -r ../trend-pulse-os/requirements.txt
```

---

**Installation complete!** Check [Quick Start](01_QUICK_START.md) to begin.
"""

        install_path = self.dest / '02_INSTALLATION.md'
        with open(install_path, 'w', encoding='utf-8') as f:
            f.write(content)

        print("✅ Installation guide created")

    def generate_stats(self):
        """Generate compilation statistics."""
        print("\n📊 Compilation Statistics:")
        print(f"  ✅ Packs copied: {self.stats['packs_copied']}")
        print(f"  ✅ Code files: {self.stats['code_files']}")
        print(f"  ✅ Documentation files: {self.stats['docs_copied']}")
        if self.stats['errors']:
            print(f"  ⚠️  Errors: {len(self.stats['errors'])}")
            for error in self.stats['errors']:
                print(f"     - {error}")

    def run(self):
        """Run complete compilation."""
        print("="*60)
        print("🔨 COMPILING TREND PULSE EXPANSION PACKS")
        print("="*60)

        self.create_structure()
        self.copy_packs()
        self.consolidate_code()
        self.organize_documentation()
        self.create_master_index()
        self.create_quick_start()
        self.create_installation_guide()
        self.generate_stats()

        print("\n" + "="*60)
        print("✅ COMPILATION COMPLETE!")
        print("="*60)
        print(f"\n📁 Compiled version: {self.dest}")
        print("📋 Start with: 00_MASTER_INDEX.md")


if __name__ == "__main__":
    compiler = Compiler()
    compiler.run()
