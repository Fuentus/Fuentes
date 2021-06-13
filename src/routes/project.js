const express = require("express");
const router = express.Router();

const projectController = require("../controllers/project");

router.post('/', projectController.createProject);

router.get('/', projectController.getProject);

router.get('/:id', projectController.getOneProject)

router.put('/:id', projectController.updateProject)

router.delete('/:id', projectController.deleteProject)

module.exports = router