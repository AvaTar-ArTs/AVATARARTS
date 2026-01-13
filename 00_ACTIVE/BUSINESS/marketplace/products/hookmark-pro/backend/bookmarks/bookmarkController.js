const bookmarkService = require('./bookmarkService');

/**
 * Bookmark Controller - HTTP request handlers
 */
class BookmarkController {
  /**
   * @route   POST /api/v1/bookmarks
   * @desc    Create new bookmark
   * @access  Private
   */
  async createBookmark(req, res, next) {
    try {
      const { userId } = req.user;
      const { url, title, rating, category, tags, notes } = req.body;

      const bookmark = await bookmarkService.createBookmark({
        userId,
        url,
        title,
        rating,
        category,
        tags,
        notes
      });

      res.status(201).json({
        success: true,
        message: 'Bookmark created successfully',
        data: { bookmark }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route   GET /api/v1/bookmarks
   * @desc    Get all bookmarks with pagination and filtering
   * @access  Private
   */
  async getBookmarks(req, res, next) {
    try {
      const { userId } = req.user;
      const { category, search, page, limit } = req.query;

      const result = await bookmarkService.getBookmarks({
        userId,
        category,
        search,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 50
      });

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route   GET /api/v1/bookmarks/:id
   * @desc    Get single bookmark
   * @access  Private
   */
  async getBookmark(req, res, next) {
    try {
      const { userId } = req.user;
      const { id } = req.params;

      const bookmark = await bookmarkService.getBookmarkById(id, userId);

      res.status(200).json({
        success: true,
        data: { bookmark }
      });
    } catch (error) {
      if (error.message === 'Bookmark not found') {
        return res.status(404).json({
          success: false,
          error: error.message
        });
      }
      next(error);
    }
  }

  /**
   * @route   PUT /api/v1/bookmarks/:id
   * @desc    Update bookmark
   * @access  Private
   */
  async updateBookmark(req, res, next) {
    try {
      const { userId } = req.user;
      const { id } = req.params;
      const updates = req.body;

      const bookmark = await bookmarkService.updateBookmark(id, userId, updates);

      res.status(200).json({
        success: true,
        message: 'Bookmark updated successfully',
        data: { bookmark }
      });
    } catch (error) {
      if (error.message === 'Bookmark not found') {
        return res.status(404).json({
          success: false,
          error: error.message
        });
      }
      next(error);
    }
  }

  /**
   * @route   DELETE /api/v1/bookmarks/:id
   * @desc    Delete bookmark
   * @access  Private
   */
  async deleteBookmark(req, res, next) {
    try {
      const { userId } = req.user;
      const { id } = req.params;

      await bookmarkService.deleteBookmark(id, userId);

      res.status(200).json({
        success: true,
        message: 'Bookmark deleted successfully'
      });
    } catch (error) {
      if (error.message === 'Bookmark not found') {
        return res.status(404).json({
          success: false,
          error: error.message
        });
      }
      next(error);
    }
  }

  /**
   * @route   GET /api/v1/bookmarks/categories/list
   * @desc    Get all categories
   * @access  Private
   */
  async getCategories(req, res, next) {
    try {
      const { userId } = req.user;

      const categories = await bookmarkService.getCategories(userId);

      res.status(200).json({
        success: true,
        data: { categories }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route   GET /api/v1/bookmarks/tags/list
   * @desc    Get all tags
   * @access  Private
   */
  async getTags(req, res, next) {
    try {
      const { userId } = req.user;

      const tags = await bookmarkService.getTags(userId);

      res.status(200).json({
        success: true,
        data: { tags }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route   GET /api/v1/bookmarks/stats
   * @desc    Get bookmark statistics
   * @access  Private
   */
  async getStats(req, res, next) {
    try {
      const { userId } = req.user;

      const stats = await bookmarkService.getBookmarkStats(userId);

      res.status(200).json({
        success: true,
        data: { stats }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route   GET /api/v1/bookmarks/export/csv
   * @desc    Export bookmarks to CSV
   * @access  Private
   */
  async exportCSV(req, res, next) {
    try {
      const { userId } = req.user;

      const bookmarks = await bookmarkService.exportToCSV(userId);

      // Convert to CSV format
      const headers = ['URL', 'Title', 'Rating', 'Category', 'Tags', 'Notes', 'Created At'];
      const csvRows = [headers.join(',')];

      for (const bookmark of bookmarks) {
        const row = [
          `"${bookmark.url}"`,
          `"${bookmark.title || ''}"`,
          bookmark.rating || '',
          `"${bookmark.category || ''}"`,
          `"${(bookmark.tags || []).join(', ')}"`,
          `"${(bookmark.notes || '').replace(/"/g, '""')}"`,
          `"${bookmark.created_at}"`
        ];
        csvRows.push(row.join(','));
      }

      const csv = csvRows.join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=bookmarks-${Date.now()}.csv`);
      res.status(200).send(csv);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BookmarkController();
