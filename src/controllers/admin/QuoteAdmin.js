const db = require("../../models");
const {Op} = require("sequelize");
const {validationResult} = require("express-validator");

const {
    Quotes,
    Inventory,
    Projects,
    Tax,
    Inspections,
    quote_operations: QuoteOperations,
    quote_operation_inv: QuoteOperationInv,
    quote_operation_workers: QuoteOperationWorker,
    project_workers: ProjectWorkers
} = db;

const logger = require("../../util/log_utils");
const {fetchQuoteByClause, getAllQuotes} = require("../service/QuoteService")
const {QuoteStatus, QuoteTax} = require("../service/QuoteStatus");
const {getPagination, getPagingData} = require("../service/PaginationService")

exports.findAllQuotesForAdmin = (req, res) => {
    logger.debug(`Quotes : Inside findAllQuotesForAdmin`);
    let {updatedAt} = req.query;
    updatedAt = updatedAt ? updatedAt : 0;
    const whereClause = {updatedAt: {[Op.gt]: updatedAt}, status: {[Op.ne]: "CLOSED"}};
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
    getAllQuotes(obj, whereClause, success, failure);
    logger.debug(`Quotes : Exit findAllQuotesForAdmin`);
};
exports.findQuoteByIdForAdmin = async (req, res, next) => {
    logger.info(`Quotes : Inside findQuoteById`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({
            message: "Validation failed",
            data: errors.array()
        });
    }
    const {id} = req.params;
    const whereClause = {id: id};
    fetchQuoteByClause(whereClause).then((quote) => {
        res.status(200).send(quote)
    }).catch((err) => {
        logger.error(err);
        next(err);
    });
    logger.info(`Quotes : Exit findQuoteById`);
};

exports.changeStatusForAdmin = async (req, res, next) => {
    logger.info(`Quotes : Inside changeStatus of Quote`);
    let {status} = req.body;
    const {id} = req.params;
    const quote = await fetchQuoteByClause({id: id})
    const boolean = QuoteStatus.checkQuotesStatusCanBeUpdated(quote.status, status);
    if (!boolean) {
        return res.status(422).send({msg: `Please Choose Correct Status`});
    }
    Quotes.update({status: status}, {where: {id: id}})
        .then((result) => {
            const obj = {};
            obj.message = "Update Successfully";
            obj.updatedRecord = result.length;
            res.status(200).send(obj);
        })
        .catch((err) => next(err));
    logger.info(`Quotes : Exit changeStatus of Quote`);
};

exports.searchResultsForAdmin = async (req, res, next) => {
    try {
        logger.debug(`Quotes : searchResults`);
        const {search} = req.body;
        const whereClause = {
            title: {
                [Op.like]: `%${search}%`
            }
        };
        const obj = {limit: 100, offset: 0};
        const failure = (err) => {
            res.status(500).send({
                message: err.message || "Error occurred while retrieving",
            });
        };
        const success = (data) => {
            const response = getPagingData(data, 0, obj.limit);
            res.send(response);
        };

        getAllQuotes(obj, whereClause, success, failure);
    } catch (err) {
        logger.error(err);
        next(err);
    }
    logger.debug(`Quotes : Exit searchResults`);
};

exports.tagQuoteAndOperations = async (req, res, next) => {
    logger.info(`Quotes : Inside changeStatus of Quote`);
    const {quoteId, operations, status} = req.body;
    const quote = await Quotes.findByPk(quoteId);
    if (status) {
        const boolean = QuoteStatus.checkQuotesStatusCanBeUpdated(quote.status, status);
        if (!boolean) {
            return res.status(422).send({msg: `Please Choose Correct Status`});
        }
    }
    const result = await db.sequelize.transaction(async (t) => {
        if (operations) {
            operations.map((operation) => {
                operation.operation_id = operation.operationId;
                operation.quote_id = quoteId;
            });
            const quoteOperationBulk = await QuoteOperations.bulkCreate(operations, {transaction: t})
            logger.info(`Inserted ${quoteOperationBulk.length} items to QuoteOperations`);
            const invArr = [], workArr = [];
            for (let i = 0; i < quoteOperationBulk.length; i++) {
                const qBulk = quoteOperationBulk[i];
                const operation = operations[i];
                const {tools: inventoryArr} = operation;
                inventoryArr.map(s => {
                    const {invId, reqQty} = s;
                    s.quote_operation_id = qBulk.tag_quote_operations_id
                    s.inv_id = invId;
                    s.req_quantity = reqQty;
                    return s;
                });
                invArr.push(inventoryArr);
                const {workers: workerArr} = operation;
                workerArr.map(s => {
                    const {workerId, totalHrs} = s;
                    s.quote_operation_id = qBulk.tag_quote_operations_id;
                    s.worker_id = workerId;
                    s.total_hrs_req = totalHrs;
                    return s;
                })
                workArr.push(workerArr);
            }
            const quoteInvOperationArr = invArr.flat(1);
            const quoteInvOperationBulk = await QuoteOperationInv.bulkCreate(quoteInvOperationArr, {transaction: t})
            logger.info(`Inserted ${quoteInvOperationBulk.length} items to QuoteOperationInv`);
            const quoteWorkerOperationArr = workArr.flat(1);
            const quoteWorkerOperationBulk = await QuoteOperationWorker.bulkCreate(quoteWorkerOperationArr, {transaction: t})
            logger.info(`Inserted ${quoteWorkerOperationBulk.length} items to QuoteOperationWorker`);
            if (status) {
                return await Quotes.update({status: status}, {where: {id: quoteId}, transaction: t});
            }
            return operations;
        }
    }).catch(function (err) {
        logger.error(err)
        return null;
    });
    if (result) {
        res.status(201).json({message: "Quote and Operations are Tagged Successfully"});
    } else {
        const err = new Error("Please try back Later");
        err.statusCode = 500;
        next(err);
    }
    logger.info(`Quotes : Exit changeStatus of Quote`);
}




/*edit Tag Operation Logic

if (operation === DB.operation) {
    update operation,
        > inv,
        > update worker
} else {
    add operation,
        > inv,
        > worker
}

if (DB.operation !== operation) {
    delete db entry
}
*/


exports.editTagQuoteAndOperations = async (req, res, next) => {
    logger.info(`Quotes : Inside editTagQuoteAndOperations of Quote`);
    const { operations, status } = req.body;
    // const quote = await Quotes.findByPk(id);
    // if (status) {
    //     const boolean = QuoteStatus.checkQuotesStatusCanBeUpdated(quote.status, status);
    //     if (!boolean) {
    //         return res.status(422).send({msg: `Please Choose Correct Status`});
    //     }
    // }
    // const taggedQuote = await findQuoteByIdForAdmin(req, res, next);
    

    // const taggedOperations = [];
    // taggedQuote.rows.map((tag) => {
    //     taggedOperations.push(tag.dataValues.operation_id)
    // })
    
    
    // const newOperations = [];
    // operations.map(operation => {
    //     newOperations.push(operation.operationId);
    // })
    // console.log(taggedOperations);
    // console.log(newOperations)

    // const includesOpr = taggedOperations.filter(x => !newOperations.includes(x)) 

   
    // console.log(includesOpr)



    // if (includesOpr.length > 0) {
    //     const result = await db.sequelize.transaction(async (t) => {
    //         if (operations) {
    //             console.log(operations)
    //             operations.map((operation) => {
    //                 operation.operation_id = operation.operationId;
    //                 operation.quote_id = quoteId;
    //             });
    //             const quoteOperationBulk = await QuoteOperations.bulkCreate(operations, {transaction: t})
    //             logger.info(`Inserted ${quoteOperationBulk.length} items to QuoteOperations`);
    //             const invArr = [], workArr = [];
    //             for (let i = 0; i < quoteOperationBulk.length; i++) {
    //                 const qBulk = quoteOperationBulk[i];
    //                 const operation = operations[i];
    //                 const {tools: inventoryArr} = operation;
    //                 inventoryArr.map(s => {
    //                     const {invId, reqQty} = s;
    //                     s.quote_operation_id = qBulk.tag_quote_operations_id
    //                     s.inv_id = invId;
    //                     s.req_quantity = reqQty;
    //                     return s;
    //                 });
    //                 invArr.push(inventoryArr);
    //                 const {workers: workerArr} = operation;
    //                 workerArr.map(s => {
    //                     const {workerId, totalHrs} = s;
    //                     s.quote_operation_id = qBulk.tag_quote_operations_id;
    //                     s.worker_id = workerId;
    //                     s.total_hrs_req = totalHrs;
    //                     return s;
    //                 })
    //                 workArr.push(workerArr);
    //             }
    //             const quoteInvOperationArr = invArr.flat(1);
    //             const quoteInvOperationBulk = await QuoteOperationInv.bulkCreate(quoteInvOperationArr, {transaction: t})
    //             logger.info(`Inserted ${quoteInvOperationBulk.length} items to QuoteOperationInv`);
    //             const quoteWorkerOperationArr = workArr.flat(1);
    //             const quoteWorkerOperationBulk = await QuoteOperationWorker.bulkCreate(quoteWorkerOperationArr, {transaction: t})
    //             logger.info(`Inserted ${quoteWorkerOperationBulk.length} items to QuoteOperationWorker`);
    //             if (status) {
    //                 return await Quotes.update({status: status}, {where: {id: quoteId}, transaction: t});
    //             }
    //             return operations;
    //         }
    //     }).catch(function (err) {
    //         logger.error(err)
    //         return null;
    //     });
    //     if (result) {
    //         res.status(201).json({message: "Quote and Operations are Tagged Successfully"});
    //     } else {
    //         const err = new Error("Please try back Later");
    //         err.statusCode = 500;
    //         next(err);
    //     }
  
    // }
    
    // const isOperation = await QuoteOperations.findOne({where: {tag_quote_operations_id: id}})
    // if(isOperation) {
    //         const result = await db.sequelize.transaction(async (t) => {
    //             let operation = await QuoteOperations.update({operation_total_hrs: operations.operation_total_hrs, operation_cost: operations.operation_cost}, {where: {tag_quote_operations_id: id}}, {transaction: t});
               
                
    //             const tools = operations.map((opr) => {
    //                 return opr.tools
    //             })

    //             for (let i = 0; i <= tools.length; i++) {
    //                console.log(tools[0][i].invId)
    //             }
            
    //             if(tools) {
    //                 const inventories = await QuoteOperationInv.findAndCountAll({where: {quote_operation_id: id}})
    //                 const inventoryDbId = inventories.rows.map((inventory) => {
    //                     return inventory.dataValues.inv_id
    //                 })
                    
    //                 const invArray = [];
    //                 inventoryArray.map(async (item) => {
    //                     if (inventoryDbId.includes(item.id)) {
    //                         invArray.push(item.id)
    //                         await QuoteOperationInv.update({req_avail: item.required_qty}, {where: {quote_operation_id: id, inv_id: item.id }}, {transaction: t});
    //                     } else {
    //                         await QuoteOperationInv.create({req_avail: item.required_qty, quote_operation_id: id, inv_id: item.id });
    //                     }
    //                 })
    //                 const delId = inventoryDbId.filter(x => !invArray.includes(x)) 
    //                 //inventoryDbId - invArray;
    //                 for (let i = 0; i < delId.length; i++) {
    //                     await QuoteOperationInv.destroy({where: {inv_id: delId[i], quote_operation_id: id}})
    //                 }
    //             }

    //             if(operations.workers) {
    //                 const allWorkers = await QuoteOperationWorker.findAndCountAll({where: {quote_operation_id : id}})
    //                 const workerDbId = allWorkers.rows.map((w) => {
    //                     return w.dataValues.worker_id
    //                 })

    //                 const workerArray = [];
    //                 operations.workers.map(async (worker) => {
    //                     if (workerDbId.includes(worker.id)) {
    //                         workerArray.push(worker.id)
    //                         await QuoteOperationWorker.update({est_cost: worker.est_cost}, {where: {quote_operation_id : id, worker_id: worker.id }}, {transaction: t});
    //                     } else {
    //                         await QuoteOperationWorker.create({avail_per_day: worker.required_hrs, quote_operation_id : id, worker_id: worker.id, est_cost: worker.est_cost});
    //                     }
    //                 })

    //                 const delWorkerId = workerDbId.filter(x => !workerArray.includes(x)) 
    //                 for (let i = 0; i < delWorkerId.length; i++) {
    //                     await QuoteOperationWorker.destroy({where: {worker_id: delWorkerId[i], quote_operation_id : id}})
    //                 }  
    //             }
    //             return operation;
    //         })
    //     .catch ((error) => {
    //         logger.error(error)
    //         return null
    //     });
    //     if (result) {
    //         res.status(200).json({message: "Tag Quote Operation updated!", data: req.body});
    //     } else {
    //         const err = new Error("Please try back Later");
    //         err.statusCode = 500;
    //         next(err);
    //     }
    // } else {
    //     return res.status(400).json({message: 'Tag Operation Doesnot Exists'})
    // }

    logger.info(`Quotes : Exit editTagQuoteAndOperations of Quote`);
}

exports.removeTagQuoteAndOperations = async (req, res, next) => {
    logger.info(`Quotes : Inside removeTagQuoteAndOperations of Quote`);
    const { id } = req.params
    const quoteOpr = await QuoteOperations.findOne({where: {quote_id: id}})
    if (quoteOpr) {
        const qId = quoteOpr.dataValues.quote_id
        const inProject = await Projects.findOne({where: {QuoteId : qId}})
        if (inProject) {
            res.status(400).send("Cant be deleted because operation is already tagged to quote") 
        } else {
            await QuoteOperations.destroy({where: {quote_id : id}})
            res.status(200).send("successfully deleted")
        }
    } else {
        res.status(400).send("No quote")
    }
    logger.info(`Quotes : Exit removeTagQuoteAndOperations of Quote`);
}

exports.convertToProject = async (req, res, next) => {
    logger.debug(`Quotes : Enter convertToProject`);
    const {quoteId} = req.params;
    let {name, desc, startDate, endDate} = req.body;
    const q = await fetchQuoteByClause({id: quoteId});
    const boolean = QuoteStatus.checkQuotesStatusCanBeUpdated(q.status, QuoteStatus.adminAcceptedQuote());
    if (!boolean) {
        return res.status(422).send({msg: `Quote cannot be Converted`});
    }
    const result = await db.sequelize
        .transaction(async (t) => {
            const {QuoteOperation: qOperations} = q;
            if (!startDate) {
                startDate = q.startDate;
            }
            if (!endDate) {
                endDate = q.endDate;
            }
            const project = await Projects.create({
                name,
                desc,
                start_date: startDate,
                end_date: endDate,
                QuoteId: quoteId,
            }, {transaction: t});


            /* hrs_left and hrs_commited logic
            
            let sDate = new Date(startDate)
            let eDate = new Date(endDate)   
            let cDate = new Date()
            
            let hrs_committed = Math.floor((Date.parse(eDate) - Date.parse(sDate)) / 86400000);
            console.log(`Hours Commited ${hrs_committed}`)

           
            if (cDate < sDate) {
                let hrs_left = Math.floor((Date.parse(eDate) - Date.parse(sDate)) / 86400000);
                console.log(`Hours Left ${hrs_left * 8}`)
            } else {
                let hrs_left = Math.floor((Date.parse(eDate) - Date.parse(cDate)) / 86400000);
                console.log(`Hours Left ${hrs_left * 8}`)
            }*/  

            for (let i = 0; i < qOperations.length; i++) {
                let workerArr = [];
                let projectWorker = {};
                const {QuoteOperationInv: qInv, QuoteOperationWorker: qWorker} = qOperations[i];
                for (let j = 0; j < qInv.length; j++) {
                    const inv = qInv[j];
                    const reqQty = inv.req_quantity;
                    const inventoryData = await Inventory.findByPk(inv.Inventories.id);
                    if (inventoryData.availability - reqQty < 0) {
                        throw new Error(`Cannot Process Availabilty is too Low for Inv ${inv.Inventories.itemName}`);
                    }
                    const result = await Inventory.update({availability: db.Sequelize.literal('availability - ' + reqQty)}, {
                        where: {id: inv.Inventories.id},
                        transaction: t
                    });
                    logger.debug(`${result[0]} Availabilty Updated for Inv ID- ${inv.Inventories.id} _  ${inv.Inventories.itemName}`);
                }

                for (let j = 0; j < qWorker.length; j++) {
                    projectWorker = {};
                    projectWorker.operation_id = qOperations[i].Operations.id;
                    projectWorker.worker_id = qWorker[j].Workers.id;
                    projectWorker.project_id = project.id;
                    projectWorker.total_hrs = qWorker[j].total_hrs_req;
                    workerArr.push(projectWorker);
                }
                const projectWorkerBulk = await ProjectWorkers.bulkCreate(workerArr, {transaction: t})
                logger.info(`Inserted ${projectWorkerBulk.length} items to ProjectWorkers`);
            }
            return project;
        }).catch(function (err) {
            next(err);
        });

    if (result) {
        res.status(201).json({message: "Project created!", data: result});
    }
    logger.debug(`Quotes : Exit convertToProject`);
}


exports.assignQuoteInspection = async (req, res, next) => {
    logger.info(`Quotes : Inside assignQuoteInspection`);
    const {id} = req.params;
    const { inspectionId } = req.body;
    const isQuote = await QuoteOperations.findOne({where: {quote_id: id}})
    if (isQuote) {
        QuoteOperations.update({inspection_id: inspectionId}, {where: {quote_id: id}})
        .then((result) => {
            const obj = {};
            obj.message = "Inspection Added Successfully";
            obj.updatedRecord = result.length;
            res.status(200).send(obj);
        })
        .catch((err) => {
            res.status(400).send("Please Input Valid Inspection")
            next(err)
        });
    } else {
        res.status(200).send("Please Input Valid Quote Id");
    }

    // const result = await db.sequelize.transaction(async (t) => {
    //     if (isQuote) {
    //         QuoteOperations.update({inspection_id: inspectionId}, {where: {quote_id: id}}, {transaction: t})
    //     }
    //     }).catch(function (err) {
    //     logger.error(err)
    //     res.status(400).send("Please Input Valid Inspection")
    //     return null;
    // });
    // if (result) {
    //     res.status(201).json({message: "Inspection Added Successfully"});
    // } else {
    //     const err = new Error("Please try back Later");
    //     err.statusCode = 500;
    //     next(err);
    // }


    logger.info(`Quotes : Exit assignQuoteInspection`);
};

exports.addTaxValue = async (req, res, next) => {
    logger.info(`Quotes : Inside addTaxValue`);
    const {id} = req.params;
    const tax = QuoteTax.taxPercentage();
    Quotes.update({tax: tax}, {where: {id: id}})
        .then((result) => {
            const obj = {};
            obj.message = "Tax Updated Successfully";
            obj.updatedRecord = result.length;
            res.status(200).send(obj);
        })
        .catch((err) => {
            res.status(400).send("Please Input Valid Tax Id")
            next(err)
        });
    logger.info(`Quotes : Exit addTaxValue`);
}


exports.addTotalValue = async (req, res, next) => {
    logger.info(`Quotes : Inside addTotalValue`);
    const {id} = req.params;
    let {total} = req.body;
    // const inspection = await Quotes.findOne({where: {id: id, InspectionId: {[Op.ne]: 1}}})
    // if (inspection) {
    //     const inspectionId = inspection.dataValues.InspectionId
    //     const ins = await Inspections.findOne({where: {id: inspectionId}})
    //     const inspectionCost = ins.cost;
    //     total = total + inspectionCost;
    // }
    // const taxValue = QuoteTax.taxPercentage()
    // const tax = await Quotes.findOne({where: {id: id, tax: {[Op.eq]: taxValue}}})
    // if (tax) {
    //     taxPrice = (total/100) * taxValue;
    //     total = total + taxPrice;
    // }
    Quotes.update({total: total}, {where: {id: id}})
        .then((result) => {
            const obj = {};
            obj.message = "Total Amount Added";
            obj.updatedRecord = result.length;
            res.status(200).send(obj);
        })
        .catch((err) => {
            res.status(400).send(err)
            next(err)
        });
    logger.info(`Quotes : Exit addTotalValue`);
}


