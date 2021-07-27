const express = require('express')
const Measures = require('../../models/measure')

const measureController = require('../../controllers/user/measure');
const isAuth = require('../../middleware/is-auth');
const loadUser = require('../../middleware/load-user');


const router = express.Router();

router.get('/', [isAuth, loadUser], measureController.getMeasures);

router.get('/:id', [isAuth, loadUser], measureController.getMeasuresById);

router.post('/', [isAuth, loadUser], measureController.createMeasures)

router.put('/:id', [isAuth, loadUser],  measureController.updateMeasuresbyId)


router.delete('/:id', [isAuth, loadUser],  measureController.deleteMeasuresById)

module.exports = router