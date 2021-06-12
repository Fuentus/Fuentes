const { param, body } = require("express-validator");

const quoteCreateValidator = [
  body("title")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Please enter a Title of Min 3 Characters."),

  body("desc")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Please enter a Description."),

  body("measures").isArray({ min: 1 }).withMessage("Please add measures"),
];


const validateReq = [
    param("id",'Enter a valid Id').isFloat()
];

module.exports = {
  quoteCreateValidator: quoteCreateValidator,
  validateReq: validateReq,
};
