const { scrapeAmazonProduct, isValidAsin } = require('../backend/src/services/amazonScraper.service');

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
        const { domain = 'com' } = req.query;

        if (!asin || !isValidAsin(asin)) {
            return res.status(400).json({ error: 'Invalid ASIN format' });
        }

        const productData = await scrapeAmazonProduct(asin, domain);
        return res.status(200).json(productData);

    } catch (error) {
        console.error('[Serverless] Scrape Error:', error.message);

        if (error.message.includes('CAPTCHA')) {
            return res.status(503).json({ error: 'Amazon blocked the request' });
        }

        return res.status(500).json({
            error: 'Failed to fetch product data',
            details: error.message
        });
    }
}
