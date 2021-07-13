const db = require("../models/");
const Users = db.Users;

module.exports = (req, res, next) => {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;

    const userId = req.userId;
    Users.findOne({where: {id: userId}})
        .then((data) => {
            if (data) {
                req.user = data;
                req.admin = data.role === "ADMIN";
                if (req.admin) {
                    next();
                }
            } else {
                const err = new Error(`Not Enough Privileges`)
                next(err);
            }
        })
        .catch(err => {
            next(err)
        });
};
