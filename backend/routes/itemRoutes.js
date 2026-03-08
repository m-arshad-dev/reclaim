const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const validateSearch = require('../middlewares/validateSearch');
router.get('/recent', itemController.getRecentItems);
router.get('/search', validateSearch, itemController.searchItems);
router.get('/my-posts/:userId', itemController.getMyPosts);

module.exports = router;