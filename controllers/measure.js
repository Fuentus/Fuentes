const { Measures } = require('../models')

exports.getMeasures = (req, res, next) => {
    try {
        const measure = Measures.findAll()
        console.log(measure)
    } catch (e) {
        console.log(e)
    }
}

exports.createMeasures = (req, res, next) => {
    const { name, unit, qty } = req.body
    try {
       req.quote.createMeasures({ name, unit, qty })
       res.status(201).json({ message: "Measurements added"})
    } catch (err) {
        console.log(err)
        next()
    }
}

exports.getMeasuresById = (req, res, next) => {
    const { id } = req.params;
    console.log(id)
    try {
        const measure = Measures.findOne(id)
        console.log(measure)
    } catch (e) {
        console.log(e)
    }
}

exports.deleteMeasuresById = (req, res, next) => {
    const { id } = req.params;
        try {
            const measure =  Measures.destroy(id)
            res.status(200)
        } catch (e) {
           console.log(e)
        }
}

exports.updateMeasuresbyId = async (req, res) => {
    const { id }  = req.params;
    //wipe existing measures and add new measures
    //wipe
    try {
        const measure =  Measures.destroy(id)
        res.status(200)
    } catch (e) {
       console.log(e)
    }
    //add new data
    const data = {
        id: 123456,
        quote_id: 1,
        name: 'Tool',
        qty: 10,
        unit: 2,
    }

    let { quote_id, name, qty, unit } = data

    try {
       const measure = await Measures.Create({
          quote_id, name, qty, unit
       })
       console.log(measure)
       res.redirect('/measure')
} catch (e) {
    console.log(e)
}
}