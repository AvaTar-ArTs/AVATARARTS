#!/bin/bash
set -euo pipefail

CONFIG_DIR="$(cd "$(dirname "$0")/.." && pwd)"
if [ -f "$CONFIG_DIR/config.env" ]; then
  set -a; source "$CONFIG_DIR/config.env"; set +a
fi
: "${SITE_EXPORT_DIR:?Set SITE_EXPORT_DIR in config.env}"
mkdir -p "$SITE_EXPORT_DIR"

echo "Publish dir: $SITE_EXPORT_DIR"
