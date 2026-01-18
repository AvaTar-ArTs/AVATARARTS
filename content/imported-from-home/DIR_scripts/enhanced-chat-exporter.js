// ==UserScript==
// @name         Universal Chat Exporter to Obsidian
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Elegant, universal chat conversation exporter with advanced formatting and multi-platform support
// @author       Enhanced by Claude
// @match        https://chatgpt.com/*
// @match        https://yuanbao.tencent.com/*
// @match        https://chat.deepseek.com/*
// @match        https://claude.ai/*
// @match        https://bard.google.com/*
// @match        https://chat.anthropic.com/*
// @grant        GM_setClipboard
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════
    // PLATFORM CONFIGURATIONS - Architecture as Poetry
    // ═══════════════════════════════════════════════════════════════
    
    const PLATFORMS = {
        'chatgpt.com': {
            name: 'ChatGPT',
            emoji: '🤖',
            selectors: {
                articles: 'article, [data-testid="conversation-turn"]',
                userContent: 'div.whitespace-pre-wrap, [data-message-author-role="user"]',
                copyButton: 'button[aria-label*="Copy"], div.touch\\:-me-2 > button:nth-child(1)',
                title: 'title, h1'
            },
            colors: { primary: '#10a37f', secondary: '#19c37d' }
        },
        'claude.ai': {
            name: 'Claude',
            emoji: '🎭',
            selectors: {
                articles: '[data-testid="message"], .message',
                userContent: '[data-is-author="true"], .user-message',
                copyButton: 'button[aria-label*="Copy"], .copy-button',
                title: 'title, .conversation-title'
            },
            colors: { primary: '#cc785c', secondary: '#d4926f' }
        },
        'yuanbao.tencent.com': {
            name: '元宝',
            emoji: '💎',
            selectors: {
                articles: 'div.agent-chat__list__item',
                userContent: 'div.hyc-content-text',
                copyButton: 'div.agent-chat__toolbar__item.agent-chat__toolbar__copy',
                title: 'span.agent-dialogue__content--common__header__name__title'
            },
            colors: { primary: '#1890ff', secondary: '#40a9ff' }
        },
        'chat.deepseek.com': {
            name: 'DeepSeek',
            emoji: '🔍',
            selectors: {
                articles: '[class*="message"], .chat-message',
                userContent: '.user-content, [data-role="user"]',
                copyButton: 'div.ds-flex > div.ds-icon-button:nth-child(1), .copy-btn',
                title: '[style*="z-index: 12"], .chat-title'
            },
            colors: { primary: '#667eea', secondary: '#764ba2' }
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // CORE SYSTEM - The Narrative Engine
    // ═══════════════════════════════════════════════════════════════

    class ChatExporter {
        constructor() {
            this.platform = this.detectPlatform();
            this.config = PLATFORMS[this.platform.hostname] || this.createFallbackConfig();
            this.button = null;
            this.isInitialized = false;
            
            this.init();
        }

        detectPlatform() {
            return {
                hostname: window.location.hostname,
                url: window.location.href,
                title: document.title
            };
        }

        createFallbackConfig() {
            return {
                name: 'Unknown Platform',
                emoji: '💬',
                selectors: {
                    articles: '[role="article"], .message, .chat-item',
                    userContent: '.user, [data-role="user"], .human',
                    copyButton: '[aria-label*="copy" i], .copy, button[title*="copy" i]',
                    title: 'title, h1, .title'
                },
                colors: { primary: '#6366f1', secondary: '#8b5cf6' }
            };
        }

        // ═══════════════════════════════════════════════════════════════
        // VISUAL INTERFACE - Typography as Architecture
        // ═══════════════════════════════════════════════════════════════

        async init() {
            if (this.isInitialized) return;
            
            await this.injectStyles();
            await this.createFloatingInterface();
            this.bindKeyboardShortcuts();
            this.observePageChanges();
            
            this.isInitialized = true;
            console.log(`🎨 Chat Exporter initialized for ${this.config.name}`);
        }

        async injectStyles() {
            const styleId = 'chat-exporter-styles';
            if (document.getElementById(styleId)) return;

            const styles = `
                <style id="${styleId}">
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                    
                    .chat-exporter-btn {
                        position: fixed;
                        top: 60px;
                        right: 20px;
                        z-index: 99999;
                        
                        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                        font-weight: 500;
                        font-size: 14px;
                        
                        background: linear-gradient(135deg, ${this.config.colors.primary}, ${this.config.colors.secondary});
                        color: white;
                        border: none;
                        border-radius: 12px;
                        padding: 12px 16px;
                        
                        cursor: move;
                        user-select: none;
                        
                        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                        backdrop-filter: blur(10px);
                        
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        transform: translateZ(0);
                    }
                    
                    .chat-exporter-btn:hover {
                        transform: translateY(-2px) scale(1.02);
                        box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
                    }
                    
                    .chat-exporter-btn:active {
                        transform: translateY(0) scale(0.98);
                    }
                    
                    .chat-exporter-btn::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05));
                        border-radius: 12px;
                        pointer-events: none;
                    }
                    
                    .chat-exporter-notification {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        z-index: 100000;
                        
                        background: rgba(0, 0, 0, 0.9);
                        color: white;
                        border-radius: 8px;
                        padding: 12px 16px;
                        
                        font-family: 'Inter', sans-serif;
                        font-size: 13px;
                        font-weight: 500;
                        
                        opacity: 0;
                        transform: translateX(100%);
                        transition: all 0.3s ease-out;
                    }
                    
                    .chat-exporter-notification.show {
                        opacity: 1;
                        transform: translateX(0);
                    }
                </style>
            `;
            
            document.head.insertAdjacentHTML('beforeend', styles);
        }

        async createFloatingInterface() {
            if (this.button) return;

            const savedPosition = await this.getSavedPosition();
            
            this.button = document.createElement('button');
            this.button.className = 'chat-exporter-btn';
            this.button.innerHTML = `${this.config.emoji} Export Chat`;
            this.button.title = `Export ${this.config.name} conversation to Obsidian\nDrag to reposition • Click to export • Ctrl+Shift+E for quick export`;
            
            this.button.style.top = `${savedPosition.top}px`;
            this.button.style.right = `${savedPosition.right}px`;
            
            this.makeDraggable(this.button);
            
            document.body.appendChild(this.button);
        }

        // ═══════════════════════════════════════════════════════════════
        // INTERACTION CHOREOGRAPHY - Movement as Language
        // ═══════════════════════════════════════════════════════════════

        makeDraggable(element) {
            let isDragging = false;
            let startX = 0;
            let startY = 0;
            let hasMoved = false;

            const onMouseDown = (e) => {
                isDragging = true;
                hasMoved = false;
                startX = e.clientX;
                startY = e.clientY;

                const rect = element.getBoundingClientRect();
                element._offsetX = startX - rect.right;
                element._offsetY = startY - rect.top;

                document.body.style.userSelect = 'none';
                element.style.cursor = 'grabbing';
            };

            const onMouseMove = async (e) => {
                if (!isDragging) return;

                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                
                if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
                    hasMoved = true;
                }

                const newTop = e.clientY - element._offsetY;
                const newRight = window.innerWidth - (e.clientX - element._offsetX);

                // Boundary constraints
                const constrainedTop = Math.max(10, Math.min(newTop, window.innerHeight - 60));
                const constrainedRight = Math.max(10, Math.min(newRight, window.innerWidth - 140));

                element.style.top = `${constrainedTop}px`;
                element.style.right = `${constrainedRight}px`;

                await this.savePosition(constrainedTop, constrainedRight);
            };

            const onMouseUp = (e) => {
                if (!isDragging) return;
                
                isDragging = false;
                document.body.style.userSelect = '';
                element.style.cursor = 'move';

                if (!hasMoved) {
                    this.exportConversation();
                }
            };

            element.addEventListener('mousedown', onMouseDown);
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        }

        bindKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.shiftKey && e.key === 'E') {
                    e.preventDefault();
                    this.exportConversation();
                }
            });
        }

        // ═══════════════════════════════════════════════════════════════
        // CONTENT EXTRACTION - Mining Conversations as Artifacts
        // ═══════════════════════════════════════════════════════════════

        async exportConversation() {
            try {
                this.showNotification('🔄 Extracting conversation...', 'info');
                
                const messages = await this.extractMessages();
                
                if (messages.length === 0) {
                    this.showNotification('❌ No messages found', 'error');
                    return;
                }

                const formattedContent = this.formatContent(messages);
                const fileName = this.generateFileName();
                
                GM_setClipboard(formattedContent);
                
                const obsidianUri = `obsidian://new?file=Chats/${this.config.name}/${fileName}&clipboard`;
                
                // Attempt to open in Obsidian
                const link = document.createElement('a');
                link.href = obsidianUri;
                link.click();
                
                this.showNotification(`✅ Exported ${messages.length} messages`, 'success');
                
            } catch (error) {
                console.error('Export error:', error);
                this.showNotification('❌ Export failed', 'error');
            }
        }

        async extractMessages() {
            const messages = [];
            const articles = document.querySelectorAll(this.config.selectors.articles);
            
            // Handle platform-specific extraction
            if (this.platform.hostname === 'chat.deepseek.com') {
                return await this.extractDeepSeekMessages();
            }
            
            for (let i = 0; i < articles.length; i++) {
                const article = articles[i];
                const isUser = i % 2 === 0;
                
                if (isUser) {
                    const userElement = article.querySelector(this.config.selectors.userContent);
                    if (userElement) {
                        messages.push({
                            role: 'user',
                            content: this.cleanText(userElement.textContent)
                        });
                    }
                } else {
                    const content = await this.extractAssistantMessage(article);
                    if (content) {
                        messages.push({
                            role: 'assistant',
                            content: content
                        });
                    }
                }
            }
            
            return messages;
        }

        async extractAssistantMessage(article) {
            const copyButton = article.querySelector(this.config.selectors.copyButton);
            
            if (copyButton) {
                copyButton.click();
                await this.delay(300);
                
                try {
                    return await navigator.clipboard.readText();
                } catch (e) {
                    console.warn('Clipboard access failed, falling back to text extraction');
                }
            }
            
            // Fallback to direct text extraction
            const textElements = article.querySelectorAll('p, div, span');
            return Array.from(textElements)
                .map(el => el.textContent.trim())
                .filter(text => text.length > 0)
                .join('\n');
        }

        async extractDeepSeekMessages() {
            const messages = [];
            const copyButtons = document.querySelectorAll("div.ds-flex > div.ds-icon-button:nth-child(1)");
            
            for (const button of copyButtons) {
                button.click();
                await this.delay(250);
                
                try {
                    const content = await navigator.clipboard.readText();
                    messages.push({
                        role: messages.length % 2 === 0 ? 'user' : 'assistant',
                        content: this.cleanText(content)
                    });
                } catch (e) {
                    console.warn('Failed to extract DeepSeek message');
                }
            }
            
            return messages;
        }

        // ═══════════════════════════════════════════════════════════════
        // CONTENT FORMATTING - Text as Visual Poetry
        // ═══════════════════════════════════════════════════════════════

        formatContent(messages) {
            const timestamp = new Date().toISOString();
            const title = this.extractTitle();
            const url = window.location.href;
            
            const frontmatter = `---
title: "${title}"
platform: ${this.config.name}
timestamp: ${timestamp}
url: ${url}
messages: ${messages.length}
tags: [chat, export, ${this.config.name.toLowerCase()}]
---

`;

            const conversationBody = messages.map((message, index) => {
                const roleEmoji = message.role === 'user' ? '👤' : this.config.emoji;
                const roleLabel = message.role === 'user' ? 'You' : this.config.name;
                
                return `## ${roleEmoji} ${roleLabel}

${this.formatMessage(message.content)}

---
`;
            }).join('\n');

            const metadata = `
> **Conversation Metadata**
> - Platform: ${this.config.name}
> - Messages: ${messages.length}
> - Exported: ${new Date().toLocaleString()}
> - Source: [${title}](${url})

`;

            return frontmatter + metadata + conversationBody;
        }

        formatMessage(content) {
            // Clean and format the message content
            return content
                .trim()
                .replace(/^>\s*/gm, '> ') // Normalize quotes
                .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
                .replace(/```(\w+)?\n/g, '```$1\n') // Ensure code blocks are properly formatted
                .split('\n')
                .map(line => line.trim())
                .join('\n');
        }

        extractTitle() {
            // Try platform-specific title extraction
            const titleSelectors = [
                this.config.selectors.title,
                'h1', 'title', '.title', '[data-testid="conversation-title"]',
                '.conversation-title', '.chat-title'
            ];
            
            for (const selector of titleSelectors) {
                const element = document.querySelector(selector);
                if (element && element.textContent.trim()) {
                    return this.cleanText(element.textContent).substring(0, 100);
                }
            }
            
            // Fallback to document title or URL-based name
            const docTitle = document.title.replace(/[/\\?%*:|"<>]/g, '-').trim();
            return docTitle || `${this.config.name} Conversation`;
        }

        generateFileName() {
            const date = new Date();
            const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
            const timeStr = date.toTimeString().split(' ')[0].replace(/:/g, '');
            const title = this.extractTitle().replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-');
            
            return `${dateStr}_${timeStr}_${title}`.substring(0, 100);
        }

        // ═══════════════════════════════════════════════════════════════
        // UTILITY FUNCTIONS - The Supporting Cast
        // ═══════════════════════════════════════════════════════════════

        cleanText(text) {
            return text
                .replace(/\u00A0/g, ' ') // Replace non-breaking spaces
                .replace(/\s+/g, ' ') // Normalize whitespace
                .trim();
        }

        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async getSavedPosition() {
            const defaultPos = { top: 60, right: 20 };
            const savedTop = await GM_getValue(`${this.platform.hostname}_btnTop`, defaultPos.top);
            const savedRight = await GM_getValue(`${this.platform.hostname}_btnRight`, defaultPos.right);
            
            return { top: savedTop, right: savedRight };
        }

        async savePosition(top, right) {
            await GM_setValue(`${this.platform.hostname}_btnTop`, top);
            await GM_setValue(`${this.platform.hostname}_btnRight`, right);
        }

        showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = 'chat-exporter-notification';
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            // Trigger animation
            setTimeout(() => notification.classList.add('show'), 10);
            
            // Auto remove
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
            
            // Also use GM_notification if available
            if (typeof GM_notification === 'function') {
                GM_notification(message, `${this.config.emoji} Chat Exporter`);
            }
        }

        observePageChanges() {
            const observer = new MutationObserver(() => {
                if (!document.getElementById('chat-exporter-btn')) {
                    this.createFloatingInterface();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // INITIALIZATION - The Grand Opening
    // ═══════════════════════════════════════════════════════════════

    let exporter;

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => exporter = new ChatExporter(), 1000);
        });
    } else {
        setTimeout(() => exporter = new ChatExporter(), 1000);
    }

    // Register menu commands
    GM_registerMenuCommand("📤 Export Conversation", () => {
        if (exporter) exporter.exportConversation();
    });

    GM_registerMenuCommand("⚙️ Reinitialize Exporter", () => {
        exporter = new ChatExporter();
    });

})();