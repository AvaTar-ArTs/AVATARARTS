#!/usr/bin/env python3
"""
Conservative Alias Cleanup
More careful approach - only removes clearly unused aliases, preserves potentially useful ones.
"""

import os
import json
from datetime import datetime

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

def conservative_cleanup_list(report):
    """Create a conservative list of aliases to remove."""
    unused = report.get('unused_aliases', {})
    
    # Aliases to KEEP (even if unused)
    keep_list = {
        # Navigation essentials
        '..', '...', '....', '.....',
        # Basic utilities
        'c', 'h', 'path', 'now', 'nowdate',
        # Git shortcuts (commonly used, might not be tracked)
        'gs', 'ga', 'gc', 'gp', 'gl', 'gd',
        # Python version aliases (needed for specific tools)
        'python3.11', 'python3.12', 'pip3.11', 'pip3.12', 'pip3',
        # ls aliases (eza fallbacks, commonly used)
        'll', 'la', 'l', 'lt',
        # Essential tools
        'z',  # zoxide fallback
        'bcat',  # bat fallback
        # Project setup (might be used)
        'psetup', 'preq', 'pinit', 'pclean',
    }
    
    # Aliases to REMOVE (clearly unused tool-specific)
    remove_list = []
    
    for alias, info in unused.items():
        definition = info.get('definition', '')
        
        # Skip if in keep list
        if alias in keep_list:
            continue
        
        # Remove tool-specific help/version aliases
        if any(x in alias for x in ['-help', '-version', '-config', '-edit', '-test']):
            if alias.startswith(('grok-', 'qwen-', 'ca-')):
                remove_list.append(alias)
        
        # Remove unused tool wrappers
        if alias in ['ask-grok', 'ask-ollama', 'd2m', 'd2m-security']:
            remove_list.append(alias)
        
        # Remove legacy aliases (duplicates of newer versions)
        if alias in ['cdai', 'cdinsta', 'cdyt', 'cdpy', 'pyai', 'pyanalyze', 
                     'pyverify', 'pyformat', 'pyflake', 'venv-setup']:
            remove_list.append(alias)
    
    return remove_list

def create_conservative_script(aliases_to_remove):
    """Create a conservative cleanup script."""
    if not aliases_to_remove:
        print("No aliases selected for conservative removal.")
        return None
    
    zshrc_path = os.path.expanduser("~/.zshrc")
    
    # Read zshrc to find exact line numbers
    with open(zshrc_path, 'r') as f:
        lines = f.readlines()
    
    # Find lines to remove
    lines_to_remove = []
    for alias_name in aliases_to_remove:
        for i, line in enumerate(lines, 1):
            stripped = line.strip()
            if stripped.startswith('alias '):
                import re
                match = re.match(r'alias\s+([^=]+)=', stripped)
                if match and match.group(1).strip() == alias_name:
                    lines_to_remove.append((i, alias_name, stripped[:60]))
                    break
    
    # Sort descending for safe removal
    lines_to_remove.sort(reverse=True, key=lambda x: x[0])
    
    script_path = os.path.join(REPORT_DIR, f"conservative_alias_cleanup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.sh")
    
    with open(script_path, 'w') as f:
        f.write("#!/bin/bash\n")
        f.write("# Conservative Alias Cleanup Script\n")
        f.write(f"# Generated: {datetime.now().isoformat()}\n")
        f.write(f"# Will remove: {len(aliases_to_remove)} aliases\n\n")
        
        f.write("ZSHRC_PATH=~/.zshrc\n")
        f.write("BACKUP_PATH=~/.zshrc.backup.$(date +%Y%m%d_%H%M%S)\n\n")
        
        f.write("echo '='*80\n")
        f.write("echo 'CONSERVATIVE ALIAS CLEANUP'\n")
        f.write("echo '='*80\n\n")
        
        f.write("echo 'Creating backup...'\n")
        f.write("cp \"$ZSHRC_PATH\" \"$BACKUP_PATH\"\n")
        f.write("echo \"✓ Backup: $BACKUP_PATH\"\n\n")
        
        f.write("echo 'Removing unused tool-specific aliases...'\n")
        f.write("echo ''\n")
        
        for line_num, alias_name, definition in lines_to_remove:
            f.write(f"# {alias_name}: {definition}\n")
            f.write(f"sed -i '' '{line_num}d' \"$ZSHRC_PATH\"\n")
            f.write(f"echo \"  ✓ {alias_name}\"\n")
        
        f.write("\necho ''\n")
        f.write("echo '='*80\n")
        f.write(f"echo '✓ Removed {len(aliases_to_remove)} aliases'\n")
        f.write("echo '💡 Reload: source ~/.zshrc'\n")
        f.write("echo '='*80\n")
    
    os.chmod(script_path, 0o755)
    return script_path

if __name__ == "__main__":
    report = load_usage_report()
    if not report:
        print("Error: No usage report found")
        exit(1)
    
    print("=" * 80)
    print("CONSERVATIVE ALIAS CLEANUP")
    print("=" * 80)
    print("\nThis will only remove clearly unused tool-specific aliases.")
    print("Essential aliases (git, navigation, Python versions) will be preserved.\n")
    
    remove_list = conservative_cleanup_list(report)
    
    print(f"📊 Analysis:")
    print(f"   Total unused aliases: {len(report.get('unused_aliases', {}))}")
    print(f"   Safe to remove (conservative): {len(remove_list)}")
    print(f"   Will preserve: {len(report.get('unused_aliases', {})) - len(remove_list)}")
    
    if remove_list:
        print(f"\n{'='*80}")
        print("ALIASES TO REMOVE (Conservative List)")
        print(f"{'='*80}")
        for alias in sorted(remove_list):
            print(f"   • {alias}")
        
        script_path = create_conservative_script(remove_list)
        
        print(f"\n{'='*80}")
        print("CLEANUP SCRIPT GENERATED")
        print(f"{'='*80}")
        print(f"\n✓ Script: {script_path}")
        print(f"✓ Will remove: {len(remove_list)} aliases")
        print(f"\n💡 Preview: bash {script_path}")
        print(f"💡 Execute: bash {script_path}")
    else:
        print("\n✅ No aliases selected for conservative removal.")
        print("   All unused aliases are either essential or need review.")
