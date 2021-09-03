const express = require('express')
const Measures = require('../../models/measure')

const userController = require('../../controllers/user/user');
const isAuth = require('../../middleware/is-auth');
const loadUser = require('../../middleware/load-user');


const router = express.Router();

router.put('/', [isAuth, loadUser], userController.updateUser)

module.exports = router