const { Users } = require("../models");
module.exports = (req, res, next) => {
  const userId = req.userId;
  Users.findOne({ where: { id: userId } }).then((data) => {
    req.user = data;
    next();
  });
};
