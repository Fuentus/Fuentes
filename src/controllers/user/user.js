const db = require('../../models');
const logger = require('../../util/log_utils');
const { Users } = db;
const {Op} = require("sequelize");

exports.updateUser = async (req, res) => {
    logger.debug(`Customers : Inside updateCustomerById`);
    const {name, email, phone, address} = req.body;
    await Users.findOne({where: {id : {[Op.eq]: req.user.id} }})
    .then(() => {
        Users.update( 
            {name: name, email: email, phone: phone, address: address},
            {where: {id : {[Op.eq]: req.user.id} }}
       )
       res.status(200).json({message: 'Updated', data: req.body})
    }).catch((err) => {
        logger.error(err);
        next(err);
    })
    logger.debug(`Customers : Exit updateCustomerById`);
}