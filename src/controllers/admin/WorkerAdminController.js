const db = require('../../models');
const {Workers, Professions, 
       project_workers: ProjectWorkers, 
       worker_operations: WorkerOperations,
       quote_operation_workers:QuoteOperationWorkers} = db;

const logger = require("../../util/log_utils");
const {validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const {Op, where} = require("sequelize");
const {getPagination, getPagingData} = require("../service/PaginationService");
const {getAllWorkers} = require("../service/WorkerService");
const worker_operations = require('../../models/worker_operations');

const findAllWorkers = (req, res, whereClause) => {
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
    getAllWorkers(obj, whereClause, success, failure);
}

exports.getAllWorkers = (req, res) => {
    logger.debug(`Workers : Inside getWorkers`);
    let {updatedAt} = req.query;
    updatedAt = updatedAt ? updatedAt : 0;
    const whereClause = {updatedAt: {[Op.gt]: updatedAt}};
    findAllWorkers(req, res, whereClause);
    logger.debug(`Workers : Exit getWorkers`);
}
exports.getAllWorkersByProfessionId = (req, res) => {
    logger.debug(`Workers : Inside getWorkers`);
    let {updatedAt} = req.query;
    const {professionId} = req.params
    updatedAt = updatedAt ? updatedAt : 0;
    const whereClause = {updatedAt: {[Op.gt]: updatedAt}, ProfessionId: {[Op.eq]: professionId}};
    findAllWorkers(req, res, whereClause);
}

exports.createWorkers = async (req, res, next) => {
    logger.debug(`Workers : Inside createWorkers`);
    const {name, phone, address, email, avail_per_day, cost_per_hr, total_avail_per_week, professionId} = req.body
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422)
                .json({message: "Validation failed", data: errors.array()});
        }
        const profession = await Professions.findByPk(professionId)
        const password = "FUENTUS@123";
        const pas = await bcrypt.hash(password, 12);
        await profession.createWorker({
            name,
            phone,
            address,
            email,
            avail_per_day,
            cost_per_hr,
            total_avail_per_week,
            firstTime: true,
            password: pas
        });
        res.status(200).json({message: 'Created Worker', data: req.body})
    } catch (err) {
        logger.error(err);
        next(err);
    }
    logger.debug(`Workers : Exit createWorkers`);
}

exports.getWorkersById = (req, res) => {
    logger.debug(`Workers : Inside getWorkersById`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422)
            .json({message: "Validation failed", data: errors.array()});
    }
    const {id} = req.params
    Workers.findOne({
        where: {id: id},
        attributes: {exclude: ['password', 'firstTime']}
    })
        .then((workers) => {
            res.send(workers).status(200)
        }).catch((err) => {
        console.log(err)
    })
    logger.debug(`Workers : Exit getWorkersById`);
}

exports.deleteWorkersById = async (req, res) => {
    //TODO dont delete any workers who are associated to any projects
    logger.debug(`Workers : Inside deleteWorkersById`);
    const {id} = req.params;
    // let includedInOpr = await WorkerOperations.findOne({where: {worker_id: id}})
    let includedInQuote = await QuoteOperationWorkers.findOne({where: {worker_id: id}})
    let includedInProject = await ProjectWorkers.findOne({where: {worker_id: id}})
    if (includedInQuote) {
        res.status(400).send({ message: `Worker cannot be deleted as worker is assigned in Quote` })
    } else if (includedInProject) {
        res.status(400).send({ message: `Worker cannot be deleted as worker is assigned in Project` })
    } else {
            const result = await db.sequelize.transaction(async (t) => {
                return await Workers.destroy(
                    {where: {id: id}, force: true},
                    {transaction: t}
                );
            });
            const obj = {};
            obj.message = "Worker Deleted Successfully";
            obj.updatedRecord = result;
            res.status(200).send(obj);
    }
    logger.debug(`Workers : Exit deleteWorkersById`);
}

exports.updateWorkersbyId = async (req, res) => {
    logger.debug(`Workers : Inside updateWorkersbyId`);
    const {id} = req.params;
    const {name, phone, address, email, avail_per_day, cost_per_hr, total_avail_per_week, professionId} = req.body
    const profession = await Professions.findByPk(professionId)
    const password = "FUENTUS@123";
    const pas = await bcrypt.hash(password, 12);
    const worker = await Workers.findOne({where: {id : id }})
    if(worker) {
        try {
            Workers.update({
                            name: name,
                            phone: phone,
                            address: address,
                            //email: email,
                            avail_per_day: avail_per_day,
                            cost_per_hr: cost_per_hr,
                            total_avail_per_week: total_avail_per_week,
                            //password: pas
                        },
                            {where: {id : id }})
                        res.status(200).json({message: 'Updated Worker', data: req.body})
        } catch (err) {
            logger.error(err);
            next(err);
        }   
    } else {
        return res.status(400).json({message: 'Worker Doesnot Exists'})
    }
    logger.debug(`Workers : Exit updateWorkersbyId`);
}
