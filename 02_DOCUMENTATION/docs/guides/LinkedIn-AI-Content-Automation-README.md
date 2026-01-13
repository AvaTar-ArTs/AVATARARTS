# LinkedIn AI Content Automation - Agentic Vibe

Automated LinkedIn content creation and posting workflow using n8n and OpenAI.

## Overview

This n8n workflow automatically generates, formats, and posts LinkedIn content every 6 hours using AI. It's designed for **Agentic Vibe**, an AI-first automation agency.

### What It Does

1. **Generates content topics** based on strategic themes
2. **Creates full LinkedIn posts** with professional copy
3. **Generates custom images** using DALL-E
4. **Adds SEO-optimized hashtags**
5. **Posts automatically to LinkedIn**

### Workflow Stages

```
Schedule (Every 6h)
    ↓
Topic Generator (GPT-4o-mini)
    ↓
Content Creator (GPT-4o-mini)
    ↓
    ├─→ Image Generator (DALL-E)
    └─→ Hashtag Generator (GPT-4o-mini)
    ↓
Merge Results
    ↓
Post to LinkedIn
```

## Brand Pillars

Content is generated around these strategic themes:

- ✅ AI for Content Creation & Workflow Automation
- ✅ LinkedIn Automation Tools, Tactics & Growth Strategies
- ✅ Solopreneur Productivity Hacks Using AI & Automation
- ✅ Systems Thinking for Scaling Personal Brands
- ✅ The Future of Work, Creators, and Automated Influence
- ✅ No-Code Tools for Content & Lead Gen Automation

## Nodes Breakdown

### 1. Schedule Trigger
- **Runs:** Every 6 hours
- **Purpose:** Initiates the content generation workflow

### 2. Content Topic Generator
- **Model:** GPT-4o-mini
- **Output:** Topic title, rationale, and hook
- **Style:** Founder-energy, contrarian, insight-driven

**Example Output:**
```json
{
  "title": "AI as Your First Content Hire: Why Founders Shouldn't Wait to Outsource Creation",
  "rationale": "Most solopreneurs delay content scaling because they think hiring a ghostwriter is the next step — but AI can handle 80% with proper systems.",
  "hook": "Ghostwriters are outdated. Train GPT once, and it ships LinkedIn gold in your voice daily."
}
```

### 3. Content Creator
- **Model:** GPT-4o-mini
- **Input:** Topic, rationale, hook
- **Output:** Full LinkedIn post + image description

**Example Output:**
```json
{
  "post title": "Exciting New Feature Launch 🚀",
  "post content": "After months of collaboration...",
  "image description": "A laptop screen showcasing the new Smart Insights dashboard..."
}
```

### 4. Image Generator (DALL-E)
- **Model:** DALL-E (via OpenAI)
- **Input:** Image description from content creator
- **Output:** Realistic LinkedIn-ready image

### 5. Hashtag Generator
- **Model:** GPT-4o-mini
- **Output:**
  - 3-5 broad hashtags (#AI, #Marketing)
  - 3-5 niche hashtags (#LinkedInAutomation)
  - 1-2 trending hashtags (#FutureOfWork)

### 6. Merge & Post
- Combines image and hashtags
- Posts to LinkedIn as organization

## Setup Instructions

### Prerequisites

1. **n8n instance** (self-hosted or cloud)
2. **OpenAI API key** (for GPT-4o-mini + DALL-E)
3. **LinkedIn OAuth2 credentials**

### Installation

1. **Import Workflow**
   ```bash
   # In n8n UI:
   # Settings → Import from File
   # Select: linkedin-ai-content-automation.json
   ```

2. **Configure Credentials**

   Update these credential IDs:

   ```json
   // OpenAI API (3 nodes)
   "credentials": {
     "openAiApi": {
       "id": "YOUR_OPENAI_CREDENTIAL_ID",
       "name": "OpenAI API"
     }
   }

   // LinkedIn OAuth2
   "credentials": {
     "linkedInOAuth2Api": {
       "id": "YOUR_LINKEDIN_CREDENTIAL_ID",
       "name": "LinkedIn OAuth2 API"
     }
   }
   ```

3. **Set Up OpenAI Credentials**
   - n8n → Credentials → Create New
   - Type: OpenAI
   - Add your `OPENAI_API_KEY`

4. **Set Up LinkedIn Credentials**
   - n8n → Credentials → Create New
   - Type: LinkedIn OAuth2
   - Follow OAuth flow to connect your LinkedIn account

5. **Activate Workflow**
   - Toggle "Active" to start scheduling
   - Or run manually for testing

## Customization

### Change Posting Schedule

Edit the Schedule Trigger node:

```json
"parameters": {
  "rule": {
    "interval": [{
      "field": "hours",
      "hoursInterval": 6  // Change this
    }]
  }
}
```

Options:
- Every 3 hours: `"hoursInterval": 3`
- Daily at 9 AM: Use cron expression
- Multiple times per day: Use cron expression

### Customize Brand Voice

Edit the **Content Topic Generator** prompt:

```
You are a Content Researcher Assistant at [YOUR BRAND]...

Focus on:
- [Your pillar 1]
- [Your pillar 2]
- [Your pillar 3]

Style Guide:
- [Your voice traits]
```

### Change AI Model

Replace `gpt-4o-mini` with:
- `gpt-4o` (more powerful, more expensive)
- `gpt-4-turbo` (balanced)
- `gpt-3.5-turbo` (cheaper, faster)

### Post as Personal Profile

In the LinkedIn node, change:

```json
"parameters": {
  "postAs": "person"  // instead of "organization"
}
```

## Cost Estimation

Based on OpenAI pricing (as of Dec 2024):

**Per Post:**
- Topic Generation: ~$0.001
- Content Creation: ~$0.002
- Image Generation (DALL-E): ~$0.04
- Hashtag Generation: ~$0.001
- **Total: ~$0.044 per post**

**Monthly (4 posts/day):**
- 120 posts × $0.044 = **~$5.28/month**

*Prices may vary based on actual token usage and OpenAI pricing changes.*

## Workflow File

**Location:** `/Users/steven/workspace/linkedin-ai-content-automation.json`

**Import to n8n:**
1. Open n8n
2. Settings → Workflows → Import from File
3. Select the JSON file
4. Configure credentials
5. Activate

## Example Output

### Generated Post

**Title:** "AI as Your First Content Hire"

**Content:**
```
Ghostwriters are outdated.

Here's why AI should be your first content hire:

→ Writes in YOUR voice after proper training
→ Ships content daily without burnout
→ Costs 1/100th of a human ghostwriter
→ Scales infinitely

Most founders delay content because they think
hiring a writer is the "next step."

But AI can handle 80% with the right systems.

Content shifts from creative bottleneck to
scalable growth lever.

Welcome to hands-free thought leadership.

#AI #ContentCreation #LinkedInGrowth #Automation
```

**Image:** Professional DALL-E generated visual

**Posted:** Automatically to LinkedIn every 6 hours

## Troubleshooting

### Workflow Not Triggering

- Check if workflow is "Active"
- Verify Schedule Trigger settings
- Check n8n execution logs

### LinkedIn Post Failed

- Verify LinkedIn OAuth2 credentials
- Check if token expired (re-authenticate)
- Ensure image is valid format

### Poor Content Quality

- Adjust prompts in agent nodes
- Switch to more powerful model (gpt-4o)
- Add more context in system prompts

### Rate Limits

- OpenAI: Default 3 requests/minute (check your tier)
- LinkedIn: ~100 posts/day (check current limits)

## Advanced Features

### Add Content Approval

Insert a **Webhook** node before LinkedIn:

1. Content generated → Sent to Slack/Email
2. You click approve/reject
3. Only approved posts go to LinkedIn

### Multi-Platform Posting

Duplicate the final merge branch to post to:
- Twitter/X
- Facebook
- Medium

### A/B Testing

Create multiple content creator variants with different tones, measure engagement.

### Content Calendar

Store generated posts in Airtable/Notion, schedule for specific dates.

## Resources

- [n8n Documentation](https://docs.n8n.io/)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [LinkedIn API Docs](https://learn.microsoft.com/en-us/linkedin/)

## License

Workflow template provided as-is. Customize for your brand.

---

**Created for Agentic Vibe**
*AI-first automation for LinkedIn growth*
