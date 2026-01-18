// AI Chatbot for Gainesville Psychiatry and Forensic Services
class PsychiatryChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.init();
    }

    init() {
        this.createChatbotHTML();
        this.attachEventListeners();
        this.addWelcomeMessage();
    }

    createChatbotHTML() {
        const chatbotHTML = `
            <div id="psychiatry-chatbot" class="chatbot-container">
                <div class="chatbot-header">
                    <h3>Ask Dr. Adu's Team</h3>
                    <button id="chatbot-close" class="chatbot-close">×</button>
                </div>
                <div class="chatbot-messages" id="chatbot-messages">
                    <!-- Messages will be added here -->
                </div>
                <div class="chatbot-input">
                    <input type="text" id="chatbot-input" placeholder="Ask about TMS therapy, appointments, or services...">
                    <button id="chatbot-send">Send</button>
                </div>
                <div class="chatbot-quick-actions">
                    <button class="quick-action" data-message="What is TMS therapy?">TMS Therapy</button>
                    <button class="quick-action" data-message="Do you accept insurance?">Insurance</button>
                    <button class="quick-action" data-message="How do I schedule an appointment?">Appointments</button>
                    <button class="quick-action" data-message="What mental health services do you offer?">Services</button>
                </div>
            </div>
            <button id="chatbot-toggle" class="chatbot-toggle">
                <span>💬</span>
                <span class="chatbot-badge">1</span>
            </button>
        `;

        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    attachEventListeners() {
        document.getElementById('chatbot-toggle').addEventListener('click', () => this.toggleChatbot());
        document.getElementById('chatbot-close').addEventListener('click', () => this.closeChatbot());
        document.getElementById('chatbot-send').addEventListener('click', () => this.sendMessage());
        document.getElementById('chatbot-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Quick action buttons
        document.querySelectorAll('.quick-action').forEach(button => {
            button.addEventListener('click', (e) => {
                const message = e.target.getAttribute('data-message');
                this.addMessage(message, 'user');
                this.processMessage(message);
            });
        });
    }

    toggleChatbot() {
        this.isOpen = !this.isOpen;
        const chatbot = document.getElementById('psychiatry-chatbot');
        chatbot.style.display = this.isOpen ? 'block' : 'none';
        
        if (this.isOpen) {
            document.getElementById('chatbot-input').focus();
        }
    }

    closeChatbot() {
        this.isOpen = false;
        document.getElementById('psychiatry-chatbot').style.display = 'none';
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.innerHTML = `<p>${text}</p>`;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    addWelcomeMessage() {
        this.addMessage("Hello! I'm here to help answer questions about Dr. Lawrence Adu's psychiatric services, TMS therapy, appointments, and more. How can I assist you today?", 'bot');
    }

    processMessage(message) {
        const responses = {
            'tms': 'TMS (Transcranial Magnetic Stimulation) is a non-invasive, FDA-approved treatment for depression. It uses magnetic fields to stimulate nerve cells in the brain. The procedure is painless and takes about 20-30 minutes. Most patients can return to normal activities immediately after treatment.',
            'insurance': 'Yes, we accept most major insurance plans including Medicare, Medicaid, Blue Cross Blue Shield, Aetna, Cigna, and UnitedHealthcare. Please call (352) 378-9116 to verify your specific coverage and benefits.',
            'appointment': 'To schedule an appointment, you can call us at (352) 378-9116 or visit our appointments page. We offer same-day appointments when available and accept most insurance plans.',
            'services': 'We offer comprehensive mental health services including TMS therapy, medication management, forensic psychiatry, addiction medicine, and counseling. Dr. Adu specializes in treating depression, anxiety, bipolar disorder, PTSD, and substance use disorders.',
            'cost': 'TMS therapy costs vary based on your insurance coverage. We work with most major insurance providers and offer flexible payment options. Call (352) 378-9116 for a personalized cost estimate.',
            'location': 'We are located at 1103 SW 2nd Avenue, Gainesville, FL 32601. Our office is conveniently located in downtown Gainesville with easy parking access.',
            'hours': 'Our office hours are Monday through Friday, 9:00 AM to 5:00 PM. We also offer some evening and weekend appointments by special arrangement.',
            'emergency': 'If you are experiencing a mental health emergency, please call 911 or go to your nearest emergency room. For non-emergency concerns, you can reach us at (352) 378-9116 during business hours.'
        };

        const lowerMessage = message.toLowerCase();
        let response = "Thank you for your question! For more detailed information, please call us at (352) 378-9116 or visit our website. We're here to help with all your mental health needs.";

        if (lowerMessage.includes('tms') || lowerMessage.includes('therapy')) {
            response = responses.tms;
        } else if (lowerMessage.includes('insurance') || lowerMessage.includes('coverage')) {
            response = responses.insurance;
        } else if (lowerMessage.includes('appointment') || lowerMessage.includes('schedule')) {
            response = responses.appointment;
        } else if (lowerMessage.includes('service') || lowerMessage.includes('treat')) {
            response = responses.services;
        } else if (lowerMessage.includes('cost') || lowerMessage.includes('price')) {
            response = responses.cost;
        } else if (lowerMessage.includes('location') || lowerMessage.includes('address')) {
            response = responses.location;
        } else if (lowerMessage.includes('hour') || lowerMessage.includes('time')) {
            response = responses.hours;
        } else if (lowerMessage.includes('emergency') || lowerMessage.includes('crisis')) {
            response = responses.emergency;
        }

        setTimeout(() => {
            this.addMessage(response, 'bot');
        }, 1000);
    }

    sendMessage() {
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();
        
        if (message) {
            this.addMessage(message, 'user');
            this.processMessage(message);
            input.value = '';
        }
    }
}

// Initialize chatbot when page loads
document.addEventListener('DOMContentLoaded', function() {
    new PsychiatryChatbot();
});

// Add chatbot styles
const chatbotStyles = `
    <style>
        .chatbot-container {
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 350px;
            height: 500px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            display: none;
            flex-direction: column;
            z-index: 1000;
            font-family: 'Inter', sans-serif;
        }

        .chatbot-header {
            background: #3498db;
            color: white;
            padding: 15px;
            border-radius: 10px 10px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .chatbot-close {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
        }

        .chatbot-messages {
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            max-height: 300px;
        }

        .message {
            margin-bottom: 10px;
            padding: 10px;
            border-radius: 10px;
            max-width: 80%;
        }

        .message.user {
            background: #3498db;
            color: white;
            margin-left: auto;
        }

        .message.bot {
            background: #f1f2f6;
            color: #2c3e50;
        }

        .chatbot-input {
            padding: 15px;
            border-top: 1px solid #eee;
            display: flex;
            gap: 10px;
        }

        .chatbot-input input {
            flex: 1;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 20px;
            outline: none;
        }

        .chatbot-input button {
            background: #3498db;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 20px;
            cursor: pointer;
        }

        .chatbot-quick-actions {
            padding: 10px 15px;
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
        }

        .quick-action {
            background: #ecf0f1;
            border: none;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 12px;
            cursor: pointer;
            color: #2c3e50;
        }

        .quick-action:hover {
            background: #3498db;
            color: white;
        }

        .chatbot-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: #3498db;
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 999;
        }

        .chatbot-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background: #e74c3c;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', chatbotStyles);