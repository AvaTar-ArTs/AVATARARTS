const express = require('express');
const router = express.Router();
const authController = require('./authController');
const { authenticate } = require('./authMiddleware');
const { validate, signupSchema, loginSchema, googleLoginSchema } = require('./authValidation');

/**
 * @route   POST /api/v1/auth/signup
 * @desc    Register new user
 * @access  Public
 */
router.post(
  '/signup',
  validate(signupSchema),
  authController.signup
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  '/login',
  validate(loginSchema),
  authController.login
);

/**
 * @route   POST /api/v1/auth/google
 * @desc    Google OAuth login
 * @access  Public
 */
router.post(
  '/google',
  validate(googleLoginSchema),
  authController.googleLogin
);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get(
  '/me',
  authenticate,
  authController.getMe
);

/**
 * @route   POST /api/v1/auth/verify-email/:token
 * @desc    Verify email address
 * @access  Public
 */
router.post(
  '/verify-email/:token',
  authController.verifyEmail
);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post(
  '/logout',
  authenticate,
  authController.logout
);

/**
 * @route   DELETE /api/v1/auth/account
 * @desc    Deactivate user account
 * @access  Private
 */
router.delete(
  '/account',
  authenticate,
  authController.deactivateAccount
);

module.exports = router;
