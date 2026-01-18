# DNS Setup Guide for dradu.avatararts.org

## Subdomain Configuration

This guide will help you set up the `dradu.avatararts.org` subdomain for Dr. Adu's Gainesville PFS website.

### DNS Records Required

Add the following DNS records to your `avatararts.org` domain:

#### 1. A Record (Primary)
```
Type: A
Name: dradu
Value: YOUR_SERVER_IP_ADDRESS
TTL: 300 (5 minutes)
```

#### 2. CNAME Record (Alternative)
```
Type: CNAME
Name: dradu
Value: avatararts.org
TTL: 300 (5 minutes)
```

#### 3. AAAA Record (IPv6 - Optional)
```
Type: AAAA
Name: dradu
Value: YOUR_IPV6_ADDRESS
TTL: 300 (5 minutes)
```

### Server Configuration

#### Apache Virtual Host
Create a virtual host configuration file:

```apache
<VirtualHost *:80>
    ServerName dradu.avatararts.org
    ServerAlias www.dradu.avatararts.org
    DocumentRoot /var/www/dradu.avatararts.org
    Redirect permanent / https://dradu.avatararts.org/
</VirtualHost>

<VirtualHost *:443>
    ServerName dradu.avatararts.org
    ServerAlias www.dradu.avatararts.org
    DocumentRoot /var/www/dradu.avatararts.org
    
    SSLEngine on
    SSLCertificateFile /path/to/ssl/certificate.crt
    SSLCertificateKeyFile /path/to/ssl/private.key
    SSLCertificateChainFile /path/to/ssl/chain.crt
    
    # Security headers
    Header always set X-Frame-Options SAMEORIGIN
    Header always set X-Content-Type-Options nosniff
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    
    # Gzip compression
    LoadModule deflate_module modules/mod_deflate.so
    <Location />
        SetOutputFilter DEFLATE
        SetEnvIfNoCase Request_URI \
            \.(?:gif|jpe?g|png)$ no-gzip dont-vary
        SetEnvIfNoCase Request_URI \
            \.(?:exe|t?gz|zip|bz2|sit|rar)$ no-gzip dont-vary
    </Location>
    
    # Cache control
    <LocationMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
        ExpiresActive On
        ExpiresDefault "access plus 1 month"
    </LocationMatch>
</VirtualHost>
```

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name dradu.avatararts.org www.dradu.avatararts.org;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name dradu.avatararts.org www.dradu.avatararts.org;
    root /var/www/dradu.avatararts.org;
    index index.html index.htm;
    
    # SSL Configuration
    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;
    ssl_trusted_certificate /path/to/ssl/chain.crt;
    
    # Security headers
    add_header X-Frame-Options SAMEORIGIN;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload";
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Cache control
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1M;
        add_header Cache-Control "public, immutable";
    }
    
    # Main location
    location / {
        try_files $uri $uri/ =404;
    }
    
    # Security
    location ~ /\. {
        deny all;
    }
}
```

### SSL Certificate Setup

#### Option 1: Let's Encrypt (Recommended)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-apache

# Get certificate for subdomain
sudo certbot --apache -d dradu.avatararts.org -d www.dradu.avatararts.org

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### Option 2: Commercial SSL Certificate
1. Purchase SSL certificate for `dradu.avatararts.org`
2. Generate CSR (Certificate Signing Request)
3. Install certificate files on server
4. Configure web server to use certificate

### File Upload Instructions

1. **Upload Files to Server:**
   ```bash
   # Create directory
   sudo mkdir -p /var/www/dradu.avatararts.org
   
   # Upload files (using SCP/SFTP)
   scp -r /path/to/local/files/* user@server:/var/www/dradu.avatararts.org/
   
   # Set permissions
   sudo chown -R www-data:www-data /var/www/dradu.avatararts.org
   sudo chmod -R 755 /var/www/dradu.avatararts.org
   ```

2. **Set Proper Permissions:**
   ```bash
   # Make sure .htaccess is readable
   sudo chmod 644 /var/www/dradu.avatararts.org/.htaccess
   
   # Ensure directories are executable
   sudo find /var/www/dradu.avatararts.org -type d -exec chmod 755 {} \;
   
   # Ensure files are readable
   sudo find /var/www/dradu.avatararts.org -type f -exec chmod 644 {} \;
   ```

### Testing the Setup

1. **DNS Propagation Check:**
   ```bash
   # Check if DNS is propagated
   nslookup dradu.avatararts.org
   dig dradu.avatararts.org
   ```

2. **Website Accessibility:**
   - Visit `https://dradu.avatararts.org`
   - Check SSL certificate validity
   - Test all pages and functionality
   - Verify mobile responsiveness

3. **SEO Testing:**
   - Test with Google PageSpeed Insights
   - Check structured data with Google Rich Results Test
   - Validate HTML with W3C Validator
   - Test robots.txt and sitemap.xml

### Monitoring and Maintenance

#### 1. Set up monitoring:
```bash
# Install monitoring tools
sudo apt install htop iotop nethogs

# Set up log monitoring
sudo tail -f /var/log/apache2/access.log
sudo tail -f /var/log/apache2/error.log
```

#### 2. Regular backups:
```bash
# Create backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf /backups/dradu_avatararts_$DATE.tar.gz /var/www/dradu.avatararts.org
```

#### 3. Performance monitoring:
- Set up Google Analytics
- Monitor Core Web Vitals
- Track search rankings
- Monitor server resources

### Troubleshooting

#### Common Issues:

1. **DNS not propagating:**
   - Wait 24-48 hours for full propagation
   - Check with different DNS servers
   - Verify DNS record configuration

2. **SSL certificate issues:**
   - Check certificate validity
   - Ensure all domains are covered
   - Verify certificate chain

3. **Website not loading:**
   - Check server status
   - Verify file permissions
   - Check web server configuration
   - Review error logs

4. **SEO issues:**
   - Verify robots.txt accessibility
   - Check sitemap.xml
   - Validate structured data
   - Test mobile-friendliness

### Security Checklist

- [ ] SSL certificate installed and valid
- [ ] Security headers configured
- [ ] File permissions set correctly
- [ ] Sensitive files protected
- [ ] Regular security updates
- [ ] Firewall configured
- [ ] Backup system in place

### Performance Optimization

- [ ] Gzip compression enabled
- [ ] Browser caching configured
- [ ] Images optimized
- [ ] CSS/JS minified
- [ ] CDN configured (if applicable)
- [ ] Database optimized (if applicable)

---

**Need Help?**
Contact: steven@creative.com
For technical support with this subdomain setup.