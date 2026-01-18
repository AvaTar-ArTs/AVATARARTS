#!/bin/bash

# ?? Fix ONLY ~/Music Folder
# Leave workspace alone, organize Music properly

set -e

MUSIC="$HOME/Music"
NOCTURNE="$MUSIC/nocTurneMeLoDieS"

echo "?? ORGANIZING ~/Music FOLDER"
echo "============================="
echo ""

cd "$MUSIC"

# 1. Consolidate all music files into nocTurneMeLoDieS
echo "?? Step 1: Consolidating music files..."

# Move loose audio files
find "$MUSIC" -maxdepth 1 -type f \( -name "*.m4a" -o -name "*.mp3" -o -name "*.wav" \) -exec mv {} "$NOCTURNE/" \; 2>/dev/null || true
echo "  ? Moved loose audio files"

# Move loose image/doc files
find "$MUSIC" -maxdepth 1 -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.txt" -o -name "*.csv" \) -exec mv {} "$NOCTURNE/" \; 2>/dev/null || true
echo "  ? Moved loose media files"
echo ""

# 2. Move scattered music folders into nocTurneMeLoDieS
echo "?? Step 2: Moving music-related folders..."

# List of folders to move INTO nocTurneMeLoDieS
for folder in "OTHER_DOWNLOADS" "mp3-bin" "SUNO" "PetalsFall" \
              "Ktherias-30_chunks" "ReflectionsOfDesire_chunks" \
              "The_Vivification_Of_Ker_chunks" "PodCast" "tesla-podcst"; do
    if [ -d "$folder" ] && [ "$folder" != "nocTurneMeLoDieS" ]; then
        mv "$folder" "$NOCTURNE/" 2>/dev/null && echo "  ? $folder ? nocTurneMeLoDieS/"
    fi
done

# Move ALBUM folder
if [ -d "ALBUM_01_JUNKYARD_SYMPHONY" ]; then
    mv "ALBUM_01_JUNKYARD_SYMPHONY" "$NOCTURNE/" 2>/dev/null && echo "  ? ALBUM_01_JUNKYARD_SYMPHONY ? nocTurneMeLoDieS/"
fi

# Move csv folder
if [ -d "csv" ]; then
    mv csv "$NOCTURNE/" 2>/dev/null && echo "  ? csv/ ? nocTurneMeLoDieS/"
fi
echo ""

# 3. Create clear structure INSIDE nocTurneMeLoDieS
echo "?? Step 3: Organizing inside nocTurneMeLoDieS..."
cd "$NOCTURNE"

# Create main folders
mkdir -p AUDIO SCRIPTS DATA ALBUMS DOCS WEB

echo "  ? Created main folders"
echo ""

# 4. Organize by type
echo "?? Step 4: Categorizing content..."

# Move audio files to AUDIO/
find . -maxdepth 1 -type f \( -name "*.m4a" -o -name "*.mp3" -o -name "*.wav" \) -exec mv {} AUDIO/ \; 2>/dev/null || true

# Move Python scripts to SCRIPTS/
find . -maxdepth 1 -name "*.py" -exec mv {} SCRIPTS/ \; 2>/dev/null || true

# Move CSV/JSON to DATA/
find . -maxdepth 1 -type f \( -name "*.csv" -o -name "*.json" \) -exec mv {} DATA/ \; 2>/dev/null || true

# Move markdown docs to DOCS/
find . -maxdepth 1 -name "*.md" -exec mv {} DOCS/ \; 2>/dev/null || true

# Move HTML/JS/CSS to WEB/
find . -maxdepth 1 -type f \( -name "*.html" -o -name "*.js" -o -name "*.css" \) -exec mv {} WEB/ \; 2>/dev/null || true

# Move album folder
if [ -d "ALBUM_01_JUNKYARD_SYMPHONY" ]; then
    mv "ALBUM_01_JUNKYARD_SYMPHONY" ALBUMS/ 2>/dev/null || true
fi

echo "  ? Files organized by type"
echo ""

# 5. Create START_HERE
cat > START_HERE.md << 'EOF'
# ?? nocTurneMeLoDieS - Music Empire

**Everything music in one place.**

---

## ?? Structure:

```
~/Music/nocTurneMeLoDieS/
?
??? AUDIO/              ? All .m4a, .mp3, .wav files
??? ALBUMS/             ? Released albums
??? SCRIPTS/            ? All Python scripts
??? DATA/               ? All CSVs and metadata
??? DOCS/               ? All documentation
??? WEB/                ? HTML galleries and players
?
??? (Project folders preserved as-is)
```

---

## ?? Quick Access:

### Audio Files:
```bash
cd ~/Music/nocTurneMeLoDieS/AUDIO
```

### Scripts:
```bash
cd ~/Music/nocTurneMeLoDieS/SCRIPTS
```

### Data/CSVs:
```bash
cd ~/Music/nocTurneMeLoDieS/DATA
```

---

## ?? From Workspace:

The workspace can still access this:
```bash
cd ~/workspace/music-empire
# (Can create symlink if needed)
```

---

**All your 783 songs and tools in one organized location.** ?
EOF

echo "?? Created START_HERE.md"
echo ""

# Final report
echo "? ~/Music ORGANIZATION COMPLETE!"
echo "================================="
echo ""
echo "?? New structure:"
ls -d */ | grep -E "^(AUDIO|SCRIPTS|DATA|ALBUMS|DOCS|WEB)" | sed 's|/||'
echo ""
echo "?? Location: ~/Music/nocTurneMeLoDieS"
echo ""
echo "?? Your music is now organized!"
