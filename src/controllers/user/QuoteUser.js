const db = require("../../models");
const {Op, where} = require("sequelize");
const {validationResult} = require("express-validator");

const logger = require("../../util/log_utils");
const {getAllQuotesUser, fetchQuoteByClauseUser, fetchQuoteByClause} = require("../service/QuoteService")
const {getPagination, getPagingData} = require("../service/PaginationService");
const {QuoteStatus} = require("../service/QuoteStatus");

const {Quotes, Measures, Uploads, Inspections} = db;

exports.findAllQuotesForUser = (req, res) => {
    logger.debug(`Quotes : Inside findAllQuotes`);
    let {updatedAt} = req.query;
    updatedAt = updatedAt ? updatedAt : 0;
    const whereClause = {updatedAt: {[Op.gt]: updatedAt}, userId: {[Op.eq]: req.user.id}, status: {[Op.notIn]: ["CLOSED", "PROJECT_IN_PROGRESS"]}};
    const {page, size} = req.query;
    const obj = getPagination(page, size);
    const failure = (err) => {
        logger.error(err);
        res.status(500).send({
            message: err.message || "Error occurred while retrieving",
        });
    };
    const success = (data) => {
        data.rows.map((user) => {
            user.dataValues.Uploads = user.dataValues.Uploads.length
        })
        const response = getPagingData(data, page, obj.limit);
        res.send(response);
    };
    getAllQuotesUser(obj, whereClause, success, failure);
    logger.debug(`Quotes : Exit findAllQuotes`);
};

exports.createQuote = async (req, res, next) => {
    logger.debug(`Quotes : Inside createQuote`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422)
            .json({message: "Validation failed", data: errors.array()});
    }
    const {title, desc, startDate, endDate, TaxId} = req.body;
    const measures = req.body.measures;
    const uploads = req.body.uploads;
    const result = await db.sequelize
        .transaction(async (t) => {
            let quote = await req.user.createQuote(
                {
                    title: title,
                    desc: desc,
                    startDate: startDate,
                    endDate: endDate,
                    TaxId: TaxId
                },
                {transaction: t}
            );

            if (measures) {
                for (let i = 0; i < measures.length; i++) {
                    await quote.createMeasure(
                        {
                            name: measures[i].name,
                            qty: measures[i].qty,
                            unit: measures[i].unit,
                        },
                        {transaction: t}
                    );
                }
            }
            if (uploads) {
                for (let i = 0; i < uploads.length; i++) {
                    await quote.createUpload(
                        {
                            fileName: uploads[i].fileName,
                            filePath: uploads[i].filePath,
                        },
                        {transaction: t}
                    );
                }
            }
            return quote;
        })
        .catch(function (err) {
            logger.error(err)
            return null;
        });
    if (result) {
        res.status(201).json({message: "Quote created!", data: req.body});
    } else {
        const err = new Error("Please try back Later");
        err.statusCode = 500;
        next(err);
    }
    logger.debug(`Quotes : Exit createQuote`);
};

exports.findQuoteById = async (req, res, next) => {
    logger.debug(`Quotes : Inside findQuoteById`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422)
            .json({message: "Validation failed", data: errors.array()});
    }
    const {id} = req.params;
    const whereClause = {
        id: id,
        userId: {[Op.eq]: req.user.id}
    };

    const quote = await fetchQuoteByClauseUser(whereClause);
    res.status(200).send(quote);
    logger.debug(`Quotes : Exit findQuoteById`);
};

exports.deleteQuoteById = async (req, res, next) => {
    logger.debug(`Quotes : Inside deleteQuoteById`);
    const {id} = req.params;
    const result = await db.sequelize.transaction(async (t) => {
        await Measures.destroy(
            {where: {QuoteId: id}, force: true},
            {transaction: t}
        );
        await Uploads.destroy(
            {where: {QuoteId: id}, force: true},
            {transaction: t}
        );
        return await Quotes.destroy(
            {where: {id: id}, force: true},
            {transaction: t}
        );
    });

    const obj = {};
    obj.message = "Update Successfully";
    obj.updatedRecord = result;
    res.status(200).send(obj);
    logger.debug(`Quotes : Exit deleteQuoteById`);
};

exports.editQuoteById = async (req, res, next) => {
    logger.debug(`Quotes : Inside editQuoteById`);
    const {id} = req.params;
    const {title, desc} = req.body;
    const measures = req.body.measures;
    const result = await db.sequelize.transaction(async (t) => {
        let res = await Quotes.update(
            {title: title, desc: desc},
            {where: {id: id}},
            {transaction: t}
        );
        if (measures) {
            await Measures.destroy(
                {
                    where: {
                        QuoteId: id,
                    },
                    force: true,
                },
                {transaction: t}
            );
            for (let i = 0; i < measures.length; i++) {
                await Measures.create(
                    {
                        name: measures[i].name,
                        qty: measures[i].qty,
                        unit: measures[i].unit,
                        QuoteId: id,
                    },
                    {transaction: t}
                );
            }
        }
        return res;
    });
    if (result) {
        const whereClause = {id: id};
        if (!req.admin) {
            whereClause["userId"] = {[Op.eq]: req.user.id};
        }
        const q = await fetchQuoteByClauseUser(whereClause);
        res.status(201).send(q);
    }
    logger.debug(`Quotes : Exit editQuoteById`);
};

exports.searchResultsForUser = async (req, res, next) => {
    try {
        logger.debug(`Quotes : searchResults`);
        const {search} = req.body;
        const whereClause = {
            title: {
                [Op.like]: `%${search}%`
            },
            userId: {
                [Op.eq]: req.user.id
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

        getAllQuotesUser(obj, whereClause, success, failure);
    } catch (err) {
        console.log(err);
        next(err);
    }
    logger.debug(`Quotes : Exit searchResults`);
};


exports.submitPOUrl = async (req, res, next) => {
    logger.info(`Quotes : Inside submitPOUrl`);
    const {id} = req.params;
    const {submit_PO} = req.body;
    const status = "QUOTE_PO_SUBMIT";
    const quote = await fetchQuoteByClauseUser({id: id, userId: req.user.id})
    try {
        const boolean = QuoteStatus.checkQuotesStatusCanBeUpdated(quote.status, status);
        if (!boolean) {
            return res.status(422).send({msg: `Please Choose Correct Status`});
        }
        Quotes.update({submittedPO: submit_PO, status: status}, {where: {id: id, userId: req.user.id}})
            .then((result) => {
                const obj = {};
                obj.message = "PO Link & Status Updated Successfully";
                obj.updatedRecord = result.length;
                res.status(200).send(obj);
            })
            .catch((err) => {
                next(err)
            }); 
    } catch (err) {
        next(err);
        return res.status(422).send({msg: `Invalid Quote`});
    }
    
    logger.info(`Quotes : Exit submitPOUrl`);
}
