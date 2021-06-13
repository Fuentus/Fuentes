const express = require("express");
const multer = require("multer");
const router = express.Router();

const isAuth = require("../middleware/is-auth");
const loadUser = require("../middleware/load-user");
const quoteController = require("../controllers/quote");
const measureRouter = require("./measure");
const uploadRoute = require("./upload");

const {
  validateReq,
  quoteCreateValidator,
  adminPrivilege,
  checkUserPrivilegeOfQuote
} = require("./validators/quotes/validateQuotes");

router.use("/measures", measureRouter);
router.use("/upload", uploadRoute);
//get all quotes - w/ pagination
router.get("/", [isAuth, loadUser], quoteController.findAllQuotes);
//creating a quote
router.post(
  "/",
  [isAuth, loadUser, quoteCreateValidator],
  quoteController.createQuote
);

//Approve quote
router.post(
  "/:id/changeStatus",
  [isAuth, loadUser, validateReq,adminPrivilege],
  quoteController.changeStatus
);

//get single quote
router.get(
  "/:id",
  [isAuth, loadUser, validateReq],
  quoteController.findQuoteById
);

//delete a quote
router.delete("/:id", [isAuth, loadUser,validateReq,checkUserPrivilegeOfQuote], quoteController.deleteQuoteById);

//edit a quote
router.put("/:id", [isAuth, loadUser,validateReq,checkUserPrivilegeOfQuote], quoteController.editQuoteById);

module.exports = router;
