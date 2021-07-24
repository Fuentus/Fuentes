const express = require("express");
const router = express.Router();

const workerController = require("../../controllers/admin/WorkerAdminController");
const {body} = require("express-validator");
const { Users,Workers } = require("../../models");

const workerCreateValidator = [
    body("email")
        .isEmail()
        .withMessage("Please enter a valid email.")
        .custom((value, { req }) => {
            return Users.findOne({ where: { email: value } }).then((userDoc) => {
                if (userDoc) {
                    return Promise.reject("E-Mail address already exists in Users!");
                }
                return Workers.findOne({ where: { email: value } })
            }).then((userDoc) => {
                if (userDoc) {
                    return Promise.reject("E-Mail address already exists in Workers!");
                }
            });
        })
        .normalizeEmail(),

    body("professionId").trim().not().isEmpty().withMessage("Profession Shouldn't be Empty"),
];


router.get('/', workerController.getAllWorkers);

router.get('/profession/:professionId', workerController.getAllWorkersByProfessionId);

router.post('/', workerCreateValidator,workerController.createWorkers);

router.get('/:id', workerController.getWorkersById)

router.put('/:id', workerController.updateWorkersbyId)

router.delete('/:id', workerController.deleteWorkersById)

module.exports = router