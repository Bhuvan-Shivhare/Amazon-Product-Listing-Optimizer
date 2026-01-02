const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Amazon Product Scraper Service
 * Fetches and parses Amazon product data using ASIN
 */

/**
 * Build Amazon product URL from ASIN and domain
 * @param {string} asin - Amazon Standard Identification Number
 * @param {string} domain - Amazon domain (com, in, co.uk)
 * @returns {string} Full Amazon product URL
 */
const buildAmazonUrl = (asin, domain = 'com') => {
    return `https://www.amazon.${domain}/dp/${asin}`;
};

/**
 * Detect if Amazon returned a CAPTCHA page
 * @param {string} html - HTML response
 * @returns {boolean} True if CAPTCHA detected
 */
const detectCaptcha = (html) => {
    return html.includes('Enter the characters you see below') ||
        html.includes('Type the characters you see in this image') ||
        html.includes('To discuss automated access to Amazon data please contact');
};

/**
 * Extract product data from Amazon HTML using cheerio
 * @param {CheerioAPI} $ - Cheerio instance
 * @param {string} url - Product URL (for logging)
 * @returns {Object} Extracted product data
 */
const extractProductData = ($, url) => {
    // Extract title - try multiple selectors
    let title = $('#productTitle').text().trim() ||
        $('h1.product-title').text().trim() ||
        $('span#productTitle').first().text().trim() ||
        $('#title').text().trim() ||
        $('meta[name="title"]').attr('content');

    // Extract bullet points - try multiple selectors
    let bullets = [];

    // Method 1: Standard feature bullets
    $('#feature-bullets ul li span.a-list-item').each((i, elem) => {
        const text = $(elem).text().trim();
        if (text) {
            bullets.push(text);
        }
    });

    // Method 2: Mobile/Alternative bullet format
    if (bullets.length === 0) {
        $('#feature-bullets li, #vscFeatureBullets li, .a-list-item').each((i, elem) => {
            const text = $(elem).text().trim();
            if (text && bullets.length < 15) {
                if (!bullets.includes(text)) bullets.push(text);
            }
        });
    }

    // Extract description
    let description = $('#productDescription p').text().trim() ||
        $('#productDescription').text().trim() ||
        $('#aplus_feature_div').text().trim() ||
        $('#bookDescription_feature_div').text().trim() ||
        $('meta[name="description"]').attr('content') ||
        '';

    // Clean data
    title = title ? title.replace(/\s+/g, ' ').trim() : '';
    description = description ? description.replace(/\s+/g, ' ').trim() : '';

    // Limits
    if (bullets.length > 10) bullets = bullets.slice(0, 10);
    if (description.length > 2000) description = description.substring(0, 2000) + '...';

    return {
        title,
        bullets,
        description
    };
};

/**
 * Get random User-Agent from a curated list
 */
const getRandomUserAgent = () => {
    const agents = [
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', // Browser verified
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
    ];
    return agents[Math.floor(Math.random() * agents.length)];
};

/**
 * Scrape Amazon product data by ASIN
 * @param {string} asin - Amazon Standard Identification Number
 * @param {string} domain - Amazon domain (default: 'com')
 * @returns {Promise<Object>} Product data object
 */
const scrapeAmazonProduct = async (asin, domain = 'com') => {
    // List of domains to try in order
    const domainsToTry = [domain, 'in', 'co.uk', 'ca'];
    let lastError = null;

    for (const currentDomain of domainsToTry) {
        const url = buildAmazonUrl(asin, currentDomain);
        let attempt = 0;
        const maxAttempts = 2; // Reduce attempts per domain to fail over faster

        console.log(`[Scraper] Trying domain: ${currentDomain}`);

        while (attempt < maxAttempts) {
            try {
                console.log(`[Scraper] Fetching ${url} (attempt ${attempt + 1}/${maxAttempts})`);

                const userAgent = getRandomUserAgent();
                const isMobile = userAgent.includes('Mobile') || userAgent.includes('iPhone');
                const sessionId = `${Math.floor(Math.random() * 1000)}-${Math.floor(Math.random() * 10000000)}-${Math.floor(Math.random() * 10000000)}`;

                const headers = {
                    'User-Agent': userAgent,
                    'Accept': isMobile
                        ? 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                        : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1',
                    'Cache-Control': 'no-cache',
                    'Referer': `https://www.amazon.${currentDomain}/s?k=${asin}`, // Internal search referer
                    'Cookie': `session-id=${sessionId}; i18n-prefs=USD;`,
                    'Sec-Fetch-Dest': 'document',
                    'Sec-Fetch-Mode': 'navigate',
                    'Sec-Fetch-Site': 'same-origin', // Fake same-origin from referer
                    'Sec-Fetch-User': '?1'
                };

                const response = await axios.get(url, {
                    headers,
                    timeout: 8000,
                    validateStatus: (status) => status < 500,
                    maxRedirects: 5
                });

                const html = response.data;
                if (detectCaptcha(html)) {
                    throw new Error('CAPTCHA');
                }

                if (response.status === 404) {
                    throw new Error('NOT_FOUND');
                }

                if (response.status === 503) {
                    throw new Error('503');
                }

                const $ = cheerio.load(html);
                const productData = extractProductData($, url);

                if (!productData.title && productData.bullets.length === 0) {
                    throw new Error('EMPTY_DATA');
                }

                console.log(`[Scraper] Success on domain: ${currentDomain}`);
                return {
                    asin,
                    url,
                    ...productData,
                    fetchedAt: new Date().toISOString()
                };

            } catch (error) {
                attempt++;
                lastError = error;

                if (error.message === 'NOT_FOUND') {
                    console.warn(`[Scraper] Product not found on ${currentDomain}, skipping to next domain...`);
                    break; // Try next domain
                }

                if (attempt >= maxAttempts) {
                    console.warn(`[Scraper] Failed all attempts on ${currentDomain}`);
                    break; // Try next domain
                }

                const waitTime = 1500 * attempt;
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
        }
    }

    // If we reached here, all domains failed
    if (lastError && lastError.message === 'CAPTCHA') {
        throw new Error('Amazon blocked the request. Please try again later.');
    }
    throw lastError || new Error('Failed to fetch product data from any Amazon domain.');
};

/**
 * Validate ASIN format
 * @param {string} asin - ASIN to validate
 * @returns {boolean} True if valid
 */
const isValidAsin = (asin) => {
    // ASIN is typically 10 characters: alphanumeric, starting with B
    const asinRegex = /^[A-Z0-9]{10}$/i;
    return asinRegex.test(asin);
};

module.exports = {
    scrapeAmazonProduct,
    isValidAsin,
    buildAmazonUrl
};
