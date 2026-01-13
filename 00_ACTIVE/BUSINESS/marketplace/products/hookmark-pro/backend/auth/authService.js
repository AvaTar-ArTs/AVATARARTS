const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

class AuthService {
  /**
   * Hash password
   */
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  /**
   * Verify password
   */
  async verifyPassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * Generate JWT token
   */
  generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
  }

  /**
   * Verify JWT token
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Create new user
   */
  async createUser({ email, password, firstName, lastName }) {
    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await this.hashPassword(password);

    // Create user
    const result = await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, tier)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, first_name, last_name, tier, created_at`,
      [email, passwordHash, firstName, lastName, 'free']
    );

    return result.rows[0];
  }

  /**
   * Authenticate user with email and password
   */
  async authenticateUser(email, password) {
    // Find user
    const result = await query(
      'SELECT * FROM users WHERE email = $1 AND is_active = TRUE',
      [email]
    );

    if (result.rows.length === 0) {
      throw new Error('Invalid email or password');
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await this.verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    await query(
      'UPDATE users SET last_login_at = NOW() WHERE id = $1',
      [user.id]
    );

    // Return user without password
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    const result = await query(
      `SELECT id, email, first_name, last_name, tier, is_active,
              email_verified, created_at, last_login_at
       FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    return result.rows[0];
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email) {
    const result = await query(
      `SELECT id, email, first_name, last_name, tier, is_active,
              email_verified, created_at, last_login_at
       FROM users WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    return result.rows[0];
  }

  /**
   * Update user tier (after subscription)
   */
  async updateUserTier(userId, tier) {
    const result = await query(
      'UPDATE users SET tier = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [tier, userId]
    );

    return result.rows[0];
  }

  /**
   * Verify email (for email verification flow)
   */
  async verifyEmail(userId) {
    await query(
      'UPDATE users SET email_verified = TRUE, updated_at = NOW() WHERE id = $1',
      [userId]
    );
  }

  /**
   * Create or update user from Google OAuth
   */
  async createOrUpdateGoogleUser({ googleId, email, firstName, lastName }) {
    // Check if user exists
    const existingUser = await query(
      'SELECT * FROM users WHERE google_id = $1 OR email = $2',
      [googleId, email]
    );

    if (existingUser.rows.length > 0) {
      // Update existing user
      const user = existingUser.rows[0];
      await query(
        `UPDATE users
         SET google_id = $1, last_login_at = NOW(), email_verified = TRUE
         WHERE id = $2`,
        [googleId, user.id]
      );

      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }

    // Create new user
    const result = await query(
      `INSERT INTO users (email, google_id, first_name, last_name, tier, email_verified)
       VALUES ($1, $2, $3, $4, $5, TRUE)
       RETURNING id, email, first_name, last_name, tier, created_at`,
      [email, googleId, firstName, lastName, 'free']
    );

    return result.rows[0];
  }

  /**
   * Deactivate user account
   */
  async deactivateUser(userId) {
    await query(
      'UPDATE users SET is_active = FALSE, updated_at = NOW() WHERE id = $1',
      [userId]
    );
  }
}

module.exports = new AuthService();
