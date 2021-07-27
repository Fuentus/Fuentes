const db = require('../../models');
const logger = require("../../util/log_utils");
const {Op} = require("sequelize");
const {getPagination, getPagingData} = require("../service/PaginationService");
const {getAllOperations, fetchOperationsByClause} = require("../service/OperationService");
const {validationResult} = require("express-validator");
const {Operations, inv_operations: InvOperations, worker_operations: WorkerOperations} = db;

exports.createOperation = async (req, res, next) => {
    logger.debug(`Operations : Inside createOperation`);
    // Item is inventory here , expecting id od inv and required quantity
    const {name, desc, items, workers} = req.body
    const result = await db.sequelize
        .transaction(async (t) => {
            let operations = await Operations.create({name: name, desc: desc}, {transaction: t});
            if(items) {
                items.map((item) => {
                    item.inv_id = item.id;
                    item.operation_id = operations.id;
                    item.req_avail = item.required_qty;
                    return item;
                })
                const invOperationBulk = await InvOperations.bulkCreate(items, {transaction: t})
                logger.info(`Inserted ${invOperationBulk.length} items to InvOperations`);
            }
            if(workers) {
                workers.map((worker) => {
                    worker.worker_id = worker.id;
                    worker.operation_id = operations.id;
                    worker.avail_per_day = worker.required_hrs;
                    // worker.est_cost = worker.est_cost; //Implicit
                    return worker;
                });
                const workerOperationBulk = await WorkerOperations.bulkCreate(workers, {transaction: t})
                logger.info(`Inserted ${workerOperationBulk.length} items to WorkerOperations`);
            }
            return operations;
        })
        .catch(function (err) {
            logger.error(err)
            return null;
        });
    if (result) {
        res.status(201).json({message: "Operations created!", data: req.body});
    } else {
        const err = new Error("Please try back Later");
        err.statusCode = 500;
        next(err);
    }
    logger.debug(`Operations : Exit createOperation`);
}

exports.findAllOperations = (req, res) => {
    logger.debug(`Operations : Inside findAllOperations`);
    let {updatedAt} = req.query;
    updatedAt = updatedAt ? updatedAt : 0;
    const whereClause = {updatedAt: {[Op.gt]: updatedAt}};
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
    getAllOperations(obj, whereClause, success, failure);
    logger.debug(`Operations : Exit findAllOperations`);
}

exports.findByOperationId = async (req, res, next) => {
    logger.info(`Operations : Inside findByOperationId`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({
            message: "Validation failed",
            data: errors.array()
        });
    }
    const {id} = req.params;
    const whereClause = {id: id};
    const quote = await fetchOperationsByClause(whereClause);
    res.status(200).send(quote);
    logger.info(`Quotes : Exit findByOperationId`);
}

exports.deleteOperation = async (req, res, next) => {
    logger.debug(`Operations : Inside deleteOperation`);
    //TODO Check in Project Operations Exists if not delete it else through error

    logger.debug(`Operations : Exit deleteOperation`);
}

exports.updateOperation = (req, res, next) => {
    logger.debug(`Operations : Inside updateOperation`);

    logger.debug(`Operations : Exit updateOperation`);
}
