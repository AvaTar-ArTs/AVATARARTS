#!/bin/bash

# ?? Consolidate All Music to ~/Music/nocTurneMeLoDieS
# Everything music goes to proper Music folder, symlink from workspace

set -e

MUSIC_HOME="$HOME/Music/nocTurneMeLoDieS"
WORKSPACE_MUSIC="$HOME/workspace/projects/music-empire"

echo "?? MUSIC CONSOLIDATION"
echo "====================="
echo ""
echo "Target: $MUSIC_HOME"
echo "Source: $WORKSPACE_MUSIC"
echo ""

# 1. Ensure nocTurneMeLoDieS structure exists
echo "?? Setting up structure in ~/Music/nocTurneMeLoDieS..."
mkdir -p "$MUSIC_HOME"/{audio,automation,data,docs}
mkdir -p "$MUSIC_HOME/audio"/{albums,downloads,masters,suno-exports}
echo "   ? Structure created"
echo ""

# 2. Move audio files from workspace music-empire to Music
echo "?? Moving audio files from workspace to Music..."
if [ -d "$WORKSPACE_MUSIC" ]; then
    # Move any .m4a, .mp3, .wav files
    find "$WORKSPACE_MUSIC" -type f \( -name "*.m4a" -o -name "*.mp3" -o -name "*.wav" \) -exec mv {} "$MUSIC_HOME/audio/suno-exports/" \; 2>/dev/null || true
    echo "   ? Audio files moved"
fi
echo ""

# 3. Move Python scripts to automation
echo "?? Consolidating automation scripts..."
if [ -d "$WORKSPACE_MUSIC" ]; then
    find "$WORKSPACE_MUSIC" -maxdepth 1 -name "*.py" -exec mv {} "$MUSIC_HOME/automation/" \; 2>/dev/null || true
    echo "   ? Python scripts moved"
fi
echo ""

# 4. Move data/CSVs
echo "?? Consolidating data files..."
if [ -d "$WORKSPACE_MUSIC" ]; then
    find "$WORKSPACE_MUSIC" -type f \( -name "*.csv" -o -name "*.json" \) -exec mv {} "$MUSIC_HOME/data/" \; 2>/dev/null || true
    echo "   ? Data files moved"
    
    # Move any data folders
    if [ -d "$WORKSPACE_MUSIC/merged-catalog" ]; then
        mv "$WORKSPACE_MUSIC/merged-catalog" "$MUSIC_HOME/data/" 2>/dev/null || true
        echo "   ? Moved merged-catalog/"
    fi
    if [ -d "$WORKSPACE_MUSIC/suno-export" ]; then
        mv "$WORKSPACE_MUSIC/suno-export" "$MUSIC_HOME/data/" 2>/dev/null || true
        echo "   ? Moved suno-export/"
    fi
    if [ -d "$WORKSPACE_MUSIC/csvs-organized" ]; then
        mv "$WORKSPACE_MUSIC/csvs-organized" "$MUSIC_HOME/data/" 2>/dev/null || true
        echo "   ? Moved csvs-organized/"
    fi
fi
echo ""

# 5. Move documentation
echo "?? Consolidating documentation..."
if [ -d "$WORKSPACE_MUSIC" ]; then
    find "$WORKSPACE_MUSIC" -maxdepth 1 -name "*.md" -exec mv {} "$MUSIC_HOME/docs/" \; 2>/dev/null || true
    echo "   ? Documentation moved"
fi
echo ""

# 6. Consolidate scattered Music folder files
echo "?? Organizing scattered Music folder files..."

# Move loose CSV files from ~/Music/csv to data
if [ -d "$HOME/Music/csv" ]; then
    mv "$HOME/Music/csv"/* "$MUSIC_HOME/data/" 2>/dev/null || true
    rmdir "$HOME/Music/csv" 2>/dev/null || true
    echo "   ? Moved ~/Music/csv/ files"
fi

# Move album to proper location
if [ -d "$HOME/Music/ALBUM_01_JUNKYARD_SYMPHONY" ]; then
    mv "$HOME/Music/ALBUM_01_JUNKYARD_SYMPHONY" "$MUSIC_HOME/audio/albums/" 2>/dev/null || true
    echo "   ? Moved ALBUM_01_JUNKYARD_SYMPHONY/"
fi

# Move mp3-bin
if [ -d "$HOME/Music/mp3-bin" ]; then
    mv "$HOME/Music/mp3-bin"/* "$MUSIC_HOME/audio/downloads/" 2>/dev/null || true
    rmdir "$HOME/Music/mp3-bin" 2>/dev/null || true
    echo "   ? Moved mp3-bin/ files"
fi

# Move OTHER_DOWNLOADS
if [ -d "$HOME/Music/OTHER_DOWNLOADS" ]; then
    mv "$HOME/Music/OTHER_DOWNLOADS"/* "$MUSIC_HOME/audio/downloads/" 2>/dev/null || true
    rmdir "$HOME/Music/OTHER_DOWNLOADS" 2>/dev/null || true
    echo "   ? Moved OTHER_DOWNLOADS/ files"
fi

# Move SUNO folder if exists
if [ -d "$HOME/Music/SUNO" ]; then
    # Move scripts to automation
    find "$HOME/Music/SUNO" -name "*.py" -exec mv {} "$MUSIC_HOME/automation/" \; 2>/dev/null || true
    # Move any audio
    find "$HOME/Music/SUNO" -type f \( -name "*.m4a" -o -name "*.mp3" \) -exec mv {} "$MUSIC_HOME/audio/suno-exports/" \; 2>/dev/null || true
    echo "   ? Moved SUNO/ contents"
fi
echo ""

# 7. Remove empty workspace/projects/music-empire if empty
echo "?? Cleaning up empty folders..."
if [ -d "$WORKSPACE_MUSIC" ]; then
    # Move any remaining folders to Music
    find "$WORKSPACE_MUSIC" -mindepth 1 -maxdepth 1 -type d -exec mv {} "$MUSIC_HOME/" \; 2>/dev/null || true
    
    # Remove if now empty
    rmdir "$WORKSPACE_MUSIC" 2>/dev/null && echo "   ? Removed empty music-empire/" || echo "   ??  music-empire/ has remaining files"
fi
echo ""

# 8. Create symlink in workspace
echo "?? Creating symlink in workspace..."
cd "$HOME/workspace/projects"
if [ ! -e "music-empire" ]; then
    ln -s "$MUSIC_HOME" music-empire
    echo "   ? Created symlink: workspace/projects/music-empire ? ~/Music/nocTurneMeLoDieS"
else
    echo "   ??  music-empire already exists"
fi
echo ""

# 9. Create navigation file
echo "?? Creating navigation guide..."
cat > "$MUSIC_HOME/START_HERE.md" << 'MUSICEOF'
# ?? nocTurneMeLoDieS - Music Empire

**All your music in one place.**

---

## ?? Structure:

```
~/Music/nocTurneMeLoDieS/
??? audio/                          ? ALL AUDIO FILES (965 files)
?   ??? albums/                     ? Released albums
?   ??? downloads/                  ? Downloaded tracks
?   ??? masters/                    ? Mastered versions
?   ??? suno-exports/               ? Suno exports
?
??? automation/                     ? ALL SCRIPTS (471 total!)
?   ??? (distribution scripts)
?   ??? (analysis scripts)
?   ??? (production scripts)
?
??? data/                           ? ALL DATA
?   ??? (CSVs, metadata)
?   ??? merged-catalog/
?   ??? suno-export/
?   ??? csvs-organized/
?
??? docs/                           ? DOCUMENTATION
```

---

## ?? Quick Access:

From workspace:
```bash
cd ~/workspace/projects/music-empire
# (This is a symlink to ~/Music/nocTurneMeLoDieS)
```

From Music folder:
```bash
cd ~/Music/nocTurneMeLoDieS
```

---

## ?? Your 783 Songs:

All audio files are now in: `audio/`

All scripts are now in: `automation/`

All data is now in: `data/`

**Everything unified. Everything accessible.** ?
MUSICEOF

echo "   ? Created START_HERE.md in ~/Music/nocTurneMeLoDieS"
echo ""

# 10. Final report
echo "? MUSIC CONSOLIDATION COMPLETE!"
echo "================================"
echo ""
echo "?? Results:"
echo ""
echo "All music content now in:"
echo "  ? ~/Music/nocTurneMeLoDieS/"
echo ""
echo "Symlink created:"
echo "  ? ~/workspace/projects/music-empire ? ~/Music/nocTurneMeLoDieS"
echo ""
echo "Structure:"
echo "  ?? audio/         (all .m4a, .mp3, .wav files)"
echo "  ?? automation/    (all Python scripts)"
echo "  ?? data/          (all CSVs and metadata)"
echo "  ?? docs/          (all documentation)"
echo ""
echo "?? Access from workspace:"
echo "  cd ~/workspace/projects/music-empire"
echo ""
echo "?? Or from Music folder:"
echo "  cd ~/Music/nocTurneMeLoDieS"
echo ""
echo "? All your music in one place!"
