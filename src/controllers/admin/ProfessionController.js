const {logger} = require("../../util/log_utils");
exports.getWorkers = (req, res, next) => {
    logger.debug(`Workers : Inside getWorkers`);
    const workers = Workers.findAndCountAll()
        .then((workers) => {
            res.status(200).send(workers)
        }).catch((err) => {
            console.log(err)
        })
    logger.debug(`Workers : Exit getWorkers`);
}