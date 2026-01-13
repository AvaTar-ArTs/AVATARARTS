const stripeService = require('./stripeService');

/**
 * Stripe Webhook Handler
 * Processes Stripe events to keep subscription status in sync
 */
class StripeWebhookHandler {
  /**
   * Main webhook handler
   * Routes events to appropriate handlers
   */
  async handleWebhook(req, res) {
    const signature = req.headers['stripe-signature'];
    const payload = req.body;

    try {
      // Verify webhook signature
      const event = stripeService.verifyWebhookSignature(payload, signature);

      console.log(`Received Stripe webhook: ${event.type}`);

      // Route to appropriate handler
      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutSessionCompleted(event.data.object);
          break;

        case 'customer.subscription.created':
          await this.handleSubscriptionCreated(event.data.object);
          break;

        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object);
          break;

        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object);
          break;

        case 'invoice.payment_succeeded':
          await this.handleInvoicePaymentSucceeded(event.data.object);
          break;

        case 'invoice.payment_failed':
          await this.handleInvoicePaymentFailed(event.data.object);
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      // Return 200 to acknowledge receipt
      res.status(200).json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error.message);
      res.status(400).json({
        error: error.message
      });
    }
  }

  /**
   * Handle checkout.session.completed event
   * Creates subscription record and upgrades user tier
   */
  async handleCheckoutSessionCompleted(session) {
    console.log('Processing checkout.session.completed:', session.id);

    if (session.mode === 'subscription') {
      await stripeService.handleCheckoutCompleted(session);
    }
  }

  /**
   * Handle customer.subscription.created event
   */
  async handleSubscriptionCreated(subscription) {
    console.log('Processing customer.subscription.created:', subscription.id);
    // Usually handled by checkout.session.completed
    // This is a backup handler
  }

  /**
   * Handle customer.subscription.updated event
   * Updates subscription status, handles renewals, cancellations
   */
  async handleSubscriptionUpdated(subscription) {
    console.log('Processing customer.subscription.updated:', subscription.id);
    await stripeService.handleSubscriptionUpdated(subscription);
  }

  /**
   * Handle customer.subscription.deleted event
   * Downgrades user to free tier
   */
  async handleSubscriptionDeleted(subscription) {
    console.log('Processing customer.subscription.deleted:', subscription.id);
    await stripeService.handleSubscriptionDeleted(subscription);
  }

  /**
   * Handle invoice.payment_succeeded event
   * Confirms successful payment
   */
  async handleInvoicePaymentSucceeded(invoice) {
    console.log('Processing invoice.payment_succeeded:', invoice.id);

    // Payment successful - ensure subscription is active
    if (invoice.subscription) {
      const subscription = await stripeService.getSubscriptionDetails(invoice.subscription);
      await stripeService.handleSubscriptionUpdated(subscription);
    }
  }

  /**
   * Handle invoice.payment_failed event
   * Marks subscription as past_due
   */
  async handleInvoicePaymentFailed(invoice) {
    console.log('Processing invoice.payment_failed:', invoice.id);

    // Payment failed - Stripe will handle retry logic
    // After multiple failures, subscription will be cancelled
    if (invoice.subscription) {
      const subscription = await stripeService.getSubscriptionDetails(invoice.subscription);
      await stripeService.handleSubscriptionUpdated(subscription);
    }
  }
}

module.exports = new StripeWebhookHandler();
