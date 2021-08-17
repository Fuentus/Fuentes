const express = require("express");
const router = express.Router();
const projectController = require("../../controllers/admin/ProjectAdminController");

router.get('/', projectController.getProject);

router.get('/:id', projectController.getOneProject)

// router.delete('/:id', projectController.deleteProjectById)

router.put('/:id', projectController.updateProjectById)

router.post("/:id/changeStatus", projectController.changeProjectStatus);

module.exports = router