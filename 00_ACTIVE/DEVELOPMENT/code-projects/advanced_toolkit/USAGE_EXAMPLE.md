# ?? Usage Example - Content-Type Classification

## What the toolkit now does:

### 1. Classifies by Duration (Smart & Simple!)
```
< 30 seconds    ? SHORT_AUDIO (UI sounds, jingles)
30s - 6 min     ? SONG (your music!)
6 min - 20 min  ? STORY (narrations, extended pieces)
> 20 min        ? AUDIOBOOK (long-form content)
```

### 2. Then classifies SONGS by:
- Genre (11 categories)
- Mood (6 types)
- Series detection

## Your Results (From Scan)

**YOUR_SUNO_SONGS Analysis:**
- **398 SONGS** - Your actual music tracks! ??
- **120 SHORT_AUDIO** - UI sounds, jingles, short clips
- **48 PODCASTS** - Political commentary, speeches
- **12 AUDIOBOOKS** - Long-form narrations
- **1 STORY** - Whimsical Story narration

**Total:** 579 files

## What to Do

### Keep as Songs (398 files)
These are your monetizable music:
```bash
cd ~/advanced_toolkit
python suno_organizer.py organize --execute
```

This will organize the 398 SONGS by genre/mood.

### Separate Non-Songs (181 files)
The toolkit can now move:
- SHORT_AUDIO ? ~/Music/Sounds/
- PODCASTS ? ~/Music/Podcasts/
- AUDIOBOOKS ? ~/Music/Audiobooks/
- STORIES ? ~/Music/Stories/

## Run the Scan

```bash
cd ~/advanced_toolkit
python suno_organizer.py scan
```

You'll see:
- Content type breakdown
- Genre classification (for SONGS)
- Mood detection (for SONGS)
- Organization plan

---

**Simple, smart, based on actual content!** ?
