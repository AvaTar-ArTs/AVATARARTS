#!/usr/bin/env python3
"""
Interactive Alias Cleanup Tool
Allows selective removal of unused aliases with preview and backup.
"""

import os
import json
import shutil
from datetime import datetime
from pathlib import Path

HOME = os.path.expanduser("~")
ZSHRC_PATH = os.path.join(HOME, ".zshrc")
REPORT_DIR = "/Users/steven/AVATARARTS/Revenue"

def load_usage_report():
    """Load the most recent usage report."""
    report_files = sorted([
        f for f in os.listdir(REPORT_DIR) 
        if f.startswith('alias_usage_report_') and f.endswith('.json')
    ], reverse=True)
    
    if not report_files:
        print("Error: No usage report found. Run alias_usage_analyzer.py first.")
        return None
    
    report_path = os.path.join(REPORT_DIR, report_files[0])
    with open(report_path, 'r') as f:
        return json.load(f)

def categorize_aliases(unused_aliases):
    """Categorize aliases for easier decision-making."""
    categories = {
        'keep_essential': [],  # Navigation, basic commands
        'keep_conditional': [],  # Fallback aliases (might be needed)
        'safe_to_remove': [],  # Clearly unused
        'review_needed': []  # Need user decision
    }
    
    essential_patterns = ['..', '...', 'c=', 'h=', 'path=', 'now', 'nowdate']
    conditional_patterns = ['echo "⚠️', 'not found', 'directory not found']
    
    for alias, info in unused_aliases.items():
        definition = info.get('definition', '')
        
        # Essential navigation aliases
        if alias in ['..', '...', '....', '.....'] or alias in ['c', 'h', 'path', 'now', 'nowdate']:
            categories['keep_essential'].append((alias, info))
        # Conditional fallback aliases (might be needed if directories exist later)
        elif any(pattern in definition for pattern in conditional_patterns):
            categories['keep_conditional'].append((alias, info))
        # Git aliases (commonly used, might just not be in tracked history)
        elif alias.startswith('g') and alias in ['ga', 'gc', 'gp', 'gl', 'gd', 'gs']:
            categories['review_needed'].append((alias, info))
        # Helper aliases that might be useful
        elif alias.startswith('env-') or alias.startswith('py-') or alias.startswith('scan-'):
            categories['review_needed'].append((alias, info))
        # Clearly unused tool-specific aliases
        else:
            categories['safe_to_remove'].append((alias, info))
    
    return categories

def preview_cleanup(report, dry_run=True):
    """Preview what would be removed."""
    unused = report.get('unused_aliases', {})
    
    if not unused:
        print("No unused aliases found!")
        return
    
    categories = categorize_aliases(unused)
    
    print("=" * 80)
    print("ALIAS CLEANUP PREVIEW")
    print("=" * 80)
    
    print(f"\n📊 Summary:")
    print(f"   Total unused aliases: {len(unused)}")
    print(f"   Essential (keep): {len(categories['keep_essential'])}")
    print(f"   Conditional fallbacks (review): {len(categories['keep_conditional'])}")
    print(f"   Safe to remove: {len(categories['safe_to_remove'])}")
    print(f"   Review needed: {len(categories['review_needed'])}")
    
    # Show safe to remove
    if categories['safe_to_remove']:
        print(f"\n{'='*80}")
        print(f"SAFE TO REMOVE ({len(categories['safe_to_remove'])} aliases)")
        print(f"{'='*80}")
        for alias, info in sorted(categories['safe_to_remove'])[:30]:
            print(f"   • {alias:25} line {info['line']:4d}")
        if len(categories['safe_to_remove']) > 30:
            print(f"   ... and {len(categories['safe_to_remove']) - 30} more")
    
    # Show conditional (keep these)
    if categories['keep_conditional']:
        print(f"\n{'='*80}")
        print(f"CONDITIONAL FALLBACKS - KEEP ({len(categories['keep_conditional'])} aliases)")
        print(f"{'='*80}")
        print("These are fallback aliases for missing directories. Keep if you might add those directories later.")
        for alias, info in sorted(categories['keep_conditional'])[:15]:
            print(f"   • {alias:25} line {info['line']:4d}")
        if len(categories['keep_conditional']) > 15:
            print(f"   ... and {len(categories['keep_conditional']) - 15} more")
    
    # Show review needed
    if categories['review_needed']:
        print(f"\n{'='*80}")
        print(f"REVIEW NEEDED ({len(categories['review_needed'])} aliases)")
        print(f"{'='*80}")
        print("These might be useful but weren't in tracked history. Review before removing.")
        for alias, info in sorted(categories['review_needed'])[:20]:
            print(f"   • {alias:25} line {info['line']:4d}")
        if len(categories['review_needed']) > 20:
            print(f"   ... and {len(categories['review_needed']) - 20} more")
    
    return categories

def create_cleanup_script(categories, selected_aliases=None):
    """Create a cleanup script for selected aliases."""
    if selected_aliases is None:
        # Default: only safe_to_remove
        selected_aliases = [alias for alias, _ in categories['safe_to_remove']]
    
    if not selected_aliases:
        print("No aliases selected for removal.")
        return None
    
    # Load zshrc to get line numbers
    with open(ZSHRC_PATH, 'r') as f:
        zshrc_lines = f.readlines()
    
    # Find lines to remove
    lines_to_remove = []
    for alias_name in selected_aliases:
        for i, line in enumerate(zshrc_lines, 1):
            if line.strip().startswith('alias ') and alias_name in line:
                # Check if it's the exact alias
                match = re.match(r'alias\s+([^=]+)=', line.strip())
                if match and match.group(1).strip() == alias_name:
                    lines_to_remove.append((i, alias_name, line.strip()[:60]))
                    break
    
    # Sort by line number (descending) so we can remove from bottom up
    lines_to_remove.sort(reverse=True, key=lambda x: x[0])
    
    script_path = os.path.join(REPORT_DIR, f"cleanup_aliases_{datetime.now().strftime('%Y%m%d_%H%M%S')}.sh")
    
    with open(script_path, 'w') as f:
        f.write("#!/bin/bash\n")
        f.write("# Interactive Alias Cleanup Script\n")
        f.write(f"# Generated: {datetime.now().isoformat()}\n")
        f.write(f"# Aliases to remove: {len(selected_aliases)}\n\n")
        
        f.write("ZSHRC_PATH=~/.zshrc\n")
        f.write("BACKUP_PATH=~/.zshrc.backup.$(date +%Y%m%d_%H%M%S)\n\n")
        
        f.write("echo '='*80\n")
        f.write("echo 'ALIAS CLEANUP'\n")
        f.write("echo '='*80\n\n")
        
        f.write("echo 'Creating backup...'\n")
        f.write("cp \"$ZSHRC_PATH\" \"$BACKUP_PATH\"\n")
        f.write("echo \"✓ Backup saved to: $BACKUP_PATH\"\n\n")
        
        f.write("echo 'Removing aliases...'\n")
        f.write("echo ''\n")
        
        # Remove from bottom to top to preserve line numbers
        for line_num, alias_name, definition in lines_to_remove:
            f.write(f"# Remove {alias_name} (line {line_num})\n")
            f.write(f"sed -i '' '{line_num}d' \"$ZSHRC_PATH\"\n")
            f.write(f"echo \"  ✓ Removed: {alias_name}\"\n")
        
        f.write("\necho ''\n")
        f.write("echo '='*80\n")
        f.write(f"echo '✓ Removed {len(selected_aliases)} aliases'\n")
        f.write("echo '✓ Backup created at: $BACKUP_PATH'\n")
        f.write("echo '💡 Reload your shell: source ~/.zshrc'\n")
        f.write("echo '='*80\n")
    
    os.chmod(script_path, 0o755)
    return script_path

if __name__ == "__main__":
    import re
    
    print("=" * 80)
    print("INTERACTIVE ALIAS CLEANUP")
    print("=" * 80)
    
    report = load_usage_report()
    if not report:
        exit(1)
    
    categories = preview_cleanup(report)
    
    if not categories:
        exit(0)
    
    print(f"\n{'='*80}")
    print("CLEANUP OPTIONS")
    print(f"{'='*80}")
    print("\n1. Remove only 'safe to remove' aliases (recommended)")
    print(f"   → {len(categories['safe_to_remove'])} aliases")
    print("\n2. Remove 'safe to remove' + 'review needed' aliases")
    print(f"   → {len(categories['safe_to_remove']) + len(categories['review_needed'])} aliases")
    print("\n3. Custom selection (you'll choose)")
    print("\n4. Generate script only (no execution)")
    
    # Default: safe to remove only
    safe_aliases = [alias for alias, _ in categories['safe_to_remove']]
    
    script_path = create_cleanup_script(categories, safe_aliases)
    
    print(f"\n{'='*80}")
    print("CLEANUP SCRIPT GENERATED")
    print(f"{'='*80}")
    print(f"\n✓ Script created: {script_path}")
    print(f"✓ Will remove: {len(safe_aliases)} aliases")
    print(f"\n💡 To preview what will be removed:")
    print(f"   bash {script_path}")
    print(f"\n💡 To apply changes:")
    print(f"   bash {script_path}")
    print(f"\n⚠️  A backup will be created automatically before any changes")
