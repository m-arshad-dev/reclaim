const express = require("express");
const controller = require("../controllers/authController");
const authenticate = require("../middlewares/authenticate");
const { loginValidator } = require("../validators/authValidator");
const {changePasswordValidator} = require('../validators/userValidator')
const validate = require("../middlewares/validate");

const router = express.Router();

router.post("/login",loginValidator ,validate, controller.login);
// POST /auth/logout
router.post("/logout" , controller.logout)
// POST /auth/refresh
router.post("/refresh" , controller.refresh)
// POST /auth/verify-email
router.post("/verify-email", controller.verifyEmail);

router.patch(
  "/change-password",
  authenticate,
  changePasswordValidator,
  validate,  
  controller.changePassword
);
// POST /auth/forgot-password
router.post("/forgot-password" , controller.forgotPassword)
// POST /auth/reset-password
router.post("/reset-password",controller.resetPassword);
module.exports = router;