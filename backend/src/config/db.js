const mysql = require('mysql2/promise');

// Create MySQL connection pool for better performance and scalability
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: parseInt(process.env.DB_QUEUE_LIMIT) || 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  waitForConnections: true
});

/**
 * Test database connection
 * @returns {Promise<boolean>} True if connection successful, false otherwise
 */
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL Connection Error:', error.message);
    console.error('⚠️  Please check your database configuration in .env file');
    return false;
  }
};

/**
 * Execute a query with automatic error handling
 * @param {string} query - SQL query string
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} Query results
 */
const executeQuery = async (query, params = []) => {
  try {
    const [results] = await pool.execute(query, params);
    return results;
  } catch (error) {
    console.error('Database Query Error:', error);
    throw error;
  }
};

/**
 * Gracefully close all database connections
 */
const closePool = async () => {
  try {
    await pool.end();
    console.log('Database connection pool closed');
  } catch (error) {
    console.error('Error closing database pool:', error);
  }
};

module.exports = {
  pool,
  testConnection,
  executeQuery,
  closePool
};
