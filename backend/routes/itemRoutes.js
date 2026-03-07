const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

router.get('/recent', itemController.getRecentItems);
router.get('/search',itemController.searchItems);
router.get('/my-posts/:userId', itemController.getMyPosts);

module.exports = router;