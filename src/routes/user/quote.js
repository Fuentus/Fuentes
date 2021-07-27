const express = require("express");
const multer = require("multer");
const router = express.Router();

const isAuth = require("../../middleware/is-auth");
const loadUser = require("../../middleware/load-user");
const quoteController = require("../../controllers/user/QuoteUser");
const measureRouter = require("./measure");
const uploadRoute = require("./upload");

const {
  validateReq,
  quoteCreateValidator,
  checkUserPrivilegeOfQuote,
  deleteQuotePrivilege,
  editQuotePrivilege
} = require("../../validators/quote-validator");

router.use("/measures", measureRouter);
router.use("/upload", uploadRoute);
router.get("/", [isAuth, loadUser], quoteController.findAllQuotesForUser);
//creating a quote
router.post(
  "/",
  [isAuth, loadUser, quoteCreateValidator],
  quoteController.createQuote
);

// //Approve quote
// router.post(
//   "/:id/changeStatus",
//   [isAuth, loadUser, validateReq, adminPrivilege],
//   quoteController.changeStatus
// );

//get single quote
router.get(
  "/:id",
  [isAuth, loadUser, validateReq],
  quoteController.findQuoteById
);

//delete a quote
router.delete(
  "/:id",
  [isAuth, loadUser, validateReq, checkUserPrivilegeOfQuote,deleteQuotePrivilege],
  quoteController.deleteQuoteById
);

//edit a quote
router.put(
  "/:id",
  [isAuth, loadUser, validateReq, checkUserPrivilegeOfQuote,editQuotePrivilege],
  quoteController.editQuoteById
);

//search a quote
router.post(
  "/search",
  [isAuth, loadUser],
  quoteController.searchResultsForUser
);

module.exports = router;
