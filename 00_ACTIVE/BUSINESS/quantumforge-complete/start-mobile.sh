#!/bin/bash

# QuantumForgeLabs Mobile Development Server
# This script starts a local server accessible from your iPhone

echo "🚀 Starting QuantumForgeLabs Mobile Server..."
echo ""

# Get local IP address
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
PORT=3000

echo "📱 Access from iPhone: http://$LOCAL_IP:$PORT/"
echo "💻 Access from Mac: http://localhost:$PORT/"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server
node server.js