const stripeService = require('./stripeService');

/**
 * Payment Controller - HTTP request handlers for payment operations
 */
class PaymentController {
  /**
   * @route   POST /api/v1/payments/create-checkout-session
   * @desc    Create Stripe checkout session for subscription
   * @access  Private
   */
  async createCheckoutSession(req, res, next) {
    try {
      const { tier } = req.body;
      const { userId, email } = req.user;

      // Validate tier
      const validTiers = ['pro', 'teams', 'enterprise'];
      if (!validTiers.includes(tier)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid subscription tier'
        });
      }

      const session = await stripeService.createCheckoutSession({
        userId,
        tier,
        email
      });

      res.status(200).json({
        success: true,
        data: {
          sessionId: session.sessionId,
          url: session.url
        }
      });
    } catch (error) {
      if (error.message === 'User already has an active subscription') {
        return res.status(400).json({
          success: false,
          error: error.message
        });
      }
      next(error);
    }
  }

  /**
   * @route   POST /api/v1/payments/create-portal-session
   * @desc    Create Stripe customer portal session
   * @access  Private
   */
  async createPortalSession(req, res, next) {
    try {
      const { userId } = req.user;

      const session = await stripeService.createPortalSession(userId);

      res.status(200).json({
        success: true,
        data: {
          url: session.url
        }
      });
    } catch (error) {
      if (error.message === 'No subscription found for this user') {
        return res.status(404).json({
          success: false,
          error: error.message
        });
      }
      next(error);
    }
  }

  /**
   * @route   GET /api/v1/payments/subscription
   * @desc    Get current user's subscription details
   * @access  Private
   */
  async getSubscription(req, res, next) {
    try {
      const { userId } = req.user;

      const subscription = await stripeService.getUserSubscription(userId);

      if (!subscription) {
        return res.status(404).json({
          success: false,
          error: 'No active subscription found'
        });
      }

      res.status(200).json({
        success: true,
        data: { subscription }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route   POST /api/v1/payments/cancel-subscription
   * @desc    Cancel subscription (at period end)
   * @access  Private
   */
  async cancelSubscription(req, res, next) {
    try {
      const { userId } = req.user;

      const result = await stripeService.cancelSubscription(userId);

      res.status(200).json({
        success: true,
        message: 'Subscription will be cancelled at the end of the billing period',
        data: {
          cancelAt: result.cancelAt
        }
      });
    } catch (error) {
      if (error.message === 'No active subscription found') {
        return res.status(404).json({
          success: false,
          error: error.message
        });
      }
      next(error);
    }
  }

  /**
   * @route   POST /api/v1/payments/reactivate-subscription
   * @desc    Reactivate a cancelled subscription
   * @access  Private
   */
  async reactivateSubscription(req, res, next) {
    try {
      const { userId } = req.user;

      await stripeService.reactivateSubscription(userId);

      res.status(200).json({
        success: true,
        message: 'Subscription reactivated successfully'
      });
    } catch (error) {
      if (error.message === 'No cancelled subscription found') {
        return res.status(404).json({
          success: false,
          error: error.message
        });
      }
      next(error);
    }
  }

  /**
   * @route   GET /api/v1/payments/pricing
   * @desc    Get pricing information
   * @access  Public
   */
  async getPricing(req, res, next) {
    try {
      const pricing = [
        {
          tier: 'free',
          name: 'Free',
          price: 0,
          priceDisplay: '$0',
          interval: 'forever',
          features: [
            'Up to 50 bookmarks',
            'Basic ratings (1-5 stars)',
            'Single device sync',
            'Basic categories',
            'Export to CSV'
          ],
          limits: {
            bookmarks: 50,
            collections: 1,
            teamMembers: 0,
            apiCalls: 0
          }
        },
        {
          tier: 'pro',
          name: 'Pro',
          price: 4.99,
          priceDisplay: '$4.99',
          interval: 'month',
          features: [
            'Unlimited bookmarks',
            'Advanced ratings & reviews',
            'Multi-device sync',
            'Unlimited categories & tags',
            'AI-powered recommendations',
            'Priority support',
            'Export to multiple formats'
          ],
          limits: {
            bookmarks: -1,
            collections: 10,
            teamMembers: 0,
            apiCalls: 1000
          },
          popular: true
        },
        {
          tier: 'teams',
          name: 'Teams',
          price: 19,
          priceDisplay: '$19',
          interval: 'month',
          features: [
            'Everything in Pro',
            'Up to 5 team members',
            'Shared collections',
            'Team analytics',
            'Advanced permissions',
            'SSO support',
            'API access'
          ],
          limits: {
            bookmarks: -1,
            collections: -1,
            teamMembers: 5,
            apiCalls: 10000
          }
        },
        {
          tier: 'enterprise',
          name: 'Enterprise',
          price: 99,
          priceDisplay: '$99',
          interval: 'month',
          features: [
            'Everything in Teams',
            'Unlimited team members',
            'Advanced security',
            'Custom integrations',
            'Dedicated support',
            'SLA guarantee',
            'Custom training'
          ],
          limits: {
            bookmarks: -1,
            collections: -1,
            teamMembers: -1,
            apiCalls: -1
          }
        }
      ];

      res.status(200).json({
        success: true,
        data: { pricing }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PaymentController();
