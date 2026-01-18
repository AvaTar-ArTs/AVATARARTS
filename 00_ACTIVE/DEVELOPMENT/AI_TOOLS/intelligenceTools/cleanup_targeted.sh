#!/bin/bash
# Targeted Cleanup Script for .cache, .local, and .ollama
# Safe, analyzed cleanup with backup support

MODE=${1:-safe}  # safe, analyze, interactive
BACKUP_DIR="$HOME/.cache_cleanup_backup_$(date +%Y%m%d_%H%M%S)"

echo "🎯 Targeted Cache Cleanup"
echo "=========================="
echo "Mode: $MODE"
echo ""

# Function to get size
get_size() {
    du -sh "$1" 2>/dev/null | awk '{print $1}'
}

# Function to count files
count_files() {
    find "$1" -type f 2>/dev/null | wc -l | tr -d ' '
}

# Before state
echo "📊 Before Cleanup:"
CACHE_BEFORE=$(du -sb ~/.cache 2>/dev/null | awk '{print $1}')
LOCAL_BEFORE=$(du -sb ~/.local 2>/dev/null | awk '{print $1}')
OLLAMA_BEFORE=$(du -sb ~/.ollama 2>/dev/null | awk '{print $1}')

echo "   .cache: $(get_size ~/.cache) ($(count_files ~/.cache) files)"
echo "   .local: $(get_size ~/.local) ($(count_files ~/.local) files)"
echo "   .ollama: $(get_size ~/.ollama) ($(count_files ~/.ollama) files)"
echo ""

case "$MODE" in
    safe)
        echo "🧹 Safe Cleanup Mode"
        echo "==================="
        echo ""
        
        # Create backup
        mkdir -p "$BACKUP_DIR"
        
        # 1. Clean package caches
        echo "1️⃣  Cleaning package caches..."
        
        if [ -d ~/.cache/pre-commit ]; then
            echo "   Cleaning pre-commit cache (197 MB)..."
            mkdir -p "$BACKUP_DIR/pre-commit"
            cp -r ~/.cache/pre-commit/* "$BACKUP_DIR/pre-commit/" 2>/dev/null
            rm -rf ~/.cache/pre-commit/*
        fi
        
        if command -v npm &> /dev/null; then
            echo "   Cleaning npm cache (25 MB)..."
            npm cache clean --force 2>/dev/null || true
        fi
        
        if [ -d ~/.cache/uv ]; then
            echo "   Cleaning uv cache (19 MB)..."
            mkdir -p "$BACKUP_DIR/uv"
            cp -r ~/.cache/uv/* "$BACKUP_DIR/uv/" 2>/dev/null
            rm -rf ~/.cache/uv/*
        fi
        
        # 2. Clean old state
        echo ""
        echo "2️⃣  Cleaning old application state..."
        
        if [ -d ~/.local/state ]; then
            echo "   Cleaning state files older than 90 days..."
            find ~/.local/state -type f -mtime +90 -exec sh -c '
                mkdir -p "$BACKUP_DIR/state/$(dirname "{}" | sed "s|$HOME/.local/state/||")"
                cp "{}" "$BACKUP_DIR/state/$(echo "{}" | sed "s|$HOME/.local/state/||")" 2>/dev/null
            ' \; -delete
        fi
        
        # 3. Clean old logs
        echo "   Cleaning old Ollama logs..."
        if [ -d ~/.ollama/logs ]; then
            find ~/.ollama/logs -type f -mtime +30 -delete
        fi
        
        echo ""
        echo "✅ Safe cleanup complete!"
        echo "   Backup: $BACKUP_DIR"
        ;;
    
    analyze)
        echo "🔍 Analysis Mode"
        echo "================"
        echo ""
        
        ANALYSIS_DIR="$HOME/intelligence/cleanup_analysis"
        mkdir -p "$ANALYSIS_DIR"
        
        echo "📊 Generating analysis reports..."
        
        # Cache breakdown
        echo "   Analyzing .cache..."
        du -sh ~/.cache/* 2>/dev/null | sort -hr > "$ANALYSIS_DIR/cache_breakdown.txt"
        
        # HuggingFace models
        if [ -d ~/.cache/huggingface ]; then
            echo "   Analyzing HuggingFace models..."
            du -sh ~/.cache/huggingface/* 2>/dev/null | sort -hr > "$ANALYSIS_DIR/hf_models.txt"
        fi
        
        # Local breakdown
        echo "   Analyzing .local..."
        du -sh ~/.local/* 2>/dev/null | sort -hr > "$ANALYSIS_DIR/local_breakdown.txt"
        
        # Python packages
        if command -v pip &> /dev/null; then
            echo "   Listing Python packages..."
            pip list --user > "$ANALYSIS_DIR/pip_packages.txt" 2>/dev/null
        fi
        
        # pipx packages
        if command -v pipx &> /dev/null; then
            echo "   Listing pipx packages..."
            pipx list > "$ANALYSIS_DIR/pipx_packages.txt" 2>/dev/null
        fi
        
        # Local lib breakdown
        if [ -d ~/.local/lib ]; then
            echo "   Analyzing .local/lib..."
            du -sh ~/.local/lib/* 2>/dev/null | sort -hr | head -20 > "$ANALYSIS_DIR/local_lib.txt"
        fi
        
        # Local share breakdown
        if [ -d ~/.local/share ]; then
            echo "   Analyzing .local/share..."
            du -sh ~/.local/share/* 2>/dev/null | sort -hr | head -20 > "$ANALYSIS_DIR/local_share.txt"
        fi
        
        echo ""
        echo "✅ Analysis complete!"
        echo "   Reports saved to: $ANALYSIS_DIR"
        echo ""
        echo "📄 Generated files:"
        ls -lh "$ANALYSIS_DIR" | tail -n +2
        ;;
    
    interactive)
        echo "💬 Interactive Cleanup Mode"
        echo "==========================="
        echo ""
        echo "This mode will ask before each cleanup action."
        echo ""
        
        # Run analysis first
        $0 analyze
        
        echo ""
        read -p "Review analysis reports? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            cat ~/intelligence/cleanup_analysis/cache_breakdown.txt | head -10
            echo ""
            read -p "Continue with HuggingFace cleanup? (y/n) " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                echo "⚠️  HuggingFace cleanup requires manual review"
                echo "   See: ~/intelligence/cleanup_analysis/hf_models.txt"
            fi
        fi
        ;;
    
    *)
        echo "Usage: $0 {safe|analyze|interactive}"
        echo ""
        echo "Modes:"
        echo "  safe        - Safe cleanup only (package caches, old state)"
        echo "  analyze     - Generate analysis reports"
        echo "  interactive - Interactive cleanup with prompts"
        exit 1
        ;;
esac

# After state
echo ""
echo "📊 After Cleanup:"
CACHE_AFTER=$(du -sb ~/.cache 2>/dev/null | awk '{print $1}')
LOCAL_AFTER=$(du -sb ~/.local 2>/dev/null | awk '{print $1}')
OLLAMA_AFTER=$(du -sb ~/.ollama 2>/dev/null | awk '{print $1}')

echo "   .cache: $(get_size ~/.cache) ($(count_files ~/.cache) files)"
echo "   .local: $(get_size ~/.local) ($(count_files ~/.local) files)"
echo "   .ollama: $(get_size ~/.ollama) ($(count_files ~/.ollama) files)"

# Calculate savings
if [ "$MODE" = "safe" ]; then
    CACHE_SAVED=$((CACHE_BEFORE - CACHE_AFTER))
    LOCAL_SAVED=$((LOCAL_BEFORE - LOCAL_AFTER))
    TOTAL_SAVED=$((CACHE_SAVED + LOCAL_SAVED))
    
    if [ $TOTAL_SAVED -gt 0 ]; then
        SAVED_MB=$((TOTAL_SAVED / 1024 / 1024))
        echo ""
        echo "💾 Space Saved: ${SAVED_MB} MB"
    fi
fi



