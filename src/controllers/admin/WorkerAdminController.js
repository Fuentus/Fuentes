const db = require('../../models');
const {Workers, Professions} = db;

const logger = require("../../util/log_utils");
const {validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const {Op} = require("sequelize");
const {getPagination, getPagingData} = require("../service/PaginationService");
const {getAllWorkers} = require("../service/WorkerService");

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
    logger.debug(`Workers : Inside deleteWorkersById`);
    const {id} = req.params
    const workers = Workers.destroy({where: {id: id}})
        .then((workers) => {
            res.sendStatus(200)
        }).catch((err) => {
            console.log(err)
        })
    logger.debug(`Workers : Exit deleteWorkersById`);
}

exports.updateWorkersbyId = async (req, res) => {
    printLog(`Workers : Inside updateWorkersbyId`);

    printLog(`Workers : Exit updateWorkersbyId`);
}
