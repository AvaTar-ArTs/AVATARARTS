# Reference Library - Consolidated Knowledge Base

This directory consolidates all reference materials, guides, templates, and patterns from across the codebase for easy access and reuse.

## Structure

```
00_REFERENCES/
├── seo_optimization/      # SEO/AEO guides and optimization patterns
├── prompt_patterns/       # AI prompt templates and patterns
├── code_templates/        # Code patterns and templates
├── strategies/            # Business and content strategies
└── examples/              # Example implementations
```

## Quick Reference

### SEO & Content Optimization
- **AEO/SEO Guide**: Complete guide to Answer Engine Optimization and SEO
  - `seo_optimization/aeo_seo_guide.rst`
- **YouTube SEO Optimizer**: YouTube content optimization patterns
  - `seo_optimization/youtube_seo_optimizer.rst`
- **Content Strategies**: Top 1-5% content strategies
  - `seo_optimization/strategies.rst`

### Prompt Patterns
- **Analysis Prompts**: Structured analysis patterns (like your music analysis scripts)
- **Content Generation**: Prompt patterns for content creation
- **Style Guides**: Voice and tone pattern templates

### Code Templates
- **Environment Loading**: Production-ready env var loading patterns
- **Retry Logic**: Exponential backoff patterns
- **API Patterns**: OpenAI/API integration patterns

### Strategies
- **Revenue Strategies**: Monetization and revenue optimization
- **Content Strategies**: Content creation and distribution strategies
- **Launch Strategies**: Product launch and go-to-market strategies

## Usage

**For Prompt Development:**
- Check `prompt_patterns/` for proven prompt structures
- Reference `seo_optimization/` for SEO-aware content prompts

**For Code Development:**
- Check `code_templates/` for reusable patterns
- Reference existing products for similar implementations

**For Strategy:**
- Check `strategies/` for business and content strategies
- Reference `seo_optimization/strategies.rst` for content performance strategies

## Adding New References

When you find useful patterns, guides, or templates:
1. Categorize them (SEO, prompts, code, strategy, examples)
2. Create symlink or copy to appropriate subdirectory
3. Update this README with description

## Key Files Location

Many reference files are symlinked from their original locations to maintain single source of truth. Original locations:

- **SEO Guides**: `01_PRODUCTS/SEO_Content_Optimization_Suite/`
- **Revenue Strategies**: `05_DOCUMENTATION/revenue_strategies/`
- **Product Examples**: `01_PRODUCTS/*/README.md` and docs
