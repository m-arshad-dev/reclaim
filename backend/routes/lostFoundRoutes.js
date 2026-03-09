const express = require('express');
const router = express.Router();
const controller = require('../controllers/lostFoundController');

// CRUD routes
router.post('/', controller.createItem.bind(controller));
router.get('/', controller.getItems.bind(controller));
router.get('/:id', controller.getItemById.bind(controller));
router.put('/:id', controller.updateItem.bind(controller));
router.delete('/:id', controller.deleteItem.bind(controller));

module.exports = router;