#!/usr/bin/env python3
"""
Alias Usage Analyzer
Analyzes actual alias usage from shell history and usage logs, then compares with defined aliases.
"""

import os
import re
import subprocess
from collections import defaultdict, Counter
from datetime import datetime
from pathlib import Path

HOME = os.path.expanduser("~")
ZSHRC_PATH = os.path.join(HOME, ".zshrc")
USAGE_LOG = os.path.join(HOME, ".zsh_usage.csv")
ALIAS_LOG = os.path.join(HOME, ".zsh_alias_usage.log")
HISTORY_FILE = os.path.join(HOME, ".zsh_history")

def extract_aliases_from_zshrc():
    """Extract all aliases defined in .zshrc."""
    aliases = {}
    functions = {}
    
    if not os.path.exists(ZSHRC_PATH):
        return aliases, functions
    
    with open(ZSHRC_PATH, 'r') as f:
        lines = f.readlines()
    
    for i, line in enumerate(lines, 1):
        stripped = line.strip()
        
        # Extract aliases
        if stripped.startswith('alias '):
            match = re.match(r'alias\s+([^=]+)=(.+)', stripped)
            if match:
                alias_name = match.group(1).strip()
                alias_value = match.group(2).strip().strip("'\"")
                aliases[alias_name] = {
                    'line': i,
                    'value': alias_value,
                    'definition': stripped[:80]
                }
        
        # Extract functions
        if re.match(r'^[a-zA-Z_-]+\(\)\s*\{', stripped):
            match = re.match(r'^([a-zA-Z_-]+)\(\)', stripped)
            if match:
                func_name = match.group(1)
                # Get function body (next few lines)
                func_body = []
                for j in range(i, min(i+10, len(lines))):
                    func_body.append(lines[j].strip())
                functions[func_name] = {
                    'line': i,
                    'body': ' '.join(func_body[:3])
                }
    
    return aliases, functions

def analyze_usage_logs():
    """Analyze usage from tracking logs."""
    usage = Counter()
    
    # Check .zsh_usage.csv
    if os.path.exists(USAGE_LOG):
        with open(USAGE_LOG, 'r') as f:
            for line in f:
                line = line.strip()
                if ',' in line:
                    date, command = line.split(',', 1)
                    # Extract first word (command/alias)
                    cmd = command.split()[0] if command.split() else command
                    usage[cmd] += 1
    
    # Check .zsh_alias_usage.log
    if os.path.exists(ALIAS_LOG):
        with open(ALIAS_LOG, 'r') as f:
            for line in f:
                line = line.strip()
                if ',' in line:
                    date, alias = line.split(',', 1)
                    usage[alias] += 1
    
    return usage

def analyze_history():
    """Analyze shell history for alias usage."""
    usage = Counter()
    
    if not os.path.exists(HISTORY_FILE):
        return usage
    
    # Read history (last 10,000 lines to avoid being too slow)
    try:
        with open(HISTORY_FILE, 'r', encoding='utf-8', errors='ignore') as f:
            lines = f.readlines()
            # Take last 10,000 lines
            lines = lines[-10000:] if len(lines) > 10000 else lines
            
            for line in lines:
                # Remove timestamp if present (zsh history format: : timestamp:0;command)
                if line.startswith(':'):
                    parts = line.split(';', 1)
                    if len(parts) > 1:
                        line = parts[1]
                
                line = line.strip()
                if not line:
                    continue
                
                # Extract first word (command)
                first_word = line.split()[0] if line.split() else line
                # Remove any special characters
                first_word = re.sub(r'[^a-zA-Z0-9_-]', '', first_word)
                
                if first_word and len(first_word) > 1:
                    usage[first_word] += 1
    except Exception as e:
        print(f"Warning: Could not read history: {e}")
    
    return usage

def get_alias_usage_stats():
    """Get comprehensive usage statistics."""
    print("=" * 80)
    print("ALIAS USAGE ANALYSIS")
    print("=" * 80)
    
    # Extract defined aliases
    print("\n1. Extracting aliases from .zshrc...")
    aliases, functions = extract_aliases_from_zshrc()
    print(f"   Found {len(aliases)} aliases and {len(functions)} functions")
    
    # Analyze usage
    print("\n2. Analyzing usage logs...")
    log_usage = analyze_usage_logs()
    print(f"   Found {len(log_usage)} unique commands in logs")
    
    print("\n3. Analyzing shell history...")
    history_usage = analyze_history()
    print(f"   Found {len(history_usage)} unique commands in history")
    
    # Combine usage data
    combined_usage = Counter()
    combined_usage.update(log_usage)
    combined_usage.update(history_usage)
    
    # Categorize aliases
    used_aliases = {}
    unused_aliases = {}
    used_functions = {}
    unused_functions = {}
    
    # Check alias usage
    for alias_name, alias_info in aliases.items():
        usage_count = combined_usage.get(alias_name, 0)
        if usage_count > 0:
            used_aliases[alias_name] = {
                **alias_info,
                'usage_count': usage_count
            }
        else:
            unused_aliases[alias_name] = alias_info
    
    # Check function usage
    for func_name, func_info in functions.items():
        usage_count = combined_usage.get(func_name, 0)
        if usage_count > 0:
            used_functions[func_name] = {
                **func_info,
                'usage_count': usage_count
            }
        else:
            unused_functions[func_name] = func_info
    
    return {
        'aliases': aliases,
        'functions': functions,
        'used_aliases': used_aliases,
        'unused_aliases': unused_aliases,
        'used_functions': used_functions,
        'unused_functions': unused_functions,
        'usage_stats': combined_usage
    }

def generate_report(stats):
    """Generate comprehensive usage report."""
    print(f"\n{'='*80}")
    print("USAGE REPORT")
    print(f"{'='*80}")
    
    print(f"\n📊 Summary:")
    print(f"   Total aliases defined: {len(stats['aliases'])}")
    print(f"   Aliases used: {len(stats['used_aliases'])} ({len(stats['used_aliases'])*100//max(len(stats['aliases']),1)}%)")
    print(f"   Aliases unused: {len(stats['unused_aliases'])} ({len(stats['unused_aliases'])*100//max(len(stats['aliases']),1)}%)")
    print(f"   Total functions defined: {len(stats['functions'])}")
    print(f"   Functions used: {len(stats['used_functions'])} ({len(stats['used_functions'])*100//max(len(stats['functions']),1)}%)")
    print(f"   Functions unused: {len(stats['unused_functions'])} ({len(stats['unused_functions'])*100//max(len(stats['functions']),1)}%)")
    
    # Top used aliases
    if stats['used_aliases']:
        print(f"\n{'='*80}")
        print("TOP 20 MOST-USED ALIASES")
        print(f"{'='*80}")
        sorted_used = sorted(stats['used_aliases'].items(), 
                           key=lambda x: x[1]['usage_count'], reverse=True)
        for i, (alias, info) in enumerate(sorted_used[:20], 1):
            print(f"{i:2d}. {alias:20} {info['usage_count']:5d} uses  (line {info['line']})")
    
    # Unused aliases (candidates for removal)
    if stats['unused_aliases']:
        print(f"\n{'='*80}")
        print(f"UNUSED ALIASES ({len(stats['unused_aliases'])} candidates for removal)")
        print(f"{'='*80}")
        
        # Group by category
        categories = defaultdict(list)
        for alias, info in stats['unused_aliases'].items():
            if '-' in alias:
                category = alias.split('-')[0]
            elif '_' in alias:
                category = alias.split('_')[0]
            else:
                category = 'other'
            categories[category].append((alias, info))
        
        for category in sorted(categories.keys()):
            print(f"\n{category.upper()} ({len(categories[category])} unused):")
            for alias, info in sorted(categories[category])[:15]:
                print(f"   • {alias:25} line {info['line']:4d}  {info['definition'][:50]}")
            if len(categories[category]) > 15:
                print(f"   ... and {len(categories[category]) - 15} more")
    
    # Unused functions
    if stats['unused_functions']:
        print(f"\n{'='*80}")
        print(f"UNUSED FUNCTIONS ({len(stats['unused_functions'])} candidates for review)")
        print(f"{'='*80}")
        for func, info in sorted(stats['unused_functions'].items()):
            print(f"   • {func:25} line {info['line']:4d}")
    
    return stats

def generate_cleanup_script(stats, dry_run=True):
    """Generate a script to remove unused aliases."""
    script_path = f"/Users/steven/AVATARARTS/Revenue/cleanup_unused_aliases.sh"
    
    with open(script_path, 'w') as f:
        f.write("#!/bin/bash\n")
        f.write("# Auto-generated alias cleanup script\n")
        f.write(f"# Generated: {datetime.now().isoformat()}\n")
        f.write(f"# Mode: {'DRY RUN' if dry_run else 'EXECUTE'}\n\n")
        
        f.write("ZSHRC_PATH=~/.zshrc\n")
        f.write("BACKUP_PATH=~/.zshrc.backup.$(date +%Y%m%d_%H%M%S)\n\n")
        
        f.write("echo '='*80\n")
        f.write("echo 'ALIAS CLEANUP SCRIPT'\n")
        f.write("echo '='*80\n\n")
        
        if not dry_run:
            f.write("echo 'Creating backup...'\n")
            f.write("cp \"$ZSHRC_PATH\" \"$BACKUP_PATH\"\n")
            f.write("echo \"Backup saved to: $BACKUP_PATH\"\n\n")
        
        # Generate removal commands
        f.write("echo 'Removing unused aliases...'\n\n")
        
        for alias, info in sorted(stats['unused_aliases'].items()):
            line_num = info['line']
            if dry_run:
                f.write(f"echo '[DRY RUN] Would remove: {alias} (line {line_num})'\n")
            else:
                f.write(f"# Remove {alias} (line {line_num})\n")
                f.write(f"sed -i '' '{line_num}d' \"$ZSHRC_PATH\"\n")
        
        f.write("\necho 'Done!'\n")
        if dry_run:
            f.write("echo 'This was a dry run. Remove --dry-run to actually modify .zshrc'\n")
    
    os.chmod(script_path, 0o755)
    return script_path

if __name__ == "__main__":
    try:
        stats = get_alias_usage_stats()
        stats = generate_report(stats)
        
        # Generate cleanup script
        print(f"\n{'='*80}")
        print("GENERATING CLEANUP SCRIPTS")
        print(f"{'='*80}")
        
        dry_run_script = generate_cleanup_script(stats, dry_run=True)
        execute_script = generate_cleanup_script(stats, dry_run=False)
        
        print(f"\n✓ Generated cleanup scripts:")
        print(f"   Dry run: {dry_run_script}")
        print(f"   Execute: {execute_script}")
        print(f"\n💡 To preview changes, run: bash {dry_run_script}")
        print(f"💡 To apply changes, run: bash {execute_script}")
        
        # Save detailed report
        report_path = f"/Users/steven/AVATARARTS/Revenue/alias_usage_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        import json
        with open(report_path, 'w') as f:
            json.dump({
                'timestamp': datetime.now().isoformat(),
                'summary': {
                    'total_aliases': len(stats['aliases']),
                    'used_aliases': len(stats['used_aliases']),
                    'unused_aliases': len(stats['unused_aliases']),
                    'total_functions': len(stats['functions']),
                    'used_functions': len(stats['used_functions']),
                    'unused_functions': len(stats['unused_functions']),
                },
                'unused_aliases': {k: {'line': v['line'], 'definition': v['definition']} 
                                 for k, v in stats['unused_aliases'].items()},
                'unused_functions': {k: {'line': v['line']} 
                                   for k, v in stats['unused_functions'].items()},
                'top_used': {k: v['usage_count'] 
                           for k, v in sorted(stats['used_aliases'].items(), 
                                            key=lambda x: x[1]['usage_count'], 
                                            reverse=True)[:30]}
            }, f, indent=2)
        
        print(f"\n📄 Detailed report saved to: {report_path}")
        
    except Exception as e:
        print(f"\n\nError: {e}")
        import traceback
        traceback.print_exc()
