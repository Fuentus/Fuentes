const db = require('../models');
const printLog = require('../util/fuentus_util');
const Operations = db.Operations;

exports.createOperation = async (req, res, next) => {
    printLog(`Operations : Inside createOperation`);
    const { o_name, o_desc, workers_req } = req.body
    try {
        const operation = await Operations.create({
            o_name : o_name,
            o_desc : o_desc,
            workers_req : workers_req
        })
        res.status(201).json({ message : 'operation created' })
        next()
    } catch (err) {
        console.log(err)
        next(err)
    }
    printLog(`Operations : Exit createOperation`);
}

exports.getOperation = (req, res, next) => {
    printLog(`Operations : Inside getOperation`);
    const getPagination = (page, size) => {
        const limit = size ? +size : 3;
        const offset = page ? page * limit : 0;
        return { limit, offset };
      };
      const getPagingData = (data, page, limit) => {
        const { count: totalItems, rows: operations } = data;
        const currentPage = page ? +page : 0;
        const totalPages = Math.ceil(totalItems / limit);
        return { totalItems, operations, totalPages, currentPage };
      };
      const { page, size } = req.query;
      const { limit, offset } = getPagination(page, size);
      Operations.findAndCountAll({ where: null, limit, offset })
        .then((data) => {
          const response = getPagingData(data, page, limit);
          res.send(response);
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || "Error occurred while retrieving",
          });
        });
    printLog(`Operations : Exit getOperation`);
}

exports.getOneOperation = (req, res, next) => {
    printLog(`Operations : Inside getOneOperation`);
    const { id } = req.params
    const operation = Operations.findOne({where : {id : id}})
    .then((operation) => {
        res.status(200).send(operation)
    }).catch((err) => {
        console.log(err)
    })
    printLog(`Operations : Exit getOneOperation`);
}

exports.deleteOperation = async (req, res, next) => {
    printLog(`Operations : Inside deleteOperation`);
    const { id } = req.params
    try {
        const operation = await Operations.destroy({where : { id : id }})
        res.sendStatus(200)
        next()
    } catch (err) {
        res.status(404).send({ message: 'Error'})
        console.log(err)
        next()
    }
    printLog(`Operations : Exit deleteOperation`);
}

exports.updateOperation = (req, res, next) => {
    printLog(`Operations : Inside updateOperation`);


    printLog(`Operations : Exit updateOperation`);
}
