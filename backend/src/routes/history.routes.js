const express = require('express');
const router = express.Router();
const historyController = require('../controllers/history.controller');

router.post('/save', historyController.saveVersion);
router.get('/:asin', historyController.getHistory);
router.get('/:asin/diff', historyController.getDiff);
router.post('/:asin/rollback', historyController.rollbackVersion);

module.exports = router;
