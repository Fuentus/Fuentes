const express = require("express");

const router = express.Router();
const quoteRoutes = require('./quote');
const userRoute = require('./user');

router.use('/quotes', quoteRoutes);
router.use('/user', userRoute);


module.exports = router;