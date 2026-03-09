const express = require("express");
const controller = require("../controllers/userController");
const authenticate =require('../middlewares/authenticate');
const router = express.Router();
const vlaidate = require('../middlewares/validate')
const {registerValidator} = require("../validators/userValidator");
const validate = require("../middlewares/validate");


// GET /users/me
router.get("/me" , authenticate , controller.me)

router.post("/register",registerValidator , validate, controller.register);

// PATCH /users/me
// PATCH /users/change-password
// GET /users/:id

module.exports = router;