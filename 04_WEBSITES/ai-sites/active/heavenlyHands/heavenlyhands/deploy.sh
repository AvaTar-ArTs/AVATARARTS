#!/bin/bash
# Deployment script for heavenlyhands.avatararts.org

echo "🚀 Deploying Heavenly Hands to subdomain..."

# Set up the directory structure
mkdir -p /home/u841983302/domains/avatararts.org/public_html/heavenlyhands

# Copy files to the subdomain directory
cp app.py /home/u841983302/domains/avatararts.org/public_html/heavenlyhands/
cp twilio_config.py /home/u841983302/domains/avatararts.org/public_html/heavenlyhands/
cp requirements.txt /home/u841983302/domains/avatararts.org/public_html/heavenlyhands/
cp heavenly_hands_dashboard.html /home/u841983302/domains/avatararts.org/public_html/heavenlyhands/templates/

# Create templates directory
mkdir -p /home/u841983302/domains/avatararts.org/public_html/heavenlyhands/templates

# Set permissions
chmod -R 755 /home/u841983302/domains/avatararts.org/public_html/heavenlyhands/
chown -R u841983302:u841983302 /home/u841983302/domains/avatararts.org/public_html/heavenlyhands/

# Create .htaccess for Python execution
cat > /home/u841983302/domains/avatararts.org/public_html/heavenlyhands/.htaccess << 'EOF'
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ app.py/$1 [QSA,L]
EOF

echo "✅ Deployment complete!"
echo "🌐 Your site will be available at: https://heavenlyhands.avatararts.org"
echo "📋 Next steps:"
echo "1. Configure subdomain in your hosting control panel"
echo "2. Set up Python environment"
echo "3. Install requirements: pip install -r requirements.txt"
echo "4. Configure Twilio webhook URL: https://heavenlyhands.avatararts.org/webhook"