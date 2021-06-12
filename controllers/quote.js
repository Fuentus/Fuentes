const quote = require("../models/quote");
const db = require("../models/index");
const { Op } = require("sequelize");
const { response } = require("express");
const { validationResult } = require("express-validator");

const Quotes = db.Quotes;
const printLog = require("../util/funetus_util");

exports.findAllQuotes = (req, res, next) => {
  printLog(`Quotes : Inside findAllQuotes`);
  const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;
    return { limit, offset };
  };
  const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: quotes } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, quotes, totalPages, currentPage };
  };

  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  let { updatedAt } = req.query;
  updatedAt = updatedAt ? updatedAt : 0;
  const whereClause = { updatedAt: { [Op.gt]: updatedAt } };
  if (!req.admin) {
    whereClause["userId"] = { [Op.eq]: req.user.id };
  }
  console.log(whereClause);
  Quotes.findAndCountAll({
    where: whereClause,
    attributes: ["id", "title", "desc", "status", "createdAt", "updatedAt"],
    include: [
      {
        model: db.Users,
        attributes: ["name", "email"],
      },
      {
        model: db.Uploads,
        attributes: ["fileName", "filePath"],
      },
    ],
    limit,
    offset,
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error occurred while retrieving",
      });
    });
  printLog(`Quotes : Exit findAllQuotes`);
};

exports.createQuote = async (req, res, next) => {
  try {
    printLog(`Quotes : Inside createQuote`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const { title, desc } = req.body;
    const measures = req.body.measures;
    const uploads = req.body.uploads;

    let quote = await req.user.createQuote({
      title: title,
      desc: desc,
    });
    for (let i = 0; i < measures.length; i++) {
      quote.createMeasure({
        name: measures[i].name,
        qty: measures[i].qty,
        unit: measures[i].unit,
      });
    }
    if (uploads) {
      quote.createUpload({
        fileName: uploads.fileName,
        filePath: uploads.filePath,
      });
    }

    res.status(201).json({ message: "Quote created!" });
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
  printLog(`Quotes : Exit createQuote`);
};

exports.findQuoteById = async (req, res, next) => {
  try {
    printLog(`Quotes : Inside findQuoteById`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 408;
      error.data = errors.array();
      throw error;
    }
    const { id } = req.params;
    const whereClause = { id: id };
    if (!req.admin) {
      whereClause["userId"] = { [Op.eq]: req.user.id };
    }
    const quote = await Quotes.findOne({
      where: whereClause,
      attributes: ["id", "title", "desc", "status", "createdAt", "updatedAt"],
      include: [
        {
          model: db.Users,
          attributes: ["name", "email"],
        },
        {
          model: db.Uploads,
          attributes: ["fileDocument", "fileName", "filePath"],
        },
        {
          model: db.Measures,
          attributes: ["name", "unit", "qty"],
        },
      ],
    }) || {};
    res.status(200).send(quote);
  } catch (err) {
    console.log(err);
    next(err);
  }
  printLog(`Quotes : Exit findQuoteById`);
};

exports.deleteQuoteById = async (req, res, next) => {
  printLog(`Quotes : Inside deleteQuoteById`);
  const { id } = req.params;
  try {
    const quote = await Quotes.destroy({ where: { id: id } });
    res.sendStatus(200);
    next();
  } catch (err) {
    res.status(404).send({ message: "Error" });
    console.log(err);
  }
  printLog(`Quotes : Exit deleteQuoteById`);
};

exports.editQuoteById = async (req, res, next) => {
  printLog(`Quotes : Inside editQuoteById`);
  const { id } = req.params;
  const { title, desc } = req.body;
  try {
    const quote = Quotes.findOne({ where: { id: id } });
    const updated = await quote.updateOne({
      title: title,
      desc: desc,
    });
    res.status(201).send(updated);
  } catch (err) {
    console.log(err);
  }
  printLog(`Quotes : Exit editQuoteById`);
};
