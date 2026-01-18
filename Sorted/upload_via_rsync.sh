#!/bin/bash
# Alternative: Use rsync over SSH (if SSH access available)
# This is more secure and efficient than FTP

SSH_HOST="u365102102@avatararts.org"
REMOTE_PATH="/domains/avatararts.org/public_html/SEO-revenue"
LOCAL_DIR="/Users/steven/AVATARARTS/all"

echo "🚀 Starting rsync upload (SSH method)..."
echo "=========================================="
echo "Host: $SSH_HOST"
echo "Remote Path: $REMOTE_PATH/all/"
echo "Local Directory: $LOCAL_DIR"
echo "=========================================="
echo ""

# Use rsync to upload
rsync -avz --progress --delete \
    "$LOCAL_DIR/" \
    "$SSH_HOST:$REMOTE_PATH/all/"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Upload complete!"
    echo "🌐 Verify at: https://avatararts.org/SEO-revenue/all/"
else
    echo ""
    echo "❌ Upload failed. Check SSH access or use FTP method."
fi
