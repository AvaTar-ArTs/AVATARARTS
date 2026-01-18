# n8n AI Agent Workflows

This directory contains n8n workflow templates for AI content generation automation.

## Files

- `ai_content_agent.json` - Main content generation orchestrator
- `content_research_agent.json` - Document analysis and pattern extraction
- `ai_optimization_agent.json` - Performance monitoring and optimization
- `credentials_template.json` - API credentials configuration
- `setup_n8n_workflows.sh` - Automated setup script

## Quick Start

1. **Start n8n:**
   ```bash
   n8n start
   ```

2. **Run setup script:**
   ```bash
   ./setup_n8n_workflows.sh
   ```

3. **Configure credentials:**
   - OpenAI API Key
   - SERP API Key
   - News API Key

4. **Import workflows:**
   - Go to n8n web interface
   - Import each JSON file
   - Configure webhook URLs

## Configuration

Update these URLs in each workflow:

- `webhook_url`: Your AI agent server URL
- `airtable_webhook_url`: Your Airtable webhook URL
- `notification_webhook`: Your notification webhook URL

## Support

For issues and questions, check the main setup guide:
`/Users/steven/n8n_setup_guide.md`
