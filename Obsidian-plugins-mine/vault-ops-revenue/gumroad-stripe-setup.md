# Gumroad & Stripe Setup for Vault Ops Toolkit

## Quick Setup Checklist

- [ ] Create Gumroad account
- [ ] Set up Stripe account  
- [ ] Configure webhooks
- [ ] Deploy validation API
- [ ] Test license flow
- [ ] Set up analytics

---

## Part 1: Gumroad Setup (Simplest Start)

### 1. Create Gumroad Products

#### Product 1: Vault Ops Pro (Annual)
```
Name: Vault Ops Pro - Annual License
Price: $39
Type: Digital Product
File: license-generator.txt (auto-generates keys)
```

#### Product 2: Vault Ops Pro (Lifetime)
```
Name: Vault Ops Pro - Lifetime License  
Price: $99 (Launch special)
Type: Digital Product
Quantity Limited: 500
```

#### Product 3: Cloud Sync
```
Name: Vault Ops Cloud Sync
Price: $12/month or $96/year
Type: Subscription
```

### 2. Gumroad License Generator Script

Create `gumroad-webhook.js` for automatic license generation:

```javascript
// Deploy to Cloudflare Workers or Vercel
export default async function handler(req, res) {
  const { email, product_id, sale_id } = req.body;
  
  // Generate unique license key
  const licenseKey = generateLicenseKey(product_id);
  
  // Store in database
  await saveLicense({
    key: licenseKey,
    email: email,
    product: getProductType(product_id),
    purchaseId: sale_id,
    createdAt: new Date()
  });
  
  // Return license key to Gumroad
  res.json({
    success: true,
    license_key: licenseKey
  });
}

function generateLicenseKey(productId) {
  const prefix = productId === 'pro' ? 'VOP' : 'VOC';
  const random = crypto.randomBytes(12).toString('hex').toUpperCase();
  return `${prefix}-${random.substr(0,4)}-${random.substr(4,4)}-${random.substr(8,4)}-${random.substr(12,4)}`;
}
```

### 3. Gumroad Product Description Template

```markdown
# Vault Ops Pro - Transform Your Obsidian Vault Into a System

Stop babysitting your notes. Automate vault maintenance with bulk operations, advanced rules, and professional workflows.

## What You Get:
✅ Bulk operations across folders/vaults
✅ Advanced rule builder with regex
✅ Custom workflow designer  
✅ Schema migration tools
✅ Priority support
✅ Early access to features
✅ All future Pro updates

## Instant Delivery:
Your license key will be emailed immediately after purchase.

## 30-Day Guarantee:
Full refund if you're not completely satisfied.

## Requirements:
- Obsidian 1.5.0+
- Vault Ops Community Edition (free)

Questions? hello@quantumforgelabs.org
```

---

## Part 2: Stripe Setup (Professional Path)

### 1. Stripe Product Configuration

```javascript
// stripe-setup.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create Products
const products = [
  {
    id: 'vault_ops_pro',
    name: 'Vault Ops Pro',
    description: 'Advanced vault automation for Obsidian',
    metadata: {
      features: 'bulk-operations,advanced-rules,custom-workflows'
    }
  },
  {
    id: 'vault_ops_cloud',
    name: 'Vault Ops Cloud Sync',
    description: 'Multi-device sync and team features',
    metadata: {
      features: 'all-pro,cloud-sync,team-features'
    }
  },
  {
    id: 'vault_ops_enterprise',
    name: 'Vault Ops Enterprise',
    description: 'Organization-wide vault management',
    metadata: {
      features: 'all,sso,audit-logging'
    }
  }
];

// Create Prices
const prices = [
  // Pro
  { product: 'vault_ops_pro', amount: 500, interval: 'month', id: 'pro_monthly' },
  { product: 'vault_ops_pro', amount: 3900, interval: 'year', id: 'pro_annual' },
  
  // Cloud
  { product: 'vault_ops_cloud', amount: 1200, interval: 'month', id: 'cloud_monthly' },
  { product: 'vault_ops_cloud', amount: 9600, interval: 'year', id: 'cloud_annual' },
  
  // Enterprise
  { product: 'vault_ops_enterprise', amount: 9900, interval: 'month', id: 'enterprise_monthly' }
];
```

### 2. Stripe Checkout Page

```javascript
// checkout-api.js
app.post('/api/create-checkout', async (req, res) => {
  const { priceId, email } = req.body;
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price: priceId,
      quantity: 1
    }],
    mode: 'subscription',
    success_url: 'https://vault-ops.quantumforgelabs.org/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'https://vault-ops.quantumforgelabs.org/pricing',
    customer_email: email,
    metadata: {
      plugin_version: req.headers['x-plugin-version']
    },
    subscription_data: {
      trial_period_days: priceId.includes('pro') ? 7 : 14
    },
    allow_promotion_codes: true
  });
  
  res.json({ checkoutUrl: session.url });
});
```

### 3. Stripe Webhook Handler

```javascript
// webhook-handler.js
app.post('/webhook/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(
    req.body, 
    sig, 
    process.env.STRIPE_WEBHOOK_SECRET
  );
  
  switch (event.type) {
    case 'checkout.session.completed':
      await handleNewSubscription(event.data.object);
      break;
      
    case 'customer.subscription.updated':
      await updateLicense(event.data.object);
      break;
      
    case 'customer.subscription.deleted':
      await revokeLicense(event.data.object);
      break;
      
    case 'invoice.payment_succeeded':
      await extendLicense(event.data.object);
      break;
  }
  
  res.json({ received: true });
});

async function handleNewSubscription(session) {
  const subscription = await stripe.subscriptions.retrieve(session.subscription);
  
  const license = {
    key: generateSecureLicenseKey(),
    email: session.customer_email,
    customerId: session.customer,
    subscriptionId: subscription.id,
    plan: getPlanFromPrice(subscription.items.data[0].price.id),
    status: 'active',
    validUntil: new Date(subscription.current_period_end * 1000),
    features: getPlanFeatures(subscription.items.data[0].price.product)
  };
  
  await saveLicenseToDatabase(license);
  await sendLicenseEmail(license);
}
```

---

## Part 3: License Validation API

Deploy this to Cloudflare Workers for global edge validation:

```javascript
// cloudflare-worker.js
export default {
  async fetch(request, env, ctx) {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }
    
    const { key, deviceId, vaultId } = await request.json();
    
    // Check cache first
    const cached = await env.LICENSE_CACHE.get(key);
    if (cached) {
      return new Response(cached, {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Validate from database
    const license = await validateLicense(key, env);
    
    if (!license) {
      return new Response(JSON.stringify({
        valid: false,
        error: 'Invalid license key'
      }), { status: 401 });
    }
    
    // Check device limits
    const devices = await getDeviceCount(license.key, env);
    if (devices >= license.maxDevices && !devices.includes(deviceId)) {
      return new Response(JSON.stringify({
        valid: false,
        error: 'Device limit exceeded'
      }), { status: 403 });
    }
    
    // Track device
    await trackDevice(license.key, deviceId, env);
    
    // Cache for 24 hours
    const response = {
      valid: true,
      license: {
        key: license.key,
        email: license.email,
        plan: license.plan,
        status: license.status,
        validUntil: license.validUntil,
        features: license.features
      }
    };
    
    await env.LICENSE_CACHE.put(
      key, 
      JSON.stringify(response),
      { expirationTtl: 86400 }
    );
    
    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

async function validateLicense(key, env) {
  // Query from D1 database
  const stmt = env.DB.prepare('SELECT * FROM licenses WHERE key = ?');
  const license = await stmt.bind(key).first();
  
  if (!license) return null;
  
  // Check expiration
  if (new Date(license.validUntil) < new Date()) {
    return null;
  }
  
  return license;
}
```

---

## Part 4: Payment Links & Buttons

### Obsidian Plugin Integration

```typescript
// In settings tab
class VaultOpsSettingTab extends PluginSettingTab {
  display(): void {
    // Upgrade button
    new Setting(containerEl)
      .setName('Upgrade to Pro')
      .setDesc('Unlock bulk operations, advanced rules, and more')
      .addButton(button => button
        .setButtonText('View Pricing')
        .onClick(() => {
          window.open('https://vault-ops.quantumforgelabs.org/pricing');
        }));
    
    // Quick purchase
    new Setting(containerEl)
      .setName('Quick Purchase')
      .addButton(button => button
        .setButtonText('Buy Pro ($39/year)')
        .onClick(async () => {
          const checkout = await this.createCheckout('pro_annual');
          window.open(checkout.url);
        }));
  }
  
  async createCheckout(priceId: string) {
    const response = await fetch('https://api.quantumforgelabs.org/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId,
        email: this.plugin.settings.userEmail,
        metadata: {
          vaultId: this.plugin.getVaultId(),
          version: this.plugin.manifest.version
        }
      })
    });
    
    return response.json();
  }
}
```

### Website Embed

```html
<!-- Gumroad Overlay -->
<script src="https://gumroad.com/js/gumroad.js"></script>
<a class="gumroad-button" href="https://gumroad.com/l/vault-ops-pro">
  Buy Vault Ops Pro
</a>

<!-- Stripe Checkout Button -->
<button id="checkout-button">Subscribe Now</button>
<script>
  document.getElementById('checkout-button').addEventListener('click', async () => {
    const response = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId: 'pro_annual' })
    });
    
    const { checkoutUrl } = await response.json();
    window.location.href = checkoutUrl;
  });
</script>

<!-- Paddle (Alternative) -->
<script src="https://cdn.paddle.com/paddle/paddle.js"></script>
<script>
  Paddle.Setup({ vendor: YOUR_VENDOR_ID });
  Paddle.Checkout.open({
    product: PRODUCT_ID,
    email: userEmail,
    successCallback: function(data) {
      activateLicense(data.checkout.id);
    }
  });
</script>
```

---

## Part 5: Analytics & Tracking

### Revenue Dashboard

```javascript
// analytics-api.js
app.get('/api/analytics/revenue', async (req, res) => {
  const stats = {
    mrr: await calculateMRR(),
    arr: await calculateARR(),
    churn: await calculateChurn(),
    ltv: await calculateLTV(),
    customers: {
      total: await getTotalCustomers(),
      active: await getActiveCustomers(),
      trial: await getTrialCustomers()
    },
    revenue: {
      today: await getRevenueToday(),
      month: await getRevenueThisMonth(),
      year: await getRevenueThisYear()
    }
  };
  
  res.json(stats);
});

async function calculateMRR() {
  const subscriptions = await stripe.subscriptions.list({
    status: 'active',
    limit: 100
  });
  
  return subscriptions.data.reduce((total, sub) => {
    const monthly = sub.items.data[0].price.unit_amount;
    if (sub.items.data[0].price.recurring.interval === 'year') {
      return total + (monthly / 12);
    }
    return total + monthly;
  }, 0) / 100;
}
```

### Conversion Tracking

```javascript
// Google Analytics 4
gtag('event', 'purchase', {
  transaction_id: '12345',
  value: 39.00,
  currency: 'USD',
  items: [{
    item_id: 'vault_ops_pro',
    item_name: 'Vault Ops Pro Annual',
    price: 39.00,
    quantity: 1
  }]
});

// Mixpanel
mixpanel.track('License Activated', {
  plan: 'pro',
  billing: 'annual',
  amount: 39,
  source: 'obsidian_plugin'
});

// Custom Analytics
fetch('/api/analytics/event', {
  method: 'POST',
  body: JSON.stringify({
    event: 'license_activated',
    properties: {
      plan: 'pro',
      source: 'plugin_settings',
      version: '1.0.0'
    }
  })
});
```

---

## Part 6: Testing Checklist

### Local Testing
```bash
# Test license generation
curl -X POST http://localhost:3000/api/generate-license \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","product":"pro"}'

# Test validation
curl -X POST http://localhost:3000/api/validate \
  -H "Content-Type: application/json" \
  -d '{"key":"VOP-TEST-TEST-TEST-TEST"}'
```

### Stripe CLI Testing
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Forward webhooks to local
stripe listen --forward-to localhost:3000/webhook/stripe

# Trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
```

---

## Quick Start Commands

```bash
# 1. Clone the revenue stack
git clone https://github.com/QuantumForgeLabs/vault-ops-revenue

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env
# Add your Stripe/Gumroad keys

# 4. Deploy to Cloudflare
wrangler publish

# 5. Test the flow
npm run test:purchase
```

---

## Revenue Optimization Tips

1. **Launch Week Strategy**
   - First 100 customers: 50% off
   - Share in Obsidian Discord
   - ProductHunt launch

2. **Pricing Experiments**
   - A/B test $39 vs $49 annual
   - Offer payment plans for lifetime
   - Student discount automation

3. **Retention Tactics**
   - Email course for new users
   - Feature announcements
   - Loyalty rewards

4. **Affiliate Program**
   - 30% commission for 12 months
   - Custom codes for influencers
   - Track with Rewardful or Post Affiliate Pro

Ready to start generating revenue! 🚀
