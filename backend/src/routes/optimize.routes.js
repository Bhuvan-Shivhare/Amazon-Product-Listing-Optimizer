const express = require('express');
const router = express.Router();
const { optimizeListing } = require('../controllers/optimize.controller');

/**
 * Optimize Routes
 * Endpoints for AI-powered listing optimization
 */

/**
 * @route   POST /api/optimize
 * @desc    Optimize Amazon product listing using AI
 * @body    { asin, title, bullets, description }
 * @access  Public
 * @example POST /api/optimize
 * {
 *   "asin": "B08N5WRWNW",
 *   "title": "PlayStation 5 Console",
 *   "bullets": ["Feature 1", "Feature 2"],
 *   "description": "Product description"
 * }
 */
router.post('/', optimizeListing);

module.exports = router;
