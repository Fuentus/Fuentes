const db = require('../models/');
const printLog = require('../util/fuentis_util');
const Measures = db.Measures;


exports.getMeasures = (req, res, next) => {
    printLog(`Measures : Inside getMeasures`);
    const measures = Measures.findAndCountAll()
    .then((measures) => {
        res.status(200).send(measures)
    }).catch((err) => {
        console.log(err)
    })
    printLog(`Measures : Exit getMeasures`);
}

exports.createMeasures = async(req, res, next) => {
    printLog(`Measures : Inside createMeasures`);
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
    printLog(`Measures : Exit createMeasures`);
}

exports.getMeasuresById = (req, res, next) => {
    printLog(`Measures : Inside getMeasuresById`);
    const { id } = req.params;
    const measures = Measures.findOne({ where : {id : id}})
    .then((measures) => {
        res.status(200).send(measures)
    }).catch((err) => {
        console.log(err)
    })
    printLog(`Measures : Exit getMeasuresById`);
}

exports.deleteMeasuresById = async (req, res, next) => {
    printLog(`Measures : Inside deleteMeasuresById`);
    const { id } = req.params;
        try {
            const measure = await Measures.destroy({ where : {id : id}})
            res.status(200)
        } catch (e) {
           console.log(e)
        }
    printLog(`Measures : Exit deleteMeasuresById`);
}

exports.updateMeasuresbyId = async (req, res) => {
    printLog(`Measures : Inside updateMeasuresbyId`);
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
printLog(`Exit : Inside updateMeasuresbyId`);
}