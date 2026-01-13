# 🤖 Automated Conversation Archive System

A comprehensive system for automatically capturing, organizing, and archiving AI conversations in real-time.

## 🚀 Features

### ✨ **Real-time Capture**
- Automatically monitors Cursor chat directories
- Captures conversations from prompt history
- Updates archives in real-time as you chat

### 📚 **Multiple Archive Formats**
- **HTML Archive**: Beautiful, interactive web interface
- **Markdown Export**: Clean, readable text format
- **JSON Export**: Structured data for processing
- **Database Storage**: SQLite for efficient querying

### 🎨 **Modern Interface**
- Responsive design with gradient backgrounds
- Real-time statistics and metrics
- Tag-based organization and filtering
- Search functionality across all conversations

### 🔄 **Automation**
- Background monitoring service
- Automatic updates every 30 seconds
- System service integration (macOS/Linux)
- Cron job support for periodic updates

## 📁 File Structure

```
/Users/steven/
├── conversation_archive.html          # Main HTML interface
├── conversation_capture.py            # Core archiving engine
├── auto_archive.py                    # Real-time monitoring
├── archive_manager.py                 # Management interface
├── conversation_archive/              # Archive data directory
│   ├── conversations.db              # SQLite database
│   └── conversation-archive-*.md     # Daily markdown exports
└── README_Archive_System.md          # This file
```

## 🛠️ Usage

### **Quick Start**
```bash
# Run the archiver once
python3 conversation_capture.py

# Open the HTML interface
open conversation_archive.html

# Start real-time monitoring
python3 auto_archive.py
```

### **Interactive Management**
```bash
# Open management interface
python3 archive_manager.py

# Or use command line
python3 archive_manager.py list
python3 archive_manager.py search "document organization"
python3 archive_manager.py open
```

### **System Service Setup**
```bash
# Setup automatic background service
python3 auto_archive.py --setup

# For macOS: Load LaunchAgent
launchctl load ~/Library/LaunchAgents/com.conversation.archiver.plist

# For Linux: Enable systemd service
systemctl --user enable conversation-archiver.service
systemctl --user start conversation-archiver.service
```

## 📊 Archive Features

### **Conversation Organization**
- **Automatic Tagging**: Based on content analysis
- **Date Grouping**: Chronological organization
- **Topic Detection**: AI-powered categorization
- **Preview Generation**: Quick content summaries

### **Search & Filter**
- Full-text search across all conversations
- Tag-based filtering
- Date range filtering
- Content type filtering

### **Export Options**
- Individual conversation export
- Bulk archive export
- Multiple format support (MD, JSON, HTML)
- Summary reports

## 🏷️ Supported Tags

- `file-management` - Document organization, file sorting
- `web-development` - Website creation, HTML/CSS/JS
- `seo` - Search optimization, marketing
- `python` - Python programming, scripting
- `business` - Business development, freelancing
- `ai` - AI tools, automation, GPT
- `automation` - Scripts, batch processing
- `data-analysis` - Data processing, CSV, reports

## 🔧 Configuration

### **Update Intervals**
- Default: 30 seconds
- Configurable in `auto_archive.py`
- Cron job: Every 5 minutes

### **Storage Locations**
- HTML Archive: `/Users/steven/conversation_archive.html`
- Database: `/Users/steven/conversation_archive/conversations.db`
- Markdown: `/Users/steven/conversation_archive/conversation-archive-YYYY-MM-DD.md`

### **Monitoring Sources**
- Cursor chat directories: `~/.cursor/chats/`
- Prompt history: `~/.cursor/prompt_history.json`
- Custom conversation sources

## 📈 Statistics Tracked

- Total conversations
- Messages exchanged
- Projects completed
- Most active topics
- Daily activity patterns
- Archive growth over time

## 🎯 Use Cases

### **For Developers**
- Track coding sessions and solutions
- Archive debugging conversations
- Document project progress
- Share knowledge with team

### **For Content Creators**
- Organize creative discussions
- Track content ideas and plans
- Archive research sessions
- Build knowledge base

### **For Business**
- Document client conversations
- Track project requirements
- Archive strategy discussions
- Maintain communication history

## 🔒 Privacy & Security

- All data stored locally
- No external services required
- SQLite database encryption available
- Configurable data retention policies

## 🚀 Advanced Features

### **API Integration**
- RESTful API for external access
- Webhook support for real-time updates
- Custom export formats

### **Analytics Dashboard**
- Conversation volume trends
- Topic popularity analysis
- Productivity metrics
- Time-based insights

### **Collaboration**
- Multi-user support
- Shared conversation spaces
- Team knowledge base
- Permission management

## 📝 Example Usage

```python
from conversation_capture import ConversationArchiver

# Initialize archiver
archiver = ConversationArchiver()

# Add current conversation
archiver.update_current_session('user', 'How do I optimize my website?')
archiver.update_current_session('assistant', 'Here are several optimization strategies...')

# Update archive
conversations = archiver.run_archive_update()

# Generate reports
archiver.generate_markdown_archive()
```

## 🆘 Troubleshooting

### **Common Issues**
1. **Permission errors**: Ensure write access to archive directory
2. **Database locked**: Close other instances of the archiver
3. **Missing conversations**: Check Cursor chat directory permissions
4. **Update failures**: Verify Python dependencies

### **Debug Mode**
```bash
# Enable verbose logging
python3 conversation_capture.py --debug

# Check system status
python3 archive_manager.py status
```

## 🔄 Updates & Maintenance

### **Automatic Updates**
- System checks for new conversations every 30 seconds
- Archives are updated in real-time
- Old files are cleaned up automatically

### **Manual Maintenance**
```bash
# Force update
python3 conversation_capture.py

# Clean old files
python3 archive_manager.py cleanup

# Generate summary
python3 archive_manager.py summary
```

## 📞 Support

For issues or feature requests:
1. Check the troubleshooting section
2. Review log files in `/tmp/conversation-archiver.log`
3. Run diagnostic commands
4. Create detailed bug reports

---

**🎉 Your conversation archive system is now ready!**

Open `conversation_archive.html` in your browser to see your beautiful, interactive conversation archive.