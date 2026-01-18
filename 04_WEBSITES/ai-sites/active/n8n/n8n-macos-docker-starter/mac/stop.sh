#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
# stop any of the stacks if running; ignore errors
docker compose -f compose.minimal.yml down || true
docker compose -f compose.postgres.local.yml down || true
docker compose -f compose.caddy.local.yml down || true
