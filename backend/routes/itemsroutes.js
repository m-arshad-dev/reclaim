const express = require("express");
const router = express.Router();
const itemsController = require("../controllers/itemscontroller");
// const claimsController = require("../controllers/claimcontroller");
// const searchController = require("../controllers/itemController");
const authMiddleware = require("../middlewares/itemsMiddle");
// -----------------------------
// Lost Item Routes
// -----------------------------
router.post("/lost-items",authMiddleware ,itemsController.createLost);
router.get("/lost-items", authMiddleware,itemsController.getLost);
router.get("/lost-items/:id", itemsController.getLostById);
router.put("/lost-items/:id", itemsController.updateLost);
router.delete("/lost-items/:id", itemsController.deleteItem);
router.post("/lost-items/:id/images", itemsController.uploadLostImage);

// -----------------------------
// Found Item Routes
// -----------------------------
router.post("/found-items",authMiddleware,itemsController.createFound);
router.get("/found-items", authMiddleware,itemsController.getFound);
router.get("/found-items/:id", itemsController.getFoundById);
router.put("/found-items/:id", itemsController.updateFound);
router.delete("/found-items/:id", itemsController.deleteItem);
router.post("/found-items/:id/images", itemsController.uploadFoundImage);

// // -----------------------------
// // Search & Filtering Routes
// // -----------------------------
// router.get("/search", searchController.searchItems);
// router.get("/lost-items/filter", searchController.filterLostItems);
// router.get("/found-items/filter", searchController.filterFoundItems);

// // -----------------------------
// // Claim Management Routes
// // -----------------------------
// router.post("/claims", claimsController.submitClaim);
// router.get("/claims", claimsController.getAllClaims);
// router.get("/claims/:id", claimsController.getClaimById);
// router.put("/claims/:id/approve", claimsController.approveClaim);
// router.put("/claims/:id/reject", claimsController.rejectClaim);

module.exports = router;