const { pool } = require('../config/db');

class Product {
    static async findByAsin(asin) {
        const [rows] = await pool.query(
            'SELECT * FROM products WHERE asin = ?',
            [asin]
        );
        return rows[0];
    }

    static async create(asin, domain = 'com') {
        const [result] = await pool.query(
            'INSERT INTO products (asin, amazon_domain) VALUES (?, ?)',
            [asin, domain]
        );
        return result.insertId;
    }

    static async findById(id) {
        const [rows] = await pool.query(
            'SELECT * FROM products WHERE id = ?',
            [id]
        );
        return rows[0];
    }
}

module.exports = Product;
