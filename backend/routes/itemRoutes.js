const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

router.get('/recent', itemController.getRecentItems);
router.get('/search',itemController.searchItems);

module.exports = router;