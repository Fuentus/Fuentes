const express = require("express");
const multer = require("multer");
const router = express.Router();

const isAuth = require("../middleware/is-auth");
const loadUser = require("../middleware/load-user");
const quoteController = require("../controllers/quote");

//get all quotes - w/ pagination
router.get("/", [isAuth, loadUser], quoteController.findAllQuotes);
//creating a quote
router.post("/", [isAuth, loadUser], quoteController.createQuote);

//get single quote
router.get("/:id", quoteController.findQuoteById);

//delete a quote
router.delete("/:id", quoteController.deleteQuoteById);

//edit a quote
router.put("/quotes/:id", async (req, res) => {
  const id = req.params.id;

  const data = {
    title: "Custom Tools",
    desc: "is simply dummy text of the printing and typesetti",
    status: "ACCEPTED",
    createdAt: "2012-02-01",
    modifiedAt: "2012-02-03",
  };

  let { title, desc, status, createdAt, modifiedAt } = data;
  try {
    const quote = await Quote.Update({
      title,
      desc,
      modifiedAt,
    });
    Quote.save();
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
