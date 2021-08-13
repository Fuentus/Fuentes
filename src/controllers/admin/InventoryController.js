const db = require('../../models');
const {Inventory,inv_operations: InvOperations} = db;

const logger = require("../../util/log_utils");
const {validationResult} = require("express-validator");
const {Op} = require("sequelize");
const {getPagination, getPagingData} = require("../service/PaginationService");
const {fetchInventoryByClause,getAllInventories} = require("../service/InventoryService");

exports.createInventory = async (req, res, next) => {
    logger.debug(`Inventory : Inside createInventory`);
    const {itemName, itemDesc, availability, cost, supplier_email, operations} = req.body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422)
            .json({message: "Validation failed", data: errors.array()});
    }
    const result = await db.sequelize
        .transaction(async (t) => {
            const inventory = await Inventory.create({
                itemName: itemName,
                itemDesc: itemDesc,
                availability: availability,
                cost: cost,
                supplierInfo: supplier_email
            }, {transaction: t});
            if (operations) {
                operations.map((item) => {
                    item.inv_id = inventory.id;
                    item.operation_id = item.id;
                    item.req_avail = 0;
                    return item;
                })
                const invOperationBulk = await InvOperations.bulkCreate(operations, {transaction: t})
                logger.info(`Inserted ${invOperationBulk.length} items to InvOperations`);
            }
            return Inventory;
        }).catch(function (err) {
            logger.error(err)
            return null;
        });

    if (result) {
        res.status(201).json({message: "Inventory created!", data: req.body});
    } else {
        const err = new Error("Please try back Later");
        err.statusCode = 500;
        next(err);
    }
    logger.debug(`Inventory : Exit createInventory`);
}

exports.findAllInventory = (req, res, next) => {
    logger.debug(`Inventory : Inside findAllInventory`);
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
    getAllInventories(obj, whereClause, success, failure);
    logger.debug(`Inventory : Exit findAllInventory`);
}

exports.findInventoryById = async (req, res, next) => {
    logger.info(`Inventory : Inside findInventoryById`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({
            message: "Validation failed",
            data: errors.array()
        });
    }
    const {id} = req.params;
    const whereClause = {id: id};
    const quote = await fetchInventoryByClause(whereClause);
    res.status(200).send(quote);
    logger.info(`Inventory : Exit findInventoryById`);
}

exports.deleteInventory = async (req, res, next) => {
    logger.info(`Inventory : Inside deleteInventory`);
    const {id} = req.params;
    const included = await InvOperations.findOne({where: {inv_id: id}})
    if (included) {
        res.status(400).send(`Inventory cannot be deleted as it is used in Operation ${included.dataValues.operation_id}`)
    } else {
        const result = await db.sequelize.transaction(async (t) => {
            return await Inventory.destroy(
                {where: {id: id}, force: true},
                {transaction: t}
            );
        });
    
        const obj = {};
        obj.message = "Inventory Deleted Successfully";
        obj.updatedRecord = result;
        res.status(200).send(obj);
    }
    logger.info(`Inventory : Exit deleteInventory`);
}

exports.updateInventory = async (req, res, next) => {
    logger.info(`Inventory : Inside updateInventory`);
    const {id} = req.params;
    const {itemName, itemDesc, availability, cost, supplier_email} = req.body
    const inventory = await Inventory.findOne({where: {id : id }})
    if(inventory) {
        
            const result = await db.sequelize.transaction(async (t) => {
            const inventory = await Inventory.update({
                itemName: itemName,
                itemDesc: itemDesc,
                availability: availability,
                cost: cost,
                supplierInfo: supplier_email
            },{where: {id: id}}, {transaction: t});
            return inventory;
            })
         .catch ((error) => {
            logger.error(error)
            return null
        });
        if (result) {
            res.status(200).json({message: "Inventory updated!", data: req.body});
        } else {
            const err = new Error("Please try back Later");
            err.statusCode = 500;
            next(err);
        }
    } else {
        return res.status(400).json({message: 'Inventory Doesnot Exists'})
    }
    logger.info(`Inventory : Exit updateInventory`);
}
