const db = require('../../models');
const {project_workers_log: ProjectWorkerLog} = db;
const logger = require("../../util/log_utils");
const {Op} = require("sequelize");
const {getPagination, getPagingData} = require("../service/PaginationService");
const {getAllProjects} = require("../service/WorkerService");


exports.findAllProjects = (req, res, next) => {
    logger.debug(`Workers : Inside findAllProjects`);
    const {page, size} = req.query;
    const obj = getPagination(page, size);
    const failure = (err) => {
        logger.error(err);
        res.status(500).send({
            message: err.message || "Error occurred while retrieving",
        });
    };
    const success = (data) => {
        const response = getPagingData(data, page, obj.limit);
        res.send(response);
    };
    console.log(`WorkerId ${req.workerId}`)
    const whereClause = {worker_id: {[Op.eq]: req.workerId}};
    getAllProjects(obj, whereClause, success, failure);
    logger.debug(`Workers : Exit findAllProjects`);
}

exports.logDailyWork = async (req, res, next) => {
    logger.debug(`Workers : Log Daily Works`);
    const {logDailyWork} = req.body;
    const result = await db.sequelize
        .transaction(async (t) => {
            const dailyWorks = [...logDailyWork];
            dailyWorks.map((l) => {
                const {logDate, hoursSpent, tag_workers_project_id} = l
                l.log_date = logDate;
                l.hrs_spent = hoursSpent;
                l.tag_workers_project_operation_id = tag_workers_project_id;
            })
            const bulk = await ProjectWorkerLog.bulkCreate(dailyWorks, {transaction: t})
            logger.info(`Inserted ${bulk.length} items to Project Daily Work`);
            return bulk;
        }).catch(function (err) {
            logger.error(err)
            return null;
        });

    if (result) {
        res.status(201).json({message: "Log Daily Works!", data: req.body});
    } else {
        const err = new Error("Please try back Later");
        err.statusCode = 500;
        next(err);
    }
    logger.debug(`Workers : Exit Log Daily Works`);
}