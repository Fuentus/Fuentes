const db = require("../../../models");
const {Op} = require("sequelize");
//
// const {logger} = require("../../../util/log_utils");

const Quotes = db.Quotes;
const Measures = db.Measures;
const Uploads = db.Uploads;
const Users = db.Users;

const fetchQuoteByClause = async (whereClause) => {
    return (
        (await Quotes.findOne({
            where: whereClause,
            attributes: ["id", "title", "desc", "status", "createdAt", "updatedAt"],
            include: [
                {
                    model: Users,
                    attributes: ["name", "email"],
                },
                {
                    model: Uploads,
                    attributes: ["fileDocument", "fileName", "filePath"],
                },
                {
                    model: Measures,
                    attributes: ["name", "unit", "qty"],
                },
            ],
        })) || {}
    );
};

const getAllQuotes = (obj, whereClause, success, failure) => {
    const {limit, offset} = obj;
    Quotes.findAndCountAll({
        where: whereClause,
        attributes: ["id", "title", "desc", "status", "createdAt", "updatedAt"],
        include: [
            {
                model: Users,
                attributes: ["name", "email"],
            },
            {
                model: Uploads,
                attributes: ["fileName", "filePath"],
            },
        ],
        order: [["updatedAt", "DESC"]],
        limit,
        offset,
    })
        .then((data) => {
            success(data);
        })
        .catch((err) => {
            failure(err);
        });
};

module.exports = {
    fetchQuoteByClause: fetchQuoteByClause,
    getAllQuotes: getAllQuotes
};