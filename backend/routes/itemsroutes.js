const express = require("express");
const router = express.Router();
const itemsController = require("../controllers/itemscontroller");



console.log("yeah")
router.post("/lost", itemsController.createLost);
// Public routes
router.get("/lost", itemsController.getLost);
router.get("/found", itemsController.getFound);

// Protected routes
router.post("/found", itemsController.createFound);

module.exports = router;