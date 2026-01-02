const VersioningService = require('../backend/src/services/versioning.service');

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { asin, ...optimizationData } = req.body;

        if (!asin) {
            return res.status(400).json({ error: 'ASIN is required' });
        }

        const result = await VersioningService.createOptimization(asin, optimizationData);
        return res.status(200).json(result);
    } catch (error) {
        console.error('[Serverless] Save Version Error:', error.message);
        return res.status(500).json({
            error: 'Failed to save version',
            details: error.message
        });
    }
}
