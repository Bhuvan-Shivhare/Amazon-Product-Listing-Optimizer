require('dotenv').config();
const app = require('./app');
const { testConnection, closePool } = require('./config/db');

// Server configuration
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Initialize server
let server;

const startServer = async () => {
    try {
        // Test database connection first
        console.log('🔍 Testing database connection...');
        console.log('📊 DB Config:', {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            database: process.env.DB_NAME,
            hasPassword: !!process.env.DB_PASSWORD
        });

        const dbConnected = await testConnection();

        if (!dbConnected) {
            console.warn('⚠️  Starting server without database connection');
            console.warn('⚠️  Database operations will fail until connection is established');
        }

        // Start Express server
        server = app.listen(PORT, () => {
            console.log('=================================');
            console.log(`🚀 Server running in ${NODE_ENV} mode`);
            console.log(`📡 Listening on port ${PORT}`);
            console.log(`🔗 Health check: http://localhost:${PORT}/health`);
            console.log('=================================');
        });

        // Handle server errors (e.g., port already in use)
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`❌ Port ${PORT} is already in use`);
                console.error(`💡 Solutions:`);
                console.error(`   1. Change PORT in .env file`);
                console.error(`   2. Kill process using port: lsof -ti:${PORT} | xargs kill -9`);
                console.error(`   3. Use a different port`);
                process.exit(1);
            } else {
                console.error('❌ Server error:', error);
                process.exit(1);
            }
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// Graceful shutdown handler
const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);

    if (server) {
        server.close(async () => {
            console.log('✅ HTTP server closed');

            // Close database connections
            await closePool();

            console.log('✅ Graceful shutdown completed');
            process.exit(0);
        });

        // Force shutdown after 10 seconds
        setTimeout(() => {
            console.error('⚠️  Forced shutdown after timeout');
            process.exit(1);
        }, 10000);
    } else {
        process.exit(0);
    }
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    gracefulShutdown('UNCAUGHT_EXCEPTION');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start the server
startServer();
