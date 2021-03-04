const express = require('express')
const Measures = require('../models/measure')

const measureController = require('../controllers/measure');

const router = express.Router();

router.get('/measure', measureController.getMeasures);

router.post('/measure', async (req, res) => {

        const data = {
            id: 123456,
            quote_id: 1,
            name: 'Tool',
            qty: 10,
            unit: 2,
        }

        let { id, quote_id, name, qty, unit } = data

        try {
           const measure = await Measures.Create({
              quote_id, name, qty, unit
           })
           console.log(measure)
           res.redirect('/measure')
    } catch (e) {
        console.log(e)
    }
})

router.post('/measure/:id', measureController.updateMeasuresbyId)


router.delete('/measure/:id',  measureController.deleteMeasuresById)

module.exports = router