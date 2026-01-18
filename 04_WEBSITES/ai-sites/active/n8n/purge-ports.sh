#!/bin/bash
# Port Cleanup Script
# ===================
# Purges unnecessary processes using common ports

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧹 Port Cleanup Script${NC}"
echo "====================="

# Function to kill process by PID
kill_process() {
    local pid=$1
    local port=$2
    local name=$3
    
    if kill -0 $pid 2>/dev/null; then
        echo -e "${YELLOW}🔄 Killing process $pid on port $port ($name)${NC}"
        kill $pid
        sleep 1
        if kill -0 $pid 2>/dev/null; then
            echo -e "${RED}⚠️  Process still running, force killing...${NC}"
            kill -9 $pid
        fi
        echo -e "${GREEN}✅ Process $pid killed${NC}"
    else
        echo -e "${YELLOW}⚠️  Process $pid not found${NC}"
    fi
}

# Check current port usage
echo -e "${BLUE}🔍 Checking current port usage...${NC}"
lsof -i :5000 -i :5001 -i :8000 -i :8080 2>/dev/null || echo "No processes found on these ports"

echo ""

# Kill specific processes
echo -e "${BLUE}🔄 Purging unnecessary processes...${NC}"

# Kill Python processes on common ports
for pid in 22000 64460 82709; do
    if kill -0 $pid 2>/dev/null; then
        port=$(lsof -p $pid -i -P -n | grep LISTEN | awk '{print $9}' | cut -d: -f2 | head -1)
        name=$(ps -p $pid -o comm= 2>/dev/null || echo "unknown")
        kill_process $pid $port $name
    fi
done

echo ""

# Check for any remaining Python processes on these ports
echo -e "${BLUE}🔍 Checking for remaining processes...${NC}"
remaining=$(lsof -i :5000 -i :5001 -i :8000 -i :8080 2>/dev/null | grep python || echo "")

if [ -n "$remaining" ]; then
    echo -e "${YELLOW}⚠️  Some Python processes still running:${NC}"
    echo "$remaining"
    echo ""
    echo -e "${CYAN}To kill them manually:${NC}"
    echo "$remaining" | awk '{print "kill " $2}' | sort -u
else
    echo -e "${GREEN}✅ All Python processes on common ports have been purged${NC}"
fi

echo ""

# Check port availability
echo -e "${BLUE}🔍 Checking port availability...${NC}"
for port in 5000 5001 8000 8080 9000; do
    if lsof -i :$port > /dev/null 2>&1; then
        service=$(lsof -i :$port | tail -1 | awk '{print $1}')
        echo -e "${RED}❌ Port $port: $service${NC}"
    else
        echo -e "${GREEN}✅ Port $port: Available${NC}"
    fi
done

echo ""

# Show recommended ports for AI agent
echo -e "${BLUE}🎯 Recommended AI Agent Ports:${NC}"
echo -e "  ${GREEN}✅ Port 9000: AI Agent Server${NC}"
echo -e "  ${GREEN}✅ Port 9001: Content Research Agent${NC}"
echo -e "  ${GREEN}✅ Port 5678: n8n Workflows${NC}"
echo -e "  ${GREEN}✅ Port 9090: Prometheus Monitoring${NC}"

echo ""
echo -e "${GREEN}🎉 Port cleanup complete!${NC}"
echo -e "${CYAN}You can now start the AI agent on port 9000${NC}"