# Payments Module

Complete Stripe billing integration for Hookmark Pro subscription management.

## Overview

This module handles all payment and subscription operations using Stripe:
- Checkout session creation
- Subscription management (create, update, cancel, reactivate)
- Webhook event processing
- Customer portal access
- Subscription status synchronization

## Architecture

### Files

```
payments/
├── stripeService.js        - Core Stripe business logic
├── paymentController.js    - HTTP request handlers
├── stripeWebhooks.js       - Webhook event handlers
├── paymentRoutes.js        - Express routes
├── PAYMENTS_TESTING.md     - Testing guide
└── README.md               - This file
```

### Service Layer (stripeService.js)

The `StripeService` class handles all Stripe API interactions:

**Checkout & Portal:**
- `createCheckoutSession()` - Create Stripe Checkout session
- `createPortalSession()` - Create Customer Portal session

**Subscription Management:**
- `getSubscriptionDetails()` - Fetch subscription from Stripe
- `getUserSubscription()` - Get user's current subscription from DB
- `cancelSubscription()` - Cancel at period end
- `reactivateSubscription()` - Remove cancellation

**Webhook Handlers:**
- `handleCheckoutCompleted()` - Process successful checkout
- `handleSubscriptionUpdated()` - Sync subscription changes
- `handleSubscriptionDeleted()` - Downgrade to free tier
- `verifyWebhookSignature()` - Validate webhook authenticity

**Utility:**
- `getPriceId()` - Map tier to Stripe Price ID

### Controller Layer (paymentController.js)

REST API endpoints for payment operations:

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/pricing` | GET | Public | Get pricing tiers |
| `/create-checkout-session` | POST | Private | Create checkout |
| `/create-portal-session` | POST | Private | Open portal |
| `/subscription` | GET | Private | Get subscription |
| `/cancel-subscription` | POST | Private | Cancel |
| `/reactivate-subscription` | POST | Private | Reactivate |

### Webhook Handler (stripeWebhooks.js)

Processes Stripe events to keep database in sync:

**Supported Events:**
- `checkout.session.completed` - New subscription created
- `customer.subscription.created` - Subscription confirmed
- `customer.subscription.updated` - Renewal or changes
- `customer.subscription.deleted` - Subscription ended
- `invoice.payment_succeeded` - Successful payment
- `invoice.payment_failed` - Failed payment

**Database Updates:**
- Creates/updates subscription records
- Upgrades/downgrades user tiers
- Tracks billing periods
- Handles cancellations

### Routes (paymentRoutes.js)

Express router configuration:

**Important**: Webhook route is defined BEFORE `express.json()` middleware to preserve raw body for signature verification.

## Database Schema

### subscriptions Table

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  stripe_customer_id VARCHAR(255) UNIQUE,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  tier VARCHAR(20),
  status VARCHAR(20),
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Status Values:**
- `active` - Subscription is active
- `trialing` - In trial period
- `past_due` - Payment failed, retrying
- `cancelled` - Subscription ended
- `incomplete` - Initial payment pending

## Environment Variables

Required in `.env`:

```bash
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Price IDs (from Stripe Dashboard)
STRIPE_PRICE_PRO=price_1234567890abcdef
STRIPE_PRICE_TEAMS=price_0987654321fedcba
STRIPE_PRICE_ENTERPRISE=price_abcdef1234567890

# URLs
FRONTEND_URL=http://localhost:3000
```

## Pricing Tiers

| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | 50 bookmarks, basic ratings, single device |
| Pro | $4.99/mo | Unlimited bookmarks, AI recommendations, multi-device sync |
| Teams | $19/mo | Pro + 5 team members, shared collections, API access |
| Enterprise | $99/mo | Teams + unlimited members, custom integrations, SLA |

## Setup Instructions

### 1. Create Stripe Account

1. Sign up at https://stripe.com
2. Get API keys from https://dashboard.stripe.com/test/apikeys
3. Add to `.env` file

### 2. Create Products

In Stripe Dashboard → Products:

1. **Hookmark Pro** - $4.99/month recurring
2. **Hookmark Teams** - $19/month recurring
3. **Hookmark Enterprise** - $99/month recurring

Copy Price IDs to `.env`

### 3. Set Up Webhooks

**Local Development:**
```bash
stripe listen --forward-to localhost:5000/api/v1/payments/webhook
```

**Production:**
- Add endpoint in Stripe Dashboard
- URL: `https://yourdomain.com/api/v1/payments/webhook`
- Select events: checkout.session.completed, customer.subscription.*
- Copy webhook secret to `.env`

### 4. Test Integration

See [PAYMENTS_TESTING.md](./PAYMENTS_TESTING.md) for complete testing guide.

## Usage Examples

### Create Checkout Session

```javascript
const response = await fetch('/api/v1/payments/create-checkout-session', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ tier: 'pro' })
});

const { data } = await response.json();
// Redirect user to data.url for payment
window.location.href = data.url;
```

### Access Customer Portal

```javascript
const response = await fetch('/api/v1/payments/create-portal-session', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const { data } = await response.json();
// Redirect to Stripe Customer Portal
window.location.href = data.url;
```

### Check Subscription Status

```javascript
const response = await fetch('/api/v1/payments/subscription', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const { data } = await response.json();
console.log(data.subscription);
// { tier: 'pro', status: 'active', current_period_end: '2025-01-26T00:00:00.000Z', ... }
```

## Error Handling

All endpoints return consistent error format:

```json
{
  "success": false,
  "error": "Error message"
}
```

**Common Errors:**
- `400` - Invalid tier, already subscribed
- `401` - Not authenticated
- `404` - No subscription found
- `500` - Stripe API error

## Security Features

1. **Webhook Signature Verification**: All webhooks verified using Stripe signature
2. **JWT Authentication**: Protected routes require valid JWT token
3. **Raw Body Preservation**: Webhook route processes raw body for signature validation
4. **Idempotency**: Subscription updates are idempotent (safe to retry)

## Testing

### Test Card Numbers

Stripe provides test cards for development:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires SCA**: `4000 0025 0000 3155`

Use any future expiry date and any 3-digit CVC.

### Webhook Testing

```bash
# Start webhook listener
stripe listen --forward-to localhost:5000/api/v1/payments/webhook

# Trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
stripe trigger invoice.payment_failed
```

## Integration Checklist

- [ ] Stripe account created
- [ ] API keys added to `.env`
- [ ] Products and prices created in Stripe
- [ ] Price IDs added to `.env`
- [ ] Webhook endpoint configured
- [ ] Webhook secret added to `.env`
- [ ] Database migrations run
- [ ] Test checkout flow completed
- [ ] Webhooks tested with Stripe CLI
- [ ] Customer portal tested

## Production Deployment

Before going live:

1. Switch to production Stripe keys
2. Update webhook endpoint to production URL
3. Create production products and prices
4. Test full checkout flow
5. Verify webhook signature validation
6. Monitor Stripe Dashboard for events

## Support

- **Stripe Documentation**: https://stripe.com/docs
- **Stripe CLI**: https://stripe.com/docs/stripe-cli
- **Testing Guide**: See [PAYMENTS_TESTING.md](./PAYMENTS_TESTING.md)

---

**Status**: Production-ready ✅
**Last Updated**: December 26, 2024
