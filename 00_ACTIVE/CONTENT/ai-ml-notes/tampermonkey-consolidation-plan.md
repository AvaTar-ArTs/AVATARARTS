# Tampermonkey Script Consolidation Plan

## Executive Summary
Analysis of 54 user scripts reveals significant redundancy and opportunities for consolidation. This plan identifies exact duplicates, similar functionality, and provides specific recommendations for merging scripts to reduce complexity and improve maintainability.

## Identified Duplicates (Exact Matches)

### 1. Perplexity.ai Chat Exporter (3 identical copies)
**Files:**
- `Perplexity.ai Chat Exporter.user.js` (83,385 bytes)
- `Perplexity.ai Chat Exporter (1).user.js` (83,385 bytes) 
- `Perplexity.ai Chat Exporter (2).user.js` (83,385 bytes)

**Action:** Keep only `Perplexity.ai Chat Exporter.user.js`, delete the other two.

### 2. DeepSeek Chat Exporter (2 identical copies)
**Files:**
- `DeepSeek Chat Exporter (Markdown & PDF & PNG - English improved version).user.js` (23,261 bytes)
- `DeepSeek Chat Exporter (Markdown & PDF & PNG - English improved version) (1).user.js` (23,261 bytes)

**Action:** Keep only the first one, delete the duplicate.

## Functional Consolidation Opportunities

### 1. ChatGPT Exporters (5 scripts → 1-2 scripts)

**Current Scripts:**
- `ChatGPT Exporter.user.js` (842KB) - Most comprehensive, supports multiple formats
- `ChatGPT - Claude - Copilot - Gemini AI Chat Exporter by RevivalStack.user.js` (102KB) - Multi-platform
- `ChatGPT Conversation Exporter (HTML + MD + TXT).user.js` (4KB) - Basic functionality
- `ChatGPT Deep Research Markdown Exporter.user.js` (13KB) - Specialized for research
- `ChatGPT GPTs Exporter.user.js` (Unknown size) - GPT-specific

**Recommendation:** 
- **Keep:** `ChatGPT - Claude - Copilot - Gemini AI Chat Exporter by RevivalStack.user.js` (most versatile)
- **Consider keeping:** `ChatGPT Exporter.user.js` if you need advanced features
- **Remove:** The other three (functionality covered by the first two)

### 2. DeepSeek Exporters (4 scripts → 1-2 scripts)

**Current Scripts:**
- `DeepSeek Chat Exporter (Markdown & PDF & PNG - English improved version).user.js` (23KB) - Most features
- `DeepSeek Chat Exporter.user.js` (13KB) - Basic functionality
- `DeepSeek Chat Exporter (Reliable).user.js` (5KB) - Minimal functionality
- `DS Exporter.user.js` (224KB) - Large, unknown features

**Recommendation:**
- **Keep:** `DeepSeek Chat Exporter (Markdown & PDF & PNG - English improved version).user.js`
- **Investigate:** `DS Exporter.user.js` - if it has unique features, keep it
- **Remove:** The other two

### 3. Universal Exporters (3 scripts → 1 script)

**Current Scripts:**
- `2Universal AI Conversation & GPT Exporter.user.js` (53KB)
- `All Universal AI Conversation & GPT Exporter.user.js` (57KB)
- `Universal Chat Exporter to Obsidian.user.js` (Unknown size)

**Recommendation:**
- **Keep:** `All Universal AI Conversation & GPT Exporter.user.js` (most comprehensive name)
- **Remove:** The other two (likely duplicate functionality)

### 4. Grok Exporters (2 scripts → 1 script)

**Current Scripts:**
- `Enhanced Grok Export v2.4.user.js` (44KB) - Older version
- `myGrok Enhanced Export v3.0.user.js` (30KB) - Newer version

**Recommendation:**
- **Keep:** `myGrok Enhanced Export v3.0.user.js` (newer version)
- **Remove:** `Enhanced Grok Export v2.4.user.js`

### 5. Medium Bypass Scripts (2 scripts → 1 script)

**Current Scripts:**
- `Medium Member Bypass.user.js` (32KB)
- `medium-bypass.user.js` (28KB)

**Recommendation:**
- **Keep:** `Medium Member Bypass.user.js` (larger, likely more features)
- **Remove:** `medium-bypass.user.js`

## Platform-Specific Consolidation

### ChatGPT Platform (16 scripts)
**High Priority for Consolidation:**
- Multiple export scripts can be reduced to 1-2
- UI enhancement scripts can be merged
- Prompt management is already centralized

### DeepSeek Platform (10 scripts)
**Consolidation Opportunities:**
- Export functionality can be unified
- UI improvements can be combined
- Auto-retry features can be integrated

### Perplexity Platform (7 scripts)
**Current State:** Well-consolidated (only 1 unique script after removing duplicates)

## Implementation Priority

### Phase 1: Remove Exact Duplicates (Immediate)
1. Delete `Perplexity.ai Chat Exporter (1).user.js`
2. Delete `Perplexity.ai Chat Exporter (2).user.js`
3. Delete `DeepSeek Chat Exporter (Markdown & PDF & PNG - English improved version) (1).user.js`

### Phase 2: Consolidate Similar Functionality (High Priority)
1. Choose best ChatGPT exporter (RevivalStack version recommended)
2. Choose best DeepSeek exporter (English improved version)
3. Choose best Universal exporter (All Universal version)
4. Choose best Grok exporter (v3.0 version)
5. Choose best Medium bypass (Member Bypass version)

### Phase 3: Advanced Consolidation (Medium Priority)
1. Investigate `DS Exporter.user.js` for unique features
2. Consider merging UI enhancement scripts
3. Evaluate prompt management integration

## Expected Results

### Before Consolidation:
- 54 scripts
- 5.5 MB total size
- High redundancy
- Potential conflicts

### After Consolidation:
- ~35-40 scripts (30-35% reduction)
- ~4.5-5.0 MB total size (10-15% reduction)
- Clear functionality separation
- Reduced maintenance overhead

## Risk Assessment

### Low Risk:
- Removing exact duplicates
- Removing clearly superseded versions

### Medium Risk:
- Consolidating export functionality (test thoroughly)
- Removing scripts with unknown unique features

### High Risk:
- Modifying core functionality scripts
- Removing scripts without thorough testing

## Testing Strategy

1. **Backup Current State:** Keep original backup
2. **Test Each Platform:** Verify functionality on ChatGPT, DeepSeek, Perplexity
3. **Check Dependencies:** Ensure no scripts depend on removed ones
4. **Monitor Performance:** Watch for conflicts or slowdowns
5. **Gradual Implementation:** Remove scripts in phases

## Next Steps

1. Create a test environment
2. Implement Phase 1 (exact duplicates)
3. Test thoroughly
4. Implement Phase 2 (similar functionality)
5. Monitor and adjust as needed