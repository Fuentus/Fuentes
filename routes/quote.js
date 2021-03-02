const express = require("express");
const multer = require("multer");
const router = express.Router();

const isAuth = require("../middleware/is-auth");
const loadUser = require("../middleware/load-user");
const quoteController = require("../controllers/quote");

//get all quotes - w/ pagination
router.get("/", quoteController.findAllQuotes);
//creating a quote
router.post("/", [isAuth, loadUser], quoteController.createQuote);

//get single quote
router.get("/:id", quoteController.findQuoteById);

//delete a quote
router.delete("/:id", quoteController.deleteQuoteById);

//edit a quote
router.put("/quotes/id", async (req, res) => {
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

//file upload
const upload = multer({
  dest: "attachments",
  limits: {
    fileSize: 200000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.endsWith(".pdf")) {
      return cb(new Error("Only pdf are allowed"));
    }
    cb(undefined, true);
  },
});

router.post(
  "quotes/id/attachments",
  upload.single("attachments"),
  (req, res) => {
    // const id = req.params.id
    res.send();
  }
);

//file delete
router.delete("quotes/id/attachments/:file_name", (req, res) => {
  try {
    const theFile = "attachments/" + req.params.file_name;

    var resultHandler = function (err) {
      if (err) {
        console.log("file delete failed", err);
        return res.status(500).json(err);
      }
      console.log("file deleted");
      return res.status(200).send({ data: req.params.file_name + " deleted" });
    };

    fs.unlinkSync(theFile, resultHandler);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
