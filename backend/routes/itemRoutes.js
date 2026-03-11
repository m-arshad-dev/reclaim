const express = require('express');
const router = express.Router();

const itemController = require('../controllers/itemController');
const validateSearch = require('../middlewares/validateSearch');

// Get recent items
router.get('/recent', (req, res) => itemController.getRecentItems(req, res));

// Search items
router.get('/search', validateSearch, (req, res) => itemController.searchItems(req, res));

// Get user's posts
router.get('/my-posts/:userId', (req, res) => itemController.getMyPosts(req, res));

// Get item details
router.get('/:id', (req, res) => itemController.getItemDetails(req, res));

module.exports = router;