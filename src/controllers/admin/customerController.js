const db = require('../../models');
const logger = require('../../util/log_utils');
const { getAllCustomers } = require('../service/CustomerService');
const { getPagination, getPagingData } = require("../service/PaginationService");
const { Users, Quotes } = db;


const findAllCustomers = (req, res, whereClause) => {
    const {page, size} = req.query;
    const obj = getPagination(page, size);
    const failure = (err) => {
        logger.error(err);
        res.status(500).send({
            message: err.message || "Error occurred while retrieving",
        });
    };

    const success =  (data) => {
        data.rows.map((user) => {
            user.dataValues.Quotes = user.dataValues.Quotes.length
        })
        
        const response = getPagingData(data, page, obj.limit);
        res.send(response);
    };
    getAllCustomers(obj, whereClause, success, failure);
}

exports.getAllCustomers = (req, res) => {
    logger.debug(`Customers : Inside getAllCustomers`);
    const whereClause = {role: "USER"};
    findAllCustomers(req, res, whereClause);
    logger.debug(`Customers : Exit getAllCustomers`);
}

exports.getCustomersById = async(req, res) => {
    logger.debug(`Customers : Inside getCustomersById`);
    const {id} = req.params

    await Users.findOne({
        where: {id: id, role: "USER"},
        attributes: {exclude: ['password', 'firstTime']}
    })
        .then(async (users) => {
            res.send(users).status(200)
        }).catch((err) => {
        console.log(err)
    })
    logger.debug(`Customers : Exit getCustomersById`);
}

// exports.deleteCustomersById = async (req, res) => {
//     logger.debug(`Customers : Inside deleteCustomersById`);
//     const {id} = req.params;
//     const result = await db.sequelize.transaction(async (t) => {
//         await Quotes.destroy(
//             {where: {UserId: id}, force: true},
//             {transaction: t}
//         )
//         return await Users.destroy({
//             where: {id: id, role: "USER"}
//         })
//     });
//     const obj = {};
//     obj.message = "User Deleted Successfully";
//     obj.updatedRecord = result;
//     res.status(200).send(obj);
//     logger.debug(`Customers : Exit deleteCustomersById`);
// }

exports.deleteCustomersById = async (req, res) => {
    logger.debug(`Customers : Inside deleteCustomersById`);
    const {id} = req.params;
    const quote = await Quotes.findOne({where: {UserId : id }});
    if(quote) {
        res.status(400).send({ message: `Customer cannot be deleted as Some Quote belongs to customer`})
    } else {
        const result = await db.sequelize.transaction(async (t) => {
            return await Users.destroy({
                where: {id: id, role: "USER"}
            })
        });
        const obj = {};
        obj.message = "User Deleted Successfully";
        obj.updatedRecord = result;
        res.status(200).send(obj);
    }  
    logger.debug(`Customers : Exit deleteCustomersById`);
}

exports.updateCustomerById = async (req, res) => {
    logger.debug(`Customers : Inside updateCustomerById`);
    const {id} = req.params;
    const {name, phone, address} = req.body;
    const customer = await Users.findOne({where: {id : id }})
    if(customer) {
        try {
            Users.update( 
                {name: name, phone: phone, address: address},
                {where: {id : id }}
           )
           res.status(200).json({message: 'Updated Customer', data: req.body})
        } catch (err) {
            logger.error(err);
            next(err);
        }
    } else {
        return res.status(400).json({message: 'Customer Doesnot Exists'})
    }
    logger.debug(`Customers : Exit updateCustomerById`);
}