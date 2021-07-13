const express = require("express");

const router = express.Router();
const quoteRoutes = require('./quote');
router.use('/quotes', quoteRoutes);

module.exports = router;