# 🚀 Heavenly Hands Call Center - Deployment Guide for avatararts.org

## 📋 Quick Deployment Steps

### 1. Upload Files to Your Server

Use your FTP credentials to upload these files to `public_html/`:

```
FTP Host: ftp://avatararts.org
Username: u841983302
Password: [your password]
Path: public_html/
```

**Files to upload:**
- `heavenly_hands_web.py` (main application)
- `requirements.txt` (dependencies)
- `start-heavenly-hands.sh` (startup script)

### 2. Configure Environment Variables

Create a `.env` file in your `public_html/` directory:

```bash
# OpenAI API (Required)
OPENAI_API_KEY=your_actual_openai_api_key_here

# Twilio API (Required for phone integration)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+13523296150

# Server Configuration
PORT=5000
DEBUG=False
```

### 3. Configure Twilio Webhook

In your Twilio console:
1. Go to Phone Numbers → Manage Numbers
2. Click on (352) 329-6150
3. Set Voice webhook URL to: `https://heavenlyhands.avatararts.org/twilio/webhook`
4. Save configuration

### 4. Start the Application

SSH into your server and run:

```bash
cd public_html/
chmod +x start-heavenly-hands.sh
./start-heavenly-hands.sh
```

## 🎯 Testing Your Deployment

### Web Interface
Visit: https://heavenlyhands.avatararts.org/

### Phone Testing
Call: (352) 329-6150

### Test Scenarios
Try these phrases when calling:
- "Hi, I need house cleaning service"
- "What's your pricing for a 3-bedroom home?"
- "Do you have availability this weekend?"
- "I'm interested in commercial cleaning"

## 📊 Features Included

✅ **Live Embedding Engine** - Real-time knowledge retrieval
✅ **AST-Based Intelligence** - Pattern recognition and intent classification
✅ **Semantic Analysis** - Customer sentiment and service categorization
✅ **Confidence Scoring** - Reliability assessment for all responses
✅ **Professional Call Handling** - Industry-standard call center operations
✅ **Heavenly Hands Knowledge Base** - Complete service information
✅ **Web Interface** - Browser-based testing and monitoring
✅ **Phone Integration** - Twilio-powered voice calls

## 🛠️ Troubleshooting

### Common Issues

**"Module not found" errors:**
```bash
source venv/bin/activate
pip install -r requirements.txt
```

**Twilio webhook not working:**
- Check webhook URL in Twilio console
- Ensure server is accessible from internet
- Verify SSL certificate is valid

**OpenAI API errors:**
- Check API key validity
- Verify account has credits
- Check rate limits

## 📞 Support

Your Heavenly Hands AI Call Center is now ready to provide 24/7 professional customer service!

**Live Features:**
- Professional call handling
- Service information and pricing
- Appointment scheduling assistance
- Complaint resolution
- Sales opportunity identification
- Follow-up management

**Business Benefits:**
- 24/7 availability
- Consistent service quality
- Reduced staffing costs
- Professional customer experience
- Intelligent lead qualification
- Comprehensive call analytics

🎉 **Deployment Complete!** Your AI call center is live and ready to serve customers!
