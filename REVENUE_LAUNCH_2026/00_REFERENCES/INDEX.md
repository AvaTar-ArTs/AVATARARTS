# Reference Library Index

Quick index to all consolidated reference materials.

## SEO & Content Optimization

### AEO/SEO Guide

**Location**: `seo_optimization/aeo_seo_guide.rst`
**Original**: `01_PRODUCTS/SEO_Content_Optimization_Suite/aeo_seo_guide.rst`
**Use For**:

- SEO/AEO optimization patterns
- Keyword strategy (primary, long-tail, semantic)
- Title optimization (55-60 chars, power words)
- Description optimization (300-500 words, structure)
- Hashtag strategy

### YouTube SEO Optimizer

**Location**: `seo_optimization/youtube_seo_optimizer.rst`
**Original**: `01_PRODUCTS/SEO_Content_Optimization_Suite/youtube_seo_optimizer.rst`
**Use For**:

- YouTube title optimization
- YouTube description generation
- Tag optimization (10-15 tags)
- Thumbnail concepts
- SEO scoring patterns

### Content Strategies

**Location**: `seo_optimization/strategies.rst`
**Original**: `01_PRODUCTS/SEO_Content_Optimization_Suite/strategies.rst`
**Use For**:

- Top 1-5% content strategy
- Trending topic workflow
- Content types (explainer, analysis, how-to)
- Daily workflow patterns

## Strategies

### Revenue Integration Strategy

**Location**: `strategies/REVENUE_INTEGRATION_STRATEGY.md`
**Original**: `05_DOCUMENTATION/revenue_strategies/REVENUE_INTEGRATION_STRATEGY.md`
**Use For**:

- Revenue diversification
- Product monetization
- Pricing strategies

## Prompt Patterns

### Structured Analysis Pattern

**Location**: `prompt_patterns/structured_analysis_pattern.md`
**Source**: `/Users/steven/Music/nocTurneMeLoDieS/create_missing_transcripts.py`
**Use For**:

- Comprehensive structured analysis
- Expert role definitions ("experienced expert")
- 5-part analysis structure (Themes, Emotional Tone, Intent, Metaphors, Experience)
- Detailed analysis requests

### Emotional & Content Analysis Pattern

**Location**: `prompt_patterns/emotional_content_analysis.md`
**Source**: `podcast_to_shorts_ai_ENHANCED.py`
**Use For**:

- Style guide generation
- Persona extraction
- Emotional palette analysis
- Narrative arc identification
- Voice/tone analysis

## Code Templates

### Environment Loading (load_env_d)

**Location**: `code_templates/load_env_d.py`
**Source**: `/Users/steven/Music/nocTurneMeLoDieS/create_missing_transcripts.py`
**Use For**:

- Production-ready environment variable loading
- Priority: llm-apis.env → MASTER_CONSOLIDATED.env → others (alphabetical)
- Handles export statements, quotes, comments
- Fails silently in production (optional local dev support)

### Retry Logic (retry_with_backoff)

**Location**: `code_templates/retry_with_backoff.py`
**Source**: Multiple scripts (Podcast_to_Shorts_AI, reference scripts)
**Use For**:

- Robust API call retry logic
- Exponential backoff with full jitter
- Prevents thundering herd
- Configurable max attempts and delay cap

### File Operations (normalize_filename)

**Location**: `code_templates/normalize_filename.py`
**Source**: `/Users/steven/Music/nocTurneMeLoDieS/create_missing_transcripts.py`
**Use For**:

- Filename normalization for fuzzy matching
- Removes extensions, suffixes, version numbers
- Normalizes separators and special chars

### Time Formatting (format_timestamp)

**Location**: `code_templates/format_timestamp.py`
**Source**: `/Users/steven/Music/nocTurneMeLoDieS/create_missing_transcripts.py`
**Use For**:

- Consistent timestamp formatting (MM:SS format)
- Easy to extend for other formats

### API Client Init (init_openai_client)

**Location**: `code_templates/init_openai_client.py`
**Source**: enhanced_recipe_generator.py, ai_receptionist.py
**Use For**: OpenAI client initialization with fallback chain

### Batch Processing (batch_process_files)

**Location**: `code_templates/batch_process_files.py`
**Source**: batch_quality_improver.py, advanced_quality_enhancer.py
**Use For**: Process files in batches with ThreadPoolExecutor

### JSON Parser (parse_json_response)

**Location**: `code_templates/parse_json_response.py`
**Source**: enhanced_recipe_generator.py
**Use For**: Parse AI JSON responses (handles markdown blocks)

### Input Validation (validate_input, sanitize_string)

**Location**: `code_templates/input_validation.py`
**Source**: common_imports.py, quality_monitor.py
**Use For**: Validate inputs, sanitize strings (security)

### Logging Setup (setup_logging)

**Location**: `code_templates/setup_logging.py`
**Source**: coding_standards.py, enhanced_utilities.py
**Use For**: Standardized logging configuration

### Timing Decorator (timing_decorator)

**Location**: `code_templates/timing_decorator.py`
**Source**: advanced_quality_improver.py
**Use For**: Measure function execution time

### HTTP Session Pool (get_session)

**Location**: `code_templates/http_session_pool.py`
**Source**: advanced_quality_enhancer.py
**Use For**: Requests session with connection pooling

### Chunk List (chunk_list)

**Location**: `code_templates/chunk_list.py`
**Source**: enhanced_utilities.py
**Use For**: Split lists into chunks for batch processing

## Adding More References

To add more reference files:

```bash
# Create symlink (recommended)
cd 00_REFERENCES/{category}/
ln -s ../../{original_path}/{filename} {filename}

# Or copy (if symlinks don't work)
cp {original_path}/{filename} {category}/
```

Then update this INDEX.md file with the new reference.
