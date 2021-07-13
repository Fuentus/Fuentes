const express = require("express");
const router = express.Router();


const quoteController = require("../../controllers/admin/QuoteAdmin");

//get all admin - w/ pagination
router.get("/", quoteController.findAllQuotesForAdmin);

//Approve quote
router.post(
  "/:id/changeStatus",
  quoteController.changeStatusForAdmin
);

//get single quote
router.get(
  "/:id",
  quoteController.findQuoteByIdAdmin
);

router.post(
  "/search",
  quoteController.searchResultsForAdmin
);

module.exports = router;
