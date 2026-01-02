const VersioningService = require('../services/versioning.service');

const saveVersion = async (req, res) => {
    try {
        const { asin, ...optimizationData } = req.body;

        if (!asin) {
            return res.status(400).json({ error: 'ASIN is required' });
        }

        const result = await VersioningService.createOptimization(asin, optimizationData);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error saving version:', error);
        res.status(500).json({ error: 'Failed to save version' });
    }
};

const getHistory = async (req, res) => {
    try {
        const { asin } = req.params;
        const history = await VersioningService.getHistory(asin);
        res.status(200).json(history);
    } catch (error) {
        console.error('Error fetching history:', error);
        if (error.message === 'Product not found') {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(500).json({ error: 'Failed to fetch history' });
    }
};

const getDiff = async (req, res) => {
    try {
        const { asin } = req.params;
        const { from, to } = req.query;

        if (!from || !to) {
            return res.status(400).json({ error: 'Both "from" and "to" version numbers are required' });
        }

        const diff = await VersioningService.getDiff(asin, parseInt(from), parseInt(to));
        res.status(200).json(diff);
    } catch (error) {
        console.error('Error computing diff:', error);
        if (error.message.includes('not found')) {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to compute diff' });
    }
};

const rollbackVersion = async (req, res) => {
    try {
        const { asin } = req.params;
        const { version } = req.body;

        if (!version) {
            return res.status(400).json({ error: 'Target version is required' });
        }

        const result = await VersioningService.rollback(asin, parseInt(version));
        res.status(200).json(result);
    } catch (error) {
        console.error('Error rolling back:', error);
        if (error.message.includes('not found')) {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to rollback' });
    }
};

module.exports = {
    saveVersion,
    getHistory,
    getDiff,
    rollbackVersion
};
