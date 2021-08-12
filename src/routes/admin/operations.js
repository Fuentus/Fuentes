const express = require("express");
const router = express.Router();

const operationController = require("../../controllers/admin/OperationsController");

const {
    validateReq,
    operationCreateValidator,
  } = require("../../validators/operation-validator");

router.post('/', [operationCreateValidator], operationController.createOperation);

router.get('/', operationController.findAllOperations);

router.get('/:id', [validateReq], operationController.findByOperationId)

router.put('/:id', operationController.updateOperation)

router.delete('/:id', operationController.deleteOperation)

module.exports = router