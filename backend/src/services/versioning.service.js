const Product = require('../models/product.model');
const ListingVersion = require('../models/listingVersion.model');

class VersioningService {
    /**
     * Save a new optimization version
     * @param {string} asin 
     * @param {Object} data 
     */
    static async createOptimization(asin, data) {
        // 1. Ensure product exists
        let product = await Product.findByAsin(asin);
        if (!product) {
            const productId = await Product.create(asin, data.domain || 'com');
            product = { id: productId };
        }

        // 2. Determine next version number
        const latestVersion = await ListingVersion.getLatestVersion(product.id);
        const nextVersionNumber = latestVersion ? latestVersion.version_number + 1 : 1;

        // 3. Create new version
        const versionData = {
            product_id: product.id,
            version_number: nextVersionNumber,
            ...data
        };

        const versionId = await ListingVersion.create(versionData);
        return {
            version_id: versionId,
            version_number: nextVersionNumber,
            asin: asin
        };
    }

    /**
     * Get history for an ASIN
     * @param {string} asin 
     */
    static async getHistory(asin) {
        const product = await Product.findByAsin(asin);
        if (!product) {
            throw new Error('Product not found');
        }
        return await ListingVersion.findByProductId(product.id);
    }

    /**
     * Get field-level diff between two versions
     * @param {string} asin 
     * @param {number} versionA 
     * @param {number} versionB 
     */
    static async getDiff(asin, versionA, versionB) {
        const product = await Product.findByAsin(asin);
        if (!product) {
            throw new Error('Product not found');
        }

        const v1 = await ListingVersion.findSpecificVersion(product.id, versionA);
        const v2 = await ListingVersion.findSpecificVersion(product.id, versionB);

        if (!v1 || !v2) {
            throw new Error('One or both versions not found');
        }

        const diffs = [];
        const fieldsToCheck = [
            { key: 'optimized_title', label: 'title' },
            { key: 'optimized_bullets', label: 'bullets' },
            { key: 'optimized_description', label: 'description' }
        ];

        fieldsToCheck.forEach(field => {
            const val1 = v1[field.key];
            const val2 = v2[field.key];

            // Deep comparison for objects/arrays, string comparison otherwise
            const isDifferent = typeof val1 === 'object'
                ? JSON.stringify(val1) !== JSON.stringify(val2)
                : val1 !== val2;

            if (isDifferent) {
                diffs.push({
                    field: field.label,
                    old: val1,
                    new: val2
                });
            }
        });

        return diffs;
    }

    /**
     * Rollback to a specific version (Forward-Rollback)
     * @param {string} asin 
     * @param {number} targetVersionNumber 
     */
    static async rollback(asin, targetVersionNumber) {
        const product = await Product.findByAsin(asin);
        if (!product) {
            throw new Error('Product not found');
        }

        const targetVersion = await ListingVersion.findSpecificVersion(product.id, targetVersionNumber);
        if (!targetVersion) {
            throw new Error(`Version ${targetVersionNumber} not found`);
        }

        // Reuse createOptimization to handle version increment logic
        // We pass the target version's content as the "new" content
        return await this.createOptimization(asin, {
            domain: product.amazon_domain,
            original_title: targetVersion.original_title,
            original_bullets: targetVersion.original_bullets,
            original_description: targetVersion.original_description,
            optimized_title: targetVersion.optimized_title,
            optimized_bullets: targetVersion.optimized_bullets,
            optimized_description: targetVersion.optimized_description,
            keywords: targetVersion.keywords,
            ai_model_used: `Rollback to v${targetVersionNumber}`,
            confidence_score: targetVersion.confidence_score,
            keyword_density_analysis: targetVersion.keyword_density_analysis,
            improvement_explanation: targetVersion.improvement_explanation
        });
    }
}

module.exports = VersioningService;
