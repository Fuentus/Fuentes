const db = require('../models/');
const printLog = require('../util/fuentus_util');
const Workers = db.Workers;


exports.getWorkers = (req, res, next) => {
    printLog(`Workers : Inside getWorkers`);
    const workers = Workers.findAndCountAll()
    .then((workers) => {
        res.status(200).send(workers)
    }).catch((err) => {
        console.log(err)
    })
    printLog(`Workers : Exit getWorkers`);
}

exports.createWorkers = async(req, res, next) => {
    printLog(`Workers : Inside createWorkers`);
    const { w_name, w_email, w_phone, w_address, w_status, p_id, w_operations, OperationId, ProjectId } = req.body
    try {
       let worker = await Workers.create({
            w_name: w_name,
            w_email: w_email,
            w_phone : w_phone,
            w_address : w_address,
            w_status : w_status,
            ProjectId : p_id,
            w_operations : w_operations,
            OperationId : OperationId,
            ProjectId: ProjectId
        })
       res.status(201).json({ message: "Worker added"})
       next()
    } catch (err) {
        console.log(err)
        res.status(404).json({ message: "Error in creating workers"})
    }
    printLog(`Workers : Exit createWorkers`);
}

exports.getWorkersById = (req, res, next) => {
    printLog(`Workers : Inside getWorkersById`);
    const { id } = req.params
    const workers = Workers.findOne({ where : {id : id}})
    .then((workers) => {
        res.send(workers).status(200)
    }).catch((err) => {
        console.log(err)
    })
    printLog(`Workers : Exit getWorkersById`);
}

exports.deleteWorkersById = async (req, res, next) => {
    printLog(`Workers : Inside deleteWorkersById`);
    const { id } = req.params
    const workers = Workers.destroy({ where : {id : id}})
    .then((workers) => {
        res.sendStatus(200)
    }).catch((err) => {
        console.log(err)
    })
    printLog(`Workers : Exit deleteWorkersById`);
}

exports.updateWorkersbyId = async (req, res) => {
    printLog(`Workers : Inside updateWorkersbyId`);

    printLog(`Workers : Exit updateWorkersbyId`);
}
