# 🤖 AI Voice Agent Script - CleanConnect Leads

**Purpose:** Qualify cleaning service leads and route to partner companies
**Platform:** Bland.ai or Vapi.ai
**Average Call Duration:** 3-5 minutes
**Target Qualification Rate:** 60%+

---

## 🎯 CALL FLOW STRUCTURE

```
GREETING (10 sec)
  ↓
QUALIFICATION (60 sec)
  ↓
DETAILS GATHERING (120 sec)
  ↓
PRICING & SCHEDULING (60 sec)
  ↓
CONFIRMATION (30 sec)
```

---

## 📞 COMPLETE SCRIPT

### **[GREETING - 10 seconds]**

```
AGENT: "Hi, thank you for calling CleanConnect! This is [Agent Name],
        your cleaning services coordinator. How can I help you today?"

[WAIT FOR RESPONSE]

CUSTOMER SAYS: [Various: "I need cleaning" / "Quote for my house" / etc.]
```

---

### **[QUALIFICATION - 60 seconds]**

```
AGENT: "Great! I'd be happy to help you find the perfect cleaning service.
        May I get your first name?"

CUSTOMER: "[Name]"

AGENT: "Perfect, thank you [Name]. Quick question - are you looking for
        residential or commercial cleaning?"

CUSTOMER: "[Residential / Commercial / Business]"

[IF RESIDENTIAL:]
AGENT: "Wonderful. And is this for:
        1. A one-time deep clean
        2. Regular recurring service, or
        3. A special occasion like move-in or move-out?"

[IF COMMERCIAL:]
AGENT: "Great. Is this for:
        1. Regular office cleaning
        2. One-time deep cleaning, or
        3. Specialized cleaning like post-construction?"

CUSTOMER: "[Answers]"
```

---

### **[DETAILS GATHERING - 120 seconds]**

```
AGENT: "Perfect. To match you with the best cleaning professional and give
        you an accurate quote, I need a few quick details.

        First, what's the size of the space?

        [IF RESIDENTIAL:] Number of bedrooms and bathrooms?
        [IF COMMERCIAL:] Square footage or number of rooms?"

CUSTOMER: "[Answers size]"

AGENT: "Got it - [repeat back: "three bedroom, two bath" or "2000 square feet"].

        Next question: What level of cleaning do you need?
        • Standard cleaning includes dusting, vacuuming, mopping,
          bathrooms, and kitchen
        • Deep cleaning adds baseboards, inside appliances, windows,
          and detailed work
        • Move-in or move-out cleaning is our most thorough option

        Which sounds right for you?"

CUSTOMER: "[Standard / Deep / Move-out]"

AGENT: "Excellent choice. A few more quick questions:

        1. Do you have any pets in the home?
           [Important for allergies and cleaning time]"

CUSTOMER: "[Yes/No - if yes, what type]"

AGENT: "2. Are there any specific areas that need extra attention?
           Things like tough stains, heavily soiled areas, or
           particular rooms you want us to focus on?"

CUSTOMER: "[Answers or "No, just general"]"

AGENT: "3. Do you have any preference for cleaning products?
           • Standard all-purpose cleaners
           • Eco-friendly and green products
           • Or we can use your own supplies"

CUSTOMER: "[Answers]"

AGENT: "Perfect. And last detail - what's your zip code or
        general location? This helps us match you with a
        local cleaning professional."

CUSTOMER: "[Zip code / Address]"

AGENT: "Great! Let me check our service area...
        [PAUSE 2 seconds - checking database]

        Good news - we have excellent cleaning professionals
        serving your area!"
```

---

### **[PRICING & SCHEDULING - 60 seconds]**

```
AGENT: "Based on everything you've told me:
        • [Residential/Commercial]
        • [Size details]
        • [Standard/Deep/Move-out] cleaning
        • [Any special requests]

        Your estimated cost would be between $[LOW] and $[HIGH].

        [IF RECURRING:]
        'And as a CleanConnect member, you'd get 10% off recurring
        service, bringing it to approximately $[DISCOUNTED AMOUNT].'

        Does that work within your budget?"

[IF YES - Continue]
[IF NO - OBJECTION HANDLING - see below]

CUSTOMER: "Yes, that sounds good"

AGENT: "Excellent! I have a few time slots available with our
        top-rated professionals:

        • [Day 1] at [Time 1] - with [Cleaner Name], 5-star rated
        • [Day 2] at [Time 2] - with [Cleaner Name], 4.9 stars
        • [Day 3] at [Time 3] - with [Cleaner Name], 5-star rated

        Which would you prefer?"

CUSTOMER: "[Chooses slot]"
```

---

### **[CONFIRMATION - 30 seconds]**

```
AGENT: "Perfect! I've got you scheduled for:
        • [Day of week], [Date] at [Time]
        • [Cleaner Name] will arrive within a 2-hour window: [time range]
        • Estimated cost: $[amount]

        Just a couple final details:

        1. Will someone be home, or should we arrange for a
           key pickup or lockbox code?"

CUSTOMER: "[Someone home / Key arrangement]"

AGENT: "2. Best phone number to reach you at?"

CUSTOMER: "[Phone number]"

AGENT: "And would you like a text confirmation? We can also
        send reminders."

CUSTOMER: "[Yes/No]"

[IF YES TO TEXT:]
AGENT: "Great! You'll receive a confirmation text within 5 minutes
        to [phone number].

        You'll also get a reminder 24 hours before, and our cleaner
        will text when they're on the way.

        Is there anything else I can help you with today, [Name]?"

CUSTOMER: "[Questions or No]"

AGENT: "Wonderful! We're looking forward to making your [home/office]
        sparkle on [Day]. The team at CleanConnect thanks you, and if
        you need anything before then, just call us back at this number.

        Have a great day!"
```

---

## 🚫 OBJECTION HANDLING

### **"That's more expensive than I expected..."**

```
AGENT: "I completely understand. Let me see what I can do.

        We have a few options:
        1. We could do a standard clean instead of deep clean -
           that would bring it to about $[LOWER AMOUNT]
        2. We could focus on specific rooms only - like just
           bathrooms and kitchen
        3. For first-time customers this month, I can offer an
           additional 15% discount

        Would any of those work better for you?"
```

### **"I need to think about it..."**

```
AGENT: "Of course, I understand! This is an important decision.

        Would it help if I email you the quote along with details
        about our top-rated cleaners in your area?

        Also, if you book within the next 48 hours, you'll lock in
        our current first-time customer discount of [X%] off.

        What email should I send that to?"

[IF THEY GIVE EMAIL - SUCCESS!]
[IF NOT:]

AGENT: "No problem. Can I at least leave you with this direct number
        to call back? It's [PHONE]. Just mention reference code
        [UNIQUE CODE] and we'll have all your details ready.

        And [Name], our calendar fills up quickly, especially
        [mention weekend/holiday if applicable], so I'd encourage
        calling back within a day or two if you're interested.

        Sound good?"
```

### **"Do you do [special service]?"**

```
[IF YES:]
AGENT: "Yes we do! [Special service] would be an additional $[X-Y]
        depending on the extent. Should I add that to your quote?"

[IF NO:]
AGENT: "That's not something our standard service includes, but let me
        check with our specialized team.

        Can I get your callback number and I'll have someone reach out
        within an hour with pricing for [special service]?"
```

### **"Can I get the same cleaner every time?"**

```
AGENT: "Absolutely! That's actually one of the most popular requests.

        When you book recurring service, we assign you a dedicated cleaner
        who gets to know your home and your preferences. They come at the
        same time, same day each [week/two weeks/month].

        If you ever need a different day, we can accommodate that too.

        Would you like me to set that up for you?"
```

---

## 🎯 QUALIFICATION CRITERIA

### **Qualified Lead = All of these:**
- ✅ Budget confirmed (said yes to pricing)
- ✅ Location in service area
- ✅ Date selected or timeline given
- ✅ Contact info collected
- ✅ Space size confirmed

### **Hot Lead = Qualified + these:**
- 🔥 Booking made immediately
- 🔥 Recurring service selected
- 🔥 Referred by existing customer
- 🔥 Premium service requested

### **Cold Lead = Missing these:**
- ❄️ No budget commitment
- ❄️ Just "shopping around"
- ❄️ No timeline ("sometime")
- ❄️ Won't give contact info

---

## 💰 PRICING CALCULATOR

### **Residential Pricing Guide:**

| Size | Standard Clean | Deep Clean | Move-in/out |
|------|---------------|------------|-------------|
| 1BR/1BA | $80-120 | $150-200 | $200-300 |
| 2BR/2BA | $100-150 | $180-250 | $250-350 |
| 3BR/2BA | $120-180 | $200-300 | $300-450 |
| 4BR/3BA | $150-220 | $250-400 | $400-600 |

### **Commercial Pricing Guide:**

| Size | Weekly | Bi-weekly | Monthly |
|------|--------|-----------|---------|
| < 1000 sq ft | $150-200 | $180-250 | $250-350 |
| 1000-2500 | $200-300 | $250-400 | $350-500 |
| 2500-5000 | $300-500 | $400-650 | $550-800 |

---

## 🤖 AI AGENT CONFIGURATION

### **Bland.ai Setup:**

```json
{
  "voice": "maya",
  "speed": 1.0,
  "emotion": "friendly-professional",
  "interruption_threshold": 150,
  "max_duration": 600,
  "webhook_url": "https://cleanconnect.com/api/lead",
  "transfer_number": "+1-XXX-XXX-XXXX"
}
```

### **Key Variables to Capture:**

```javascript
{
  customer_name: string,
  service_type: "residential" | "commercial",
  frequency: "one-time" | "recurring",
  bedrooms: number,
  bathrooms: number,
  square_feet: number,
  cleaning_level: "standard" | "deep" | "move-out",
  has_pets: boolean,
  pet_types: string[],
  special_requests: string,
  product_preference: "standard" | "eco" | "own",
  zip_code: string,
  estimated_price: number,
  selected_date: datetime,
  selected_time: string,
  phone_number: string,
  email: string,
  key_arrangement: string,
  qualification_status: "qualified" | "hot" | "cold"
}
```

---

## 🚀 DEPLOYMENT STEPS

### **1. Set up Bland.ai Account:**
```bash
# Go to https://bland.ai/
# Sign up for account
# Get API key
# Cost: ~$0.12/minute
```

### **2. Configure Voice Agent:**
```bash
# Upload this script
# Set voice parameters
# Test with sample calls
# Set up webhook for lead capture
```

### **3. Integrate with CleanConnect:**
```bash
cd ~/ai-sites/cleanconnect-pro
# Connect Bland.ai webhook to lead database
# Set up SMS confirmations
# Configure partner notifications
```

### **4. Partner with Local Cleaners:**
```bash
# Find 3-5 cleaning companies in your area
# Offer lead generation service
# Charge $50-100 per qualified lead
# Or 10-20% of first job
```

---

## 📊 SUCCESS METRICS

**Target KPIs:**
- Call answer rate: 80%+
- Qualification rate: 60%+
- Booking conversion: 40%+
- Average call time: 3-5 minutes
- Lead value: $50-100 each

**Revenue Calculation:**
```
5 qualified leads/day × 30 days × $75/lead = $11,250/month
```

---

## 🎯 NEXT STEPS

1. Test script with Bland.ai demo
2. Record sample calls
3. Refine based on objections
4. Deploy to production
5. Monitor and optimize

**Ready to generate cleaning leads on autopilot!** 🤖💰
