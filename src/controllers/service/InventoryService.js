const db = require("../../models");
const {Operations, inv_operations: InvOperations, Inventory} = db;

const fetchInventoryByClause = async (whereClause) => {
    return (
        (await Inventory.findOne({
            where: whereClause,
            attributes: ["id", "itemName", "itemDesc", "availability","cost","createdAt","updatedAt"],
            include: [
                {
                    model: InvOperations,
                    as: "Inventories",
                    attributes: ["tag_inv_operations_id"],
                    include: [{
                        model: Operations,
                        as: "Operations",
                        attributes: ["id","name"]
                    }],
                }
            ],
        })) || {}
    );
};

const getAllInventories = (obj, whereClause, success, failure) => {
    const {limit, offset} = obj;
    Inventory.findAndCountAll({
        where: whereClause,
        attributes: ["id", "itemName", "itemDesc", "availability","cost","createdAt","updatedAt"],
        include: [
            {
                model: InvOperations,
                as: "Inventories",
                attributes: ["tag_inv_operations_id"],
                include: [{
                    model: Operations,
                    as: "Operations",
                    attributes: ["id","name"]
                }],
            }
        ],
        order: [["updatedAt", "DESC"]],
        limit,
        offset,
    })
        .then((data) => {
            success(data);
        })
        .catch((err) => {
            failure(err);
        });
};

module.exports = {
    fetchInventoryByClause: fetchInventoryByClause,
    getAllInventories: getAllInventories
};