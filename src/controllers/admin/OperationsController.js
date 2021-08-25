const db = require('../../models');
const logger = require("../../util/log_utils");
const {Op} = require("sequelize");
const {getPagination, getPagingData} = require("../service/PaginationService");
const {getAllOperations, fetchOperationsByClause} = require("../service/OperationService");
const {validationResult} = require("express-validator");
const inv_operations = require('../../models/inv_operations');
const {Inventory, Worker, Operations, inv_operations: InvOperations, worker_operations: WorkerOperations, quote_operations: QuoteOperation} = db;

exports.createOperation = async (req, res, next) => {
    logger.debug(`Operations : Inside createOperation`);
    // Item is inventory here , expecting id od inv and required quantity
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422)
            .json({message: "Validation failed", data: errors.array()});
    }
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
    logger.info(`Operations : Exit findByOperationId`);
}

exports.deleteOperation = async (req, res, next) => {
    logger.debug(`Operations : Inside deleteOperation`);
    //TODO Check in Project Operations Exists if not delete it else through error
    const {id} = req.params;
    let included = await QuoteOperation.findOne({where: {operation_id: id}})
    if (included) {
        res.status(400).send(`Operation cannot be deleted as Operation is assigned to Quote ${included.dataValues.quote_id}`)
    } else {
        const result = await db.sequelize.transaction(async (t) => {
            await InvOperations.destroy(
                {where: {operation_id: id}, force: true},
                {transaction: t}
            );
            await WorkerOperations.destroy(
                {where: {operation_id: id}, force: true},
                {transaction: t}
            );
            return await Operations.destroy(
                {where: {id: id}, force: true},
                {transaction: t}
            );
        });
        const obj = {};
        obj.message = "Operations Deleted Successfully";
        obj.updatedRecord = result;
        res.status(200).send(obj);
        logger.debug(`Operations : Exit deleteOperation`);
    }
}

exports.updateOperation = async (req, res, next) => {
    logger.info(`Operations : Inside updateOperation`);
    const {id} = req.params;
    const {name, desc, items, workers} = req.body
    const operation = await Operations.findOne({where: {id : id }})
    if(operation) {
            const result = await db.sequelize.transaction(async (t) => {
                let operation = await Operations.update({name: name, desc: desc}, {where: {id : id }}, {transaction: t});
                               
                if(items) {
                    const inventory = []
                    items.map(async (item) => {
                                    const inv = await InvOperations.findOne({where: {operation_id : id, inv_id: item.id }})
                                    if (!inv) {
                                        let addInv = await InvOperations.create({req_avail: item.required_qty, operation_id : id, inv_id: item.id });
                                        inventory.push(addInv);
                                    } else {
                                        let updateInv = await InvOperations.update({req_avail: item.required_qty}, {where: {operation_id : id, inv_id: item.id }}, {transaction: t});
                                        inventory.push(updateInv);
                                    }      
                    })  



                    // const inv = await InvOperations.findOne({where: {operation_id : id, inv_id: item.id }})
                    //                 const inventories = await InvOperations.findAndCountAll({where: {operation_id : id}})
                    //                 for(let i = 0; i < inventories.count; i++) {
                    //                     let invId = inventories.rows[i].dataValues.inv_id;
                    //                     if(invId !== item.id) {
                    //                         let delInv = await InvOperations.destroy({where: {operation_id : id, inv_id: invId}});
                    //                         inventory.push(delInv);
                    //                     }
                    //                 }

                    //                 // inventories.rows.map((inventory) => {
                    //                 //     console.log("test")
                    //                 // })

                    //                 if (!inv) {
                    //                     let addInv = await InvOperations.create({req_avail: item.required_qty, operation_id : id, inv_id: item.id });
                    //                     inventory.push(addInv);
                    //                 } 
                    //                 else {
                    //                     let updateInv = await InvOperations.update({req_avail: item.required_qty}, {where: {operation_id : id, inv_id: item.id }}, {transaction: t});
                    //                     inventory.push(updateInv);
                    //                 }  
                    // logger.info(`Updated ${inventory.length} inventory field of Operations`);
                }
                if(workers) {
                    const workersAvailable = []
                    workers.map(async (worker) => {
                        const workerOpr = await WorkerOperations.findOne({where: {operation_id: id, worker_id: worker.id}})
                        if (!workerOpr) {
                            let createWorker = await WorkerOperations.create({avail_per_day: worker.required_hrs, operation_id : id, worker_id: worker.id, est_cost: worker.est_cost});
                            workersAvailable.push(createWorker);
                        } else {
                            let updateWorker = await WorkerOperations.update({avail_per_day: worker.required_hrs}, {where: {operation_id : id, worker_id: worker.id }}, {transaction: t});
                            workersAvailable.push(updateWorker);
                        }
                        
                    });
                    logger.info(`Updated ${workersAvailable.length} worker field of Operations`);     
                }
                return operation;
            })
        .catch ((error) => {
            logger.error(error)
            return null
        });
        if (result) {
            res.status(200).json({message: "Operation updated!", data: req.body});
        } else {
            const err = new Error("Please try back Later");
            err.statusCode = 500;
            next(err);
        }
    } else {
        return res.status(400).json({message: 'Operation Doesnot Exists'})
    }
    logger.info(`Operations : Exit updateOperation`);
}
