const db = require("../../models");
//
// const {logger} = require("../../../util/log_utils");

const {Workers} = db;

const fetchWorkersByClause = async (whereClause) => {
    return (
        (await Workers.findOne({
            where: whereClause,
            attributes: ["name", "phone", "address", "email",
                "avail_per_day", "cost_per_hr", "total_avail_per_week", "createdAt", "updatedAt"],
        })) || {}
    );
};

const getAllWorkers = (obj, whereClause, success, failure) => {
    const {limit, offset} = obj;
    Workers.findAndCountAll({
        where: whereClause,
        attributes: ["name", "phone", "address", "email",
            "avail_per_day", "cost_per_hr", "total_avail_per_week", "createdAt", "updatedAt"],
        order: [["updatedAt", "DESC"]],
        limit,
        offset,
    })
        .then((data) => {
            success(data);
        })
        .catch((err) => {
            failure(err);
        });
};

module.exports = {
    fetchWorkersByClause: fetchWorkersByClause,
    getAllWorkers: getAllWorkers
};