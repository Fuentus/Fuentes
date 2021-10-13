const express = require("express");
const { body } = require("express-validator");

const { Users } = require("../models");
const authController = require("../controllers/auth");

const isAuth = require("../middleware/is-auth");
const loadUser = require("../middleware/load-user");
const { adminRoutes } = require("../validators/user-validator");
const check = require('express-validator/check')
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
  //body("password")
    //.trim(),
    // .isLength({ min: 5 })
    // .withMessage("Password min of 5 Characters."),
  body("name").trim().not().isEmpty().withMessage("Name Shouldn't be Empty"),
];

 
router.put("/signup", signUpValidator, authController.signup);

router.put(
  "/createAdmin",
  [signUpValidator, isAuth, loadUser, adminRoutes],
  authController.createAdminUser
);

router.post("/login", authController.login);
router.post("/workerLogin", authController.workerLogin);

router.post("/forgotPassword", authController.forgotPassword);
router.post("/verifyReset", authController.verifyReset);

router.post("/forgotPasswordWorker", authController.forgotPasswordWorker);
router.post("/verifyResetWorker", authController.verifyResetWorker);

module.exports = router;
