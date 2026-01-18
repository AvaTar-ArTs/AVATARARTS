#!/bin/bash
# FTP Upload Script for SEO-revenue/all/
# Uploads /Users/steven/AVATARARTS/all/ to ftp://u365102102@avatararts.org/domains/avatararts.org/public_html/SEO-revenue/all/

set -euo pipefail

# IMPORTANT: Do not hardcode credentials in this repo.
# Provide via environment variables or enter interactively.
FTP_HOST="${FTP_HOST:-82.29.199.248}"
FTP_PORT="${FTP_PORT:-21}"
FTP_PATH="${FTP_PATH:-/domains/avatararts.org/public_html/SEO-revenue}"
LOCAL_DIR="${LOCAL_DIR:-/Users/steven/AVATARARTS/all}"

FTP_USER="${FTP_USER:-}"
FTP_PASS="${FTP_PASS:-}"

if [ -z "$FTP_USER" ]; then
  read -r -p "FTP Username: " FTP_USER
fi

if [ -z "$FTP_PASS" ]; then
  read -r -s -p "FTP Password: " FTP_PASS
  echo ""
fi

echo "🚀 Starting FTP Upload..."
echo "=========================================="
echo "Host: $FTP_HOST:$FTP_PORT"
echo "User: $FTP_USER"
echo "Remote Path: $FTP_PATH/all/"
echo "Local Directory: $LOCAL_DIR"
echo "=========================================="
echo ""

# Check if lftp is available (best option)
if command -v lftp &> /dev/null; then
    echo "✅ Using lftp for upload..."
    lftp -u "$FTP_USER,$FTP_PASS" -p "$FTP_PORT" -e "
set ftp:ssl-allow no
set ssl:verify-certificate no
set ftp:passive-mode yes
cd $FTP_PATH
mirror -R --delete --verbose --exclude-glob='.*' $LOCAL_DIR all
quit
" "$FTP_HOST"

    UPLOAD_EXIT_CODE=$?
    if [ $UPLOAD_EXIT_CODE -eq 0 ]; then
        echo ""
        echo "✅ Upload complete!"
    else
        echo ""
        echo "⚠️  Upload exit code: $UPLOAD_EXIT_CODE"
        echo "Check output above for details."
    fi

# Check if ncftp is available
elif command -v ncftp &> /dev/null; then
    echo "✅ Using ncftp for upload..."
    ncftp -u "$FTP_USER" -p "$FTP_PASS" "$FTP_HOST" <<EOF
cd $FTP_PATH
put -R $LOCAL_DIR all
quit
EOF
    echo ""
    echo "✅ Upload complete!"

# Use standard ftp
elif command -v ftp &> /dev/null; then
    echo "✅ Using standard ftp for upload..."
    ftp -n "$FTP_HOST" <<EOF
user $FTP_USER $FTP_PASS
binary
cd $FTP_PATH
lcd $LOCAL_DIR
prompt off
mput -R *
quit
EOF
    echo ""
    echo "✅ Upload complete!"

else
    echo "❌ No FTP client found. Please install one:"
    echo "   - lftp (recommended): brew install lftp"
    echo "   - Or use FileZilla/Cyberduck GUI client"
    echo ""
    echo "Manual upload instructions:"
    echo "1. Connect to: ftp://$FTP_USER@$FTP_HOST"
    echo "2. Navigate to: $FTP_PATH"
    echo "3. Upload entire 'all' folder from: $LOCAL_DIR"
    exit 1
fi

echo ""
echo "🌐 Verify at: https://avatararts.org/SEO-revenue/all/"
