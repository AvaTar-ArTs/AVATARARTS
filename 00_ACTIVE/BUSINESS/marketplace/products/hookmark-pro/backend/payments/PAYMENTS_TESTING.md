# Payments API Testing Guide

## Overview

This guide shows how to test the Stripe payment integration endpoints using `curl`, Postman, and Stripe CLI.

**Base URL**: `http://localhost:5000/api/v1/payments`

---

## Prerequisites

1. **Stripe Account**: Sign up at https://stripe.com
2. **Stripe CLI**: Install from https://stripe.com/docs/stripe-cli
3. **Environment Variables**: Set up `.env` file with Stripe keys
4. **Authentication Token**: Get token from `/api/v1/auth/login` or `/api/v1/auth/signup`

---

## Stripe Setup

### 1. Get API Keys

1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy your **Secret key** (starts with `sk_test_`)
3. Copy your **Publishable key** (starts with `pk_test_`)
4. Add to `.env`:

```bash
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key
```

### 2. Create Products and Prices

#### Option A: Using Stripe Dashboard

1. Go to https://dashboard.stripe.com/test/products
2. Click **"Add product"**
3. Create three products:

**Pro Tier:**
- Name: `Hookmark Pro`
- Price: `$4.99 / month`
- Recurring: Monthly
- Copy the Price ID (starts with `price_`)

**Teams Tier:**
- Name: `Hookmark Teams`
- Price: `$19 / month`
- Recurring: Monthly

**Enterprise Tier:**
- Name: `Hookmark Enterprise`
- Price: `$99 / month`
- Recurring: Monthly

4. Add Price IDs to `.env`:

```bash
STRIPE_PRICE_PRO=price_1234567890abcdef
STRIPE_PRICE_TEAMS=price_0987654321fedcba
STRIPE_PRICE_ENTERPRISE=price_abcdef1234567890
```

#### Option B: Using Stripe CLI

```bash
# Create Pro product and price
stripe products create --name="Hookmark Pro" --description="Pro tier subscription"
stripe prices create --product=prod_XXX --unit-amount=499 --currency=usd --recurring[interval]=month

# Create Teams product and price
stripe products create --name="Hookmark Teams" --description="Teams tier subscription"
stripe prices create --product=prod_YYY --unit-amount=1900 --currency=usd --recurring[interval]=month

# Create Enterprise product and price
stripe products create --name="Hookmark Enterprise" --description="Enterprise tier subscription"
stripe prices create --product=prod_ZZZ --unit-amount=9900 --currency=usd --recurring[interval]=month
```

### 3. Set Up Webhook

#### For Local Testing:

```bash
# Forward Stripe events to local server
stripe listen --forward-to localhost:5000/api/v1/payments/webhook

# Copy the webhook secret (starts with whsec_)
# Add to .env:
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

#### For Production:

1. Go to https://dashboard.stripe.com/test/webhooks
2. Click **"Add endpoint"**
3. Endpoint URL: `https://yourdomain.com/api/v1/payments/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the webhook secret and add to `.env`

---

## API Endpoints

### 1. Get Pricing (Public)

**Endpoint**: `GET /pricing`

```bash
curl -X GET http://localhost:5000/api/v1/payments/pricing
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "pricing": [
      {
        "tier": "free",
        "name": "Free",
        "price": 0,
        "priceDisplay": "$0",
        "interval": "forever",
        "features": [
          "Up to 50 bookmarks",
          "Basic ratings (1-5 stars)",
          "Single device sync",
          "Basic categories",
          "Export to CSV"
        ],
        "limits": {
          "bookmarks": 50,
          "collections": 1,
          "teamMembers": 0,
          "apiCalls": 0
        }
      },
      {
        "tier": "pro",
        "name": "Pro",
        "price": 4.99,
        "priceDisplay": "$4.99",
        "interval": "month",
        "features": [
          "Unlimited bookmarks",
          "Advanced ratings & reviews",
          "Multi-device sync",
          "Unlimited categories & tags",
          "AI-powered recommendations",
          "Priority support",
          "Export to multiple formats"
        ],
        "limits": {
          "bookmarks": -1,
          "collections": 10,
          "teamMembers": 0,
          "apiCalls": 1000
        },
        "popular": true
      }
      // ... teams and enterprise tiers
    ]
  }
}
```

---

### 2. Create Checkout Session (Protected)

**Endpoint**: `POST /create-checkout-session`

**Requires**: Authorization header with Bearer token

```bash
TOKEN="your-jwt-token-here"

curl -X POST http://localhost:5000/api/v1/payments/create-checkout-session \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tier": "pro"
  }'
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "sessionId": "cs_test_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
    "url": "https://checkout.stripe.com/c/pay/cs_test_a1b2c3d4..."
  }
}
```

**Usage:**
1. Redirect user to the returned `url`
2. User completes payment on Stripe Checkout page
3. Stripe redirects back to your success URL
4. Webhook updates user's subscription status

**Error Responses:**

Invalid tier (400):
```json
{
  "success": false,
  "error": "Invalid subscription tier"
}
```

Already subscribed (400):
```json
{
  "success": false,
  "error": "User already has an active subscription"
}
```

---

### 3. Get Current Subscription (Protected)

**Endpoint**: `GET /subscription`

```bash
curl -X GET http://localhost:5000/api/v1/payments/subscription \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "subscription": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "tier": "pro",
      "status": "active",
      "current_period_start": "2024-12-26T00:00:00.000Z",
      "current_period_end": "2025-01-26T00:00:00.000Z",
      "cancel_at_period_end": false,
      "created_at": "2024-12-26T10:00:00.000Z"
    }
  }
}
```

**No Subscription** (404):
```json
{
  "success": false,
  "error": "No active subscription found"
}
```

---

### 4. Create Customer Portal Session (Protected)

**Endpoint**: `POST /create-portal-session`

The Customer Portal allows users to:
- Update payment methods
- View invoices
- Cancel subscription
- Update billing information

```bash
curl -X POST http://localhost:5000/api/v1/payments/create-portal-session \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "url": "https://billing.stripe.com/p/session/test_a1b2c3d4..."
  }
}
```

**Usage:**
1. Redirect user to the returned `url`
2. User manages their subscription on Stripe's hosted portal
3. Stripe redirects back to your return URL

---

### 5. Cancel Subscription (Protected)

**Endpoint**: `POST /cancel-subscription`

**Note**: This cancels at the end of the billing period, not immediately.

```bash
curl -X POST http://localhost:5000/api/v1/payments/cancel-subscription \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Subscription will be cancelled at the end of the billing period",
  "data": {
    "cancelAt": "2025-01-26T00:00:00.000Z"
  }
}
```

---

### 6. Reactivate Subscription (Protected)

**Endpoint**: `POST /reactivate-subscription`

Removes the cancellation from a subscription that was cancelled but hasn't ended yet.

```bash
curl -X POST http://localhost:5000/api/v1/payments/reactivate-subscription \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Subscription reactivated successfully"
}
```

---

## Testing Workflow

### Complete Subscription Flow

#### 1. Create Account and Login

```bash
# Sign up
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Save the token
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### 2. View Pricing

```bash
curl -X GET http://localhost:5000/api/v1/payments/pricing
```

#### 3. Create Checkout Session

```bash
curl -X POST http://localhost:5000/api/v1/payments/create-checkout-session \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"tier": "pro"}'
```

#### 4. Test Payment

In test mode, use Stripe's test card numbers:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

Any future expiry date and any 3-digit CVC.

#### 5. Verify Subscription

```bash
# Check subscription status
curl -X GET http://localhost:5000/api/v1/payments/subscription \
  -H "Authorization: Bearer $TOKEN"

# Check user tier was upgraded
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

#### 6. Manage Subscription

```bash
# Cancel subscription
curl -X POST http://localhost:5000/api/v1/payments/cancel-subscription \
  -H "Authorization: Bearer $TOKEN"

# Reactivate subscription
curl -X POST http://localhost:5000/api/v1/payments/reactivate-subscription \
  -H "Authorization: Bearer $TOKEN"

# Access customer portal
curl -X POST http://localhost:5000/api/v1/payments/create-portal-session \
  -H "Authorization: Bearer $TOKEN"
```

---

## Webhook Testing

### Using Stripe CLI

1. Start webhook forwarding:

```bash
stripe listen --forward-to localhost:5000/api/v1/payments/webhook
```

2. Trigger test events:

```bash
# Test successful checkout
stripe trigger checkout.session.completed

# Test subscription update
stripe trigger customer.subscription.updated

# Test payment failure
stripe trigger invoice.payment_failed
```

### Manual Webhook Testing

You can also send webhook events manually:

```bash
curl -X POST http://localhost:5000/api/v1/payments/webhook \
  -H "Content-Type: application/json" \
  -H "Stripe-Signature: test_signature" \
  -d '{
    "type": "checkout.session.completed",
    "data": {
      "object": {
        "id": "cs_test_123",
        "mode": "subscription",
        "customer": "cus_test_123",
        "subscription": "sub_test_123",
        "metadata": {
          "userId": "user-uuid",
          "tier": "pro"
        }
      }
    }
  }'
```

**Note**: In production, this will fail signature verification. Use Stripe CLI for testing.

---

## Postman Collection

Import this JSON into Postman:

```json
{
  "info": {
    "name": "Hookmark Pro Payments",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api/v1/payments"
    },
    {
      "key": "token",
      "value": "your-jwt-token"
    }
  ],
  "item": [
    {
      "name": "Get Pricing",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/pricing"
        }
      }
    },
    {
      "name": "Create Checkout Session",
      "request": {
        "method": "POST",
        "header": [
          {"key": "Authorization", "value": "Bearer {{token}}"},
          {"key": "Content-Type", "value": "application/json"}
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"tier\": \"pro\"}"
        },
        "url": {
          "raw": "{{baseUrl}}/create-checkout-session"
        }
      }
    },
    {
      "name": "Get Subscription",
      "request": {
        "method": "GET",
        "header": [
          {"key": "Authorization", "value": "Bearer {{token}}"}
        ],
        "url": {
          "raw": "{{baseUrl}}/subscription"
        }
      }
    },
    {
      "name": "Create Portal Session",
      "request": {
        "method": "POST",
        "header": [
          {"key": "Authorization", "value": "Bearer {{token}}"}
        ],
        "url": {
          "raw": "{{baseUrl}}/create-portal-session"
        }
      }
    },
    {
      "name": "Cancel Subscription",
      "request": {
        "method": "POST",
        "header": [
          {"key": "Authorization", "value": "Bearer {{token}}"}
        ],
        "url": {
          "raw": "{{baseUrl}}/cancel-subscription"
        }
      }
    },
    {
      "name": "Reactivate Subscription",
      "request": {
        "method": "POST",
        "header": [
          {"key": "Authorization", "value": "Bearer {{token}}"}
        ],
        "url": {
          "raw": "{{baseUrl}}/reactivate-subscription"
        }
      }
    }
  ]
}
```

---

## Common Issues

### Issue 1: Webhook Signature Verification Failed

**Error**: `Webhook signature verification failed`

**Solution**:
- Ensure `STRIPE_WEBHOOK_SECRET` is set correctly in `.env`
- Use `stripe listen` for local testing
- Check that webhook route is before `express.json()` middleware

### Issue 2: Invalid Price ID

**Error**: `No such price: 'price_XXX'`

**Solution**:
- Create products and prices in Stripe Dashboard
- Update `.env` with correct Price IDs
- Ensure you're using test mode Price IDs (start with `price_test_`)

### Issue 3: User Already Has Subscription

**Error**: `User already has an active subscription`

**Solution**:
- User can only have one active subscription at a time
- Cancel existing subscription before creating a new one
- Or upgrade/downgrade through customer portal

---

## Next Steps

1. Test all endpoints with curl or Postman
2. Complete a full subscription flow
3. Test webhook events with Stripe CLI
4. Integrate with Chrome extension frontend
5. Set up production webhooks
6. Enable production mode in Stripe Dashboard

---

**Status**: Payment module complete and ready for testing
**Last Updated**: December 26, 2024
