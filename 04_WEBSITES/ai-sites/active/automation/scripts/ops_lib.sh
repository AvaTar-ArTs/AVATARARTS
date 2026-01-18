#!/bin/bash
set -euo pipefail
OPS_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG_CSV="$OPS_DIR/ops_log.csv"
mkdir -p "$OPS_DIR"
if [ ! -f "$LOG_CSV" ]; then
  echo "timestamp,action,src_path,dst_path,status,notes,size_before,size_after" > "$LOG_CSV"
fi
log_op(){
  local action="$1"; local src="$2"; local dst="$3"; local status="$4"; local notes="$5"; local sb="$6"; local sa="$7";
  local ts; ts="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "$ts,$(printf %q "$action"),$(printf %q "$src"),$(printf %q "$dst"),$(printf %q "$status"),$(printf %q "$notes"),$sb,$sa" >> "$LOG_CSV"
}
size_of(){ du -k "$1" 2>/dev/null | tail -1 | awk '{print $1}'; }
