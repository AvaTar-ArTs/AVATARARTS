const authService = require('./authService');

class AuthController {
  /**
   * POST /api/v1/auth/signup
   * Register new user
   */
  async signup(req, res, next) {
    try {
      const { email, password, firstName, lastName } = req.body;

      // Create user
      const user = await authService.createUser({
        email,
        password,
        firstName,
        lastName
      });

      // Generate token
      const token = authService.generateToken({
        userId: user.id,
        email: user.email,
        tier: user.tier
      });

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: {
          user,
          token
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/login
   * Login user
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Authenticate user
      const user = await authService.authenticateUser(email, password);

      // Generate token
      const token = authService.generateToken({
        userId: user.id,
        email: user.email,
        tier: user.tier
      });

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user,
          token
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/auth/me
   * Get current user profile
   */
  async getMe(req, res, next) {
    try {
      const user = await authService.getUserById(req.user.userId);

      res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/google
   * Google OAuth login
   */
  async googleLogin(req, res, next) {
    try {
      const { googleId, email, firstName, lastName } = req.body;

      // Create or update user
      const user = await authService.createOrUpdateGoogleUser({
        googleId,
        email,
        firstName,
        lastName
      });

      // Generate token
      const token = authService.generateToken({
        userId: user.id,
        email: user.email,
        tier: user.tier
      });

      res.json({
        success: true,
        message: 'Google login successful',
        data: {
          user,
          token
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/verify-email/:token
   * Verify email address
   */
  async verifyEmail(req, res, next) {
    try {
      const { token } = req.params;

      // Verify token and extract user ID
      const decoded = authService.verifyToken(token);

      // Verify email
      await authService.verifyEmail(decoded.userId);

      res.json({
        success: true,
        message: 'Email verified successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/logout
   * Logout user (client-side token removal)
   */
  async logout(req, res) {
    // Since we're using stateless JWT, logout is handled client-side
    // But we can log the event for analytics
    res.json({
      success: true,
      message: 'Logout successful'
    });
  }

  /**
   * DELETE /api/v1/auth/account
   * Deactivate user account
   */
  async deactivateAccount(req, res, next) {
    try {
      await authService.deactivateUser(req.user.userId);

      res.json({
        success: true,
        message: 'Account deactivated successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
