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
const {fetchQuoteByClause, getAllQuotes, fetchQuoteByClauseOperations} = require("../service/QuoteService")
const {QuoteStatus, QuoteTax} = require("../service/QuoteStatus");
const {getPagination, getPagingData} = require("../service/PaginationService")

exports.findAllQuotesForAdmin = (req, res) => {
    logger.debug(`Quotes : Inside findAllQuotesForAdmin`);
    let {updatedAt} = req.query;
    updatedAt = updatedAt ? updatedAt : 0;
    const whereClause = {updatedAt: {[Op.gt]: updatedAt}, status: {[Op.notIn]: ["CLOSED", "PROJECT_IN_PROGRESS"]}};
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
    const cStatus = QuoteStatus.customerStatus()
    const include = cStatus.includes(status)
    if (!include) {
        Quotes.update({status: status}, {where: {id: id}})
        .then((result) => {
            const obj = {};
            obj.message = "Update Successfully";
            obj.updatedRecord = result.length;
            res.status(200).send(obj);
        }).catch((err) => {
            next(err)
        })
} else {
    res.status(400).json({ message: 'NO PRIVILAGE'}); //already i  cstner quueue
}
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




exports.editTagQuoteAndOperations = async (req, res, next) => {
    logger.info(`Quotes : Inside editTagQuoteAndOperations of Quote`);
    const {id} = req.params
    const whereClause = {id: id}
    const {quoteId, operations, status} = req.body;
    const quote = await Quotes.findByPk(quoteId);
    if (status) {
        const boolean = QuoteStatus.checkQuotesStatusCanBeUpdated(quote.status, status);
        if (!boolean) {
            return res.status(422).send({msg: `Please Choose Correct Status`});
    }}
        
    if (operations) {
        const quotes = await fetchQuoteByClauseOperations(whereClause)

        let operationsIds = quotes.QuoteOperation.map((qOp) => qOp.Operations.id)

        const operationReqId = operations.map((operation) => operation.operationId)
        console.log('operationsIds')
        console.log(operationsIds)
        console.log(operationReqId)

        let oprInDb =  operationReqId.filter(x => operationsIds.includes(x))
        //let oprNotInDb =  operationReqId - oprInDb;
        let oprNotInDb =  operationReqId.filter(x => !operationsIds.includes(x))



        if (oprInDb) {
            for(let i = 0; i < oprInDb.length; i++) {
                console.log('operations')
                console.log(operations.map((o) => o.tools))

                let opTotalHours = operations.map((o) => o.operation_total_hrs) //verfy
                let opCost = operations.map((o) => o.operation_cost)

                let tagInvId = await QuoteOperations.findOne({where: {operation_id : oprInDb[i], quote_id: quoteId}})
                tagInvId = tagInvId.dataValues.tag_quote_operations_id;
            
//add transcations
                QuoteOperations.update({operation_total_hrs: opTotalHours[i], operation_cost: opCost[i]}, {where: {tag_quote_operations_id: tagInvId}})
                let items = operations.map((o) => o.tools)
                items = [].concat.apply([], items);

                let workers = operations.map((o) => o.workers)
                workers = [].concat.apply([], workers);
              
                if(items) {
                    console.log('inv')
                    const inventories = await QuoteOperationInv.findAndCountAll({where: {quote_operation_id: tagInvId}})
                    const inventoryDbId = inventories.rows.map((inventory) => {
                        return inventory.dataValues.inv_id
                    })

                    console.log(inventoryDbId)
                    
                    const invArray = [];
                    console.log('items')
                    console.log(items)
                    items.map(async (item) => {
                        console.log('item')
                        console.log(item)
                        if (inventoryDbId.includes(item.invId)) {
                            invArray.push(item.invId)
                            await QuoteOperationInv.update({req_quantity: item.reqQty}, {where: {inv_id: item.invId, quote_operation_id: tagInvId}});
                        } else {
                            await QuoteOperationInv.create({req_quantity: item.reqQty, inv_id: item.invId, quote_operation_id: tagInvId});
                        }
                    })
                    const delId = inventoryDbId.filter(x => !invArray.includes(x))
                    for (let i = 0; i < delId.length; i++) {
                        await QuoteOperationInv.destroy({where: {inv_id: delId[i], quote_operation_id: tagInvId}})
                    }
                }
                 if(workers) {
                    const allWorkers = await QuoteOperationWorker.findAndCountAll({where: {quote_operation_id: tagInvId}})
                    const workerDbId = allWorkers.rows.map((w) => {
                        return w.dataValues.worker_id
                    })

                    console.log('workerDbId') 
                    console.log(workerDbId)

                    const workerArray = [];
                    workers.map(async (worker) => {
                        if (workerDbId.includes(worker.id)) {
                            workerArray.push(worker.id)
                            await QuoteOperationWorker.update({total_hrs_req: worker.totalHrs}, {where: {quote_operation_id: tagInvId, worker_id: worker.workerId }}, {transaction: t});
                        } else {
                            await QuoteOperationWorker.create({total_hrs_req: worker.totalHrs, quote_operation_id: tagInvId, worker_id: worker.workerId});
                        }
                    })

                    const delWorkerId = workerDbId.filter(x => !workerArray.includes(x)) 
                    for (let i = 0; i < delWorkerId.length; i++) {
                        await QuoteOperationWorker.destroy({where: {worker_id: delWorkerId[i], quote_operation_id: tagInvId}})
                    }  
                }
            }
        } else {
            const result = await db.sequelize.transaction(async (t) => {
                for(let i = 0; i < oprNotInDb.length; i++) {
                    console.log("operations")
                    console.log(operations)
                    const oprId = operations.map((o) => o.operationId)
                    const oprTotalHrs = operations.map((o) => o.operation_total_hrs)
                    const oprCost = operations.map((o) => o.operation_cost)
                    const quoteOperationBulk = await QuoteOperations.create({operation_total_hrs:oprTotalHrs[i], operation_cost: oprCost[i], operation_id : oprId[i], quote_id: quoteId }, {transaction: t})
                    logger.info(`Inserted ${quoteOperationBulk.length} items to QuoteOperations`);

                    const tagId = quoteOperationBulk.dataValues.tag_quote_operations_id

                    let items = operations.map((o) => o.tools)
                    items = [].concat.apply([], items);
                    console.log(items)

                    let workers = operations.map((o) => o.workers)
                    workers = [].concat.apply([], workers);
                    console.log(workers)
                
                if(items) {
                    items.map(async (item) => {
                        await QuoteOperationInv.create({req_quantity: item.reqQty, inv_id: item.invId, quote_operation_id: tagId});
                    })
                    
                }
                if(workers) {
                    workers.map(async (worker) => {
                        await QuoteOperationWorker.create({total_hrs_req: worker.totalHrs, quote_operation_id: tagId, worker_id: worker.workerId});
                    })
                   
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
        }

        
        let notInc = operationsIds.filter(x => !operationReqId.includes(x))
        console.log('notInc')
        console.log(notInc)
        for(let i = 0; i < notInc.length; i++) {
            const id = notInc[i]
            const quoteOpr = await QuoteOperations.findOne({where: {operation_id: id}})
            if (quoteOpr) {
                await QuoteOperations.destroy({where: {operation_id : id}})
                res.status(200).send("successfully deleted")
            } else {
                res.status(400).send("No quote")
            }
        }
    }
    logger.info(`Quotes : Exit editTagQuoteAndOperations of Quote`);
}



// exports.editTagQuoteAndOperations = async (req, res, next) => {
//     logger.info(`Quotes : Inside editTagQuoteAndOperations of Quote`);
//     const {id} = req.params
//     const whereClause = {id: id}
//     const {quoteId, operations, status} = req.body;
//     const quote = await Quotes.findByPk(quoteId);
//     if (status) {
//         const boolean = QuoteStatus.checkQuotesStatusCanBeUpdated(quote.status, status);
//         if (!boolean) {
//             return res.status(422).send({msg: `Please Choose Correct Status`});
//     }} 
//     if (operations) {
//         const quotes = await fetchQuoteByClauseOperations(whereClause)

//         let operationsIds = quotes.QuoteOperation.map((qOp) => qOp.Operations.id)
//         const operationReqId = operations.map((operation) => operation.operationId)

//         let oprInDb =  operationReqId.filter(x => !operationsIds.includes(x))
//         console.log(oprInDb)
//         // console.log(operations)

//         if (oprInDb) {
//             const result = await db.sequelize.transaction(async (t) => {
//                 for(let i = 0; i < oprInDb.length; i++) {
//                     console.log("operations")
//                     console.log(operations)
//                     const oprId = operations.map((o) => o.operationId)
//                     const oprTotalHrs = operations.map((o) => o.operation_total_hrs)
//                     const oprCost = operations.map((o) => o.operation_cost)
//                     const quoteOperationBulk = await QuoteOperations.create({operation_total_hrs:oprTotalHrs[i], operation_cost: oprCost[i], operation_id : oprId[i], quote_id: quoteId }, {transaction: t})
//                     logger.info(`Inserted ${quoteOperationBulk.length} items to QuoteOperations`);

//                     const tagId = quoteOperationBulk.dataValues.tag_quote_operations_id

//                     let items = operations.map((o) => o.tools)
//                     items = [].concat.apply([], items);
//                     console.log(items)

//                     let workers = operations.map((o) => o.workers)
//                     workers = [].concat.apply([], workers);
//                     console.log(workers)
                
//                 if(items) {
//                     items.map(async (item) => {
//                         await QuoteOperationInv.create({req_quantity: item.reqQty, inv_id: item.invId, quote_operation_id: tagId});
//                     })
                    
//                 }
//                 if(workers) {
//                     workers.map(async (worker) => {
//                         await QuoteOperationWorker.create({total_hrs_req: worker.totalHrs, quote_operation_id: tagId, worker_id: worker.workerId});
//                     })
                   
//                 }
//                 return operations;
//             }
                   
//             }).catch(function (err) {
//                 logger.error(err)
//                 return null;
//             });
//             if (result) {
//                 res.status(201).json({message: "Quote and Operations are Tagged Successfully"});
//             } else {
//                 const err = new Error("Please try back Later");
//                 err.statusCode = 500;
//                 next(err);
//             }
//         }
//     }
//     logger.info(`Quotes : Exit editTagQuoteAndOperations of Quote`);
// }
