const logger = require("../../util/log_utils");
const db = require("../../models");
const {Inspections} = db;
// const {QuoteStatus} = require("../service/QuoteStatus");
exports.fetchAllInspectionData = async (req, res, next) => {
    logger.info(`Inspections : Inside fetchAllInspectionData`);
    const inspections = await Inspections.findAndCountAll({ attributes: ["id", "name", "cost"]});
    const result = {};
    result.inspections = inspections;
    // result.quoteStatus = QuoteStatus.getAllQuotesStatus();
    res.status(200).send(result);
    logger.info(`Inspections : Exit fetchAllInspectionData`);
}

exports.getOneInspection = async (req, res, next) =>{
    logger.info(`Inspections : Inside getOneInspection`);
    const {id} = req.params;
    const inspections = await Inspections.findOne({ attributes: ["id", "name", "cost"], where: {id: id}});
    const result = {};
    result.inspections = inspections;
    res.status(200).send(result);
    logger.info(`Inspections : Exit getOneInspection`);
}

exports.createInspection = async (req, res, next) => {
    logger.info(`Inspections : Inside createInspection`);
    const {name, cost} = req.body;
    try {
        await Inspections.create({
            name: name,
            cost: cost,
        });
        res.status(201).json({message: "Inspections created!", data: req.body});
    } catch (err) {
        logger.error(err);
        next(err);
    }
    logger.info(`Inspections : Exit createInspection`);
}

exports.updateInspection = async (req, res, next) => {
    logger.info(`Inspections : Inside updateInspection`);
    const {name, cost} = req.body;
    const {id} = req.params;
    const inspection = await Inspections.findOne({where: {id : id }})
    if (inspection) {
        try {
            await Inspections.update({
                name: name,
                cost: cost,
            },
            {where: {id : id }});
            res.status(201).json({message: "Inspections updated!", data: req.body});
        } catch (err) {
            logger.error(err);
            next(err);
        }
    } else {
        res.status(400).json({message: "Inspection is not available!"});
    }
    logger.info(`Inspections : Exit updateInspection`);
}