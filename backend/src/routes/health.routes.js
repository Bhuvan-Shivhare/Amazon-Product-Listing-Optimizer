const express = require('express');
const router = express.Router();

/**
 * Health check endpoint
 * GET /health
 * Returns server status and timestamp
 */
router.get('/', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

module.exports = router;
