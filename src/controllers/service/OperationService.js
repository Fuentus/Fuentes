const db = require("../../models");
const {Operations, inv_operations: InvOperations, worker_operations: WorkerOperations, Inventory} = db;

const fetchOperationsByClause = async (whereClause) => {
    return (
        (await Operations.findOne({
            where: whereClause,
            attributes: ["id", "name", "desc"],
            include: [
                {
                    model: InvOperations,
                    as: "OperationInventories",
                    attributes: ["tag_inv_operations_id", "req_avail"],
                    include: [
                        {
                            model: Inventory,
                            as: "Inventories",
                            attributes: ["id","itemName", "availability"]
                        }],
                    }
            ],
        })) || {}
    );
};

const getAllOperations = (obj, whereClause, success, failure) => {
    const {limit, offset} = obj;
    Operations.findAndCountAll({
        where: whereClause,
        attributes: { 
                include: ["id", "name", "desc", "createdAt", "updatedAt"]
                    },
        include: [
            {
                model: InvOperations,
                as: "OperationInventories",
                attributes: ["tag_inv_operations_id"],
                include: [{
                    model: Inventory,
                    as: "Inventories",
                    attributes: ["itemName"]
                }],
            },
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
    fetchOperationsByClause: fetchOperationsByClause,
    getAllOperations: getAllOperations
};