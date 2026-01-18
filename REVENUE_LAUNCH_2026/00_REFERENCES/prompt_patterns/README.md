# Prompt Patterns - Emotional & Content Analysis

This directory contains reusable prompt patterns for emotional and content analysis, extracted from your reference scripts.

## Key Patterns

### 1. Structured Analysis Pattern
**File**: `structured_analysis_prompt.md`
**Source**: `/Users/steven/Music/nocTurneMeLoDieS/create_missing_transcripts.py`

Pattern for comprehensive, structured analysis with:
- Expert role definition
- In-depth analysis focus
- Structured output format (5 key sections)
- Clear, detailed bullet points

**Use For**:
- Transcript analysis
- Content analysis
- Song/lyrics analysis
- Any structured analytical task

### 2. Emotional & Content Analysis
**File**: `emotional_content_analysis.md`
**Source**: `podcast_to_shorts_ai_ENHANCED.py`

Pattern for style guide generation with:
- Persona/voice analysis
- Emotional palette extraction
- Narrative arc identification
- Style guide JSON structure

**Use For**:
- Style guide generation
- Persona extraction
- Emotional depth analysis
- Content transformation (long-form → short-form)

## Pattern Structure

Both patterns follow this structure:
1. **System Prompt**: Defines expert role and approach
2. **User Prompt**: Provides structured analysis request
3. **Output Format**: Specifies response structure (JSON or structured text)

## Usage Examples

### Structured Analysis
```python
system_prompt = """You are an experienced language and music expert. Your role is to provide an in-depth, structured analysis of song lyrics.
Focus on uncovering the central context, emotional nuances, narrative arc, and deeper meanings..."""

user_prompt = f"""Please provide a thorough analysis of the following song transcript, structured as follows:
(1) **Central Themes and Meaning**: ...
(2) **Emotional Tone**: ...
(3) **Artist's Intent**: ...
(4) **Metaphors, Symbols, and Imagery**: ...
(5) **Overall Emotional and Narrative Experience**: ...
"""
```

### Style Guide Generation
```python
system_prompt = """You are an expert brand voice editor and short-form storytelling specialist..."""

user_prompt = f"""Create a comprehensive style guide to rewrite podcast moments into YouTube Shorts
with strong emotional arc and a consistent, authentic voice..."""
```

## Key Characteristics

**Structured Analysis Pattern:**
- "experienced expert" language
- "in-depth, structured analysis"
- "focus on uncovering"
- 5-part structured output
- Clear, detailed bullet points

**Emotional Content Pattern:**
- "emotional palette"
- "narrative structure"
- "authentic voice"
- JSON output format
- Style guide structure

## Adapting Patterns

To adapt these patterns:
1. Replace `[domain]` with your domain (e.g., "language and music", "content strategy")
2. Replace `[content type]` with your content type (e.g., "song lyrics", "podcast transcript")
3. Adjust the 5 analysis sections as needed
4. Modify JSON structure for style guides as required

## Related Patterns

- **SEO Patterns**: See `../seo_optimization/` for SEO-aware content patterns
- **Code Templates**: See `../code_templates/` for implementation patterns
- **Strategies**: See `../strategies/` for content strategies
