const { query } = require('../config/database');

/**
 * Bookmark Service - Business logic for bookmark operations
 */
class BookmarkService {
  /**
   * Create a new bookmark
   */
  async createBookmark({ userId, url, title, rating, category, tags, notes }) {
    const result = await query(
      `INSERT INTO bookmarks (user_id, url, title, rating, category, tags, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, user_id, url, title, rating, category, tags, notes, created_at, updated_at`,
      [userId, url, title, rating || null, category || null, tags || [], notes || null]
    );

    return result.rows[0];
  }

  /**
   * Get all bookmarks for a user with pagination and filtering
   */
  async getBookmarks({ userId, category, search, page = 1, limit = 50 }) {
    const offset = (page - 1) * limit;
    let queryText = 'SELECT * FROM bookmarks WHERE user_id = $1 AND is_deleted = FALSE';
    const params = [userId];
    let paramCount = 1;

    // Filter by category
    if (category) {
      paramCount++;
      queryText += ` AND category = $${paramCount}`;
      params.push(category);
    }

    // Search in title, url, and notes
    if (search) {
      paramCount++;
      queryText += ` AND (title ILIKE $${paramCount} OR url ILIKE $${paramCount} OR notes ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    // Order and pagination
    queryText += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await query(queryText, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM bookmarks WHERE user_id = $1 AND is_deleted = FALSE';
    const countParams = [userId];

    if (category) {
      countQuery += ' AND category = $2';
      countParams.push(category);
    }

    const countResult = await query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    return {
      bookmarks: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get a single bookmark by ID
   */
  async getBookmarkById(bookmarkId, userId) {
    const result = await query(
      'SELECT * FROM bookmarks WHERE id = $1 AND user_id = $2 AND is_deleted = FALSE',
      [bookmarkId, userId]
    );

    if (result.rows.length === 0) {
      throw new Error('Bookmark not found');
    }

    return result.rows[0];
  }

  /**
   * Update a bookmark
   */
  async updateBookmark(bookmarkId, userId, updates) {
    const { title, rating, category, tags, notes } = updates;

    const result = await query(
      `UPDATE bookmarks
       SET title = COALESCE($1, title),
           rating = COALESCE($2, rating),
           category = COALESCE($3, category),
           tags = COALESCE($4, tags),
           notes = COALESCE($5, notes),
           updated_at = NOW()
       WHERE id = $6 AND user_id = $7 AND is_deleted = FALSE
       RETURNING *`,
      [title, rating, category, tags, notes, bookmarkId, userId]
    );

    if (result.rows.length === 0) {
      throw new Error('Bookmark not found');
    }

    return result.rows[0];
  }

  /**
   * Delete a bookmark (soft delete)
   */
  async deleteBookmark(bookmarkId, userId) {
    const result = await query(
      `UPDATE bookmarks
       SET is_deleted = TRUE, updated_at = NOW()
       WHERE id = $1 AND user_id = $2 AND is_deleted = FALSE
       RETURNING id`,
      [bookmarkId, userId]
    );

    if (result.rows.length === 0) {
      throw new Error('Bookmark not found');
    }

    return { success: true };
  }

  /**
   * Get bookmarks by category
   */
  async getBookmarksByCategory(userId, category) {
    const result = await query(
      `SELECT * FROM bookmarks
       WHERE user_id = $1 AND category = $2 AND is_deleted = FALSE
       ORDER BY created_at DESC`,
      [userId, category]
    );

    return result.rows;
  }

  /**
   * Get bookmarks by tag
   */
  async getBookmarksByTag(userId, tag) {
    const result = await query(
      `SELECT * FROM bookmarks
       WHERE user_id = $1 AND $2 = ANY(tags) AND is_deleted = FALSE
       ORDER BY created_at DESC`,
      [userId, tag]
    );

    return result.rows;
  }

  /**
   * Get all categories for a user
   */
  async getCategories(userId) {
    const result = await query(
      `SELECT DISTINCT category
       FROM bookmarks
       WHERE user_id = $1 AND category IS NOT NULL AND is_deleted = FALSE
       ORDER BY category`,
      [userId]
    );

    return result.rows.map(row => row.category);
  }

  /**
   * Get all tags for a user
   */
  async getTags(userId) {
    const result = await query(
      `SELECT DISTINCT unnest(tags) as tag
       FROM bookmarks
       WHERE user_id = $1 AND is_deleted = FALSE
       ORDER BY tag`,
      [userId]
    );

    return result.rows.map(row => row.tag);
  }

  /**
   * Get bookmark statistics for a user
   */
  async getBookmarkStats(userId) {
    const totalResult = await query(
      'SELECT COUNT(*) as total FROM bookmarks WHERE user_id = $1 AND is_deleted = FALSE',
      [userId]
    );

    const categoryResult = await query(
      `SELECT category, COUNT(*) as count
       FROM bookmarks
       WHERE user_id = $1 AND category IS NOT NULL AND is_deleted = FALSE
       GROUP BY category
       ORDER BY count DESC`,
      [userId]
    );

    const ratingResult = await query(
      `SELECT rating, COUNT(*) as count
       FROM bookmarks
       WHERE user_id = $1 AND rating IS NOT NULL AND is_deleted = FALSE
       GROUP BY rating
       ORDER BY rating DESC`,
      [userId]
    );

    const avgRatingResult = await query(
      'SELECT AVG(rating) as avg_rating FROM bookmarks WHERE user_id = $1 AND rating IS NOT NULL AND is_deleted = FALSE',
      [userId]
    );

    return {
      total: parseInt(totalResult.rows[0].total),
      byCategory: categoryResult.rows,
      byRating: ratingResult.rows,
      averageRating: parseFloat(avgRatingResult.rows[0].avg_rating) || 0
    };
  }

  /**
   * Export bookmarks to CSV format
   */
  async exportToCSV(userId) {
    const result = await query(
      `SELECT url, title, rating, category, tags, notes, created_at
       FROM bookmarks
       WHERE user_id = $1 AND is_deleted = FALSE
       ORDER BY created_at DESC`,
      [userId]
    );

    return result.rows;
  }
}

module.exports = new BookmarkService();
