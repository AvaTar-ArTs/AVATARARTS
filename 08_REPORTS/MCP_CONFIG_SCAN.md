# 🔍 MCP Configuration Scan Results

## 📁 **Found Configuration Files**

### 1. **Main Cursor MCP Config** (iCloud Sync)
**Location:** `~/Library/Mobile Documents/com~apple~CloudDocs/Cursor/mcp.json`

**Configured Servers:**
- ✅ **Hugging Face** - AI model access
- ✅ **Notion** - Workspace integration (`https://mcp.notion.com/mcp`)
- ✅ **Vercel** - Deployment platform (`https://mcp.vercel.com`)
- ✅ **GitHub** - Repository management (Docker-based)

---

### 2. **Local MCP Config** (Standard Location)
**Location:** `~/.config/mcp/servers.json`

**Configured Servers:**
- ✅ **context7** - Documentation and code examples
- ✅ **github** - GitHub API access (npx-based)
- ✅ **filesystem** - Local file system access (`/Users/steven`)
- ✅ **brave-search** - Real-time web search
- ✅ **playwright** - Browser automation
- ✅ **sequential-thinking** - Structured problem-solving
- ✅ **notion** - Notion workspace (npx-based, different from Cursor config)

**Security:** Allowlist policy enabled (only listed servers allowed)

---

### 3. **Claude Extensions** (Claude Desktop)
**Location:** `~/Library/Application Support/Claude/Claude Extensions Settings/`

**Configured Servers:**
- ✅ **Postman MCP Server** - API testing and management
- ✅ **Apify MCP Server** - Web scraping and automation

---

### 4. **Workspace Export Config**
**Location:** `~/Cursor_Workspace_Export/mcp/mcp-servers.json`

**Configured Servers:**
- ✅ **filesystem** - Basic file system access

---

## 🚀 **Suggested Additional MCP Servers**

Based on your setup, here are recommended servers to consider adding:

### **Development & Code**
1. **SQLite** - Database operations
   ```json
   "sqlite": {
     "command": "npx",
     "args": ["-y", "@modelcontextprotocol/server-sqlite", "--db-path", "/path/to/database.db"]
   }
   ```

2. **PostgreSQL** - PostgreSQL database access
   ```json
   "postgres": {
     "command": "npx",
     "args": ["-y", "@modelcontextprotocol/server-postgres"],
     "env": {
       "POSTGRES_CONNECTION_STRING": "${POSTGRES_CONNECTION_STRING}"
     }
   }
   ```

3. **Puppeteer** - Alternative to Playwright for browser automation
   ```json
   "puppeteer": {
     "command": "npx",
     "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
   }
   ```

### **AI & Machine Learning**
4. **Slack** - Team communication
   ```json
   "slack": {
     "command": "npx",
     "args": ["-y", "@modelcontextprotocol/server-slack"],
     "env": {
       "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}"
     }
   }
   ```

5. **Google Drive** - File storage integration
   ```json
   "gdrive": {
     "command": "npx",
     "args": ["-y", "@modelcontextprotocol/server-gdrive"],
     "env": {
       "GDRIVE_CREDENTIALS_PATH": "${GDRIVE_CREDENTIALS_PATH}"
     }
   }
   ```

6. **Memory** - Persistent memory for conversations
   ```json
   "memory": {
     "command": "npx",
     "args": ["-y", "@modelcontextprotocol/server-memory"]
   }
   ```

### **Design & Content**
7. **Figma** - Design tool integration
   ```json
   "figma": {
     "command": "npx",
     "args": ["-y", "@modelcontextprotocol/server-figma"],
     "env": {
       "FIGMA_ACCESS_TOKEN": "${FIGMA_ACCESS_TOKEN}"
     }
   }
   ```

8. **Linear** - Project management
   ```json
   "linear": {
     "command": "npx",
     "args": ["-y", "@modelcontextprotocol/server-linear"],
     "env": {
       "LINEAR_API_KEY": "${LINEAR_API_KEY}"
     }
   }
   ```

9. **Gmail** - Email integration
   ```json
   "gmail": {
     "command": "npx",
     "args": ["-y", "@modelcontextprotocol/server-gmail"],
     "env": {
       "GMAIL_CREDENTIALS_PATH": "${GMAIL_CREDENTIALS_PATH}"
     }
   }
   ```

### **Productivity**
10. **Fetch** - HTTP requests and API testing
    ```json
    "fetch": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-fetch"]
    }
    ```

11. **AWS** - AWS services integration
    ```json
    "aws": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-aws"],
      "env": {
        "AWS_ACCESS_KEY_ID": "${AWS_ACCESS_KEY_ID}",
        "AWS_SECRET_ACCESS_KEY": "${AWS_SECRET_ACCESS_KEY}"
      }
    }
    ```

12. **Git** - Git repository operations
    ```json
    "git": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-git"]
    }
    ```

---

## 📊 **Configuration Summary**

| Location | Server Count | Primary Use |
|----------|-------------|-------------|
| **Cursor (iCloud)** | 4 servers | Main Cursor IDE config |
| **~/.config/mcp/** | 7 servers | Local MCP standard config |
| **Claude Extensions** | 2 servers | Claude Desktop integration |
| **Workspace Export** | 1 server | Workspace backup |

**Total Unique Servers Found:** 10+ unique MCP servers

---

## ⚠️ **Notes & Recommendations**

1. **Duplicate Notion Config**: You have Notion configured in both:
   - Cursor config (URL-based: `https://mcp.notion.com/mcp`)
   - Local config (npx-based: `@modelcontextprotocol/server-notion`)

   Consider standardizing on one approach.

2. **GitHub Configs**: Multiple GitHub configurations exist:
   - Cursor config uses Docker
   - Local config uses npx

   Both work, but npx is simpler for local development.

3. **Security**: The `~/.config/mcp/allowlist.json` has an allowlist policy enabled, which is good for security.

4. **API Keys**: Make sure all required API keys are set in `~/.env.d/` for the local MCP config.

5. **Sync Consideration**: The Cursor config in iCloud will sync across devices, while `~/.config/mcp/` is device-specific.

---

## 🔧 **Next Steps**

1. Review duplicate configurations (Notion, GitHub)
2. Add any suggested servers that match your workflow
3. Ensure API keys are configured for all servers
4. Test MCP connections after adding new servers
5. Update allowlist if using `~/.config/mcp/` security policy

---

**Scan Date:** Mon Jan 12 18:13:16 EST 2026
**System:** macOS
**User:** steven
