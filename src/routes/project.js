const express = require("express");
const router = express.Router();
const projectController = require("../controllers/admin/ProjectAdminController");

router.get('/', projectController.getProject);

router.get('/:id', projectController.getOneProject)

module.exports = router