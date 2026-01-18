
# 🎼 Lyrics-Bound Visual Narrative Generation Framework (Master Template)

---

## 1. Core Principle

- Every image must be derived **strictly from the song’s lyrics, timestamps, and context**.  
- No outside narrative or invented symbolism may appear.  
- **Typography is optional**, used only when it reinforces or quotes the lyric directly.  

---

## 2. Song Analysis Phase

| Category | Description | Example |
|-----------|--------------|----------|
| **Themes** | Recurring motifs, core ideas | love, loss, rebirth |
| **Emotions** | Dominant feelings across verses | bittersweet, hopeful, reflective |
| **Symbols / Imagery** | Tangible visuals in lyrics | petals, dawn, rain, mirror |
| **Timestamps** | Use to mark shifts in tone | intro → bridge → outro |
| **Narrative Arc** | 4-part structure: Introduction → Development → Climax → Resolution | heartbreak → reflection → release → renewal |

---

## 3. Narrative Image Structure (Per Batch of 4)

### A. Main Image – Core Emotion
```
Title: {{song_title}} – Main
Visual: Depict {{character_state_or_action}} from the lyrics, showing the emotional peak.
Lighting/Color: {{dramatic_palette}} (contrast between sorrow and hope).
Typography (optional): "{{lyric_snippet}}" integrated naturally (wall graffiti, light reflection).
Aspect Ratio: 9:16 or 16:9.
Purpose: Capture the heart of the song — the emotional truth.
```

### B. Transition Image – Symbolic Bridge
```
Title: {{song_title}} – Transition
Visual: Close-up of {{symbolic_object}} mentioned in lyrics.
Lighting/Color: Muted tones with gentle highlights.
Typography: Only if the lyric refers directly to the object.
Aspect Ratio: 16:9 or 1:1.
Purpose: Shift the viewer’s focus smoothly to the next lyric phase.
```

### C. Filler Image – Reflection / Pause
```
Title: {{song_title}} – Filler
Visual: Symbolic or atmospheric element ({{environmental_detail}}, {{object_from_lyric}}).
Lighting/Color: Warm nostalgic tones; calm composition.
Typography: Rare, subtle, or omitted.
Aspect Ratio: 1:1 or 16:9.
Purpose: Deepen emotion; offer breathing space in the visual story.
```

### D. Ambient / Next-Scene Transition
```
Title: {{song_title}} – Transition 2
Visual: Expanded scene ({{environment_or_landscape}}) showing tonal change or conclusion.
Lighting/Color: Pastel fades or dawn hues suggesting resolution.
Typography: Optional final lyric echo "{{closing_line}}".
Aspect Ratio: 16:9.
Purpose: Close one emotional chapter or prepare the next.
```

---

## 4. Batching & Iteration

- Always generate **4 images per batch** (Main, Transition, Filler, Ambient).  
- After each batch, propose **4 new lyric-rooted ideas**:
```
1. {{expand_on_lyric_metaphor}}
2. {{explore_secondary_symbol}}
3. {{introduce_emotional_shift}}
4. {{alternate_perspective_or_angle}}
```
- Continue until all verses or timestamps are visually expressed.

---

## 5. Technical Defaults

| Parameter | Default | Notes |
|------------|----------|-------|
| **Aspect Ratios** | 9:16 (portraits), 16:9 (landscapes), 1:1 (symbols) | Choose per image type |
| **Typography** | Disabled unless lyric-driven | Must be part of the world, not overlay |
| **Backgrounds** | Solid or minimalist | Emphasize symbolic clarity |
| **Lighting Flow** | Dark → Midtone → Bright | Mirrors lyrical emotional shift |
| **Batch Continuation** | Always assume “DO” | Auto-continue next batch unless stopped |

---

## 6. Example Application: “PeTals FaLL (Remix) Yah Yah”

| Image | Scene Summary | Lyrical Tie |
|-------|----------------|-------------|
| **Main** | A lone figure beneath falling petals; dusk light fading | “Petals fall, yet roots remain” |
| **Transition** | Close-up of a drifting petal catching golden light | “Whispers of a distant song” |
| **Filler** | Empty park, fallen petals on bench at twilight | “Beauty lies where none can see” |
| **Ambient** | Dawn horizon, dew on petals, faint silhouette | “Her truth illuminates the way” |

---

## 7. Automation Notes

- Each prompt can be piped to **DALL·E 3** or your **DiGiTaL DiVe** API.  
- Use the same JSON/YAML variable mapping (`{{...}}`) to auto-populate from lyric analysis scripts.  
- Maintain consistent **narrative lighting transitions** (shadow → contrast → glow).  
- Always output **4 images + 4 new concept seeds** per iteration.  
