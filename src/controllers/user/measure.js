const db = require('../../models');
const printLog = require('../../util/log_utils');
const Measures = db.Measures;
const {validationResult} = require("express-validator");

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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422)
            .json({message: "Validation failed", data: errors.array()});
    }
    const { name, unit, qty, QuoteId } = req.body
    try {
       let measure = await Measures.create({
            name: name,
            unit: unit,
            qty : qty,
            QuoteId : QuoteId
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422)
            .json({message: "Validation failed", data: errors.array()});
    }
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
    const { id } = req.params;
        try {
            const measure = await Measures.destroy({ where : {id : id}})
            res.status(200)
        } catch (e) {
           console.log(e)
        }
    const { name, unit, qty, QuoteId } = req.body
        try {
           let measure = await Measures.create({
                name: name,
                unit: unit,
                qty : qty,
                QuoteId : QuoteId
            })
           res.status(201).json({ message: "Measurements added"})
           next()
        } catch (err) {
            console.log(err)
            res.status(404).json({ message: "Error in measures"})
        }
    printLog(`Exit : Inside updateMeasuresbyId`);
}