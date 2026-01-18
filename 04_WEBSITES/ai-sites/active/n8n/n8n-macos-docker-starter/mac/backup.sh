#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
# Backup Postgres
docker exec -t n8n-postgres pg_dump -U "${POSTGRES_USER:-n8n}" "${POSTGRES_DB:-n8n}" > "./backup_$(date +%F).sql"
echo "Backup written to $(pwd)/backup_$(date +%F).sql"
