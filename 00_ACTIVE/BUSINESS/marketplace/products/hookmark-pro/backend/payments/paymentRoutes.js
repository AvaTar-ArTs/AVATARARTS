const express = require('express');
const router = express.Router();
const paymentController = require('./paymentController');
const stripeWebhooks = require('./stripeWebhooks');
const { authenticate } = require('../auth/authMiddleware');

/**
 * @route   POST /api/v1/payments/webhook
 * @desc    Stripe webhook endpoint
 * @access  Public (verified by Stripe signature)
 * @note    This route must be defined BEFORE express.json() middleware
 *          to preserve raw body for signature verification
 */
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  (req, res) => stripeWebhooks.handleWebhook(req, res)
);

/**
 * @route   GET /api/v1/payments/pricing
 * @desc    Get pricing information
 * @access  Public
 */
router.get(
  '/pricing',
  paymentController.getPricing
);

/**
 * @route   POST /api/v1/payments/create-checkout-session
 * @desc    Create Stripe checkout session
 * @access  Private
 */
router.post(
  '/create-checkout-session',
  authenticate,
  paymentController.createCheckoutSession
);

/**
 * @route   POST /api/v1/payments/create-portal-session
 * @desc    Create customer portal session
 * @access  Private
 */
router.post(
  '/create-portal-session',
  authenticate,
  paymentController.createPortalSession
);

/**
 * @route   GET /api/v1/payments/subscription
 * @desc    Get current subscription
 * @access  Private
 */
router.get(
  '/subscription',
  authenticate,
  paymentController.getSubscription
);

/**
 * @route   POST /api/v1/payments/cancel-subscription
 * @desc    Cancel subscription
 * @access  Private
 */
router.post(
  '/cancel-subscription',
  authenticate,
  paymentController.cancelSubscription
);

/**
 * @route   POST /api/v1/payments/reactivate-subscription
 * @desc    Reactivate cancelled subscription
 * @access  Private
 */
router.post(
  '/reactivate-subscription',
  authenticate,
  paymentController.reactivateSubscription
);

module.exports = router;
