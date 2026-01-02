const mysql = require('mysql2/promise');

// Create MySQL connection pool with serverless-optimized settings
const poolConfig = process.env.DATABASE_URL
  ? { uri: process.env.DATABASE_URL }
  : {
    host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
    port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
    user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
    database: process.env.MYSQLDATABASE || process.env.DB_NAME,
  };

const pool = mysql.createPool({
  ...poolConfig,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10, // Restored for long-running Express
  enableKeepAlive: true,
  waitForConnections: true,
  ssl: (process.env.DATABASE_URL || process.env.MYSQLHOST) ? { rejectUnauthorized: true } : undefined
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
