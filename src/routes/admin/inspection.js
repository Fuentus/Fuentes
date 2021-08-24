const express = require("express");
const router = express.Router();

const inspectionController = require('../../controllers/admin/InspectionController')

router.get('/', inspectionController.fetchAllInspectionData);

router.get('/:id', inspectionController.getOneInspection);

router.put('/:id', inspectionController.updateInspection)

router.post('/', inspectionController.createInspection);

module.exports = router
