const logger = require("../../util/log_utils");
const db = require("../../models");
const {Inspections, quote_operations: QuoteOperations} = db;
// const {QuoteStatus} = require("../service/QuoteStatus");
exports.fetchAllInspectionData = async (req, res, next) => {
    logger.info(`Inspections : Inside fetchAllInspectionData`);
    const inspections = await Inspections.findAndCountAll({ attributes: ["id", "name", "cost", "desc"]});
    const result = {};
    result.inspections = inspections;
    // result.quoteStatus = QuoteStatus.getAllQuotesStatus();
    res.status(200).send(result);
    logger.info(`Inspections : Exit fetchAllInspectionData`);
}

exports.getOneInspection = async (req, res, next) =>{
    logger.info(`Inspections : Inside getOneInspection`);
    const {id} = req.params;
    const inspections = await Inspections.findOne({ attributes: ["id", "name", "cost", "desc"], where: {id: id}});
    const result = {};
    result.inspections = inspections;
    res.status(200).send(result);
    logger.info(`Inspections : Exit getOneInspection`);
}

exports.createInspection = async (req, res, next) => {
    logger.info(`Inspections : Inside createInspection`);
    const {name, cost, desc} = req.body;
    try {
        await Inspections.create({
            name: name,
            cost: cost,
            desc: desc
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
    const {name, cost, desc} = req.body;
    const {id} = req.params;
    const inspection = await Inspections.findOne({where: {id : id }})
    if (inspection) {
        try {
            await Inspections.update({
                name: name,
                cost: cost,
                desc: desc
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

exports.deleteInspection = async (req, res, next) => {
    logger.info(`Inspections : Inside deleteInspection`);
    const {id} = req.params;
    const inQuotes = await QuoteOperations.findOne({where: {inspection_id : id }})
    if (inQuotes) {
        res.status(400).send("Inspection Can't Be deleted as it is assigned to Quote Operations")
    } else {
        const result = await db.sequelize.transaction(async (t) => {
            return await Inspections.destroy(
                {where: {id: id}, force: true},
                {transaction: t}
            );
        });
        const obj = {};
        obj.message = "Inspections Deleted Successfully";
        obj.updatedRecord = result;
        res.status(200).send(obj);
    }
    logger.info(`Inspections : Exit deleteInspection`);
}