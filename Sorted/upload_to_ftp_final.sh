#!/bin/bash
# FTP Upload Script for SEO-revenue/all/
# Using SSL/TLS as required by server

FTP_HOST="82.29.199.248"
FTP_USER="u365102102.avatararts.org"
FTP_PASS="s64i4X@vNZ*"
FTP_PORT="21"
FTP_PATH="/domains/avatararts.org/public_html/SEO-revenue"
LOCAL_DIR="/Users/steven/AVATARARTS/all"

echo "🚀 Starting FTP Upload (SSL/TLS)..."
echo "=========================================="
echo "Host: $FTP_HOST:$FTP_PORT"
echo "User: $FTP_USER"
echo "Remote Path: $FTP_PATH/all/"
echo "Local Directory: $LOCAL_DIR"
echo "=========================================="
echo ""

# Use lftp with SSL/TLS
lftp -u "$FTP_USER,$FTP_PASS" -p "$FTP_PORT" "$FTP_HOST" <<EOF
set ftp:ssl-force yes
set ssl:verify-certificate no
set ftp:passive-mode yes
cd $FTP_PATH
mirror -R --delete --verbose --exclude-glob='.*' $LOCAL_DIR all
quit
EOF

UPLOAD_EXIT_CODE=$?
echo ""

if [ $UPLOAD_EXIT_CODE -eq 0 ]; then
    echo "✅ Upload complete!"
    echo ""
    echo "🌐 Verify at: https://avatararts.org/SEO-revenue/all/"
else
    echo "⚠️  Upload exit code: $UPLOAD_EXIT_CODE"
    echo ""
    echo "Trying alternative method..."

    # Alternative: Try without domain in username
    echo "Retrying with username: u365102102"
    lftp -u "u365102102,$FTP_PASS" -p "$FTP_PORT" "$FTP_HOST" <<EOF2
set ftp:ssl-force yes
set ssl:verify-certificate no
set ftp:passive-mode yes
cd $FTP_PATH
mirror -R --delete --verbose --exclude-glob='.*' $LOCAL_DIR all
quit
EOF2

    if [ $? -eq 0 ]; then
        echo "✅ Upload complete (alternative method)!"
        echo ""
        echo "🌐 Verify at: https://avatararts.org/SEO-revenue/all/"
    else
        echo "❌ Upload failed. Please check:"
        echo "   1. FTP credentials are correct"
        echo "   2. Server allows FTP connections"
        echo "   3. Directory path exists on server"
    fi
fi
