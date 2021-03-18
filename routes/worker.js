const express = require("express");
const router = express.Router();

const workerController = require("../controllers/worker");


router.post('/', workerController.createWorkers);

router.get('/', workerController.getWorkers);

router.get('/:id', workerController.getWorkersById)

router.put('/:id', workerController.updateWorkersbyId)

router.delete('/:id', workerController.deleteWorkersById)

module.exports = router