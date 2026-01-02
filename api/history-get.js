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

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { asin } = req.query;

        if (!asin) {
            return res.status(400).json({ error: 'ASIN is required' });
        }

        const history = await VersioningService.getHistory(asin);
        return res.status(200).json(history);
    } catch (error) {
        console.error('[Serverless] Get History Error:', error.message);
        if (error.message === 'Product not found') {
            return res.status(404).json({ error: 'Product not found' });
        }
        return res.status(500).json({
            error: 'Failed to fetch history',
            details: error.message
        });
    }
}
