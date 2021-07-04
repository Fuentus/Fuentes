const db = require("../models/index");
const { Op } = require("sequelize");
const { validationResult } = require("express-validator");

const Quotes = db.Quotes;
const Measures = db.Measures;
const Uploads = db.Uploads;
const Users = db.Users;

const printLog = require("../util/fuentus_util");
const { QUOTE_STATUS, QuoteExists } = require("../util/fuentus_constants");

const fetchQuoteByClause = async (whereClause) => {
  return (
    (await Quotes.findOne({
      where: whereClause,
      attributes: ["id", "title", "desc", "status", "createdAt", "updatedAt"],
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
      ],
    })) || {}
  );
};

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

const getAllQuotes = (obj, whereClause, success, failure) => {
  const { limit, offset } = obj;
  Quotes.findAndCountAll({
    where: whereClause,
    attributes: ["id", "title", "desc", "status", "createdAt", "updatedAt"],
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

exports.findAllQuotes = (req, res) => {
  printLog(`Quotes : Inside findAllQuotes`);
  let { updatedAt } = req.query;
  updatedAt = updatedAt ? updatedAt : 0;
  const whereClause = { updatedAt: { [Op.gt]: updatedAt } };
  if (!req.admin) {
    whereClause["userId"] = { [Op.eq]: req.user.id };
  }
  const { page, size } = req.query;
  const obj = getPagination(page, size);
  const failure = (err) => {
    res.status(500).send({
      message: err.message || "Error occurred while retrieving",
    });
  };
  const success = (data) => {
    const response = getPagingData(data, page, obj.limit);
    res.send(response);
  };
  getAllQuotes(obj, whereClause, success, failure);
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
    const result = await db.sequelize.transaction(async (t) => {
      let quote = await req.user.createQuote(
        {
          title: title,
          desc: desc,
        },
        { transaction: t }
      );

      if (measures) {
        for (let i = 0; i < measures.length; i++) {
          await quote.createMeasure(
            {
              name: measures[i].name,
              qty: measures[i].qty,
              unit: measures[i].unit,
            },
            { transaction: t }
          );
        }
      }
      if (uploads) {
        await quote.createUpload(
          {
            fileName: uploads.fileName,
            filePath: uploads.filePath,
          },
          { transaction: t }
        );
      }
      return quote;
    });
    res.status(201).json({ message: "Quote created!", data: result });
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
    const quote = await fetchQuoteByClause(whereClause);
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
    const result = await db.sequelize.transaction(async (t) => {
      await Measures.destroy(
        { where: { QuoteId: id }, force: true },
        { transaction: t }
      );
      await Uploads.destroy(
        { where: { QuoteId: id }, force: true },
        { transaction: t }
      );
      let res = await Quotes.destroy(
        { where: { id: id }, force: true },
        { transaction: t }
      );
      return res;
    });

    const obj = {};
    obj.message = "Update Successfully";
    obj.updatedRecord = result;
    res.status(200).send(obj);
  } catch (err) {
    res.status(404).send({ message: "Error" });
    console.log(err);
    next(err);
  }
  printLog(`Quotes : Exit deleteQuoteById`);
};

exports.editQuoteById = async (req, res, next) => {
  try {
    printLog(`Quotes : Inside editQuoteById`);
    const { id } = req.params;
    const { title, desc } = req.body;
    const measures = req.body.measures;
    const result = await db.sequelize.transaction(async (t) => {
      let res = await Quotes.update(
        { title: title, desc: desc },
        { where: { id: id } },
        { transaction: t }
      );
      if (measures) {
        await Measures.destroy(
          {
            where: {
              QuoteId: id,
            },
            force: true,
          },
          { transaction: t }
        );
        for (let i = 0; i < measures.length; i++) {
          await Measures.create(
            {
              name: measures[i].name,
              qty: measures[i].qty,
              unit: measures[i].unit,
              QuoteId: id,
            },
            { transaction: t }
          );
        }
      }
      return res;
    });
    if (result) {
      const whereClause = { id: id };
      if (!req.admin) {
        whereClause["userId"] = { [Op.eq]: req.user.id };
      }
      const q = await fetchQuoteByClause(whereClause);
      res.status(201).send(q);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
  printLog(`Quotes : Exit editQuoteById`);
};

exports.changeStatus = (req, res, next) => {
  try {
    printLog(`Quotes : Inside changeStatus of Quote`);
    let { status } = req.body;
    const { id } = req.params;
    const boolean = QuoteExists(status);
    if (!boolean) {
      throw Error(" Please Choose Correct Status");
    }
    Quotes.update({ status: status }, { where: { id: id } })
      .then((result) => {
        const obj = {};
        obj.message = "Update Successfully";
        obj.updatedRecord = result[0];
        res.status(200).send(obj);
      })
      .catch((err) => res.status(500).send(err));
  } catch (err) {
    console.log(err);
    next(err);
  }
  printLog(`Quotes : Exit changeStatus of Quote`);
};

exports.searchResults = async (req, res, next) => {
  try {
    printLog(`Quotes : searchResults`);
    const { search } = req.body;
    const whereClause = { title: { [Op.like]: `%${search}%` } };
    if (!req.admin) {
      whereClause["userId"] = { [Op.eq]: req.user.id };
    }
    const obj = { limit: 100, offset: 0 };
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
    console.log(err);
    next(err);
  }
  printLog(`Quotes : Exit searchResults`);
};
