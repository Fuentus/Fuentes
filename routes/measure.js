const express = require('express')
const Measures = require('../models/measure')

const measureController = require('../controllers/measure');

const router = express.Router();

router.get('/measure', measureController.getMeasures);

// router.get('/measure/hi', (req, res) => {
//     res.send('hello')
// });

router.post('/measure', measureController.createMeasures)

router.post('/measure/:id', measureController.updateMeasuresbyId)


router.delete('/measure/:id',  measureController.deleteMeasuresById)

module.exports = router