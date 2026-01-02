const { optimizeProductListing } = require('../services/aiOptimizer.service');

/**
 * Optimize Controller
 * Handles requests for AI-powered listing optimization
 */

/**
 * Optimize product listing using AI
 * POST /api/optimize
 * Body: { asin, title, bullets, description }
 */
const optimizeListing = async (req, res, next) => {
    try {
        const { asin, title, bullets, description } = req.body;

        // Validate required fields
        if (!title || typeof title !== 'string') {
            return res.status(400).json({
                error: 'Missing or invalid required field: title (must be a string)'
            });
        }

        if (!bullets || !Array.isArray(bullets) || bullets.length === 0) {
            return res.status(400).json({
                error: 'Missing or invalid required field: bullets (must be a non-empty array)'
            });
        }

        if (!description || typeof description !== 'string') {
            return res.status(400).json({
                error: 'Missing or invalid required field: description (must be a string)'
            });
        }

        // ASIN is optional but recommended
        const productAsin = asin || 'UNKNOWN';

        console.log(`[Optimize Controller] Starting optimization for ASIN: ${productAsin}`);

        // Call AI optimizer service
        const result = await optimizeProductListing({
            title,
            bullets,
            description
        });

        // Format response
        const response = {
            asin: productAsin,
            optimized: result.optimized,
            model: result.model,
            optimizedAt: new Date().toISOString(),
            usage: result.usage
        };

        console.log(`[Optimize Controller] Optimization successful for ASIN: ${productAsin}`);

        res.status(200).json(response);

    } catch (error) {
        console.error('[Optimize Controller] Error:', error.message);

        // Handle Groq-specific errors
        if (error.message.includes('API key')) {
            return res.status(500).json({
                error: 'Groq API configuration error',
                details: error.message
            });
        }

        if (error.message.includes('rate limit')) {
            return res.status(429).json({
                error: 'Rate limit exceeded',
                details: error.message
            });
        }

        if (error.message.includes('timeout')) {
            return res.status(504).json({
                error: 'Groq request timeout',
                details: error.message
            });
        }

        if (error.message.includes('invalid optimization format')) {
            return res.status(500).json({
                error: 'AI returned invalid response format',
                details: 'Please try again or contact support'
            });
        }

        // Generic error
        res.status(500).json({
            error: 'Failed to optimize listing',
            details: error.message
        });
    }
};

module.exports = {
    optimizeListing
};
