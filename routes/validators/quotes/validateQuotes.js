const { param, body } = require("express-validator");
const { QUOTE_STATUS } = require('../../../util/fuentus_constants');
const db = require("../../../models/index");
const Quotes = db.Quotes;

const quoteCreateValidator = [
  body("title")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Please enter a Title of Min 3 Characters."),

  body("desc")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Please enter a Description."),

  body("measures").isArray({ min: 1 }).withMessage("Please add measures"),
];


const validateReq = [
  param("id", 'Enter a valid Id').isFloat()
];

const adminPrivilege = (req, res, next) => {
  if (req.admin) {
    next();
  } else {
    res.status(401).send({ message: "Insufficient Privilege" });
  }
};
const checkUserPrivilegeOfQuote = (req, res, next) => {
  const { id } = req.params;
  Quotes.findOne({ where: { id: id } }).then((val) => {
    if (val) {
      const data = val.dataValues;
      const user = req.user.dataValues;
      if (req.admin) {
        next();
      } else if (data.UserId === user.id && data.status === QUOTE_STATUS[0]) {
        next()
      } else {
        res.status(401).send({ message: "Insufficient Privilege" });
      }
    }else{
      next();
    }
  })
};
module.exports = {
  quoteCreateValidator: quoteCreateValidator,
  validateReq: validateReq,
  adminPrivilege: adminPrivilege,
  checkUserPrivilegeOfQuote: checkUserPrivilegeOfQuote
};
