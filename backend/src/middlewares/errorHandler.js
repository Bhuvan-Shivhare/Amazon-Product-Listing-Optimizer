/**
 * Global error handling middleware
 * Catches all errors and sends appropriate responses
 */
const errorHandler = (err, req, res, next) => {
    // Log error for debugging
    console.error('Error:', {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        path: req.path,
        method: req.method
    });

    // Determine status code
    const statusCode = err.statusCode || 500;

    // Send error response
    res.status(statusCode).json({
        success: false,
        error: {
            message: err.message || 'Internal Server Error',
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        },
        timestamp: new Date().toISOString()
    });
};

/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res, next) => {
    const error = new Error(`Route not found: ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};

module.exports = {
    errorHandler,
    notFoundHandler
};
