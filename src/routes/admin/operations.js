const express = require("express");
const router = express.Router();

const operationController = require("../../controllers/admin/OperationsController");


router.post('/', operationController.createOperation);

router.get('/', operationController.findAllOperations);

router.get('/:id', operationController.findByOperationId)

router.put('/:id', operationController.updateOperation)

router.delete('/:id', operationController.deleteOperation)

module.exports = router