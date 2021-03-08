const db = require('../models/');
const Measures = db.Measures;


exports.getMeasures = async (req, res, next) => {
    console.log('hi')
    try {
        const measures = await Measures.findAndCountAll()
        res.status(200).send(measures)
    } catch (e) {
        console.log(e)
    }
}

exports.createMeasures = async(req, res, next) => {
    const { name, unit, qty } = req.body
    try {
       let measure = await req.quote.createMeasures({ 
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

exports.getMeasuresById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const measures = await Measures.findOne({ where : {id : id}})
        res.status(200).send(measures)
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