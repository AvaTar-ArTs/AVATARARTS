# n8n Docker Starter — **macOS edition** (Intel or Apple Silicon)

This kit is tailored for **macOS**. It gives you three quick ways to run **n8n** with Docker:

- `compose.minimal.yml` — n8n only (uses built-in SQLite in `~/.n8n`). Fastest local test.
- `compose.postgres.local.yml` — n8n + Postgres (recommended for real work).
- `compose.caddy.local.yml` — Same as Postgres variant but fronted by **Caddy** with local HTTPS on `https://localhost` (uses Caddy's local CA).

> All commands assume you’re in this folder. On macOS, paths map cleanly into containers.

---

## 0) Prereqs (macOS)

### Option A — Docker Desktop (simplest)
```bash
brew install --cask docker
open -a Docker
# Wait until the whale icon is steady (Docker is running)
docker version
docker compose version
```

### Option B — Colima (no Docker Desktop)
```bash
brew install colima docker docker-compose
colima start
docker version
docker compose version
```
> If you switch between Docker Desktop and Colima, stop one before starting the other.

---

## 1) Project setup

```bash
mkdir -p ~/n8n && cd ~/n8n
# Place these files here (unzip the starter into this directory)
cp .env.example .env
```

Generate secrets:
```bash
# n8n encryption key (required)
openssl rand -base64 32

# Postgres password (if using Postgres)
openssl rand -hex 32
```

Open `.env` and set:
- `N8N_ENCRYPTION_KEY` (don’t skip)
- `TZ` and `GENERIC_TIMEZONE` (defaults to America/New_York)
- `POSTGRES_*` (if using the Postgres/Caddy compose)

---

## 2) Run n8n (pick one)

### A) Minimal (SQLite) — quickest local try
```bash
docker compose -f compose.minimal.yml up -d
open http://localhost:5678
```

### B) Postgres (recommended for durability)
```bash
docker compose -f compose.postgres.local.yml up -d
open http://localhost:5678
```

### C) Local HTTPS via Caddy
```bash
# One-time trust for Caddy's local CA (so browsers accept the cert automatically):
# (No action needed if you trust Caddy's local CA popup; otherwise see: brew install mkcert, mkcert -install)
docker compose -f compose.caddy.local.yml up -d
open https://localhost
```

> Your n8n data lives in the `n8n_data` volume; Postgres data lives in `pg_data`. You can also drop files into `./local-files` and access them at `/files` inside n8n.

---

## 3) Useful commands

**Update images & restart**
```bash
docker compose -f compose.postgres.local.yml pull
docker compose -f compose.postgres.local.yml up -d
```

**Tail logs**
```bash
docker compose -f compose.postgres.local.yml logs -f n8n
```

**Back up Postgres (creates a dump in the current folder)**
```bash
docker exec -t n8n-postgres pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" > "./backup_$(date +%F).sql"
```

**Stop & remove containers (keeps data volumes)**
```bash
docker compose -f compose.postgres.local.yml down
```

---

## 4) Exposing to the internet (optional)

For a real hosted setup, you’ll typically run this stack on a **cloud VM** with a domain + TLS (Traefik/Caddy). If you want to **share your mac** temporarily, consider tools like **Cloudflare Tunnel** or **Tailscale Funnel**. For production, use a VPS and the Traefik/ACME pattern.

---

## 5) Files in this kit

- `.env.example` — copy to `.env` and fill values.
- `compose.minimal.yml` — n8n only (SQLite).
- `compose.postgres.local.yml` — n8n + Postgres.
- `compose.caddy.local.yml` — Postgres stack + Caddy HTTPS (localhost).
- `Caddyfile.local` — Caddy reverse proxy with local TLS.
- `mac/start_minimal.sh`, `mac/start_postgres.sh`, `mac/start_caddy.sh`, `mac/stop.sh`, `mac/update.sh`, `mac/backup.sh` — helper scripts.
- `local-files/` — mounted into the n8n container at `/files`.
