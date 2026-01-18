#!/bin/bash
# FTP Upload Script for SEO-revenue/all/
# Updated with correct credentials

FTP_HOST="82.29.199.248"
FTP_USER="u365102102.avatararts.org"
FTP_PASS="s64i4X@vNZ*"
FTP_PORT="21"
FTP_PATH="/domains/avatararts.org/public_html/SEO-revenue"
LOCAL_DIR="/Users/steven/AVATARARTS/all"

echo "🚀 Starting FTP Upload..."
echo "=========================================="
echo "Host: $FTP_HOST:$FTP_PORT"
echo "User: $FTP_USER"
echo "Remote Path: $FTP_PATH/all/"
echo "Local Directory: $LOCAL_DIR"
echo "=========================================="
echo ""

# Test connection first
echo "Testing FTP connection..."
lftp -u "$FTP_USER,$FTP_PASS" -p "$FTP_PORT" "$FTP_HOST" <<TEST_EOF
set ftp:ssl-allow no
set ssl:verify-certificate no
set ftp:passive-mode yes
pwd
ls
quit
TEST_EOF

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Connection test failed. Please check credentials."
    exit 1
fi

echo ""
echo "✅ Connection successful! Starting upload..."
echo ""

# Perform upload
lftp -u "$FTP_USER,$FTP_PASS" -p "$FTP_PORT" "$FTP_HOST" <<UPLOAD_EOF
set ftp:ssl-allow no
set ssl:verify-certificate no
set ftp:passive-mode yes
cd $FTP_PATH
mirror -R --delete --verbose --exclude-glob='.*' $LOCAL_DIR all
quit
UPLOAD_EOF

UPLOAD_EXIT_CODE=$?
echo ""

if [ $UPLOAD_EXIT_CODE -eq 0 ]; then
    echo "✅ Upload complete!"
    echo ""
    echo "🌐 Verify at: https://avatararts.org/SEO-revenue/all/"
else
    echo "⚠️  Upload exit code: $UPLOAD_EXIT_CODE"
    echo "Check output above for details."
fi
