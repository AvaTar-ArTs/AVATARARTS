# Heavenly Hands Call Tracking - Production Deployment Guide

## 🎯 **Overview**

This production-ready call tracking system is based on [Twilio's official call tracking tutorial](https://www.twilio.com/en-us/blog/developers/tutorials/integrations/call-tracking-python-django) and specifically designed for Heavenly Hands Cleaning Service in Gainesville, Florida.

## 🚀 **Features Implemented**

### **Core Call Tracking Features:**
- ✅ **Lead Source Management** - Track calls from different marketing channels
- ✅ **Phone Number Management** - Purchase and manage multiple Twilio numbers
- ✅ **Call Forwarding** - Automatically forward calls to main number (+13525811245)
- ✅ **Lead Creation** - Automatically create lead records from incoming calls
- ✅ **Analytics Dashboard** - Beautiful charts with Chart.js integration
- ✅ **Conversion Tracking** - Monitor booking conversion rates
- ✅ **Real-time Updates** - Live dashboard with automatic refresh

### **Heavenly Hands Specific Features:**
- 🏠 **Service Area Tracking** - Gainesville, Ocala, Alachua, High Springs, Newberry, Micanopy
- 🔧 **Service Type Classification** - Residential, Commercial, Airbnb, Move-in/out, Deep Clean
- 📊 **Campaign Performance** - Google Ads, Facebook, Yelp, Referral tracking
- 📞 **Call Outcome Analysis** - Interested, Not Interested, Callback Requested, etc.
- 💰 **Booking Conversion** - Track successful bookings and estimated values

## 📋 **Prerequisites**

### **Required Environment Variables:**
```bash
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Django Configuration
DJANGO_SECRET_KEY=your_django_secret_key
DEBUG=False

# Webhook Configuration
WEBHOOK_BASE_URL=https://heavenlyhands.avatararts.org
```

### **Required Python Packages:**
```bash
pip install django
pip install twilio
pip install django-phonenumber-field
pip install phonenumbers
```

## 🛠️ **Installation Steps**

### **1. Clone and Setup**
```bash
cd /Users/steven/ai-sites/heavenlyHands
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### **2. Database Setup**
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

### **3. Create Sample Data**
```bash
python manage.py create_sample_data
```

### **4. Start Development Server**
```bash
python manage.py runserver 0.0.0.0:8000
```

## 🌐 **Production Deployment**

### **1. Configure Webhooks in Twilio Console**
- Go to [Twilio Console](https://console.twilio.com/)
- Navigate to Phone Numbers → Manage → Active Numbers
- For each tracking number, set the webhook URL:
  ```
  https://heavenlyhands.avatararts.org/webhook/voice/{lead_source_name}/
  ```

### **2. Deploy to avatararts.org**
```bash
# Upload files to server
scp -r * user@avatararts.org:/path/to/heavenlyhands/

# On server, run:
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py create_sample_data
```

### **3. Configure Web Server (Nginx)**
```nginx
server {
    listen 80;
    server_name heavenlyhands.avatararts.org;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /static/ {
        alias /path/to/heavenlyhands/staticfiles/;
    }
}
```

## 📊 **Dashboard Features**

### **Analytics Dashboard URL:**
```
https://heavenlyhands.avatararts.org/
```

### **Available Charts:**
1. **📊 Leads by Source** - Pie chart showing lead distribution
2. **🏙️ Leads by City** - Doughnut chart of geographic distribution
3. **🔧 Leads by Service Type** - Bar chart of service preferences
4. **📈 Conversion Rates** - Bar chart of source performance

### **Real-time Statistics:**
- Total Leads
- Successful Bookings
- Conversion Rate
- Active Lead Sources

### **Recent Leads Table:**
- Customer Name
- Phone Number
- City
- Service Type
- Lead Source
- Timestamp
- Booking Status

## 🔗 **API Endpoints**

### **Analytics APIs:**
```bash
GET /api/leads-by-source/          # Get leads by source
GET /api/leads-by-city/            # Get leads by city
GET /api/conversion-rates/         # Get conversion rates
GET /api/recent-leads/             # Get recent leads
GET /api/analytics/                # Get comprehensive analytics
```

### **Webhook Endpoints:**
```bash
POST /webhook/voice/{lead_source_name}/  # Handle incoming calls
```

## 📞 **Lead Source Management**

### **Creating New Lead Sources:**
```python
from heavenly_hands_call_tracking.models import HeavenlyHandsLeadSource

# Create a new lead source
source = HeavenlyHandsLeadSource.objects.create(
    name='Google Ads Gainesville',
    incoming_number='+13525551234',
    forwarding_number='+13525811245',
    campaign_type='google_ads',
    service_area='gainesville'
)
```

### **Available Campaign Types:**
- `google_ads` - Google Ads campaigns
- `facebook` - Facebook advertising
- `yelp` - Yelp reviews and ads
- `referral` - Customer referrals
- `direct` - Direct calls
- `other` - Other sources

### **Service Areas:**
- `gainesville` - Gainesville, FL
- `ocala` - Ocala, FL
- `alachua` - Alachua, FL
- `high_springs` - High Springs, FL
- `newberry` - Newberry, FL
- `micanopy` - Micanopy, FL
- `all` - All service areas

## 🎯 **Call Flow Process**

### **1. Incoming Call Process:**
```
Customer calls tracking number
    ↓
Twilio webhook triggers
    ↓
System identifies lead source
    ↓
Creates lead record in database
    ↓
Forwards call to main number (+13525811245)
    ↓
Call ends, system updates outcome
```

### **2. Lead Data Captured:**
- Phone number
- City and state
- Lead source
- Timestamp
- Call duration
- Call outcome
- Booking status

## 📈 **Performance Monitoring**

### **Key Metrics to Track:**
1. **Call Volume** - Total calls per day/week/month
2. **Conversion Rate** - Percentage of calls that result in bookings
3. **Source Performance** - Which marketing channels perform best
4. **Geographic Performance** - Which cities generate most leads
5. **Service Type Trends** - Most requested services

### **Dashboard Refresh:**
- Automatic refresh every 30 seconds
- Real-time call tracking
- Live conversion rate updates

## 🔧 **Customization Options**

### **Adding New Service Types:**
```python
# In models.py, add to SERVICE_TYPE_CHOICES
('new_service', 'New Service Type')
```

### **Adding New Campaign Types:**
```python
# In models.py, add to CAMPAIGN_TYPE_CHOICES
('new_campaign', 'New Campaign Type')
```

### **Customizing Dashboard:**
- Modify `heavenly_hands_dashboard.html`
- Add new Chart.js visualizations
- Customize colors and styling

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **Webhook Not Receiving Calls:**
   - Check Twilio console webhook configuration
   - Verify webhook URL is accessible
   - Check server logs for errors

2. **Database Connection Issues:**
   - Verify SQLite database permissions
   - Check Django settings configuration
   - Run migrations if needed

3. **Chart Not Loading:**
   - Check browser console for JavaScript errors
   - Verify API endpoints are returning data
   - Check Chart.js CDN connection

### **Log Files:**
- Django logs: `heavenly_hands_call_tracking.log`
- Server logs: Check web server configuration
- Twilio logs: Available in Twilio console

## 📞 **Support and Maintenance**

### **Regular Maintenance Tasks:**
1. **Weekly:** Review conversion rates and optimize underperforming sources
2. **Monthly:** Analyze geographic trends and adjust marketing focus
3. **Quarterly:** Review and update service type classifications

### **Backup Strategy:**
```bash
# Backup database
cp heavenly_hands_call_tracking.db backup_$(date +%Y%m%d).db

# Backup static files
tar -czf static_backup_$(date +%Y%m%d).tar.gz staticfiles/
```

## 🎉 **Success Metrics**

### **Expected Results:**
- **Call Tracking:** 100% of incoming calls tracked and recorded
- **Lead Management:** Automated lead creation and categorization
- **Analytics:** Real-time insights into marketing performance
- **Conversion:** Improved booking rates through better lead qualification

### **ROI Indicators:**
- Increased lead volume from tracked sources
- Higher conversion rates from qualified leads
- Better understanding of customer demographics
- Optimized marketing spend based on performance data

---

## 📚 **Additional Resources**

- [Twilio Call Tracking Tutorial](https://www.twilio.com/en-us/blog/developers/tutorials/integrations/call-tracking-python-django)
- [Django Documentation](https://docs.djangoproject.com/)
- [Chart.js Documentation](https://www.chartjs.org/docs/)
- [Twilio Voice API](https://www.twilio.com/docs/voice)

---

**🎯 This production-ready call tracking system will help Heavenly Hands Cleaning Service optimize their marketing efforts, track lead performance, and increase booking conversions through data-driven insights.**
