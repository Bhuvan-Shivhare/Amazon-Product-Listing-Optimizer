const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

// Import routes
const healthRoutes = require('./routes/health.routes');
const productRoutes = require('./routes/product.routes');
const optimizeRoutes = require('./routes/optimize.routes');
const historyRoutes = require('./routes/history.routes');

// Initialize Express app
const app = express();

// ==============================
// Middleware Configuration
// ==============================

// Enable CORS for all origins (configure based on your needs)
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));

// Request logging middleware (use 'combined' in production)
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Parse JSON request bodies
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==============================
// API Routes
// ==============================

// Health check endpoint
app.use('/health', healthRoutes);

// Product routes
app.use('/api/products', productRoutes);

// Optimize routes
app.use('/api/optimize', optimizeRoutes);

// History routes
app.use('/api/history', historyRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Amazon Listing Optimizer API',
        version: '1.0.0',
        status: 'Running',
        endpoints: {
            health: '/health',
            products: '/api/products/:asin',
            optimize: '/api/optimize',
            history: '/api/history/:asin'
        }
    });
});

// ==============================
// Error Handling
// ==============================

// 404 handler - must be after all routes
app.use(notFoundHandler);

// Global error handler - must be last
app.use(errorHandler);

module.exports = app;
