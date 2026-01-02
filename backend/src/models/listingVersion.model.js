const { pool } = require('../config/db');

class ListingVersion {
    static async create(data) {
        const {
            product_id,
            version_number,
            original_title,
            original_bullets,
            original_description,
            optimized_title,
            optimized_bullets,
            optimized_description,
            keywords,
            ai_model_used,
            confidence_score,
            keyword_density_analysis,
            improvement_explanation
        } = data;

        const [result] = await pool.query(
            `INSERT INTO listing_versions 
            (product_id, version_number, original_title, original_bullets, original_description, 
            optimized_title, optimized_bullets, optimized_description, keywords, ai_model_used,
            confidence_score, keyword_density_analysis, improvement_explanation) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                product_id,
                version_number,
                original_title,
                JSON.stringify(original_bullets || []),
                original_description,
                optimized_title,
                JSON.stringify(optimized_bullets || []),
                optimized_description,
                JSON.stringify(keywords || []),
                ai_model_used,
                confidence_score || null,
                keyword_density_analysis || null,
                improvement_explanation || null
            ]
        );
        return result.insertId;
    }

    static parseJSONFields(version) {
        if (!version) return version;
        try {
            if (typeof version.original_bullets === 'string') version.original_bullets = JSON.parse(version.original_bullets);
            if (typeof version.optimized_bullets === 'string') version.optimized_bullets = JSON.parse(version.optimized_bullets);
            if (typeof version.keywords === 'string') version.keywords = JSON.parse(version.keywords);
        } catch (e) {
            console.error('Error parsing JSON fields:', e);
        }
        return version;
    }

    static async findByProductId(productId) {
        const [rows] = await pool.query(
            'SELECT * FROM listing_versions WHERE product_id = ? ORDER BY version_number DESC',
            [productId]
        );
        return rows.map(this.parseJSONFields);
    }

    static async findSpecificVersion(productId, versionNumber) {
        const [rows] = await pool.query(
            'SELECT * FROM listing_versions WHERE product_id = ? AND version_number = ?',
            [productId, versionNumber]
        );
        return this.parseJSONFields(rows[0]);
    }

    static async getLatestVersion(productId) {
        const [rows] = await pool.query(
            'SELECT * FROM listing_versions WHERE product_id = ? ORDER BY version_number DESC LIMIT 1',
            [productId]
        );
        return this.parseJSONFields(rows[0]);
    }
}

module.exports = ListingVersion;
