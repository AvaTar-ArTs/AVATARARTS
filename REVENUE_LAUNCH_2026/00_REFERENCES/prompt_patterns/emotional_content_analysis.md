# Emotional & Content Analysis Pattern

**Source**: `podcast_to_shorts_ai_ENHANCED.py` - `_build_style_guide` method
**Use Case**: Style guide generation, persona extraction, emotional depth analysis

## Style Guide Generation Pattern

### System Prompt

```
You are an expert brand voice editor and short-form storytelling specialist.
Your expertise lies in analyzing content and creating style guides that capture the unique voice,
emotional palette, and narrative structure of creators. You understand how to translate longer-form
content into compelling short-form formats while preserving authenticity and emotional resonance.
```

### User Prompt Pattern

```
Create a comprehensive style guide to rewrite [source content] into [target format]
with strong emotional arc and a consistent, authentic voice.

Inputs:
- persona (optional): [persona description]
- style_seed (optional, may include notes/lyrics/tone references): [style references]

Use the [content sample] to infer speaking cadence, vocabulary patterns, and natural language flow.
Do NOT invent facts or characteristics not present in the sample.

[Content Sample]:
{content_sample}

Return valid JSON with this structure:
{
  "voice": {
    "tone": "description of overall tone",
    "pace": "description of pacing (fast/slow/varies)",
    "vocabulary_level": "description of word choice complexity",
    "signature_phrases": ["array", "of", "distinctive", "phrases"],
    "do": ["preferred", "writing", "patterns"],
    "dont": ["patterns", "to", "avoid"]
  },
  "emotional_palette": {
    "primary": ["main", "emotions"],
    "secondary": ["supporting", "emotions"],
    "avoid": ["emotions", "to", "minimize"]
  },
  "narrative_arc": {
    "beats": ["key", "story", "beats"],
    "preferred_tension_curve": "description of tension structure",
    "payoff_style": "description of how resolutions work"
  },
  "hook_patterns": ["3-7 short template patterns"],
  "cta_patterns": ["3-7 short call-to-action templates"],
  "formatting": {
    "line_break_style": "description",
    "subtitle_style_notes": "description"
  }
}
```

## Key Elements

### Voice Structure

- **tone**: Overall emotional tone
- **pace**: Pacing description
- **vocabulary_level**: Word choice complexity
- **signature_phrases**: Distinctive phrases
- **do/dont**: Preferred patterns vs. patterns to avoid

### Emotional Palette

- **primary**: Main emotions to emphasize
- **secondary**: Supporting emotions
- **avoid**: Emotions to minimize

### Narrative Arc

- **beats**: Key story beats
- **preferred_tension_curve**: Tension structure
- **payoff_style**: How resolutions work

### Patterns

- **hook_patterns**: Opening patterns
- **cta_patterns**: Call-to-action patterns
- **formatting**: Style formatting notes

## Python Implementation

```python
system_prompt = """You are an expert brand voice editor and short-form storytelling specialist.
Your expertise lies in analyzing content and creating style guides that capture the unique voice,
emotional palette, and narrative structure of creators..."""

user_prompt = f"""Create a comprehensive style guide to rewrite podcast moments into YouTube Shorts
with strong emotional arc and a consistent, authentic voice.

Inputs:
- persona (optional): {persona if persona else "N/A"}
- style_seed (optional): {style_seed[:2000] if style_seed else "N/A"}

Use the transcript sample to infer speaking cadence, vocabulary patterns, and natural language flow.
Do NOT invent facts or characteristics not present in the sample.

Transcript sample:
{transcript_sample}

Return valid JSON with this structure:
{{...}}
"""
```

## Use Cases

1. **Content Transformation**: Long-form → Short-form
2. **Persona Extraction**: Extract voice from existing content
3. **Style Guide Creation**: Create style guides for content generation
4. **Emotional Analysis**: Analyze emotional palette of content
5. **Narrative Structure**: Identify narrative patterns

## Related Patterns

- See `structured_analysis_pattern.md` for comprehensive analysis patterns
- See `../seo_optimization/` for SEO-aware content patterns
