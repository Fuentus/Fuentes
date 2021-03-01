const Quote = require('../models/quote');

exports.findAllQuotes = (req, res, next) => {
    const { page = 1, limit = 10 } = req.query
    try {
        const quotes = Quote.find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = Quote.countDocuments();

        res.json({
            quotes,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (e) {
        console.log(e)
    }
}
exports.createQuote = async (req, res, next) => {
    const { title, desc } = req.body;
    try {
        const quote = await req.user.createQuote({ title: title, desc: desc });
        console.log(quote);
    } catch (err) {
        console.log(err);
    }
    // .then(result => {
    //     res.status(201).json({ message: 'Quote created!' })
    // })
    // .catch(err => console.log(err));
    res.status(201).json({ message: 'Quote created!' })
}