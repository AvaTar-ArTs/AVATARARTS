#!/usr/bin/env python3
"""
Aggressive Alias Cleanup - Keep only scan-* aliases and essentials
"""

import os
import re
import json
from datetime import datetime

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
        return None
    
    report_path = os.path.join(REPORT_DIR, report_files[0])
    with open(report_path, 'r') as f:
        return json.load(f)

def extract_all_aliases():
    """Extract all aliases from .zshrc with line numbers."""
    aliases = {}
    
    if not os.path.exists(ZSHRC_PATH):
        return aliases
    
    with open(ZSHRC_PATH, 'r') as f:
        lines = f.readlines()
    
    for i, line in enumerate(lines, 1):
        stripped = line.strip()
        if stripped.startswith('alias '):
            match = re.match(r'alias\s+([^=]+)=(.+)', stripped)
            if match:
                alias_name = match.group(1).strip()
                alias_value = match.group(2).strip().strip("'\"")
                aliases[alias_name] = {
                    'line': i,
                    'value': alias_value,
                    'definition': stripped
                }
    
    return aliases

def get_aliases_to_keep():
    """Define which aliases to keep."""
    # Essential navigation
    keep = {
        '..', '...', '....', '.....',
        'c', 'h', 'path', 'now', 'nowdate',
    }
    
    # Most used from history
    keep.update({
        'pip', 'python3', 'cat', 'tree', 'base',
    })
    
    # All scan-* aliases (user specifically uses these)
    all_aliases = extract_all_aliases()
    for alias_name in all_aliases.keys():
        if alias_name.startswith('scan-'):
            keep.add(alias_name)
    
    # Used aliases from report
    report = load_usage_report()
    if report:
        used = report.get('used_aliases', {})
        for alias_name in used.keys():
            keep.add(alias_name)
    
    # Essential tool aliases that might be needed
    keep.update({
        'ls',  # Might be eza alias
        'envctl', 'env-collect', 'env-list',  # Used
        'd2m-ai', 'dir2md', 'd2m-fast',  # Used
        'pclean',  # Used
    })
    
    return keep

def create_aggressive_cleanup_script():
    """Create script to remove all aliases except keep list."""
    all_aliases = extract_all_aliases()
    keep_list = get_aliases_to_keep()
    
    # Find aliases to remove
    remove_list = []
    for alias_name, info in all_aliases.items():
        if alias_name not in keep_list:
            remove_list.append((info['line'], alias_name, info['definition'][:60]))
    
    # Sort descending for safe removal
    remove_list.sort(reverse=True, key=lambda x: x[0])
    
    if not remove_list:
        print("No aliases to remove!")
        return None
    
    script_path = os.path.join(REPORT_DIR, f"aggressive_alias_cleanup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.sh")
    
    with open(script_path, 'w') as f:
        f.write("#!/bin/bash\n")
        f.write("# Aggressive Alias Cleanup - Keep only scan-* and essentials\n")
        f.write(f"# Generated: {datetime.now().isoformat()}\n")
        f.write(f"# Will remove: {len(remove_list)} aliases\n")
        f.write(f"# Will keep: {len(keep_list)} aliases\n\n")
        
        f.write("ZSHRC_PATH=~/.zshrc\n")
        f.write("BACKUP_PATH=~/.zshrc.backup.$(date +%Y%m%d_%H%M%S)\n\n")
        
        f.write("echo '='*80\n")
        f.write("echo 'AGGRESSIVE ALIAS CLEANUP'\n")
        f.write("echo '='*80\n\n")
        
        f.write("echo 'Creating backup...'\n")
        f.write("cp \"$ZSHRC_PATH\" \"$BACKUP_PATH\"\n")
        f.write("echo \"✓ Backup: $BACKUP_PATH\"\n\n")
        
        f.write("echo 'Removing unused aliases (keeping scan-* and essentials)...'\n")
        f.write("echo ''\n")
        
        for line_num, alias_name, definition in remove_list:
            f.write(f"# {alias_name}: {definition}\n")
            f.write(f"sed -i '' '{line_num}d' \"$ZSHRC_PATH\"\n")
            f.write(f"echo \"  ✓ {alias_name}\"\n")
        
        f.write("\necho ''\n")
        f.write("echo '='*80\n")
        f.write(f"echo '✓ Removed {len(remove_list)} aliases'\n")
        f.write(f"echo '✓ Kept {len(keep_list)} aliases (including all scan-* aliases)'\n")
        f.write("echo '💡 Reload: source ~/.zshrc'\n")
        f.write("echo '='*80\n")
    
    os.chmod(script_path, 0o755)
    return script_path, remove_list, keep_list

if __name__ == "__main__":
    print("=" * 80)
    print("AGGRESSIVE ALIAS CLEANUP")
    print("=" * 80)
    print("\nThis will remove all aliases EXCEPT:")
    print("  • All scan-* aliases (you use these)")
    print("  • Essential navigation (.., ..., c, h, etc.)")
    print("  • Most-used commands (pip, python3, cat, etc.)")
    print("  • Actually used aliases from history\n")
    
    all_aliases = extract_all_aliases()
    keep_list = get_aliases_to_keep()
    
    print(f"📊 Analysis:")
    print(f"   Total aliases: {len(all_aliases)}")
    print(f"   Will keep: {len(keep_list)}")
    print(f"   Will remove: {len(all_aliases) - len(keep_list)}")
    
    # Show what will be kept
    scan_aliases = [a for a in keep_list if a.startswith('scan-')]
    print(f"\n   Scan aliases to keep: {len(scan_aliases)}")
    for alias in sorted(scan_aliases):
        print(f"     • {alias}")
    
    # Show other kept aliases
    other_kept = sorted([a for a in keep_list if not a.startswith('scan-')])
    print(f"\n   Other aliases to keep ({len(other_kept)}):")
    for alias in other_kept[:20]:
        print(f"     • {alias}")
    if len(other_kept) > 20:
        print(f"     ... and {len(other_kept) - 20} more")
    
    script_path, remove_list, keep_list = create_aggressive_cleanup_script()
    
    if script_path:
        print(f"\n{'='*80}")
        print("CLEANUP SCRIPT GENERATED")
        print(f"{'='*80}")
        print(f"\n✓ Script: {script_path}")
        print(f"✓ Will remove: {len(remove_list)} aliases")
        print(f"✓ Will keep: {len(keep_list)} aliases")
        print(f"\n💡 Preview: bash {script_path}")
        print(f"💡 Execute: bash {script_path}")
