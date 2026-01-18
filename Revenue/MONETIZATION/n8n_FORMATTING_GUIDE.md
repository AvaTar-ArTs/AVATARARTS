# n8n Workflow Formatting & Best Practices Guide

**Based on:** Analysis of 6 workflows + 853 market templates
**Date:** 2026-01-13
**Purpose:** Optimize workflows for monetization

---

## 📋 Standard n8n Workflow Structure

### Required JSON Structure

```json
{
  "name": "Workflow Name",
  "nodes": [...],
  "connections": {...},
  "settings": {...}
}
```

### Required Fields

1. **`name`** (string) - Workflow display name
   - ✅ Use descriptive, SEO-friendly names
   - ❌ Avoid: "Workflow 1", "Test", "New Workflow"

2. **`nodes`** (array) - Array of workflow nodes
   - Minimum: 1 node
   - Each node must have required fields (see below)

3. **`connections`** (object) - Node connection mapping
   - Format: `{ "Node Name": { "main": [[{ "node": "Next Node", "type": "main", "index": 0 }]] } }`
   - Can be empty `{}` for single-node workflows

---

## 🔧 Node Structure

### Required Node Fields

```json
{
  "id": "unique-node-id",
  "name": "Node Display Name",
  "type": "n8n-nodes-base.webhook",
  "position": [250, 300],
  "parameters": {}
}
```

**Field Details:**

1. **`id`** (string) - Unique identifier
   - Format: lowercase-with-hyphens
   - Example: `"webhook-trigger"`, `"parse-input"`

2. **`name`** (string) - Display name
   - ✅ Descriptive: "Research Agent", "Format Result"
   - ❌ Generic: "Node 1", "Code", "HTTP Request"

3. **`type`** (string) - Node type identifier
   - Format: `n8n-nodes-base.{nodename}`
   - Examples: `n8n-nodes-base.webhook`, `n8n-nodes-base.code`

4. **`position`** (array) - [x, y] coordinates
   - Used for UI layout
   - Spacing: ~200px horizontal, ~100px vertical

5. **`parameters`** (object) - Node configuration
   - Contains all node-specific settings
   - Can be empty `{}` for nodes with defaults

### Optional Node Fields

```json
{
  "typeVersion": 1,           // Node version (recommended)
  "notes": "Documentation",   // User notes (recommended)
  "disabled": false,          // Disable node
  "credentials": {...},       // Credential references
  "webhookId": "unique-id",   // For webhook nodes
  "executeOnce": false,       // Execute only once
  "retryOnFail": false,       // Retry on failure
  "maxTries": 3,              // Max retry attempts
  "waitBetweenTries": 1000    // Wait time (ms)
}
```

**Best Practices:**
- ✅ Always include `typeVersion` for compatibility
- ✅ Add `notes` to complex nodes
- ✅ Use `credentials` object instead of hardcoded keys

---

## 🔗 Connections Structure

### Standard Format

```json
{
  "Node Name": {
    "main": [
      [
        {
          "node": "Next Node Name",
          "type": "main",
          "index": 0
        }
      ]
    ]
  }
}
```

### Multiple Outputs

```json
{
  "Node Name": {
    "main": [
      [
        { "node": "Node A", "type": "main", "index": 0 },
        { "node": "Node B", "type": "main", "index": 0 }
      ]
    ]
  }
}
```

**Key Points:**
- Connection key = **source node name** (not ID)
- `main` array contains output connections
- Each connection specifies target `node` name

---

## ⚙️ Settings Structure

### Common Settings

```json
{
  "settings": {
    "executionOrder": "v1",              // Execution order
    "saveExecutionProgress": false,      // Save progress
    "saveManualExecutions": true,        // Save manual runs
    "saveDataErrorExecution": "all",     // Save error data
    "saveDataSuccessExecution": "all",   // Save success data
    "executionTimeout": 3600,            // Timeout (seconds)
    "timezone": "America/New_York",      // Timezone
    "errorWorkflow": "workflow-id"       // Error handler workflow
  }
}
```

---

## 📊 Market Insights

### Template Statistics

- **Total Templates:** 853
- **AI-Related:** 290 (34% of market)
- **Average Nodes:** 3.6 nodes per workflow
- **Node Distribution:**
  - Small (<5 nodes): 69.8%
  - Medium (5-14 nodes): 30.2%
  - Large (15+ nodes): 0%

### Most Popular Templates

1. **Scrape and summarize webpages with AI** - 291,546 views
2. **AI agent that can scrape webpages** - 211,623 views
3. **Automated Web Scraping** - 99,001 views
4. **Chat with local LLMs** - 77,672 views
5. **Flux AI Image Generator** - 76,789 views

**Key Insights:**
- AI + Web Scraping = High demand
- Simple workflows (3-5 nodes) are most popular
- AI integration is essential for top templates

---

## ✅ Formatting Best Practices

### 1. Naming Conventions

**Workflow Names:**
- ✅ `"Enterprise AI Agents Pro"`
- ✅ `"Trend Analyzer - Advanced"`
- ❌ `"workflow1"`, `"test"`, `"new"`

**Node Names:**
- ✅ `"Research Agent"`, `"Format Result"`, `"Save to Sheets"`
- ❌ `"Node 1"`, `"Code"`, `"HTTP Request"`

**Node IDs:**
- ✅ `"webhook-trigger"`, `"parse-input"`, `"research-agent"`
- ❌ `"node1"`, `"abc123"`, `"temp"`

### 2. Documentation

**Add Notes to Complex Nodes:**
```json
{
  "notes": "This node processes AI responses and calculates SEO/AEO scores. Requires OpenAI API key."
}
```

**Use Descriptive Comments in Code Nodes:**
```javascript
// Parse incoming data
// Extract keyword and task type
// Return formatted object
```

### 3. Error Handling

**Always Include:**
- Error catch nodes
- Retry logic for API calls
- Validation nodes
- Fallback paths

### 4. Credentials

**✅ DO:**
- Use credential references: `"credentials": { "openAiApi": { "id": "1", "name": "OpenAI" } }`
- Document required credentials in notes
- Provide setup instructions

**❌ DON'T:**
- Hardcode API keys
- Include passwords in JSON
- Store sensitive data in parameters

### 5. Version Compatibility

**Always Include:**
```json
{
  "typeVersion": 1  // or appropriate version
}
```

**Check Compatibility:**
- Test with latest n8n version
- Document minimum n8n version required
- Use compatible node types

---

## 🎯 Optimization for Monetization

### Based on Market Analysis

1. **Focus on AI Integration**
   - 34% of market is AI-related
   - Top templates all use AI
   - High demand = higher prices

2. **Keep It Simple**
   - 70% of templates have <5 nodes
   - Simple = easier to understand
   - Faster to set up = better reviews

3. **Add Value**
   - Include error handling
   - Add documentation
   - Provide examples
   - Include setup guides

4. **SEO Optimization**
   - Use keyword-rich names
   - Include popular categories
   - Match top template patterns

---

## 🔍 Validation Checklist

Before packaging, verify:

- [ ] All workflows use standard JSON format
- [ ] All nodes have unique IDs
- [ ] All nodes have descriptive names
- [ ] Connections are properly defined
- [ ] No hardcoded credentials
- [ ] `typeVersion` included on all nodes
- [ ] Complex nodes have notes
- [ ] Error handling included
- [ ] Tested and working
- [ ] Compatible with n8n 1.0+

---

## 📝 Example: Perfect Workflow Format

```json
{
  "name": "AI Content Research Agent",
  "nodes": [
    {
      "id": "webhook-trigger",
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 300],
      "webhookId": "content-research",
      "notes": "Receives research requests via webhook"
    },
    {
      "id": "research-agent",
      "name": "AI Research Agent",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [450, 300],
      "parameters": {
        "model": "gpt-4",
        "messages": {
          "values": [
            {
              "role": "system",
              "content": "You are a research assistant."
            }
          ]
        }
      },
      "credentials": {
        "openAiApi": {
          "id": "1",
          "name": "OpenAI API"
        }
      },
      "notes": "Requires OpenAI API key. Uses GPT-4 for research."
    }
  ],
  "connections": {
    "Webhook Trigger": {
      "main": [
        [
          {
            "node": "AI Research Agent",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "settings": {
    "executionOrder": "v1",
    "saveManualExecutions": true
  },
  "tags": [
    {
      "name": "AI",
      "id": "ai-tag"
    }
  ]
}
```

---

## 🚀 Next Steps

1. ✅ Review all 31 workflows against this guide
2. ✅ Standardize formatting
3. ✅ Add missing documentation
4. ✅ Validate structure
5. ✅ Test compatibility
6. ✅ Package for sale

---

**Status:** ✅ Research Complete
**Action:** Apply formatting standards to all workflows
