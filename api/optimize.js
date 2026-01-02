const { optimizeProductListing } = require('../backend/src/services/aiOptimizer.service');

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
        const { asin, title, bullets, description } = req.body;

        if (!asin || !title || !bullets || !description) {
            return res.status(400).json({
                error: 'Missing required fields: asin, title, bullets, description'
            });
        }

        const optimizedData = await optimizeProductListing({ title, bullets, description });
        return res.status(200).json(optimizedData);

    } catch (error) {
        console.error('[Serverless] Optimization Error:', error.message);

        if (error.message.includes('rate limit')) {
            return res.status(429).json({ error: error.message });
        }

        return res.status(500).json({
            error: 'AI Optimization failed',
            details: error.message
        });
    }
}
