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
  quoteController.findQuoteByIdForAdmin
);

router.post(
  "/search",
  quoteController.searchResultsForAdmin
);

router.put("/tagQuotes",
    quoteController.tagQuoteAndOperations);

router.put("/tagQuotes/:id",
    quoteController.editTagQuoteAndOperations);

router.delete("/tagQuotes/:id",
    quoteController.removeTagQuoteAndOperations);

router.put("/convertToProject/:quoteId",
    quoteController.convertToProject);

router.post("/assignQuoteInspection/:id",
    quoteController.assignQuoteInspection);

router.post("/addTaxValue/:id",
    quoteController.addTaxValue);

router.post("/addTotalValue/:id",
    quoteController.addTotalValue);

router.post("/submitPOUrl/:id",
    quoteController.submitPOUrl);


module.exports = router;
