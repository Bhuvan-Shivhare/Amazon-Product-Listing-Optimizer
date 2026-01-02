const express = require('express');
const router = express.Router();
const { getProductByAsin } = require('../controllers/product.controller');

/**
 * Product Routes
 * Endpoints for fetching Amazon product data
 */

/**
 * @route   GET /api/products/:asin
 * @desc    Get Amazon product data by ASIN
 * @params  asin - Amazon Standard Identification Number (10 chars)
 * @query   domain - Amazon domain (com, in, co.uk, etc.) - optional, default: 'com'
 * @access  Public
 * @example GET /api/products/B08N5WRWNW?domain=com
 */
router.get('/:asin', getProductByAsin);

module.exports = router;
