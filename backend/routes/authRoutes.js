const express = require("express");
const controller = require("../controllers/authController");

const router = express.Router();

router.post("/login", controller.login);
// POST /auth/logout
router.post("/logout" , controller.logout)
// POST /auth/refresh
router.post("/refresh" , controller.refresh)
// POST /auth/verify-email
router.post("/verify-email", controller.verifyEmail);
// POST /auth/forgot-password
// POST /auth/reset-password
module.exports = router;