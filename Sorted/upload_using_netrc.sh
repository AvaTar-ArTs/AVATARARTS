#!/bin/bash
# FTP Upload using .netrc for secure credential handling

FTP_HOST="82.29.199.248"
FTP_USER="u365102102.avatararts.org"
FTP_PASS="s64i4X@vNZ*"
FTP_PORT="21"
FTP_PATH="/domains/avatararts.org/public_html/SEO-revenue"
LOCAL_DIR="/Users/steven/AVATARARTS/all"

# Create temporary .netrc file
NETRC_FILE=$(mktemp)
cat > "$NETRC_FILE" <<NETRC_EOF
machine $FTP_HOST
login $FTP_USER
password $FTP_PASS
NETRC_EOF

echo "🚀 Starting FTP Upload (using .netrc)..."
echo "=========================================="
echo "Host: $FTP_HOST:$FTP_PORT"
echo "User: $FTP_USER"
echo "Remote Path: $FTP_PATH/all/"
echo "Local Directory: $LOCAL_DIR"
echo "=========================================="
echo ""

# Use lftp with .netrc (export NETRC environment variable)
export NETRC="$NETRC_FILE"
lftp -p "$FTP_PORT" -e "
set ftp:ssl-force yes
set ssl:verify-certificate no
set ftp:passive-mode yes
open $FTP_HOST
cd $FTP_PATH
mirror -R --delete --verbose --exclude-glob='.*' $LOCAL_DIR all
quit
"

UPLOAD_EXIT_CODE=$?

# Clean up .netrc file
rm -f "$NETRC_FILE"

echo ""

if [ $UPLOAD_EXIT_CODE -eq 0 ]; then
    echo "✅ Upload complete!"
    echo ""
    echo "🌐 Verify at: https://avatararts.org/SEO-revenue/all/"
else
    echo "⚠️  Upload failed with exit code: $UPLOAD_EXIT_CODE"
    echo ""
    echo "Please verify:"
    echo "  - FTP credentials are correct"
    echo "  - Password special characters (@, *) are correct"
    echo "  - Server is accessible"
fi
