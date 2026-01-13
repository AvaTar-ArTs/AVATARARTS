# n8n Local Setup (Lightweight Docker)

A lightweight Docker setup for n8n with disk usage monitoring and cleanup tools.

## Quick Start

1. **Copy environment file:**
   ```bash
   cp .env.example .env
   # Edit .env and set your password
   ```

2. **Start n8n:**
   ```bash
   docker-compose up -d
   ```

3. **Access n8n:**
   Open http://localhost:5678 in your browser

4. **Stop n8n:**
   ```bash
   docker-compose down
   ```

## Disk Usage Management

### Monitor Docker Disk Usage

```bash
python docker-disk-monitor.py
```

This will:
- Show detailed Docker disk usage
- Warn if usage exceeds 10GB
- Alert if usage exceeds 20GB

### Clean Up Docker

```bash
python docker-cleanup.py
```

This safely removes:
- Stopped containers
- Unused images
- Unused volumes (⚠️ **NOT n8n_data** - your workflows are safe)
- Build cache

### Prevent Docker Bloat

**Automatic cleanup (recommended):**
- Set up a cron job to run cleanup weekly:
  ```bash
  # Add to crontab (crontab -e)
  0 2 * * 0 cd /path/to/n8n-local && python docker-cleanup.py
  ```

**Manual monitoring:**
- Run `python docker-disk-monitor.py` weekly
- Clean up when usage gets above 10GB

**Docker settings:**
- Log rotation is already configured (max 10MB per container, 3 files)
- Resource limits are set (2GB RAM, 1 CPU)

## Configuration

Edit `.env` to customize:
- `N8N_USER` - Username for basic auth
- `N8N_PASSWORD` - Password (change this!)
- `N8N_HOST` - Hostname (for webhooks)
- `WEBHOOK_URL` - Full webhook URL
- `TZ` - Timezone

## Data Persistence

Your n8n workflows and data are stored in a Docker volume `n8n_data`. This persists even if you remove the container.

**To backup:**
```bash
docker run --rm -v n8n_local_n8n_data:/data -v $(pwd):/backup alpine tar czf /backup/n8n-backup-$(date +%Y%m%d).tar.gz /data
```

**To restore:**
```bash
docker run --rm -v n8n_local_n8n_data:/data -v $(pwd):/backup alpine tar xzf /backup/n8n-backup-YYYYMMDD.tar.gz -C /
```

## Troubleshooting

**Check if n8n is running:**
```bash
docker-compose ps
```

**View logs:**
```bash
docker-compose logs -f n8n
```

**Restart n8n:**
```bash
docker-compose restart
```

**Reset everything (⚠️ deletes all workflows):**
```bash
docker-compose down -v
docker-compose up -d
```

## Disk Usage Tips

1. **Regular cleanup:** Run cleanup script weekly
2. **Monitor usage:** Check disk usage monthly
3. **Remove unused images:** Docker keeps old image versions
4. **Limit log size:** Already configured (10MB max per container)
5. **Use specific image tags:** Using `:latest` can accumulate old versions

## Size Estimates

- **n8n image:** ~500MB
- **n8n data volume:** Grows with workflows (typically <100MB for small setups)
- **Total expected:** ~1-2GB for basic setup

If you see much larger usage, run the cleanup script!
