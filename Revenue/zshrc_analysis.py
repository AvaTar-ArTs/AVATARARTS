#!/usr/bin/env python3
"""
.zshrc Analysis Script
Analyzes .zshrc for issues, optimizations, security concerns, and best practices.
"""

import os
import re
from pathlib import Path
from collections import defaultdict

ZSHRC_PATH = os.path.expanduser("~/.zshrc")

def analyze_zshrc():
    """Comprehensive analysis of .zshrc file."""
    print("=" * 80)
    print(".ZSHRC ANALYSIS")
    print("=" * 80)
    
    if not os.path.exists(ZSHRC_PATH):
        print(f"Error: {ZSHRC_PATH} not found")
        return
    
    with open(ZSHRC_PATH, 'r') as f:
        lines = f.readlines()
    
    total_lines = len(lines)
    
    issues = {
        'security': [],
        'performance': [],
        'redundancy': [],
        'best_practices': [],
        'optimization': []
    }
    
    # Track patterns
    aliases = []
    functions = []
    exports = []
    sources = []
    path_additions = []
    duplicate_checks = defaultdict(list)
    
    print(f"\n📊 Basic Stats:")
    print(f"   Total lines: {total_lines}")
    print(f"   File size: {os.path.getsize(ZSHRC_PATH) / 1024:.2f} KB")
    
    # Analyze line by line
    for i, line in enumerate(lines, 1):
        stripped = line.strip()
        
        # Skip empty lines and comments
        if not stripped or stripped.startswith('#'):
            continue
        
        # Track aliases
        if stripped.startswith('alias '):
            match = re.match(r'alias\s+([^=]+)=', stripped)
            if match:
                alias_name = match.group(1).strip()
                aliases.append((i, alias_name))
                duplicate_checks[f'alias_{alias_name}'].append(i)
        
        # Track functions
        if re.match(r'^[a-zA-Z_-]+\(\)\s*\{', stripped):
            match = re.match(r'^([a-zA-Z_-]+)\(\)', stripped)
            if match:
                func_name = match.group(1)
                functions.append((i, func_name))
                duplicate_checks[f'func_{func_name}'].append(i)
        
        # Track exports
        if stripped.startswith('export '):
            match = re.match(r'export\s+([A-Z_]+)=', stripped)
            if match:
                var_name = match.group(1)
                exports.append((i, var_name))
                duplicate_checks[f'export_{var_name}'].append(i)
        
        # Track source commands
        if stripped.startswith('source ') or stripped.startswith('. '):
            match = re.search(r'(source|\.)\s+([^\s]+)', stripped)
            if match:
                source_file = match.group(2)
                sources.append((i, source_file))
        
        # Track PATH additions
        if 'PATH=' in stripped or 'path=(' in stripped:
            path_additions.append((i, stripped[:80]))
        
        # Security checks
        if 'API_KEY' in stripped or 'SECRET' in stripped or 'TOKEN' in stripped:
            if not any(x in stripped for x in ['export', 'unset', 'unset -f']):
                issues['security'].append(f"Line {i}: Potential secret in plain text: {stripped[:60]}")
        
        # Performance checks
        if 'os.walk' in stripped or 'find ' in stripped:
            if 'preexec' not in stripped and 'chpwd' not in stripped:
                issues['performance'].append(f"Line {i}: Potential slow operation in startup: {stripped[:60]}")
        
        # Redundancy checks
        if stripped.count('source') > 1:
            issues['redundancy'].append(f"Line {i}: Multiple source commands: {stripped[:60]}")
    
    # Find duplicates
    for key, line_nums in duplicate_checks.items():
        if len(line_nums) > 1:
            issues['redundancy'].append(f"Duplicate {key}: lines {', '.join(map(str, line_nums))}")
    
    # Best practices
    if total_lines > 2000:
        issues['best_practices'].append(f"File is very large ({total_lines} lines). Consider splitting into modules.")
    
    # Check for common issues
    has_compinit_optimization = any('compinit' in line and 'mh+24' in line for line in lines)
    if not has_compinit_optimization:
        issues['optimization'].append("Consider optimizing compinit with daily check (mh+24)")
    
    # Report findings
    print(f"\n📝 Found:")
    print(f"   Aliases: {len(aliases)}")
    print(f"   Functions: {len(functions)}")
    print(f"   Exports: {len(exports)}")
    print(f"   Source commands: {len(sources)}")
    print(f"   PATH modifications: {len(path_additions)}")
    
    # Report issues
    total_issues = sum(len(v) for v in issues.values())
    
    if total_issues == 0:
        print(f"\n✅ No issues found! Your .zshrc looks good.")
    else:
        print(f"\n⚠️  Found {total_issues} potential issues:")
        
        if issues['security']:
            print(f"\n🔒 Security ({len(issues['security'])}):")
            for issue in issues['security'][:10]:
                print(f"   {issue}")
        
        if issues['performance']:
            print(f"\n⚡ Performance ({len(issues['performance'])}):")
            for issue in issues['performance'][:10]:
                print(f"   {issue}")
        
        if issues['redundancy']:
            print(f"\n🔄 Redundancy ({len(issues['redundancy'])}):")
            for issue in issues['redundancy'][:15]:
                print(f"   {issue}")
        
        if issues['best_practices']:
            print(f"\n📚 Best Practices ({len(issues['best_practices'])}):")
            for issue in issues['best_practices']:
                print(f"   {issue}")
        
        if issues['optimization']:
            print(f"\n🎯 Optimization ({len(issues['optimization'])}):")
            for issue in issues['optimization']:
                print(f"   {issue}")
    
    # Show top aliases and functions
    print(f"\n{'='*80}")
    print("TOP ALIASES AND FUNCTIONS")
    print(f"{'='*80}")
    
    if aliases:
        print(f"\nMost common alias prefixes:")
        prefix_counts = defaultdict(int)
        for _, alias_name in aliases:
            prefix = alias_name.split('-')[0] if '-' in alias_name else alias_name.split('_')[0]
            prefix_counts[prefix] += 1
        
        for prefix, count in sorted(prefix_counts.items(), key=lambda x: x[1], reverse=True)[:10]:
            print(f"   {prefix}: {count} aliases")
    
    if functions:
        print(f"\nFunctions defined:")
        for line_num, func_name in functions[:20]:
            print(f"   Line {line_num}: {func_name}()")
    
    return issues

if __name__ == "__main__":
    try:
        issues = analyze_zshrc()
    except Exception as e:
        print(f"\n\nError: {e}")
        import traceback
        traceback.print_exc()
