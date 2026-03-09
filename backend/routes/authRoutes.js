const express = require("express");
const controller = require("../controllers/authController");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

router.post("/login", controller.login);
// POST /auth/logout
router.post("/logout" , controller.logout)
// POST /auth/refresh
router.post("/refresh" , controller.refresh)
// POST /auth/verify-email
router.post("/verify-email", controller.verifyEmail);

router.patch(
  "/change-password",
  authenticate,
  controller.changePassword
);
// POST /auth/forgot-password
router.post("/forgot-password" , controller.forgotPassword)
// POST /auth/reset-password
router.post("/reset-password",controller.resetPassword);
module.exports = router;