const { body } = require("express-validator");

exports.loginValidator = [

  body("email")
    .isEmail()
    .withMessage("Valid email required"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")

];

exports.forgotPasswordValidator = [

  body("email")
    .isEmail()
    .withMessage("Valid email required")

];

exports.resetPasswordValidator = [

  body("token")
    .notEmpty()
    .withMessage("Token required"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")

];