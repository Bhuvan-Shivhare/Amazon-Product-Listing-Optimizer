const Groq = require('groq-sdk');

/**
 * AI Listing Optimizer Service using Groq
 * Uses Groq's llama-3.1-70b-versatile model for Amazon product optimization
 */

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

/**
 * Build system prompt for Amazon listing optimization
 * @returns {string} System prompt
 */
const buildSystemPrompt = () => {
    return `You are an expert Amazon product listing optimizer. Your task is to optimize product listings for SEO and conversions while staying factual and Amazon-compliant.

CRITICAL RULES:
1. Output ONLY valid JSON, absolutely no markdown, no extra text, no explanations
2. Do NOT invent features that don't exist in the original listing
3. Do NOT use prohibited words: "best", "#1", "guaranteed", "perfect"
4. Do NOT use emojis or special characters
5. Stay factual - no exaggerated claims
6. Follow Amazon marketplace policies strictly

OPTIMIZATION GUIDELINES:

TITLE:
- Keep under 200 characters
- Include primary keywords naturally
- Make it SEO-friendly and searchable
- Clear and readable

BULLETS:
- Generate exactly 3-5 bullet points
- Focus on benefits over features
- Keep each under 250 characters
- Use clear, concise language
- Start with most important benefits

DESCRIPTION:
- Write 2-3 paragraphs (200-300 words)
- Persuasive but factual
- Highlight unique selling points
- No emojis, no exaggerations

KEYWORDS:
- Extract 3-5 high-value SEO keywords
- Buyer-intent focused
- Lowercase only
- No duplicates

OUTPUT FORMAT (strict JSON only):
{
  "optimized_title": "string",
  "optimized_bullets": ["string", "string", "string"],
  "optimized_description": "string",
  "keywords": ["string", "string", "string"],
  "confidence_score": 0-100,
  "keyword_density_analysis": "string describing keyword usage",
  "improvement_explanation": "brief explanation of why this version is better"
}`;
};

/**
 * Validate AI optimization output
 * @param {Object} output - AI response
 * @returns {boolean} True if valid
 */
const validateOptimizationOutput = (output) => {
    if (!output || typeof output !== 'object') {
        return false;
    }

    // Check required fields
    if (!output.optimized_title || typeof output.optimized_title !== 'string') {
        return false;
    }

    if (!Array.isArray(output.optimized_bullets) || output.optimized_bullets.length < 3 || output.optimized_bullets.length > 5) {
        return false;
    }

    if (!output.optimized_description || typeof output.optimized_description !== 'string') {
        return false;
    }

    if (!Array.isArray(output.keywords) || output.keywords.length < 3 || output.keywords.length > 5) {
        return false;
    }

    if (typeof output.confidence_score !== 'number' || output.confidence_score < 0 || output.confidence_score > 100) {
        return false;
    }

    if (typeof output.improvement_explanation !== 'string' || output.improvement_explanation.length === 0) {
        return false;
    }

    return true;
};

/**
 * Optimize Amazon product listing using Groq AI
 * @param {Object} productData - Original product data
 * @param {string} productData.title - Original title
 * @param {Array<string>} productData.bullets - Original bullet points
 * @param {string} productData.description - Original description
 * @returns {Promise<Object>} Optimized product data
 */
const optimizeProductListing = async (productData) => {
    const { title, bullets, description } = productData;

    // Validate API key
    if (!process.env.GROQ_API_KEY) {
        throw new Error('Groq API key not configured. Please set GROQ_API_KEY in .env file.');
    }

    // Build user prompt with original data
    const userPrompt = `Optimize this Amazon product listing. Return ONLY valid JSON with no extra text.

ORIGINAL TITLE:
${title}

ORIGINAL BULLET POINTS:
${bullets.map((b, i) => `${i + 1}. ${b}`).join('\n')}

ORIGINAL DESCRIPTION:
${description}

Output the optimized version as pure JSON following the exact format specified in the system prompt.`;

    try {
        console.log('[AI Optimizer] Sending request to Groq...');

        const response = await groq.chat.completions.create({
            model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: buildSystemPrompt() },
                { role: 'user', content: userPrompt }
            ],
            temperature: parseFloat(process.env.GROQ_TEMPERATURE) || 0.4,
            max_tokens: parseInt(process.env.GROQ_MAX_TOKENS) || 700,
            response_format: { type: 'json_object' }
        });

        // Extract and parse response
        const aiOutput = response.choices[0].message.content;
        const optimizedData = JSON.parse(aiOutput);

        console.log('[AI Optimizer] Successfully received optimized data from Groq');

        // Validate output structure
        if (!validateOptimizationOutput(optimizedData)) {
            console.error('[AI Optimizer] Validation failed:', optimizedData);
            throw new Error('AI returned invalid optimization format');
        }

        // Map to expected format - Keep optimized_ prefix to match DB schema and AI output
        const formattedOutput = {
            optimized_title: optimizedData.optimized_title,
            optimized_bullets: optimizedData.optimized_bullets,
            optimized_description: optimizedData.optimized_description,
            keywords: optimizedData.keywords,
            confidence_score: optimizedData.confidence_score,
            keyword_density_analysis: optimizedData.keyword_density_analysis,
            improvement_explanation: optimizedData.improvement_explanation
        };

        return {
            optimized: formattedOutput,
            model: response.model,
            usage: {
                promptTokens: response.usage.prompt_tokens,
                completionTokens: response.usage.completion_tokens,
                totalTokens: response.usage.total_tokens
            }
        };

    } catch (error) {
        console.error('[AI Optimizer] Error:', error.message);

        // Handle specific Groq errors
        if (error.status === 429 || error.message.includes('rate_limit')) {
            throw new Error('Groq rate limit exceeded. Please try again later.');
        }

        if (error.status === 401 || error.message.includes('authentication')) {
            throw new Error('Invalid Groq API key. Please check your configuration.');
        }

        if (error.status === 500 || error.status === 503) {
            throw new Error('Groq server error. Please try again later.');
        }

        if (error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
            throw new Error('Groq API timeout. Please check your internet connection.');
        }

        // Re-throw other errors
        throw error;
    }
};

module.exports = {
    optimizeProductListing,
    buildSystemPrompt,
    validateOptimizationOutput
};
