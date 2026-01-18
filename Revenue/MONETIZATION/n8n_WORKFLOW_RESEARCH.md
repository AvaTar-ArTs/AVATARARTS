# n8n Workflow & Template Research Report

**Generated:** 2026-01-13 07:28:59
**Source:** Analysis of 6 workflows + 853 market templates

---

## 📋 Executive Summary

This report analyzes n8n workflow structure, formatting standards, and market trends to optimize monetization strategy.

---

## 🔧 n8n Workflow Structure

### Standard Format

n8n workflows use a JSON structure with the following **required fields**:

```json
{
  "name": "Workflow Name",
  "nodes": [...],
  "connections": {...},
  "settings": {...}
}
```

### Required Fields (100% of workflows)

1. **`name`** - Workflow display name
2. **`nodes`** - Array of workflow nodes
3. **`connections`** - Object defining node connections

### Node Structure

Each node **must** contain:
- `id` - Unique node identifier
- `name` - Node display name
- `type` - Node type (e.g., `n8n-nodes-base.webhook`)
- `position` - [x, y] coordinates for UI
- `parameters` - Node configuration object

### Optional Node Fields

Common optional fields:
- `typeVersion` - Node version (for compatibility)
- `notes` - User notes/documentation
- `disabled` - Whether node is disabled
- `credentials` - Credential references
- `webhookId` - For webhook nodes
- `executeOnce` - Execute only once
- `retryOnFail` - Retry on failure

### Settings Structure

Common settings:
- `saveExecutionProgress` - Save execution state
- `saveManualExecutions` - Save manual runs
- `saveDataErrorExecution` - Save error data
- `saveDataSuccessExecution` - Save success data
- `executionTimeout` - Timeout in seconds
- `timezone` - Workflow timezone

---

## 📊 Market Analysis

### Template Statistics

- **Total Templates Analyzed:** 853
- **AI-Related Templates:** 290 (34.0%)
- **Average Node Count:** 3.6 nodes

### Top Categories


### Node Count Distribution


- **Small (<5 nodes):** 409 (69.8%)
- **Medium (5-14 nodes):** 177 (30.2%)
- **Large (15+ nodes):** 0 (0.0%)

### Most Popular Templates


1. **Scrape and summarize webpages with AI**
   - Views: 291,546
   - Nodes: 6
   - Categories: 

2. **AI agent that can scrape webpages**
   - Views: 211,623
   - Nodes: 4
   - Categories: 

3. **Automated Web Scraping: email a CSV, save to Google Sheets &**
   - Views: 99,001
   - Nodes: 5
   - Categories: 

4. **Chat with local LLMs using n8n and Ollama**
   - Views: 77,672
   - Nodes: 2
   - Categories: 

5. **Flux AI Image Generator**
   - Views: 76,789
   - Nodes: 2
   - Categories: 

6. **AI Voice Chatbot with ElevenLabs & OpenAI for Customer Servi**
   - Views: 62,222
   - Nodes: 10
   - Categories: 

7. **Hacker News to Video Content**
   - Views: 46,708
   - Nodes: 12
   - Categories: 

8. **AI Powered Web Scraping with Jina, Google Sheets and OpenAI **
   - Views: 43,837
   - Nodes: 4
   - Categories: 

9. **Generate SQL queries from schema only - AI-powered**
   - Views: 38,321
   - Nodes: 4
   - Categories: 

10. **Telegram AI bot assistant: ready-made template for voice & t**
   - Views: 37,867
   - Nodes: 5
   - Categories: 

---

## 🎯 Best Practices for Monetization

### 1. Workflow Structure

✅ **DO:**
- Include descriptive `name` field
- Use clear, descriptive node names
- Add `notes` to complex nodes
- Include `typeVersion` for compatibility
- Structure connections logically

❌ **DON'T:**
- Use generic names like "Node 1"
- Leave nodes without documentation
- Mix different n8n versions
- Create circular dependencies

### 2. Template Formatting

✅ **DO:**
- Use consistent naming conventions
- Include setup instructions in notes
- Document required credentials
- Add error handling nodes
- Include example data

❌ **DON'T:**
- Hardcode API keys
- Skip error handling
- Use unclear variable names
- Forget to document dependencies

### 3. Market Positioning

Based on market analysis:
- **AI-related templates** are 34.0% of market
- **Average complexity:** 3.6 nodes
- **Popular categories:** Focus on top categories for SEO

---

## 📈 Recommendations

### For Your Package:

1. **Standardize Format:**
   - Ensure all workflows use standard n8n format
   - Add `typeVersion` to all nodes
   - Include comprehensive `notes`

2. **Optimize for Market:**
   - Focus on AI-related workflows (high demand)
   - Target popular categories
   - Create workflows with 5-15 nodes (sweet spot)

3. **Documentation:**
   - Add setup guides
   - Document credentials needed
   - Include use case examples
   - Provide troubleshooting tips

4. **Quality Assurance:**
   - Test all workflows before packaging
   - Remove hardcoded credentials
   - Validate JSON structure
   - Check node compatibility

---

## 🔍 Technical Details

### Node Type Distribution

- `n8n-nodes-base.code`: 8 occurrences
- `n8n-nodes-base.webhook`: 6 occurrences
- `n8n-nodes-base.respondToWebhook`: 6 occurrences
- `n8n-nodes-base.httpRequest`: 4 occurrences
- `n8n-nodes-base.openAi`: 3 occurrences
- `n8n-nodes-base.googleSheets`: 2 occurrences
- `n8n-nodes-base.set`: 1 occurrences

### Connection Patterns

- Average nodes per workflow: 5.0
- Average connections per workflow: 4.0

---

## ✅ Validation Checklist

Before monetizing, ensure each workflow:

- [ ] Uses standard n8n JSON format
- [ ] Has descriptive name
- [ ] All nodes have unique IDs
- [ ] Connections are properly defined
- [ ] No hardcoded credentials
- [ ] Includes error handling
- [ ] Has documentation/notes
- [ ] Tested and working
- [ ] Compatible with latest n8n version

---

**Status:** ✅ Research Complete
**Next:** Apply findings to optimize package
