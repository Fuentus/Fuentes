const db = require('../../models');
const logger = require('../../util/log_utils');
const { Users } = db;
const {Op} = require("sequelize");
const { fetchCustomersByClause } = require('../service/CustomerService');

exports.updateUser = async (req, res) => {
    logger.debug(`Customers : Inside updateCustomerById`);
    const {name, phone, address} = req.body;
    await Users.findOne({where: {id : {[Op.eq]: req.user.id} }})
    .then(() => {
        Users.update( 
            {name: name, phone: phone, address: address},
            {where: {id : {[Op.eq]: req.user.id} }}
       )
       res.status(200).json({message: 'Updated', data: req.body})
    }).catch((err) => {
        logger.error(err);
        next(err);
    })
    logger.debug(`Customers : Exit updateCustomerById`);
}

exports.getUserProfile = (req, res) => {
    logger.info(`Customers : Inside getUserProfile`);
    const id = req.user.id;
    const whereClause = {id: id};
    fetchCustomersByClause(whereClause)
    .then((user) => {
        res.send(user).status(200)
    }).catch((err) => {
        logger.error(err);
        next(err);
    })
    logger.info(`Customers : Exit getUserProfile`);
}