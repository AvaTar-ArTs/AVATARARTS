# Chat History Locations - Table of Contents

## Overview
This document compiles all the locations where chat history and session data are stored across various applications and projects in the workspace.

## 1. Cursor Agent & Development Tools

### 1.1 Cursor Agent Sessions
- **Location**: Not found in current search results
- **Note**: The `cursor-agent --resume=aefe6b4d****` command suggests session IDs are stored somewhere, but specific location not identified

### 1.2 Hyper Terminal Sessions
- **File**: `hyper/lib/reducers/sessions.ts`
- **Storage**: In-memory session management with UIDs
- **Key Features**:
  - Session state management
  - Active session tracking
  - Session data persistence
  - Terminal session lifecycle management

## 2. AI/Chat Applications

### 2.1 ChatGPT Exporters & Storage
- **Location**: `Downloads/tampermonkey-backup-chrome-2025-10-15T07-15-55-158Z/`
- **Files**:
  - `ChatGPT_Exporter.js` - Main exporter with storage management
  - `ChatGPT Save Conversation.storage.json` - Saved conversations
  - `Favorite GPT conversations.storage.json` - Favorited conversations
  - `2Universal AI Conversation & GPT Exporter.storage.json` - Universal exporter data
- **Storage Methods**:
  - LocalStorage
  - GMStorage (Greasemonkey storage)
  - MemoryStorage (fallback)

### 2.2 ChatGPT Configuration
- **File**: `.chatgpt/chat.conf.json`
- **Purpose**: ChatGPT configuration and settings

### 2.3 DeepWiki Chat System
- **Location**: `Downloads/Compressed/02_Development_Projects/deepwiki-open-main/api/`
- **Files**:
  - `websocket_wiki.py` - WebSocket chat handling
  - `rag.py` - Memory and conversation management
  - `api.py` - API endpoints
  - `simple_chat.py` - Simple chat implementation
- **Storage Locations**:
  - Cloned repositories: `~/.adalflow/repos/`
  - Embeddings and indexes: `~/.adalflow/databases/`
  - Generated wiki cache: `~/.adalflow/wikicache/`

## 3. OpenAI & AI Development

### 3.1 OpenAI Cookbook Examples
- **Location**: `tehSiTes/openai-cookbook/examples/`
- **Files**:
  - `agents_sdk/session_memory.ipynb` - Session memory management
  - `object_oriented_agentic_approach/resources/object_oriented_agents/core_classes/chat_messages.py` - Chat message handling
  - `partners/temporal_agents_with_knowledge_graphs/db_interface.py` - Database interface for agents

### 3.2 Custom AI Applications
- **Location**: `tehSiTes/AvaTarArTs/`
- **Files**:
  - `ChatGPT_Exporter.js` - ChatGPT data export functionality
  - `python/sample_config.py` - Configuration management
  - `python/GmailBot.py` - Gmail integration with chat history
  - `python/files_io.py` - File I/O operations

## 4. System & Shell History

### 4.1 Zsh History
- **File**: `.oh-my-zsh/lib/history.zsh`
- **Purpose**: Shell command history management

### 4.2 Directory Persistence
- **File**: `.oh-my-zsh/plugins/dirpersist/dirpersist.plugin.zsh`
- **Purpose**: Directory navigation history

## 5. Storage Patterns Identified

### 5.1 Local Storage
- Browser localStorage for web-based applications
- JSON files for configuration and data persistence
- In-memory storage for active sessions

### 5.2 File System Storage
- `~/.adalflow/` directory for DeepWiki data
- Configuration files in hidden directories (`.chatgpt/`, `.oh-my-zsh/`)
- Backup directories for exported data

### 5.3 Database Storage
- SQLite databases for structured data
- FAISS databases for vector embeddings
- Custom database interfaces for AI agents

## 6. Session Management Features

### 6.1 Session Lifecycle
- Creation and initialization
- Active session tracking
- Session termination and cleanup
- Session resumption capabilities

### 6.2 Memory Management
- Conversation history storage
- Context length management
- Memory summarization
- Multi-turn conversation support

### 6.3 Export/Import Capabilities
- JSON export formats
- Conversation backup systems
- Cross-platform data portability
- Tampermonkey script integration

## 7. Configuration Files

### 7.1 Application Configs
- `hyper/app/config/config-default.json` - Hyper terminal configuration
- Various `.json` files for application settings
- Python configuration files for AI applications

### 7.2 Storage Keys
- `chatgpt_gpts_data` - ChatGPT GPTs data
- `STORAGE_KEY` constants in JavaScript applications
- Custom storage keys for different applications

---

*Generated from workspace search results - Last updated: $(date)*