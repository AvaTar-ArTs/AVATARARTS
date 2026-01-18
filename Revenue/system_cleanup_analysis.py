#!/usr/bin/env python3
"""
System Directory Cleanup Analysis
Analyzes cache, config, and user directories to identify safe cleanup opportunities.
"""

import os
import json
from pathlib import Path
from datetime import datetime
from collections import defaultdict

# All directories to analyze
DIRECTORIES = [
    '/Users/steven/__pycache__',
    '/Users/steven/.aider',
    '/Users/steven/.apify',
    '/Users/steven/.aspnet',
    '/Users/steven/.boltai',
    '/Users/steven/.bun',
    '/Users/steven/.bundle',
    '/Users/steven/.cache',
    '/Users/steven/.cfg',
    '/Users/steven/.chatgpt',
    '/Users/steven/.claude',
    '/Users/steven/.claude-code-router',
    '/Users/steven/.claude-server-commander',
    '/Users/steven/.claude-worktrees',
    '/Users/steven/.codex',
    '/Users/steven/.composer',
    '/Users/steven/.conda',
    '/Users/steven/.config',
    '/Users/steven/.cups',
    '/Users/steven/.cursor',
    '/Users/steven/.dotfiles',
    '/Users/steven/.dotnet',
    '/Users/steven/.EasyOCR',
    '/Users/steven/.env.d',
    '/Users/steven/.fontconfig',
    '/Users/steven/.gem',
    '/Users/steven/.gemini',
    '/Users/steven/.github',
    '/Users/steven/.gnupg',
    '/Users/steven/.gradle',
    '/Users/steven/.grok',
    '/Users/steven/.harbor',
    '/Users/steven/.history',
    '/Users/steven/.hyper_plugins',
    '/Users/steven/.idlerc',
    '/Users/steven/.ipython',
    '/Users/steven/.iterm2',
    '/Users/steven/.jupyter',
    '/Users/steven/.keras',
    '/Users/steven/.lh',
    '/Users/steven/.local',
    '/Users/steven/.lpass',
    '/Users/steven/.m2',
    '/Users/steven/.matplotlib',
    '/Users/steven/.mplayer',
    '/Users/steven/.n8n',
    '/Users/steven/.npm',
    '/Users/steven/.nuget',
    '/Users/steven/.nvm',
    '/Users/steven/.oh-my-zsh',
    '/Users/steven/.oracle_jre_usage',
    '/Users/steven/.package_manager_backup_20251106_070741',
    '/Users/steven/.pdf-filler-profiles',
    '/Users/steven/.pixi',
    '/Users/steven/.postman',
    '/Users/steven/.putty',
    '/Users/steven/.qodo',
    '/Users/steven/.quicklook_plugins_backup',
    '/Users/steven/.qwen',
    '/Users/steven/.raycast',
    '/Users/steven/.raycast/scripts',
    '/Users/steven/.raycast/scripts/model-picker.applescript',
    '/Users/steven/.rustup',
    '/Users/steven/.sdkman',
    '/Users/steven/.ssh',
    '/Users/steven/.terraform',
    '/Users/steven/.thunderbird',
    '/Users/steven/.tool-versions',
    '/Users/steven/.vscode',
    '/Users/steven/.wrangler',
    '/Users/steven/.yarn',
    '/Users/steven/.zsh',
    '/Users/steven/.zsh_history',
    '/Users/steven/Library',
    '/Users/steven/maigret',
    '/Users/steven/Miniforge_Mamba_Analysis',
    '/Users/steven/Movies',
    '/Users/steven/Music',
    '/Users/steven/orchestrator',
    '/Users/steven/Pictures',
    '/Users/steven/PSD-EXT',
    '/Users/steven/Public',
    '/Users/steven/pydocs',
    '/Users/steven/pythons',
    '/Users/steven/Raycast',
    '/Users/steven/RightFont',
    '/Users/steven/scripts',
    '/Users/steven/userscripts',
    '/Users/steven/Zotero',
    '/Users/steven/zsh-autocomplete',
    '/Users/steven/zsh-completions',
    '/Users/steven/iCloud',
]

# Categories for different types of directories
CATEGORIES = {
    'cache': [
        '__pycache__', '.cache', '.npm', '.gradle', '.m2', '.composer',
        '.gem', '.bundle', '.conda', '.nuget', '.yarn', '.bun',
        '.ipython', '.jupyter', '.matplotlib', '.keras', '.mplayer',
        '.oracle_jre_usage', '.package_manager_backup_', '.quicklook_plugins_backup',
        '.EasyOCR', '.fontconfig', '.idlerc', '.cups', '.local/share',
    ],
    'config': [
        '.config', '.cursor', '.vscode', '.iterm2', '.oh-my-zsh',
        '.zsh', '.dotfiles', '.ssh', '.gnupg', '.postman', '.putty',
        '.nvm', '.rustup', '.sdkman', '.terraform', '.n8n', '.qwen',
        '.claude', '.chatgpt', '.codex', '.gemini', '.grok', '.boltai',
        '.aider', '.apify', '.claude-code-router', '.claude-server-commander',
        '.claude-worktrees', '.qodo', '.raycast', '.dotnet', '.aspnet',
        '.pixi', '.wrangler', '.env.d', '.cfg', '.tool-versions',
        '.thunderbird', '.lpass', '.harbor', '.lh', '.pdf-filler-profiles',
    ],
    'user_data': [
        'Library', 'Movies', 'Music', 'Pictures', 'Public', 'iCloud',
    ],
    'development': [
        'pythons', 'pydocs', 'scripts', 'userscripts', 'maigret',
        'orchestrator', 'Miniforge_Mamba_Analysis', 'PSD-EXT',
        'RightFont', 'Raycast', 'Zotero', 'zsh-autocomplete',
        'zsh-completions', '.github', '.history',
    ],
    'backup': [
        '.package_manager_backup_', '.quicklook_plugins_backup',
    ],
}

def get_directory_size(directory):
    """Get total size and file count of directory."""
    total_size = 0
    file_count = 0
    dir_count = 0
    
    if not os.path.exists(directory):
        return 0, 0, 0
    
    try:
        for root, dirs, files in os.walk(directory):
            # Skip hidden files in count but include in size
            for filename in files:
                filepath = os.path.join(root, filename)
                try:
                    total_size += os.path.getsize(filepath)
                    file_count += 1
                except (OSError, PermissionError):
                    pass
            
            dir_count += len([d for d in dirs if not d.startswith('.')])
    except (OSError, PermissionError) as e:
        pass
    
    return total_size, file_count, dir_count

def categorize_directory(directory):
    """Categorize a directory based on its name and contents."""
    name = os.path.basename(directory)
    
    for category, patterns in CATEGORIES.items():
        for pattern in patterns:
            if pattern in name or pattern in directory:
                return category
    
    # Default categorization
    if name.startswith('.'):
        if 'cache' in name.lower() or 'tmp' in name.lower():
            return 'cache'
        return 'config'
    
    return 'unknown'

def analyze_directories():
    """Analyze all directories and create cleanup plan."""
    print("=" * 80)
    print("SYSTEM DIRECTORY CLEANUP ANALYSIS")
    print("=" * 80)
    
    analysis = {
        'timestamp': datetime.now().isoformat(),
        'directories': {},
        'categories': defaultdict(list),
        'safe_to_clean': [],
        'keep': [],
        'summary': {}
    }
    
    total_size = 0
    total_files = 0
    
    print("\nAnalyzing directories...\n")
    
    for directory in DIRECTORIES:
        if not os.path.exists(directory):
            continue
        
        size, files, dirs = get_directory_size(directory)
        category = categorize_directory(directory)
        
        size_mb = round(size / (1024 * 1024), 2)
        
        dir_info = {
            'path': directory,
            'size_bytes': size,
            'size_mb': size_mb,
            'file_count': files,
            'dir_count': dirs,
            'category': category
        }
        
        analysis['directories'][directory] = dir_info
        analysis['categories'][category].append(dir_info)
        
        total_size += size
        total_files += files
        
        # Determine if safe to clean
        if category == 'cache' or 'backup' in category or '__pycache__' in directory:
            if size > 0:  # Only add if it has content
                analysis['safe_to_clean'].append(dir_info)
        elif category in ['user_data', 'config']:
            analysis['keep'].append(dir_info)
        
        print(f"{'✓' if size > 0 else '⊘'} {directory[:60]:60} {size_mb:8.2f} MB ({files:5d} files) [{category}]")
    
    analysis['summary'] = {
        'total_directories': len(analysis['directories']),
        'total_size_mb': round(total_size / (1024 * 1024), 2),
        'total_files': total_files,
        'safe_to_clean_count': len(analysis['safe_to_clean']),
        'safe_to_clean_size_mb': round(sum(d['size_bytes'] for d in analysis['safe_to_clean']) / (1024 * 1024), 2),
    }
    
    # Sort by size
    analysis['safe_to_clean'].sort(key=lambda x: x['size_bytes'], reverse=True)
    analysis['keep'].sort(key=lambda x: x['size_bytes'], reverse=True)
    
    print(f"\n{'='*80}")
    print("SUMMARY")
    print(f"{'='*80}")
    print(f"Total directories analyzed: {analysis['summary']['total_directories']}")
    print(f"Total size: {analysis['summary']['total_size_mb']:.2f} MB")
    print(f"Total files: {analysis['summary']['total_files']:,}")
    print(f"\nSafe to clean:")
    print(f"  - Directories: {analysis['summary']['safe_to_clean_count']}")
    print(f"  - Size: {analysis['summary']['safe_to_clean_size_mb']:.2f} MB")
    
    # Save analysis
    output_file = f"/Users/steven/AVATARARTS/Revenue/system_cleanup_analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(output_file, 'w') as f:
        json.dump(analysis, f, indent=2)
    
    print(f"\nAnalysis saved to: {output_file}")
    
    return analysis, output_file

if __name__ == "__main__":
    try:
        analysis, output_file = analyze_directories()
        
        print("\n" + "="*80)
        print("TOP 20 LARGEST CACHE/BACKUP DIRECTORIES (Safe to Clean)")
        print("="*80)
        for i, dir_info in enumerate(analysis['safe_to_clean'][:20], 1):
            print(f"{i:2d}. {dir_info['path'][:65]:65} {dir_info['size_mb']:8.2f} MB ({dir_info['file_count']:5d} files)")
        
    except KeyboardInterrupt:
        print("\n\nAnalysis cancelled by user.")
        import sys
        sys.exit(1)
    except Exception as e:
        print(f"\n\nError: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        import sys
        sys.exit(1)
