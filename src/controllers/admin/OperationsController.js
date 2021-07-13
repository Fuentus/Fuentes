const db = require('../../models');
const {logger} = require("../../util/log_utils");
const {Operations} = db;

exports.createOperation = async (req, res, next) => {
    logger.debug(`Operations : Inside createOperation`);
    const {name, desc} = req.body
    try {
        const operation = await Operations.create({
            name: name,
            desc: desc
        })
        res.status(201).json({message: 'operation created', data: operation})
    } catch (err) {
        logger.error(err)
        next(err)
    }
    logger.debug(`Operations : Exit createOperation`);
}

exports.findAllOperations = (req, res, next) => {
    logger.debug(`Operations : Inside getOperation`);
    const getPagination = (page, size) => {
        const limit = size ? +size : 3;
        const offset = page ? page * limit : 0;
        return {limit, offset};
    };
    const getPagingData = (data, page, limit) => {
        const {count: totalItems, rows: operations} = data;
        const currentPage = page ? +page : 0;
        const totalPages = Math.ceil(totalItems / limit);
        return {totalItems, operations, totalPages, currentPage};
    };
    const {page, size} = req.query;
    const {limit, offset} = getPagination(page, size);
    Operations.findAndCountAll({where: null, limit, offset})
        .then((data) => {
            const response = getPagingData(data, page, limit);
            res.send(response);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Error occurred while retrieving",
            });
        });
    logger.debug(`Operations : Exit getOperation`);
}

exports.findByOperationId = (req, res, next) => {
    logger.debug(`Operations : Inside getOneOperation`);
    const {id} = req.params
    const operation = Operations.findOne({where: {id: id}})
        .then((operation) => {
            res.status(200).send(operation)
        }).catch((err) => {
            console.log(err)
            next(err);
        })
    logger.debug(`Operations : Exit getOneOperation`);
}

exports.deleteOperation = async (req, res, next) => {
    logger.debug(`Operations : Inside deleteOperation`);
    const {id} = req.params
    try {
        const operation = await Operations.destroy({where: {id: id}})
        res.sendStatus(200)
        next()
    } catch (err) {
        res.status(404).send({message: 'Error'})
        console.log(err)
        next()
    }
    logger.debug(`Operations : Exit deleteOperation`);
}

exports.updateOperation = (req, res, next) => {
    logger.debug(`Operations : Inside updateOperation`);


    logger.debug(`Operations : Exit updateOperation`);
}
