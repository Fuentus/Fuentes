const { Upload } = require("../models");
const { Measures } = require("../models");


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
  const { name, unit, qty } = Measures
  const { filename, filepath } = Upload
  try {
    await req.user.createQuote({ 
      title: title,
      desc: desc,
      measurements: {
        name:name, 
        unit:unit, 
        qty:qty 
      }, 
      upload: {
        filename,
        filepath
      }});
    res.status(201).json({ message: "Quote created!" });
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//TODO
exports.findQuoteById = async (req, res, next) => {
  const { id } = req.params;
  console.log(id)
    try {
       const quote = await Quote.findOne(id)
       res.status(200).send(quote) 
    } catch (e) {
        console.log(error) 
        res.status(404).send(e)  
    }
}

//TODO
exports.deleteQuoteById = async (req, res, next) => {
  const { id } = req.params;
  console.log(id)
    try {
        const quote = await Quote.destroy(id)
        res.status(200)
    } catch (e) {
       console.log(e) 
    }   
}
