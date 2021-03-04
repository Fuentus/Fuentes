const express = require("express");
const { body } = require("express-validator");

const { Users } = require("../models");
const authController = require("../controllers/auth");

const router = express.Router();

const signUpValidator = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .custom((value, { req }) => {
      return Users.findOne({ where: { email: value } }).then((userDoc) => {
        if (userDoc) {
          return Promise.reject("E-Mail address already exists!");
        }
      });
    })
    .normalizeEmail(),
  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Password min of 5 Characters."),
  body("name").trim().not().isEmpty().withMessage("Name Shouldn't be Empty"),
];

router.put("/signup", signUpValidator, authController.signup);

router.post("/login", authController.login);


module.exports = router;
