const db = require("../models/");
const Users = db.Users;

module.exports = (req, res, next) => {
  const userId = req.userId;
  Users.findOne({ where: { id: userId } }).then((data) => {
    if (data) {
      req.user = data;
      req.admin = false;
      if (data.role === "ADMIN") {
        req.admin = true;
      }
    }
    next();
  });
};
