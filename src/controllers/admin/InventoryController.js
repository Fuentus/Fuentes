const db = require('../../models');
const {Inventory,inv_operations: InvOperations} = db;

const {logger} = require("../../util/log_utils");
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

exports.deleteInventory = (req, res, next) => {
    printLog(`Inventory : Inside deleteInventory`);
    const {id} = req.params
    try {
        const inventory = Inventory.destroy({where: {id: id}})
        res.sendStatus(200)
        next()
    } catch (err) {
        console.log(err)
        next(err)
    }
    printLog(`Inventory : Exit deleteInventory`);
}

exports.updateInventory = (req, res, next) => {
    printLog(`Inventory : Inside updateInventory`);


    printLog(`Inventory : Exit updateInventory`);
}
