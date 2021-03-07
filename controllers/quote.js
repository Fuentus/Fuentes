const quote = require("../models/quote");
const db = require('../models/index')
const Quotes = db.Quotes;

exports.findAllQuotes = (req, res, next) => {
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
};

exports.createQuote = async (req, res, next) => {
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
};

//TODO
exports.findQuoteById = (req, res, next) => {
  const { id } = req.params;
    try {
       Quotes.findOne({ where : { id : id} })
       res.status(200).send({ message : 'Sucessfull'}) 
    } catch (err) {
        console.log(err) 
        res.status(404).send({ message : 'Error Occured'})
    }
}

//TODO
exports.deleteQuoteById = (req, res, next) => {
  const { id } = req.params;
  console.log(id)
    try {
        quote.deleteQuoteById()
        res.status(200).send({ message : 'Retrived'})
        next();
    } catch (err) {
      res.status(404).send({ message: 'Error'})
      console.log(err)
    }   
}
