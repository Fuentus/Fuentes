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
       let measure = Measures.createMeasures({ 
            name: name,
            unit: unit,
            qty : qty
        })
       res.status(201).json({ message: "Measurements added"})
       next()
    } catch (err) {
        console.log(err)
        res.status(404).json({ message: "Error in measures"})
    }
}

exports.getMeasuresById = (req, res, next) => {
    const { id } = req.params;
    console.log(id)
    try {
        const measure = Measures.findOne({ where : {id : id}})
        console.log(measure)
    } catch (e) {
        console.log(e)
    }
}

exports.deleteMeasuresById = async (req, res, next) => {
    const { id } = req.params;
        try {
            const measure = await Measures.destroy({ where : {id : id}})
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
        const measure =  Measures.destroy({ where : {id : id}})
        res.sendStatus(200)
    } catch (e) {
       console.log(e)
    }
    //add new data
    // const data = {
    //     id: 123456,
    //     quote_id: 1,
    //     name: 'Tool',
    //     qty: 10,
    //     unit: 2,
    // }
 

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