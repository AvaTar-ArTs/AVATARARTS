const Stripe = require('stripe');
const { query } = require('../config/database');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Stripe Service - Business logic for Stripe operations
 * Handles checkout sessions, subscriptions, customer portal, and webhooks
 */
class StripeService {
  /**
   * Get price IDs from environment based on tier
   */
  getPriceId(tier) {
    const priceIds = {
      pro: process.env.STRIPE_PRICE_PRO,
      teams: process.env.STRIPE_PRICE_TEAMS,
      enterprise: process.env.STRIPE_PRICE_ENTERPRISE
    };
    return priceIds[tier];
  }

  /**
   * Create checkout session for subscription
   */
  async createCheckoutSession({ userId, tier, email }) {
    const priceId = this.getPriceId(tier);
    if (!priceId) {
      throw new Error(`Invalid tier: ${tier}`);
    }

    // Check if user already has an active subscription
    const existingSub = await query(
      'SELECT id FROM subscriptions WHERE user_id = $1 AND status = $2',
      [userId, 'active']
    );

    if (existingSub.rows.length > 0) {
      throw new Error('User already has an active subscription');
    }

    // Create or retrieve Stripe customer
    let customerId;
    const existingCustomer = await query(
      'SELECT stripe_customer_id FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
      [userId]
    );

    if (existingCustomer.rows.length > 0 && existingCustomer.rows[0].stripe_customer_id) {
      customerId = existingCustomer.rows[0].stripe_customer_id;
    } else {
      const customer = await stripe.customers.create({
        email,
        metadata: { userId }
      });
      customerId = customer.id;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      success_url: `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing`,
      metadata: {
        userId,
        tier
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required'
    });

    return {
      sessionId: session.id,
      url: session.url
    };
  }

  /**
   * Create customer portal session for subscription management
   */
  async createPortalSession(userId) {
    // Get user's Stripe customer ID
    const result = await query(
      'SELECT stripe_customer_id FROM subscriptions WHERE user_id = $1 AND stripe_customer_id IS NOT NULL ORDER BY created_at DESC LIMIT 1',
      [userId]
    );

    if (result.rows.length === 0) {
      throw new Error('No subscription found for this user');
    }

    const customerId = result.rows[0].stripe_customer_id;

    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.FRONTEND_URL}/settings/billing`
    });

    return {
      url: session.url
    };
  }

  /**
   * Get subscription details from Stripe
   */
  async getSubscriptionDetails(subscriptionId) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return {
      id: subscription.id,
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null
    };
  }

  /**
   * Cancel subscription (at period end)
   */
  async cancelSubscription(userId) {
    // Get user's active subscription
    const result = await query(
      'SELECT stripe_subscription_id FROM subscriptions WHERE user_id = $1 AND status = $2',
      [userId, 'active']
    );

    if (result.rows.length === 0) {
      throw new Error('No active subscription found');
    }

    const subscriptionId = result.rows[0].stripe_subscription_id;

    // Cancel at period end (don't immediately cancel)
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true
    });

    // Update database
    await query(
      'UPDATE subscriptions SET cancel_at_period_end = TRUE, updated_at = NOW() WHERE stripe_subscription_id = $1',
      [subscriptionId]
    );

    return {
      cancelAt: new Date(subscription.current_period_end * 1000)
    };
  }

  /**
   * Reactivate cancelled subscription
   */
  async reactivateSubscription(userId) {
    const result = await query(
      'SELECT stripe_subscription_id FROM subscriptions WHERE user_id = $1 AND status = $2 AND cancel_at_period_end = TRUE',
      [userId, 'active']
    );

    if (result.rows.length === 0) {
      throw new Error('No cancelled subscription found');
    }

    const subscriptionId = result.rows[0].stripe_subscription_id;

    // Remove cancellation
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false
    });

    // Update database
    await query(
      'UPDATE subscriptions SET cancel_at_period_end = FALSE, updated_at = NOW() WHERE stripe_subscription_id = $1',
      [subscriptionId]
    );

    return { success: true };
  }

  /**
   * Handle successful checkout completion
   * Called by webhook handler
   */
  async handleCheckoutCompleted(session) {
    const { userId, tier } = session.metadata;
    const customerId = session.customer;
    const subscriptionId = session.subscription;

    // Get subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Create or update subscription record
    await query(
      `INSERT INTO subscriptions (
        user_id, stripe_customer_id, stripe_subscription_id,
        tier, status, current_period_start, current_period_end
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (stripe_subscription_id)
      DO UPDATE SET status = $5, current_period_start = $6, current_period_end = $7, updated_at = NOW()`,
      [
        userId,
        customerId,
        subscriptionId,
        tier,
        subscription.status,
        new Date(subscription.current_period_start * 1000),
        new Date(subscription.current_period_end * 1000)
      ]
    );

    // Update user tier
    await query(
      'UPDATE users SET tier = $1, updated_at = NOW() WHERE id = $2',
      [tier, userId]
    );

    return { success: true };
  }

  /**
   * Handle subscription updates
   * Called by webhook handler
   */
  async handleSubscriptionUpdated(subscription) {
    const subscriptionId = subscription.id;
    const status = subscription.status;

    // Update subscription in database
    await query(
      `UPDATE subscriptions SET
        status = $1,
        current_period_start = $2,
        current_period_end = $3,
        cancel_at_period_end = $4,
        updated_at = NOW()
      WHERE stripe_subscription_id = $5`,
      [
        status,
        new Date(subscription.current_period_start * 1000),
        new Date(subscription.current_period_end * 1000),
        subscription.cancel_at_period_end,
        subscriptionId
      ]
    );

    // If subscription is cancelled or past_due, downgrade user to free
    if (status === 'canceled' || status === 'past_due') {
      await query(
        `UPDATE users SET tier = 'free', updated_at = NOW()
         WHERE id = (SELECT user_id FROM subscriptions WHERE stripe_subscription_id = $1)`,
        [subscriptionId]
      );
    }

    return { success: true };
  }

  /**
   * Handle subscription deletion
   * Called by webhook handler
   */
  async handleSubscriptionDeleted(subscription) {
    const subscriptionId = subscription.id;

    // Update subscription status
    await query(
      'UPDATE subscriptions SET status = $1, updated_at = NOW() WHERE stripe_subscription_id = $2',
      ['cancelled', subscriptionId]
    );

    // Downgrade user to free tier
    await query(
      `UPDATE users SET tier = 'free', updated_at = NOW()
       WHERE id = (SELECT user_id FROM subscriptions WHERE stripe_subscription_id = $1)`,
      [subscriptionId]
    );

    return { success: true };
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload, signature) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    try {
      const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
      return event;
    } catch (error) {
      throw new Error(`Webhook signature verification failed: ${error.message}`);
    }
  }

  /**
   * Get user's current subscription
   */
  async getUserSubscription(userId) {
    const result = await query(
      `SELECT
        s.id, s.tier, s.status, s.current_period_start,
        s.current_period_end, s.cancel_at_period_end, s.created_at
      FROM subscriptions s
      WHERE s.user_id = $1 AND s.status IN ('active', 'trialing', 'past_due')
      ORDER BY s.created_at DESC
      LIMIT 1`,
      [userId]
    );

    return result.rows[0] || null;
  }
}

module.exports = new StripeService();
