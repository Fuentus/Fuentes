const logger = require("../../util/log_utils");
const db = require("../../models");
const {Professions} = db;
const {QuoteStatus, QuoteTax} = require("../service/QuoteStatus");


exports.fetchAllMasterData = async (req, res, next) => {
    logger.debug(`MasterData : Inside MasterData`);
    const professions = await Professions.findAndCountAll({ attributes: ["id", "name"]});
    const result = {};
    result.professions = professions;
    result.quoteStatus = QuoteStatus.getAllQuotesStatus();
    result.tax = QuoteTax.taxPercentage();
    res.status(200).send(result);
    logger.debug(`MasterData : Exit MasterData`);
}