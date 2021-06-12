const { body } = require("express-validator");

const quoteValidator = [
  body("title")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Please enter a Title of Min 3 Characters."),

  body("desc")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Please enter a Description."),

  body("measures").isArray({min:1})
  .withMessage("Please add measures"),

];

module.exports = quoteValidator;
