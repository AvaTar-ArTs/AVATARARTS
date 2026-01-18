#!/bin/bash
# Slack/Discord webhook notifications for sales/leads
set -euo pipefail

SLACK_WEBHOOK="${SLACK_WEBHOOK_URL:-}"
DISCORD_WEBHOOK="${DISCORD_WEBHOOK_URL:-}"

MESSAGE="${1:-New event occurred}"
EMOJI="${2:-💰}"

if [ -n "$SLACK_WEBHOOK" ]; then
  curl -X POST -H 'Content-type: application/json' \
    --data "{\"text\":\"$EMOJI $MESSAGE\"}" \
    "$SLACK_WEBHOOK" 2>/dev/null
fi

if [ -n "$DISCORD_WEBHOOK" ]; then
  curl -X POST -H 'Content-type: application/json' \
    --data "{\"content\":\"$EMOJI $MESSAGE\"}" \
    "$DISCORD_WEBHOOK" 2>/dev/null
fi

echo "✅ Notification sent: $MESSAGE"
