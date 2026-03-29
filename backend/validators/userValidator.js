const { body } = require("express-validator");

exports.registerValidator = [

  body("full_name")
    .notEmpty()
    .withMessage("Name required"),

  body("email")
    .isEmail()
    .withMessage("Valid email required"),

  body("password")
    .isLength({ min:4 })
    .withMessage("Password must be at least 8 characters")

];

exports.changePasswordValidator = [

  body("currentPassword")
    .notEmpty()
    .withMessage("Current password required"),

  body("newPassword")
    .isLength({ min:8 })
    .withMessage("New password must be at least 8 characters")

];