const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/upload");
const isAuth = require("../middleware/is-auth");
const loadUser = require("../middleware/load-user");
const upload = require("../models/upload");

router.get("/:id", [isAuth, loadUser], uploadController.findAllUploads)

router.post("/:id", [isAuth, loadUser], uploadController.createUpload)

router.delete("/:id", [isAuth, loadUser], uploadController.deleteUpload);

module.exports = router;
