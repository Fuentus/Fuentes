const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/upload");

router.get("quotes/id/attachments", uploadController.findAllUploads)

router.post("quotes/id/attachments", upload.single("attachments"), uploadController.createUpload)

router.delete("quotes/id/attachments", uploadController.deleteUpload);

module.exports = router;
