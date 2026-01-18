#!/bin/bash
# Test different FTP connection methods

FTP_HOST="82.29.199.248"
FTP_PORT="21"
FTP_PASS="s64i4X@vNZ*"

echo "Testing FTP connection methods..."
echo ""

# Test 1: Username without domain
echo "Test 1: u365102102"
lftp -u "u365102102,$FTP_PASS" -p "$FTP_PORT" -e "set ftp:ssl-allow no; set ftp:passive-mode yes; pwd; ls; quit" "$FTP_HOST" 2>&1 | head -10
echo ""

# Test 2: Username with domain
echo "Test 2: u365102102.avatararts.org"
lftp -u "u365102102.avatararts.org,$FTP_PASS" -p "$FTP_PORT" -e "set ftp:ssl-allow no; set ftp:passive-mode yes; pwd; ls; quit" "$FTP_HOST" 2>&1 | head -10
echo ""

# Test 3: Using curl
echo "Test 3: Using curl"
curl -v --ftp-ssl --insecure --user "u365102102:$FTP_PASS" "ftp://$FTP_HOST:$FTP_PORT/" 2>&1 | head -20
