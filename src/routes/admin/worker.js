const express = require("express");
const router = express.Router();

const workerController = require("../../controllers/admin/WorkerAdminController");

const {
    validateReq,
    workerCreateValidator,
  } = require("../../validators/worker-validator");


router.get('/', workerController.getAllWorkers);

router.get('/profession/:professionId', workerController.getAllWorkersByProfessionId);

router.post('/', [workerCreateValidator], workerController.createWorkers);

router.get('/:id', [validateReq], workerController.getWorkersById)

router.put('/:id', workerController.updateWorkersbyId)

router.delete('/:id', workerController.deleteWorkersById)

module.exports = router