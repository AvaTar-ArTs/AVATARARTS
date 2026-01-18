# 🔌 AI Agent Port Reference

## **Current Port Usage on Your System**

Based on the `lsof` output, here are the ports currently in use:

| Port | Service | Process | Status |
|------|---------|---------|--------|
| **5000** | AirPlay Receiver | ControlCenter | ✅ **OCCUPIED** |
| **5001** | Python Process | Python | ✅ **OCCUPIED** |
| **7000** | Control Center | ControlCenter | ✅ **OCCUPIED** |
| **8000** | Python Process | python3.1 | ✅ **OCCUPIED** |
| **8080** | Python Process | python3.1 | ✅ **OCCUPIED** |
| **3000** | Cursor/VS Code | Cursor | ✅ **OCCUPIED** |
| **3001** | Cursor/VS Code | Cursor | ✅ **OCCUPIED** |
| **10007** | Neat Download Manager | NeatDownl | ✅ **OCCUPIED** |
| **23119** | Zotero | zotero | ✅ **OCCUPIED** |
| **23116** | Zotero | zotero | ✅ **OCCUPIED** |
| **19876** | Zotero | zotero | ✅ **OCCUPIED** |
| **2432** | Setapp | SetappAge | ✅ **OCCUPIED** |
| **49567** | Cursor | Cursor | ✅ **OCCUPIED** |
| **53758** | Alfred | Alfred | ✅ **OCCUPIED** |
| **49181** | Rapport | rapportd | ✅ **OCCUPIED** |
| **59565** | Cursor | Cursor | ✅ **OCCUPIED** |

## **AI Agent System Ports**

### **Core Services**
| Port | Service | Purpose | Status |
|------|---------|---------|--------|
| **5678** | n8n | Workflow automation platform | 🟡 **Available** |
| **5000** | AI Agent Server | Main AI orchestration | ❌ **Blocked by AirPlay** |
| **5001** | Content Research | Document analysis | ❌ **Blocked by Python** |
| **8000** | AI Agent (Alt) | Alternative port | ❌ **Blocked by Python** |

### **Optional Services**
| Port | Service | Purpose | Status |
|------|---------|---------|--------|
| **3000** | Grafana | Monitoring dashboards | ❌ **Blocked by Cursor** |
| **9090** | Prometheus | Metrics collection | 🟡 **Available** |
| **6379** | Redis | Caching | 🟡 **Available** |
| **5432** | PostgreSQL | Database | 🟡 **Available** |

## **Recommended Port Configuration**

### **Option 1: Use Available Ports**
```yaml
# AI Agent Services
AI_AGENT_PORT: 9000          # Main AI server
CONTENT_RESEARCH_PORT: 9001  # Content analysis
N8N_PORT: 5678              # n8n workflows
GRAFANA_PORT: 3001          # Monitoring (if needed)
PROMETHEUS_PORT: 9090       # Metrics
REDIS_PORT: 6379            # Caching
POSTGRES_PORT: 5432         # Database
```

### **Option 2: Free Up Common Ports**
```bash
# Disable AirPlay Receiver (frees port 5000)
# System Preferences → Sharing → AirPlay Receiver → Off

# Stop conflicting Python processes
pkill -f "python.*8000"
pkill -f "python.*5001"
```

## **Port Usage by Service Type**

### **🤖 AI Services**
- **5000**: AI Agent Server (main orchestration)
- **5001**: Content Research Agent (document analysis)
- **8000**: Alternative AI Agent port
- **9000**: Alternative AI Agent port (recommended)

### **🔄 Automation Services**
- **5678**: n8n (workflow automation)
- **8080**: Alternative n8n port
- **9001**: Alternative automation port

### **📊 Monitoring Services**
- **3000**: Grafana (dashboards)
- **9090**: Prometheus (metrics)
- **3001**: Alternative Grafana port

### **🗄️ Data Services**
- **5432**: PostgreSQL (database)
- **6379**: Redis (caching)
- **23119**: Zotero (research)

### **🛠️ Development Services**
- **3000**: Cursor/VS Code (development)
- **3001**: Cursor/VS Code (development)
- **8080**: Development servers

## **Quick Port Check Commands**

### **Check Specific Ports**
```bash
# Check if port is available
lsof -i :5000
lsof -i :5678
lsof -i :8000

# Check all listening ports
lsof -i -P -n | grep LISTEN
```

### **Find Available Ports**
```bash
# Find next available port starting from 8000
for port in {8000..8100}; do
    if ! lsof -i :$port > /dev/null 2>&1; then
        echo "Port $port is available"
        break
    fi
done
```

## **AI Agent Port Configuration**

### **Current Setup (Blocked)**
```python
# ai-agent-server-local.py
app.run(host='0.0.0.0', port=8000, debug=False)  # ❌ Blocked
```

### **Recommended Setup**
```python
# ai-agent-server-local.py
app.run(host='0.0.0.0', port=9000, debug=False)  # ✅ Available
```

### **Update Configuration**
```bash
# Update the server port
sed -i '' 's/port=8000/port=9000/g' ai-agent-server-local.py
sed -i '' 's/localhost:8000/localhost:9000/g' start-ai-agent-mamba.sh
```

## **Service URLs**

### **When Running on Port 9000**
- **AI Agent**: http://localhost:9000
- **Health Check**: http://localhost:9000/health
- **Services**: http://localhost:9000/ai-agent/services
- **Analyze**: http://localhost:9000/ai-agent/analyze
- **Execute**: http://localhost:9000/ai-agent/execute

### **When Running on Port 5678 (n8n)**
- **n8n Interface**: http://localhost:5678
- **Workflow Editor**: http://localhost:5678/workflow

## **Troubleshooting Port Conflicts**

### **Common Issues**
1. **Port 5000**: AirPlay Receiver (macOS)
2. **Port 3000**: Development servers
3. **Port 8000**: Python development servers
4. **Port 8080**: Web servers

### **Solutions**
1. **Disable AirPlay**: System Preferences → Sharing
2. **Use alternative ports**: 9000, 9001, 9002, etc.
3. **Stop conflicting processes**: `pkill -f "process_name"`
4. **Use port ranges**: 8000-8999 for development

## **Next Steps**

1. **Choose available ports** (recommended: 9000, 9001)
2. **Update configuration files** with new ports
3. **Test the services** on the new ports
4. **Update documentation** with correct URLs

---

**💡 Tip**: Use ports 9000+ for AI services to avoid conflicts with common development ports!