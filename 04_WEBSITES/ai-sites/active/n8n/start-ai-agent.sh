#!/bin/bash
# n8n AI Agent Startup Script
# ===========================
# Complete AI automation stack launcher

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo -e "${BLUE}🤖 n8n AI Agent Startup Script${NC}"
echo "=================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker is running${NC}"

# Check if .env file exists and load from ~/.env.d
if [ ! -f ".env" ]; then
    echo -e "${BLUE}🔄 Loading environment from ~/.env.d...${NC}"
    
    # Use the Python environment loader
    if python3 env-loader.py; then
        echo -e "${GREEN}✅ Environment loaded from ~/.env.d${NC}"
    else
        echo -e "${YELLOW}⚠️  Some API keys may be missing. Using template...${NC}"
        if [ -f ".env.ai-agent" ]; then
            cp .env.ai-agent .env
            echo -e "${YELLOW}📝 Created .env from template. Please add missing API keys.${NC}"
        else
            echo -e "${RED}❌ No environment template found. Please create .env manually.${NC}"
            exit 1
        fi
    fi
else
    echo -e "${GREEN}✅ Using existing .env file${NC}"
fi

# Validate environment
echo -e "${BLUE}🔍 Validating environment configuration...${NC}"
if python3 env-loader.py > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Environment validation passed${NC}"
else
    echo -e "${YELLOW}⚠️  Environment validation warnings (continuing anyway)${NC}"
fi

# Check API status
echo -e "${BLUE}🔍 Checking API status...${NC}"
./check-api-status-simple.sh

# Create necessary directories
echo -e "${BLUE}📁 Creating directories...${NC}"
mkdir -p n8n-data/{backups,logs}
mkdir -p local-files
mkdir -p monitoring/{prometheus,grafana/{dashboards,datasources}}

# Create Prometheus configuration
cat > monitoring/prometheus.yml << 'EOF'
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
  
  - job_name: 'n8n'
    static_configs:
      - targets: ['n8n:5678']
    metrics_path: '/metrics'
    scrape_interval: 30s
  
  - job_name: 'ai-agent'
    static_configs:
      - targets: ['ai-agent:5000']
    metrics_path: '/metrics'
    scrape_interval: 30s
EOF

# Create Grafana datasource configuration
cat > monitoring/grafana/datasources/prometheus.yml << 'EOF'
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: true
EOF

# Create Grafana dashboard configuration
cat > monitoring/grafana/dashboards/dashboard.yml << 'EOF'
apiVersion: 1

providers:
  - name: 'default'
    orgId: 1
    folder: ''
    type: file
    disableDeletion: false
    updateIntervalSeconds: 10
    allowUiUpdates: true
    options:
      path: /etc/grafana/provisioning/dashboards
EOF

# Create a simple Grafana dashboard
cat > monitoring/grafana/dashboards/ai-agent-dashboard.json << 'EOF'
{
  "dashboard": {
    "id": null,
    "title": "n8n AI Agent Dashboard",
    "tags": ["n8n", "ai", "automation"],
    "style": "dark",
    "timezone": "browser",
    "panels": [
      {
        "id": 1,
        "title": "AI Agent Status",
        "type": "stat",
        "targets": [
          {
            "expr": "up{job=\"ai-agent\"}",
            "legendFormat": "AI Agent"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "color": {
              "mode": "thresholds"
            },
            "thresholds": {
              "steps": [
                {
                  "color": "red",
                  "value": 0
                },
                {
                  "color": "green",
                  "value": 1
                }
              ]
            }
          }
        }
      },
      {
        "id": 2,
        "title": "n8n Status",
        "type": "stat",
        "targets": [
          {
            "expr": "up{job=\"n8n\"}",
            "legendFormat": "n8n"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "color": {
              "mode": "thresholds"
            },
            "thresholds": {
              "steps": [
                {
                  "color": "red",
                  "value": 0
                },
                {
                  "color": "green",
                  "value": 1
                }
              ]
            }
          }
        }
      }
    ],
    "time": {
      "from": "now-6h",
      "to": "now"
    },
    "refresh": "5s"
  }
}
EOF

echo -e "${GREEN}✅ Directories and configurations created${NC}"

# Build custom images
echo -e "${BLUE}🔨 Building AI agent images...${NC}"
docker compose -f compose.ai-agent.yml build

# Start the stack
echo -e "${BLUE}🚀 Starting AI agent stack...${NC}"
docker compose -f compose.ai-agent.yml up -d

# Wait for services to be ready
echo -e "${BLUE}⏳ Waiting for services to start...${NC}"
sleep 10

# Check service health
echo -e "${BLUE}🔍 Checking service health...${NC}"

# Check n8n
if curl -s http://localhost:5678 > /dev/null; then
    echo -e "${GREEN}✅ n8n is running at http://localhost:5678${NC}"
else
    echo -e "${YELLOW}⚠️  n8n is starting up...${NC}"
fi

# Check AI agent
if curl -s http://localhost:5000/health > /dev/null; then
    echo -e "${GREEN}✅ AI Agent is running at http://localhost:5000${NC}"
else
    echo -e "${YELLOW}⚠️  AI Agent is starting up...${NC}"
fi

# Check Grafana (if enabled)
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ Grafana is running at http://localhost:3000${NC}"
    echo -e "${BLUE}   Default login: admin / admin${NC}"
else
    echo -e "${YELLOW}⚠️  Grafana is starting up...${NC}"
fi

echo ""
echo -e "${GREEN}🎉 AI Agent stack is starting up!${NC}"
echo ""
echo -e "${BLUE}📋 Service URLs:${NC}"
echo -e "   n8n:        http://localhost:5678"
echo -e "   AI Agent:   http://localhost:5000"
echo -e "   Grafana:    http://localhost:3000 (admin/admin)"
echo -e "   Prometheus: http://localhost:9090"
echo ""
echo -e "${BLUE}📁 Data locations:${NC}"
echo -e "   n8n data:   ./n8n-data/"
echo -e "   AI logs:    ./ai-agent-logs/"
echo -e "   Research:   ./content-research-data/"
echo ""
echo -e "${BLUE}🔧 Management commands:${NC}"
echo -e "   View logs:  docker compose -f compose.ai-agent.yml logs -f"
echo -e "   Stop:       docker compose -f compose.ai-agent.yml down"
echo -e "   Restart:    docker compose -f compose.ai-agent.yml restart"
echo -e "   Update:     docker compose -f compose.ai-agent.yml pull && docker compose -f compose.ai-agent.yml up -d"
echo ""
echo -e "${YELLOW}💡 Next steps:${NC}"
echo -e "   1. Open n8n at http://localhost:5678"
echo -e "   2. Import workflows from ./n8n_workflows/"
echo -e "   3. Configure credentials in n8n"
echo -e "   4. Test AI agent endpoints"
echo -e "   5. Set up monitoring dashboards"
echo ""
echo -e "${GREEN}🚀 Your AI automation stack is ready!${NC}"