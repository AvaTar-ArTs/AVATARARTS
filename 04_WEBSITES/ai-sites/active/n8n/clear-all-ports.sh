#!/bin/bash
# Complete Port Clearing Script
# =============================
# Clears all conflicting ports for AI agent system

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧹 Complete Port Clearing Script${NC}"
echo "=================================="

# Function to kill process by PID
kill_process() {
    local pid=$1
    local port=$2
    local name=$3
    
    if kill -0 $pid 2>/dev/null; then
        echo -e "${YELLOW}🔄 Killing process $pid on port $port ($name)${NC}"
        kill $pid 2>/dev/null || true
        sleep 1
        if kill -0 $pid 2>/dev/null; then
            echo -e "${RED}⚠️  Process still running, force killing...${NC}"
            kill -9 $pid 2>/dev/null || true
        fi
        echo -e "${GREEN}✅ Process $pid killed${NC}"
    else
        echo -e "${YELLOW}⚠️  Process $pid not found${NC}"
    fi
}

# Clear all Python processes on common ports
echo -e "${BLUE}🔄 Clearing all Python processes on common ports...${NC}"

# Get all Python processes using ports 5000-9000
python_pids=$(lsof -i :5000-9000 2>/dev/null | grep python | awk '{print $2}' | sort -u || echo "")

if [ -n "$python_pids" ]; then
    for pid in $python_pids; do
        port=$(lsof -p $pid -i -P -n 2>/dev/null | grep LISTEN | awk '{print $9}' | cut -d: -f2 | head -1 || echo "unknown")
        name=$(ps -p $pid -o comm= 2>/dev/null || echo "python")
        kill_process $pid $port $name
    done
else
    echo -e "${GREEN}✅ No Python processes found on common ports${NC}"
fi

echo ""

# Clear any remaining processes on our target ports
echo -e "${BLUE}🔄 Clearing target ports (5000, 5001, 8000, 8080, 9000)...${NC}"

for port in 5000 5001 8000 8080 9000; do
    if lsof -i :$port > /dev/null 2>&1; then
        pid=$(lsof -i :$port | tail -1 | awk '{print $2}')
        service=$(lsof -i :$port | tail -1 | awk '{print $1}')
        echo -e "${YELLOW}🔄 Clearing port $port (PID: $pid, Service: $service)${NC}"
        kill $pid 2>/dev/null || true
        sleep 1
        if kill -0 $pid 2>/dev/null; then
            kill -9 $pid 2>/dev/null || true
        fi
        echo -e "${GREEN}✅ Port $port cleared${NC}"
    else
        echo -e "${GREEN}✅ Port $port already available${NC}"
    fi
done

echo ""

# Wait a moment for processes to fully terminate
echo -e "${BLUE}⏳ Waiting for processes to terminate...${NC}"
sleep 2

# Final port check
echo -e "${BLUE}🔍 Final port availability check...${NC}"
echo ""

for port in 5000 5001 8000 8080 9000 9001 5678; do
    if lsof -i :$port > /dev/null 2>&1; then
        service=$(lsof -i :$port | tail -1 | awk '{print $1}')
        echo -e "${RED}❌ Port $port: $service${NC}"
    else
        echo -e "${GREEN}✅ Port $port: Available${NC}"
    fi
done

echo ""

# Show system status
echo -e "${BLUE}📊 System Status:${NC}"
echo -e "  ${CYAN}Python processes: $(ps aux | grep python | grep -v grep | wc -l | tr -d ' ')${NC}"
echo -e "  ${CYAN}Listening ports: $(lsof -i -P -n | grep LISTEN | wc -l | tr -d ' ')${NC}"

echo ""

# Show recommended next steps
echo -e "${BLUE}🎯 Next Steps:${NC}"
echo -e "  ${CYAN}1. Start AI Agent:${NC}"
echo -e "  ${YELLOW}     ./start-ai-agent-mamba.sh${NC}"
echo ""
echo -e "  ${CYAN}2. Test the server:${NC}"
echo -e "  ${YELLOW}     curl http://localhost:9000/health${NC}"
echo ""
echo -e "  ${CYAN}3. Check services:${NC}"
echo -e "  ${YELLOW}     curl http://localhost:9000/ai-agent/services${NC}"

echo ""
echo -e "${GREEN}🎉 Port clearing complete!${NC}"
echo -e "${PURPLE}   Ready to start the AI agent system${NC}"