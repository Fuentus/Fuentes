const {param, body, check} = require("express-validator");
const {QUOTE_STATUS} = require('../controllers/service/quote/QuoteStatus');
const db = require("../models/index");
const Quotes = db.Quotes;

const quoteCreateValidator = [
    body("title")
        .trim()
        .isLength({min: 3})
        .withMessage("Please enter a Title of Min 3 Characters."),

    body("desc")
        .trim()
        .isLength({min: 3})
        .withMessage("Please enter a Description."),

    body("measures").isArray({min: 1}).withMessage("Please add measures"),

    body('startDate').isISO8601()
        .toDate()
        .withMessage("Please enter a valid date.")
        .custom(value => {
        let enteredDate = new Date(value);
        let todayDate = new Date();
        if (todayDate > enteredDate) {
            throw new Error("Please select start date in future");
        }
        return true;
    }),
    body('endDate').isISO8601()
        .toDate()
        .withMessage("Please enter a valid date.")
        .custom((value, {req}) => {
        let enteredDate = new Date(value);
        let todayDate = new Date();
        let d = req.body.startDate;
        let startDate = new Date(d);
          if (todayDate > enteredDate) {
            throw new Error("Please select endDate in future");
          }
        if (startDate > enteredDate) {
            throw new Error("End Date should be greater than Start date");
        }
        return true;
    })
];


const validateReq = [
    param("id", 'Enter a valid Id').isFloat()
];

const checkUserPrivilegeOfQuote = (req, res, next) => {
    const {id} = req.params;
    Quotes.findOne({where: {id: id}}).then((val) => {
        if (val) {
            const data = val.dataValues;
            const user = req.user.dataValues;
            if (req.admin) {
                next();
            } else if (data.UserId === user.id && data.status === QUOTE_STATUS[0]) {
                next()
            } else {
                res.status(401).send({message: "Insufficient Privilege"});
            }
        } else {
            res.status(200).send({});
        }
    })
};
module.exports = {
    quoteCreateValidator: quoteCreateValidator,
    validateReq: validateReq,
    checkUserPrivilegeOfQuote: checkUserPrivilegeOfQuote
};
