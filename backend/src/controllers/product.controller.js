const { scrapeAmazonProduct, isValidAsin } = require('../services/amazonScraper.service');

/**
 * Product Controller
 * Handles requests for Amazon product data
 */

/**
 * Get Amazon product data by ASIN
 * GET /api/products/:asin
 * Query params: domain (optional, default: 'com')
 */
const getProductByAsin = async (req, res, next) => {
    try {
        const { asin } = req.params;
        const { domain = 'com' } = req.query;

        // Validate ASIN format
        if (!isValidAsin(asin)) {
            return res.status(400).json({
                error: 'Invalid ASIN format. ASIN must be 10 alphanumeric characters.'
            });
        }

        // Validate domain
        const validDomains = ['com', 'in', 'co.uk', 'ca', 'de', 'fr', 'es', 'it', 'jp'];
        if (!validDomains.includes(domain)) {
            return res.status(400).json({
                error: `Invalid domain. Supported domains: ${validDomains.join(', ')}`
            });
        }

        console.log(`[Controller] Fetching product data for ASIN: ${asin}, domain: ${domain}`);

        // Scrape product data
        const productData = await scrapeAmazonProduct(asin, domain);

        // Return success response
        res.status(200).json(productData);

    } catch (error) {
        console.error('[Controller] Error fetching product:', error.message);

        // Handle specific error types
        if (error.message.includes('CAPTCHA')) {
            return res.status(503).json({
                error: 'Amazon blocked the request. Please try again later.',
                details: error.message
            });
        }

        if (error.message.includes('not found') || error.message.includes('unavailable')) {
            return res.status(404).json({
                error: 'Product not found',
                details: error.message
            });
        }

        if (error.message.includes('timeout')) {
            return res.status(504).json({
                error: 'Request timeout',
                details: error.message
            });
        }

        // Generic error
        res.status(500).json({
            error: 'Failed to fetch product data',
            details: error.message
        });
    }
};

module.exports = {
    getProductByAsin
};
