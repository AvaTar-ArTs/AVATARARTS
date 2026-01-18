const express = require('express');
const router = express.Router();
const bookmarkController = require('./bookmarkController');
const { authenticate } = require('../auth/authMiddleware');
const { validate, createBookmarkSchema, updateBookmarkSchema } = require('./bookmarkValidation');

/**
 * @route   POST /api/v1/bookmarks
 * @desc    Create new bookmark
 * @access  Private
 */
router.post(
  '/',
  authenticate,
  validate(createBookmarkSchema),
  bookmarkController.createBookmark
);

/**
 * @route   GET /api/v1/bookmarks
 * @desc    Get all bookmarks with pagination
 * @access  Private
 */
router.get(
  '/',
  authenticate,
  bookmarkController.getBookmarks
);

/**
 * @route   GET /api/v1/bookmarks/stats
 * @desc    Get bookmark statistics
 * @access  Private
 */
router.get(
  '/stats',
  authenticate,
  bookmarkController.getStats
);

/**
 * @route   GET /api/v1/bookmarks/categories/list
 * @desc    Get all categories
 * @access  Private
 */
router.get(
  '/categories/list',
  authenticate,
  bookmarkController.getCategories
);

/**
 * @route   GET /api/v1/bookmarks/tags/list
 * @desc    Get all tags
 * @access  Private
 */
router.get(
  '/tags/list',
  authenticate,
  bookmarkController.getTags
);

/**
 * @route   GET /api/v1/bookmarks/export/csv
 * @desc    Export bookmarks to CSV
 * @access  Private
 */
router.get(
  '/export/csv',
  authenticate,
  bookmarkController.exportCSV
);

/**
 * @route   GET /api/v1/bookmarks/:id
 * @desc    Get single bookmark
 * @access  Private
 */
router.get(
  '/:id',
  authenticate,
  bookmarkController.getBookmark
);

/**
 * @route   PUT /api/v1/bookmarks/:id
 * @desc    Update bookmark
 * @access  Private
 */
router.put(
  '/:id',
  authenticate,
  validate(updateBookmarkSchema),
  bookmarkController.updateBookmark
);

/**
 * @route   DELETE /api/v1/bookmarks/:id
 * @desc    Delete bookmark
 * @access  Private
 */
router.delete(
  '/:id',
  authenticate,
  bookmarkController.deleteBookmark
);

module.exports = router;
