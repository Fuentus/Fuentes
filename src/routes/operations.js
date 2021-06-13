const express = require("express");
const router = express.Router();

const operationController = require("../controllers/operations");


router.post('/', operationController.createOperation);

router.get('/', operationController.getOperation);

router.get('/:id', operationController.getOneOperation)

router.put('/:id', operationController.updateOperation)

router.delete('/:id', operationController.deleteOperation)

module.exports = router