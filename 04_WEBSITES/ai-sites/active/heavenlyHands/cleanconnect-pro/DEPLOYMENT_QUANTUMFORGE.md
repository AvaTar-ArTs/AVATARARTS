# CleanConnect Pro - Live Deployment Guide
## Quantum Forge Labs Production Setup

[![Deployment Status](https://img.shields.io/badge/Deployment-Ready-green)](https://quantumforgelabs.org)
[![SSL Certificate](https://img.shields.io/badge/SSL-Valid-green)](https://quantumforgelabs.org)
[![CDN](https://img.shields.io/badge/CDN-CloudFlare-blue)](https://cloudflare.com)

> **Complete production deployment guide for CleanConnect Pro on quantumforgelabs.org domain with enterprise-grade security, performance, and scalability.**

---

## 🌐 **Production Domain Setup**

### **Primary Domain Configuration**
- **Main Site**: `https://cleanconnect.quantumforgelabs.org`
- **API**: `https://api.cleanconnect.quantumforgelabs.org`
- **Admin**: `https://admin.cleanconnect.quantumforgelabs.org`
- **Mobile**: `https://mobile.cleanconnect.quantumforgelabs.org`

### **Subdomain Structure**
```
quantumforgelabs.org/
├── cleanconnect.quantumforgelabs.org/     # Main marketplace
├── api.cleanconnect.quantumforgelabs.org/ # REST API
├── admin.cleanconnect.quantumforgelabs.org/ # Admin dashboard
├── mobile.cleanconnect.quantumforgelabs.org/ # Mobile PWA
└── docs.cleanconnect.quantumforgelabs.org/ # Documentation
```

---

## 🚀 **Quick Deployment (5 Minutes)**

### **1. Server Preparation**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL 14+
sudo apt install postgresql postgresql-contrib

# Install Nginx
sudo apt install nginx

# Install PM2
sudo npm install -g pm2
```

### **2. Clone & Setup**
```bash
# Clone repository
git clone https://github.com/quantumforgelabs/cleanconnect-pro.git
cd cleanconnect-pro

# Install dependencies
npm install --production

# Install frontend dependencies
cd frontend && npm install && npm run build && cd ..
```

### **3. Database Setup**
```bash
# Create production database
sudo -u postgres createdb cleanconnect_pro

# Create user
sudo -u postgres psql -c "CREATE USER cleanconnect_user WITH PASSWORD 'secure_production_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE cleanconnect_pro TO cleanconnect_user;"

# Run schema
psql -U cleanconnect_user -d cleanconnect_pro -f database-schema.sql
```

### **4. Environment Configuration**
```bash
# Create production environment file
cat > .env << EOF
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cleanconnect_pro
DB_USER=cleanconnect_user
DB_PASSWORD=secure_production_password

# JWT Secrets (Generate secure keys)
JWT_SECRET=$(openssl rand -base64 64)
JWT_REFRESH_SECRET=$(openssl rand -base64 64)

# Production URLs
NODE_ENV=production
PORT=3000
API_BASE_URL=https://api.cleanconnect.quantumforgelabs.org
FRONTEND_URL=https://cleanconnect.quantumforgelabs.org

# Stripe (Replace with your keys)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Replace with your service)
SENDGRID_API_KEY=SG...
FROM_EMAIL=noreply@quantumforgelabs.org

# SMS (Replace with your service)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...

# Google Maps
GOOGLE_MAPS_API_KEY=AIza...

# Redis (Optional but recommended)
REDIS_URL=redis://localhost:6379

# Monitoring
SENTRY_DSN=https://...
EOF
```

### **5. Start Application**
```bash
# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save
pm2 startup
```

---

## 🔧 **Nginx Configuration**

### **Main Configuration File**
```bash
# Create main site config
sudo nano /etc/nginx/sites-available/cleanconnect.quantumforgelabs.org
```

```nginx
# Main CleanConnect Pro Site
server {
    listen 80;
    server_name cleanconnect.quantumforgelabs.org;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name cleanconnect.quantumforgelabs.org;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/cleanconnect.quantumforgelabs.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cleanconnect.quantumforgelabs.org/privkey.pem;
    
    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://maps.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.stripe.com https://maps.googleapis.com; frame-src https://js.stripe.com;" always;
    
    # Root directory
    root /var/www/cleanconnect-pro/frontend/dist;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # Main application
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API proxy
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
    
    # WebSocket support
    location /socket.io/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### **API Subdomain Configuration**
```bash
# Create API config
sudo nano /etc/nginx/sites-available/api.cleanconnect.quantumforgelabs.org
```

```nginx
# API Subdomain
server {
    listen 80;
    server_name api.cleanconnect.quantumforgelabs.org;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.cleanconnect.quantumforgelabs.org;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/api.cleanconnect.quantumforgelabs.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.cleanconnect.quantumforgelabs.org/privkey.pem;
    
    # Security Headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # API proxy
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Rate limiting
        limit_req zone=api burst=20 nodelay;
    }
    
    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}

# Rate limiting zones
http {
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
}
```

### **Admin Subdomain Configuration**
```bash
# Create admin config
sudo nano /etc/nginx/sites-available/admin.cleanconnect.quantumforgelabs.org
```

```nginx
# Admin Dashboard
server {
    listen 80;
    server_name admin.cleanconnect.quantumforgelabs.org;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name admin.cleanconnect.quantumforgelabs.org;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/admin.cleanconnect.quantumforgelabs.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/admin.cleanconnect.quantumforgelabs.org/privkey.pem;
    
    # Enhanced security for admin
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # IP whitelist (optional)
    # allow 192.168.1.0/24;
    # deny all;
    
    root /var/www/cleanconnect-pro/admin;
    index admin-dashboard.html;
    
    location / {
        try_files $uri $uri/ /admin-dashboard.html;
    }
    
    # API proxy for admin
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### **Enable Sites**
```bash
# Enable all sites
sudo ln -s /etc/nginx/sites-available/cleanconnect.quantumforgelabs.org /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/api.cleanconnect.quantumforgelabs.org /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/admin.cleanconnect.quantumforgelabs.org /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## 🔒 **SSL Certificate Setup**

### **Install Certbot**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificates for all subdomains
sudo certbot --nginx -d cleanconnect.quantumforgelabs.org
sudo certbot --nginx -d api.cleanconnect.quantumforgelabs.org
sudo certbot --nginx -d admin.cleanconnect.quantumforgelabs.org
sudo certbot --nginx -d mobile.cleanconnect.quantumforgelabs.org

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 📁 **File Structure Setup**

### **Create Directory Structure**
```bash
# Create web directories
sudo mkdir -p /var/www/cleanconnect-pro/{frontend,admin,mobile,api}

# Set permissions
sudo chown -R www-data:www-data /var/www/cleanconnect-pro
sudo chmod -R 755 /var/www/cleanconnect-pro

# Copy files
sudo cp -r frontend/dist/* /var/www/cleanconnect-pro/frontend/
sudo cp admin-dashboard.html /var/www/cleanconnect-pro/admin/
sudo cp mobile-app-interface.html /var/www/cleanconnect-pro/mobile/
```

---

## 🗄️ **Database Production Setup**

### **PostgreSQL Configuration**
```bash
# Edit PostgreSQL config
sudo nano /etc/postgresql/14/main/postgresql.conf

# Update these settings:
max_connections = 200
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100

# Edit pg_hba.conf
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Add production access
host    cleanconnect_pro    cleanconnect_user    127.0.0.1/32    md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### **Database Optimization**
```sql
-- Connect to database
psql -U cleanconnect_user -d cleanconnect_pro

-- Create indexes for performance
CREATE INDEX CONCURRENTLY idx_bookings_status_date ON bookings(status, scheduled_date);
CREATE INDEX CONCURRENTLY idx_users_type_active ON users(user_type, is_active);
CREATE INDEX CONCURRENTLY idx_requests_status_created ON cleaning_requests(status, created_at);
CREATE INDEX CONCURRENTLY idx_quotes_status_created ON quotes(status, created_at);

-- Analyze tables
ANALYZE;

-- Create backup user
CREATE USER backup_user WITH PASSWORD 'backup_password';
GRANT SELECT ON ALL TABLES IN SCHEMA public TO backup_user;
```

---

## 🔄 **PM2 Process Management**

### **Ecosystem Configuration**
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'cleanconnect-api',
    script: './src/app.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/cleanconnect/err.log',
    out_file: '/var/log/cleanconnect/out.log',
    log_file: '/var/log/cleanconnect/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
```

### **PM2 Commands**
```bash
# Start application
pm2 start ecosystem.config.js

# Monitor
pm2 monit

# View logs
pm2 logs cleanconnect-api

# Restart
pm2 restart cleanconnect-api

# Stop
pm2 stop cleanconnect-api

# Save configuration
pm2 save

# Setup startup
pm2 startup
```

---

## 📊 **Monitoring & Logging**

### **Setup Logging**
```bash
# Create log directory
sudo mkdir -p /var/log/cleanconnect
sudo chown -R www-data:www-data /var/log/cleanconnect

# Setup log rotation
sudo nano /etc/logrotate.d/cleanconnect
```

```bash
# Log rotation configuration
/var/log/cleanconnect/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        pm2 reloadLogs
    endscript
}
```

### **Health Monitoring**
```bash
# Create health check script
sudo nano /usr/local/bin/cleanconnect-health.sh
```

```bash
#!/bin/bash
# Health check script

# Check API
if ! curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "API is down" | mail -s "CleanConnect API Alert" admin@quantumforgelabs.org
    pm2 restart cleanconnect-api
fi

# Check database
if ! pg_isready -h localhost -p 5432 -U cleanconnect_user > /dev/null 2>&1; then
    echo "Database is down" | mail -s "CleanConnect DB Alert" admin@quantumforgelabs.org
fi

# Check disk space
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "Disk usage is ${DISK_USAGE}%" | mail -s "CleanConnect Disk Alert" admin@quantumforgelabs.org
fi
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/cleanconnect-health.sh

# Add to crontab
sudo crontab -e
# Add: */5 * * * * /usr/local/bin/cleanconnect-health.sh
```

---

## 🔐 **Security Hardening**

### **Firewall Configuration**
```bash
# Install UFW
sudo apt install ufw

# Configure firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### **Fail2Ban Setup**
```bash
# Install Fail2Ban
sudo apt install fail2ban

# Configure for Nginx
sudo nano /etc/fail2ban/jail.local
```

```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[nginx-http-auth]
enabled = true

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
logpath = /var/log/nginx/error.log
maxretry = 10
```

### **Security Headers**
```bash
# Create security headers file
sudo nano /etc/nginx/conf.d/security.conf
```

```nginx
# Security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

# Hide Nginx version
server_tokens off;

# Limit request size
client_max_body_size 10M;

# Timeouts
client_body_timeout 12;
client_header_timeout 12;
keepalive_timeout 15;
send_timeout 10;
```

---

## 🚀 **Performance Optimization**

### **Redis Caching**
```bash
# Install Redis
sudo apt install redis-server

# Configure Redis
sudo nano /etc/redis/redis.conf
```

```conf
# Redis configuration
maxmemory 256mb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
```

### **CDN Setup (CloudFlare)**
1. Add domain to CloudFlare
2. Update nameservers
3. Enable caching
4. Configure SSL/TLS
5. Enable compression
6. Setup page rules

### **Database Connection Pooling**
```javascript
// config/database.js
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});
```

---

## 📈 **Analytics & Monitoring**

### **Google Analytics Setup**
```html
<!-- Add to all HTML files -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### **Sentry Error Tracking**
```bash
# Install Sentry
npm install @sentry/node @sentry/integrations
```

```javascript
// Initialize Sentry
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

---

## 🔄 **Backup Strategy**

### **Database Backup**
```bash
# Create backup script
sudo nano /usr/local/bin/cleanconnect-backup.sh
```

```bash
#!/bin/bash
# Database backup script

BACKUP_DIR="/var/backups/cleanconnect"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="cleanconnect_pro_$DATE.sql"

mkdir -p $BACKUP_DIR

# Create backup
pg_dump -U cleanconnect_user -h localhost cleanconnect_pro > $BACKUP_DIR/$BACKUP_FILE

# Compress backup
gzip $BACKUP_DIR/$BACKUP_FILE

# Keep only last 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

# Upload to cloud storage (optional)
# aws s3 cp $BACKUP_DIR/$BACKUP_FILE.gz s3://quantumforgelabs-backups/
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/cleanconnect-backup.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/cleanconnect-backup.sh
```

---

## 🧪 **Testing Production**

### **Smoke Tests**
```bash
# Test main site
curl -I https://cleanconnect.quantumforgelabs.org

# Test API
curl -I https://api.cleanconnect.quantumforgelabs.org/health

# Test admin
curl -I https://admin.cleanconnect.quantumforgelabs.org

# Test mobile
curl -I https://mobile.cleanconnect.quantumforgelabs.org
```

### **Performance Tests**
```bash
# Install artillery
npm install -g artillery

# Run load test
artillery quick --count 100 --num 10 https://cleanconnect.quantumforgelabs.org
```

---

## 📋 **Post-Deployment Checklist**

### **Functionality Tests**
- [ ] User registration works
- [ ] Login/logout functions
- [ ] Property management
- [ ] Cleaning request submission
- [ ] Quote system
- [ ] Booking process
- [ ] Payment processing
- [ ] Real-time tracking
- [ ] Mobile app functionality
- [ ] Admin dashboard access

### **Performance Tests**
- [ ] Page load times < 3 seconds
- [ ] API response times < 500ms
- [ ] Mobile performance
- [ ] SSL certificate valid
- [ ] CDN working
- [ ] Caching enabled

### **Security Tests**
- [ ] HTTPS redirects working
- [ ] Security headers present
- [ ] Firewall configured
- [ ] Fail2Ban active
- [ ] Database secured
- [ ] API rate limiting

---

## 🆘 **Troubleshooting**

### **Common Issues**

**1. 502 Bad Gateway**
```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs cleanconnect-api

# Restart application
pm2 restart cleanconnect-api
```

**2. Database Connection Error**
```bash
# Check PostgreSQL
sudo systemctl status postgresql

# Test connection
psql -U cleanconnect_user -d cleanconnect_pro -h localhost
```

**3. SSL Certificate Issues**
```bash
# Check certificate
sudo certbot certificates

# Renew certificate
sudo certbot renew --dry-run
```

**4. Nginx Configuration Error**
```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log
```

---

## 📞 **Support & Maintenance**

### **Regular Maintenance Tasks**
- [ ] Daily database backups
- [ ] Weekly log rotation
- [ ] Monthly security updates
- [ ] Quarterly performance reviews
- [ ] Annual SSL certificate renewal

### **Monitoring Alerts**
- [ ] Server uptime monitoring
- [ ] Database performance monitoring
- [ ] API response time monitoring
- [ ] Error rate monitoring
- [ ] Disk space monitoring

---

## 🎯 **Success Metrics**

### **Performance Targets**
- **Uptime**: 99.9%
- **Page Load**: < 3 seconds
- **API Response**: < 500ms
- **Mobile Score**: 90+
- **SEO Score**: 95+

### **Business Metrics**
- **User Growth**: 20% monthly
- **Conversion Rate**: 15%
- **User Retention**: 70%
- **Average Rating**: 4.5+

---

**🚀 Your CleanConnect Pro platform is now live at https://cleanconnect.quantumforgelabs.org**

*Built with ❤️ by [Quantum Forge Labs](https://quantumforgelabs.org) - Transforming the future of local services through AI and innovation.*