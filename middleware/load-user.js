const db = require('../models/')
const Users = db.Users


module.exports = (req, res, next) => {
  const userId = req.userId;
  Users.findOne({ where: { id: userId } }).then((data) => {
    req.user = data;
    next();
  });
};
