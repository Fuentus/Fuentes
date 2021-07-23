const {logger} = require("../../util/log_utils");
const db = require("../../models");
const {Professions} = db;

exports.fetchAllMasterData = async (req, res, next) => {
    logger.debug(`MasterData : Inside MasterData`);
    const professions = await Professions.findAndCountAll({ attributes: ["id", "name"]});
    const result = {};
    result.professions = professions;
    res.status(200).send(result);
    logger.debug(`MasterData : Exit MasterData`);
}