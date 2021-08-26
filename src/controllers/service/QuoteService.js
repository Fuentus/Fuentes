const db = require("../../models");
//
// const {logger} = require("../../../util/log_utils");

const {
    Quotes, Measures, Uploads, Users, Operations, Inventory,Workers,
    quote_operations: QuoteOperations,
    quote_operation_inv: QuoteOperationInv,
    quote_operation_workers: QuoteOperationWorkers
} = db;

const fetchQuoteByClause = async (whereClause) => {
    return (
        (await Quotes.findOne({
            where: whereClause,
            attributes: ["id", "title", "desc", "startDate", "endDate", "status", "createdAt", "updatedAt", "InspectionId"],
            include: [
                {
                    model: Users,
                    attributes: ["name", "email"],
                },
                {
                    model: Uploads,
                    attributes: ["fileDocument", "fileName", "filePath"],
                },
                {
                    model: Measures,
                    attributes: ["name", "unit", "qty"],
                },
                {
                    model: QuoteOperations,
                    as: "QuoteOperation",
                    attributes: ["tag_quote_operations_id", "operation_total_hrs", "operation_cost"],
                    include: [
                        {
                            model: Operations,
                            as: "Operations",
                            attributes: ["id","name", "desc"]
                        },
                        {
                            model: QuoteOperationInv,
                            as: "QuoteOperationInv",
                            attributes: ["tag_inv_operations_id","quote_operation_id", "req_quantity"],
                            include: [
                                {
                                    model: Inventory,
                                    as: "Inventories",
                                    attributes: ["id", "itemName", "itemDesc", "availability", "cost"]
                                }
                            ]
                        },
                        {
                            model: QuoteOperationWorkers,
                            as: "QuoteOperationWorker",
                            attributes: ["tag_worker_operations_id","quote_operation_id", "total_hrs_req"],
                            include: [
                                {
                                    model: Workers,
                                    as: "Workers",
                                    attributes: ["id", "name", "cost_per_hr", "total_avail_per_week", "avail_per_day", "email"]
                                }
                            ]
                        }
                    ]
                }
            ],
        })) || {}
    );
};

const getAllQuotes = (obj, whereClause, success, failure) => {
    const {limit, offset} = obj;
    Quotes.findAndCountAll({
        where: whereClause,
        attributes: ["id", "title", "desc", "status", "createdAt", "updatedAt", "InspectionId"],
        include: [
            {
                model: Users,
                attributes: ["name", "email"],
            },
            {
                model: Uploads,
                attributes: ["fileName", "filePath"],
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
    fetchQuoteByClause: fetchQuoteByClause,
    getAllQuotes: getAllQuotes
};