
# n8n Docker Starter (Traefik & Caddy options)

This starter lets you deploy **n8n** with Docker in minutes. It includes:

- `compose.traefik.yml` — Official-style TLS via **Traefik** (simple, default).
- `compose.postgres-traefik.yml` — Adds **Postgres** for production data durability.
- `compose.caddy.yml` — Same idea using **Caddy** (Automatic HTTPS).
- `.env.example` — Fill this in and rename to `.env`.
- `README.md` — This file.

> Prereqs: A domain or subdomain pointing at your server’s public IP (A record). Open ports **80** and **443** to the host.

## 1) Install Docker (Ubuntu example)

```bash
# Add Docker’s official repo and install Engine + Compose plugin
sudo apt-get update
sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo   "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu   $(. /etc/os-release && echo \"${UBUNTU_CODENAME:-$VERSION_CODENAME}\") stable" |   sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# (Optional) run Docker without sudo for your user
sudo usermod -aG docker $USER
newgrp docker
docker run --rm hello-world
```

## 2) Prepare project folder

```bash
mkdir -p ~/n8n && cd ~/n8n
# Copy files from this ZIP into this folder
cp /path/to/n8n-docker-starter/* . -R
cp .env.example .env
```

## 3) Generate secrets and edit `.env`

```bash
# Generate a strong key for n8n
openssl rand -base64 32

# Generate a Postgres password (if using the Postgres compose)
openssl rand -hex 32
```

Open `.env` and fill values. The important ones:
- `DOMAIN_NAME`, `SUBDOMAIN` (or `N8N_HOST` for Caddy file)
- `SSL_EMAIL` (for TLS via ACME/Let’s Encrypt)
- `N8N_ENCRYPTION_KEY`
- `POSTGRES_*` (if using Postgres compose)

## 4) Launch with Traefik (default)

```bash
docker compose -f compose.traefik.yml up -d
# Then visit: https://$SUBDOMAIN.$DOMAIN_NAME
```

## 5) Launch with Postgres

```bash
docker compose -f compose.postgres-traefik.yml up -d
```

## 6) Launch with Caddy (alternative)

```bash
docker compose -f compose.caddy.yml up -d
```

## Common tasks

**Update n8n:**

```bash
docker compose -f compose.traefik.yml pull
docker compose -f compose.traefik.yml up -d
```

**Back up Postgres:**

```bash
# Adjust container name if different
docker exec -t n8n-postgres pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" > ./backup_$(date +%F).sql
```

**Logs:**

```bash
docker compose -f compose.traefik.yml logs -f n8n
docker compose -f compose.traefik.yml logs -f traefik
```

---

**Security notes**
- Keep your `.env` out of version control.
- Always set `N8N_ENCRYPTION_KEY` before first run.
- Use strong, unique Postgres credentials if using that variant.
