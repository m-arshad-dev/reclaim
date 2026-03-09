const express = require("express");
const controller = require("../controllers/userController");
const authenticate =require('../middlewares/authenticate');
const router = express.Router();



// GET /users/me
router.get("/me" , authenticate , controller.me)

router.post("/register", controller.register);

// PATCH /users/me
// PATCH /users/change-password
// GET /users/:id

module.exports = router;