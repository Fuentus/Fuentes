const express = require("express");
const multer = require("multer");
const router = express.Router();

const isAuth = require("../middleware/is-auth");
const loadUser = require("../middleware/load-user");
const quoteController = require("../controllers/quote");
const measureRouter = require('./measure')
const uploadRoute = require('./upload');

router.use('/measures',measureRouter)
router.use('/upload', uploadRoute)
//get all quotes - w/ pagination
router.get("/", [isAuth, loadUser], quoteController.findAllQuotes);
//creating a quote
router.post("/", [isAuth, loadUser], quoteController.createQuote);

//get single quote
router.get("/:id", [isAuth, loadUser], quoteController.findQuoteById);

//delete a quote
router.delete("/:id", [isAuth, loadUser], quoteController.deleteQuoteById);

//edit a quote
router.put("/:id", [isAuth, loadUser], quoteController.editQuoteById)

module.exports = router;
