const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user');
const authController = require('../controllers/auth');

const router = express.Router();

router.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ where: { email: value } })
          .then(userDoc => {
            if (userDoc) {
              return Promise.reject('E-Mail address already exists!');
            }
          });
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 })
      .withMessage('Password min of 5 Characters.'),
    body('name')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Name Shouldn\'t be Empty')
  ],
  authController.signup
);

router.post('/login', authController.login);

module.exports = router;
