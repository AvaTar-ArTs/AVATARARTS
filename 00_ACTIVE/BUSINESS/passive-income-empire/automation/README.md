# n8n Automation Hub

## Quick Start

```bash
cd ~/ai-sites/passive-income-empire/automation
docker compose up -d
# open http://localhost:5678
```

## Workflows
- social-media-scheduler.json
- lead-router.json
- music-promotion.json
- analytics-daily-report.json

Import each JSON in n8n (top-right menu → Import from file).

## Environment Variables (set in n8n UI or .env)
- TWILIO_SID / TWILIO_TOKEN
- SENDGRID_API_KEY or SMTP creds
- YOUTUBE_API_KEY
- GOOGLE_SHEETS creds (OAuth)
- GA4_MEASUREMENT_ID / API_SECRET
