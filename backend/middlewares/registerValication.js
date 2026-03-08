const { body } = require("express-validator");

const registerValidation = [
  body("full_name").notEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 6 })
];