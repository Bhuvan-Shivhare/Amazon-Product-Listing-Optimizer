const fs = require('fs');
const path = require('path');
require('dotenv').config(); // Load environment variables
const { pool } = require('../config/db');

const runMigration = async () => {
    try {
        console.log('Starting migration...');
        const migrationPath = path.join(__dirname, '../db/migrations/001_create_schema.sql');
        const sql = fs.readFileSync(migrationPath, 'utf8');

        // Split by semicolon to handle multiple statements if necessary, 
        // though mysql2's pool.query might handle it if multipleStatements is enabled.
        // For safety, let's assume we might need to enable multipleStatements or run one by one.
        // However, the SQL file has individual CREATE TABLE statements.

        // Let's try executing the whole block if the driver supports it, or split.
        // A simple split by ';' might be brittle if ';' is in comments or strings.
        // Given the file content, it has standard SQL.

        // Checking if we can just run it.
        // If mysql2 is configured with multipleStatements: true, this works.
        // If not, we iterate.

        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        for (const statement of statements) {
            console.log('Running statement:', statement.substring(0, 50) + '...');
            await pool.query(statement);
        }

        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

runMigration();
