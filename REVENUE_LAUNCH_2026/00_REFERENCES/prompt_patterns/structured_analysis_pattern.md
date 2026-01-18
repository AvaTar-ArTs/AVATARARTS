# Structured Analysis Prompt Pattern

**Source**: `/Users/steven/Music/nocTurneMeLoDieS/create_missing_transcripts.py`
**Use Case**: Comprehensive structured analysis of content (songs, transcripts, media)

## System Prompt Pattern

```
You are an experienced [domain] expert. Your role is to provide an in-depth, structured analysis of [content type].
Focus on uncovering the central context, emotional nuances, narrative arc, and deeper meanings. Analyze the emotional tone,
narrative journey, and underlying themes, while highlighting any significant metaphors, symbols, and imagery.
Explain how these elements interconnect and contribute to the overall emotional and narrative impact.
```

## User Prompt Pattern

```
Please provide a thorough analysis of the following [content], structured as follows:

(1) **Central Themes and Meaning**: Describe the main themes and the message conveyed by the [content].

(2) **Emotional Tone**: Highlight the emotional tone and any shifts throughout the [content].

(3) **[Creator]'s Intent**: Discuss what the [creator] might be aiming to express or achieve with this [content].

(4) **Metaphors, Symbols, and Imagery**: Identify and explain notable metaphors, symbols, or imagery, and their significance.

(5) **Overall Emotional and Narrative Experience**: Summarize how these elements create an impactful experience for the [audience].

Structure your response in clear, detailed bullet points for better readability.

[Content]:
{content}
```

## Key Characteristics

- **Expert Role**: "experienced [domain] expert"
- **Analysis Type**: "in-depth, structured analysis"
- **Focus Areas**: "uncovering central context, emotional nuances, narrative arc"
- **Structure**: 5-part structured output
- **Format**: "clear, detailed bullet points"

## Python Implementation Example

```python
system_prompt = (
    "You are an experienced language and music expert. Your role is to provide an in-depth, structured analysis of song lyrics. "
    "Focus on uncovering the central context, emotional nuances, narrative arc, and deeper meanings. Analyze the emotional tone, "
    "narrative journey, and underlying themes, while highlighting any significant metaphors, symbols, and imagery. "
    "Explain how these elements interconnect and contribute to the overall emotional and narrative impact."
)

user_prompt = (
    f"Please provide a thorough analysis of the following song transcript, structured as follows: "
    f"(1) **Central Themes and Meaning**: Describe the main themes and the message conveyed by the song. "
    f"(2) **Emotional Tone**: Highlight the emotional tone and any shifts throughout the lyrics. "
    f"(3) **Artist's Intent**: Discuss what the artist might be aiming to express or achieve with these lyrics. "
    f"(4) **Metaphors, Symbols, and Imagery**: Identify and explain notable metaphors, symbols, or imagery, and their significance. "
    f"(5) **Overall Emotional and Narrative Experience**: Summarize how these elements create an impactful experience for the listener. "
    f"Structure your response in clear, detailed bullet points for better readability.\n\n"
    f"Transcript:\n{transcript_text}"
)
```

## Adapting This Pattern

**For Podcast Analysis:**

- Replace "song lyrics" → "podcast transcript"
- Replace "Artist" → "Speaker" or "Creator"
- Replace "listener" → "audience" or "viewer"

**For Video Content:**

- Replace "song lyrics" → "video transcript"
- Replace "Artist" → "Creator"
- Add sections for visual elements if needed

**For Written Content:**

- Replace "song lyrics" → "written content" or "article"
- Replace "Artist" → "Author"
- Keep same structure, adjust terminology

## Related Patterns

- See `emotional_content_analysis.md` for style guide patterns
- See `../seo_optimization/` for SEO-aware analysis patterns
