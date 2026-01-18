#!/usr/bin/env python3
"""
Complete merge script: Analyze and merge /Users/steven/ai-sites into /Users/steven/AVATARARTS
"""
from pathlib import Path
import shutil
from datetime import datetime
from collections import defaultdict
import csv
import sys

ai_sites = Path("/Users/steven/ai-sites")
avatararts = Path("/Users/steven/AVATARARTS")
target = avatararts / "04_WEBSITES" / "ai-sites"

def analyze_source():
    """Analyze the source directory"""
    print("=" * 70)
    print("STEP 1: ANALYZING AI-SITES")
    print("=" * 70)
    
    if not ai_sites.exists():
        print(f"❌ Source directory not found: {ai_sites}")
        return None
    
    files_data = []
    dir_structure = defaultdict(lambda: {'files': 0, 'size': 0, 'items': []})
    total_size = 0
    total_files = 0
    
    print("🔍 Scanning files...")
    for file_path in ai_sites.rglob('*'):
        if file_path.is_file():
            try:
                stat = file_path.stat()
                size = stat.st_size
                rel_path = file_path.relative_to(ai_sites)
                parent_dir = rel_path.parts[0] if len(rel_path.parts) > 1 else 'root'
                
                files_data.append({
                    'source': str(file_path),
                    'rel_path': str(rel_path),
                    'parent_dir': parent_dir,
                    'size': size,
                    'name': file_path.name
                })
                
                dir_structure[parent_dir]['files'] += 1
                dir_structure[parent_dir]['size'] += size
                dir_structure[parent_dir]['items'].append(rel_path)
                total_size += size
                total_files += 1
            except Exception:
                pass
    
    print(f"✅ Scanned {total_files:,} files")
    print(f"💾 Total size: {total_size / (1024**3):.2f} GB")
    print(f"📁 Top-level directories: {len(dir_structure)}")
    
    # Save analysis CSV
    csv_file = avatararts / "00_ACTIVE" / "BUSINESS" / "business-activation" / "ai-sites_analysis.csv"
    with open(csv_file, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=['path', 'name', 'size_bytes', 'size_mb', 'size_gb', 'parent_dir'])
        writer.writeheader()
        for row in files_data:
            writer.writerow({
                'path': row['rel_path'],
                'name': row['name'],
                'size_bytes': row['size'],
                'size_mb': f"{row['size'] / (1024**2):.2f}",
                'size_gb': f"{row['size'] / (1024**3):.4f}",
                'parent_dir': row['parent_dir']
            })
    print(f"📄 Analysis CSV: {csv_file}")
    
    return {
        'files_data': files_data,
        'dir_structure': dir_structure,
        'total_files': total_files,
        'total_size': total_size
    }

def check_conflicts(analysis):
    """Check for existing files in target"""
    print("\n" + "=" * 70)
    print("STEP 2: CHECKING FOR CONFLICTS")
    print("=" * 70)
    
    conflicts = []
    if target.exists():
        print(f"⚠️  Target directory exists: {target}")
        existing_files = {}
        for f in target.rglob('*'):
            if f.is_file():
                rel = f.relative_to(target)
                existing_files[str(rel)] = f
        
        source_files = {row['rel_path']: row for row in analysis['files_data']}
        
        for rel_path in source_files:
            if rel_path in existing_files:
                conflicts.append({
                    'path': rel_path,
                    'source': source_files[rel_path]['source'],
                    'target': str(existing_files[rel_path]),
                    'source_size': source_files[rel_path]['size'],
                    'target_size': existing_files[rel_path].stat().st_size
                })
        
        print(f"   Found {len(conflicts)} potential conflicts")
        if conflicts:
            print("\n   First 10 conflicts:")
            for c in conflicts[:10]:
                print(f"      - {c['path']}")
                print(f"        Source: {c['source_size'] / 1024:.1f} KB")
                print(f"        Target: {c['target_size'] / 1024:.1f} KB")
    else:
        print(f"✅ Target directory doesn't exist - will create: {target}")
    
    return conflicts

def create_merge_plan(analysis, conflicts):
    """Create detailed merge plan"""
    print("\n" + "=" * 70)
    print("STEP 3: CREATING MERGE PLAN")
    print("=" * 70)
    
    plan_file = avatararts / "00_ACTIVE" / "BUSINESS" / "business-activation" / "ai-sites_merge_plan.md"
    
    with open(plan_file, 'w') as f:
        f.write("# AI-SITES TO AVATARARTS MERGE PLAN\n")
        f.write("=" * 70 + "\n\n")
        f.write(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
        
        f.write("## 📊 Analysis Summary\n\n")
        f.write(f"- **Total Files:** {analysis['total_files']:,}\n")
        f.write(f"- **Total Size:** {analysis['total_size'] / (1024**3):.2f} GB\n")
        f.write(f"- **Top-level Directories:** {len(analysis['dir_structure'])}\n")
        f.write(f"- **Conflicts:** {len(conflicts)}\n\n")
        
        f.write("## 📁 Directory Structure\n\n")
        for dir_name, info in sorted(analysis['dir_structure'].items(), key=lambda x: x[1]['size'], reverse=True):
            f.write(f"### {dir_name}\n")
            f.write(f"- **Files:** {info['files']:,}\n")
            f.write(f"- **Size:** {info['size'] / (1024**3):.2f} GB\n\n")
        
        f.write("## 🎯 Merge Strategy\n\n")
        f.write("**Source:** `/Users/steven/ai-sites`\n")
        f.write("**Target:** `~/AVATARARTS/04_WEBSITES/ai-sites/`\n\n")
        
        f.write("### Merge Options:\n\n")
        f.write("1. **Direct Copy** - Copy all files as-is (fastest)\n")
        f.write("2. **Smart Merge** - Handle conflicts, keep newer files\n")
        f.write("3. **Selective Merge** - Choose specific directories\n\n")
        
        if conflicts:
            f.write("## ⚠️ Conflicts Detected\n\n")
            f.write(f"Found {len(conflicts)} files that already exist in target:\n\n")
            for c in conflicts[:20]:
                f.write(f"- `{c['path']}`\n")
                f.write(f"  - Source: {c['source_size'] / 1024:.1f} KB\n")
                f.write(f"  - Target: {c['target_size'] / 1024:.1f} KB\n\n")
            if len(conflicts) > 20:
                f.write(f"... and {len(conflicts) - 20} more\n\n")
    
    print(f"✅ Merge plan saved to: {plan_file}")
    return plan_file

def perform_merge(analysis, conflicts, strategy='smart'):
    """Perform the actual merge"""
    print("\n" + "=" * 70)
    print("STEP 4: PERFORMING MERGE")
    print("=" * 70)
    
    target.mkdir(parents=True, exist_ok=True)
    
    copied = 0
    skipped = 0
    errors = 0
    
    print(f"📁 Target: {target}")
    print(f"🔄 Strategy: {strategy}")
    print("\nCopying files...")
    
    for row in analysis['files_data']:
        source_file = Path(row['source'])
        target_file = target / row['rel_path']
        
        # Check if conflict
        is_conflict = any(c['path'] == row['rel_path'] for c in conflicts)
        
        if is_conflict and strategy == 'smart':
            # Keep newer file
            source_mtime = source_file.stat().st_mtime
            if target_file.exists():
                target_mtime = target_file.stat().st_mtime
                if source_mtime <= target_mtime:
                    skipped += 1
                    continue
        
        try:
            target_file.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source_file, target_file)
            copied += 1
            if copied % 100 == 0:
                print(f"   Copied {copied} files...")
        except Exception as e:
            errors += 1
            print(f"   ⚠️  Error copying {row['rel_path']}: {e}")
    
    print(f"\n✅ Merge complete!")
    print(f"   Copied: {copied:,} files")
    print(f"   Skipped: {skipped:,} files")
    print(f"   Errors: {errors:,} files")
    
    return {
        'copied': copied,
        'skipped': skipped,
        'errors': errors
    }

if __name__ == "__main__":
    # Analyze
    analysis = analyze_source()
    if not analysis:
        sys.exit(1)
    
    # Check conflicts
    conflicts = check_conflicts(analysis)
    
    # Create plan
    plan_file = create_merge_plan(analysis, conflicts)
    
    print("\n" + "=" * 70)
    print("ANALYSIS COMPLETE")
    print("=" * 70)
    print(f"\n📄 Analysis CSV: ~/AVATARARTS/00_ACTIVE/BUSINESS/business-activation/ai-sites_analysis.csv")
    print(f"📋 Merge Plan: {plan_file}")
    print(f"\n⚠️  To perform merge, run:")
    print(f"   python3 {Path(__file__).parent / 'merge_ai_sites_complete.py'} --merge")
    print("=" * 70)
