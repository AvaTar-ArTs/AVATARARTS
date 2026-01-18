const authService = require('./authService');

/**
 * Authenticate JWT token
 * Extracts token from Authorization header and verifies it
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided. Please login.'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = authService.verifyToken(token);

    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      tier: decoded.tier
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token. Please login again.'
    });
  }
};

/**
 * Check if user has required tier
 * Usage: requireTier('pro') or requireTier(['pro', 'teams', 'enterprise'])
 */
const requireTier = (requiredTiers) => {
  return (req, res, next) => {
    const tiers = Array.isArray(requiredTiers) ? requiredTiers : [requiredTiers];

    if (!req.user || !tiers.includes(req.user.tier)) {
      return res.status(403).json({
        success: false,
        error: `This feature requires ${tiers.join(' or ')} subscription`,
        upgradeUrl: '/pricing'
      });
    }

    next();
  };
};

/**
 * Optional authentication
 * Tries to authenticate but doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = authService.verifyToken(token);

      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        tier: decoded.tier
      };
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

module.exports = {
  authenticate,
  requireTier,
  optionalAuth
};
