# 📋 Input Examples - Enterprise AI Agents

**Complete input examples for different use cases**

---

## Example 1: Research Workflow

```json
{
  "workflow_type": "research",
  "tasks": [
    {
      "agent": "research",
      "query": "AI automation trends 2026",
      "type": "trend_analysis"
    }
  ],
  "parallel": true
}
```

---

## Example 2: Content Generation Workflow

```json
{
  "workflow_type": "content",
  "tasks": [
    {
      "agent": "content",
      "topic": "Enterprise AI Agents Framework",
      "format": "article",
      "target_keywords": ["AI Agents Framework", "Enterprise Automation"],
      "seo_optimize": true,
      "aeo_optimize": true
    }
  ],
  "parallel": false
}
```

---

## Example 3: Multi-Agent Workflow

```json
{
  "workflow_type": "multi",
  "tasks": [
    {
      "id": "step_1",
      "agent": "research",
      "query": "enterprise automation trends",
      "type": "market_research",
      "dependencies": []
    },
    {
      "id": "step_2",
      "agent": "content",
      "topic": "Enterprise AI Agents",
      "format": "article",
      "target_keywords": ["AI Agents Framework"],
      "seo_optimize": true,
      "aeo_optimize": true,
      "dependencies": ["step_1"]
    },
    {
      "id": "step_3",
      "agent": "analytics",
      "data_source": "all",
      "metrics": ["performance", "revenue"],
      "timeframe": "30d",
      "dependencies": ["step_2"]
    }
  ],
  "parallel": false,
  "max_retries": 3,
  "timeout": 300
}
```

---

## Example 4: Automation Workflow

```json
{
  "workflow_type": "automation",
  "tasks": [
    {
      "agent": "automation",
      "workflow_type": "enterprise_automation",
      "steps": [
        {"name": "research", "action": "gather_data"},
        {"name": "process", "action": "analyze"}
      ],
      "integrations": ["api", "database"]
    }
  ],
  "parallel": true
}
```

---

## Example 5: Analytics Workflow

```json
{
  "workflow_type": "analytics",
  "tasks": [
    {
      "agent": "analytics",
      "data_source": "all",
      "metrics": ["performance", "revenue", "engagement"],
      "timeframe": "30d"
    }
  ],
  "parallel": false
}
```

---

## Example 6: Integration Workflow

```json
{
  "workflow_type": "integration",
  "tasks": [
    {
      "agent": "integration",
      "integration_type": "api",
      "api_config": {
        "key": "your_api_key"
      },
      "endpoints": ["/v1/data", "/v1/status"]
    }
  ],
  "parallel": false
}
```

---

## Example 7: Parallel Multi-Agent Workflow

```json
{
  "workflow_type": "multi",
  "tasks": [
    {
      "id": "step_1",
      "agent": "research",
      "query": "AI trends",
      "type": "trend_analysis",
      "dependencies": []
    },
    {
      "id": "step_2",
      "agent": "content",
      "topic": "AI Automation",
      "format": "blog",
      "target_keywords": ["AI", "Automation"],
      "dependencies": []
    },
    {
      "id": "step_3",
      "agent": "analytics",
      "data_source": "all",
      "metrics": ["performance"],
      "dependencies": []
    }
  ],
  "parallel": true
}
```

---

## 📝 Field Descriptions

### workflow_type
- **Type:** string
- **Options:** `research`, `content`, `automation`, `analytics`, `integration`, `multi`
- **Default:** `research`

### tasks
- **Type:** array
- **Required:** Yes
- **Min Items:** 1

### parallel
- **Type:** boolean
- **Default:** `true`
- **Description:** Execute independent steps in parallel

### max_retries
- **Type:** integer
- **Range:** 0-5
- **Default:** 3

### timeout
- **Type:** integer
- **Range:** 1-3600 seconds
- **Default:** 300 (5 minutes)

---

**Use these examples to get started!** 🚀