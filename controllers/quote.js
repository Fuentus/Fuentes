const quote = require("../models/quote");
const db = require('../models/index');
const { response } = require("express");
const Quotes = db.Quotes;
const printLog = require("../util/funetus_util")

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
  Quotes.findAndCountAll({ where: null, limit, offset })
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
  printLog(`Quotes : Inside createQuote`);
  const { title, desc } = req.body;
  const measures = req.body.measures;
  const uploads = req.body.uploads
  try {
    let quote = await req.user.createQuote({
      title: title,
      desc: desc,
    });
    for(let i=0; i < measures.length; i++) {
      quote.createMeasure({
        name: measures[i].name,
        qty: measures[i].qty,
        unit: measures[i].unit
      })
    }
      quote.createUpload({
        fileName: uploads.fileName,
        filePath: uploads.filePath
      })

    res.status(201).json({ message: "Quote created!" });
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
  printLog(`Quotes : Exit createQuote`);
};

//TODO
exports.findQuoteById =  (req, res, next) => {
  printLog(`Quotes : Inside findQuoteById`);
  const { id } = req.params;
    const quote = Quotes.findOne({ where : { id : id} })
     .then((quote) => {
      res.status(200).send(quote)
     })
     .catch((err) => {
       console.log(err)
     })
     printLog(`Quotes : Exit findQuoteById`);
    }

//TODO
exports.deleteQuoteById = async (req, res, next) => {
  printLog(`Quotes : Inside deleteQuoteById`);
  const { id } = req.params;
    try {
        const quote = await Quotes.destroy({ where : { id : id} })
        res.sendStatus(200)
        next();
    } catch (err) {
      res.status(404).send({ message: 'Error'})
      console.log(err)
    }
    printLog(`Quotes : Exit deleteQuoteById`);

}

exports.editQuoteById = async(req, res, next) => {
  printLog(`Quotes : Inside editQuoteById`);
  const { id } = req.params;
  const { title, desc } = req.body;
  try {
    const quote = Quotes.findOne({ where : { id : id} })
    const updated = await quote.updateOne({
        title: title,
        desc: desc,
    })
    res.status(201).send(updated)
  } catch (err) {
    console.log(err)
  }
  printLog(`Quotes : Exit editQuoteById`);
}
