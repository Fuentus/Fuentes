const express = require("express");
const router = express.Router();
const isWorker = require("../../middleware/is-worker");

const workerController = require("../../controllers/worker/WorkerController");

router.get("/", [isWorker], workerController.findAllProjects);
router.post("/", [isWorker], workerController.logDailyWork);
router.put("/", [isWorker], workerController.updateWorkerbyId);
router.get("/profile", [isWorker], workerController.getWorkersById);


module.exports = router;
