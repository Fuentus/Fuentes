const db = require("../../models");
const {Users} = db;


    const fetchCustomersByClause = async (whereClause) => {
        return (
            (await Users.findOne({
                where: whereClause,
                attributes: ["id", "name", "email", "status", "createdAt", "updatedAt", "phone", "address"],
            })) || {}
        );
    };
    
    const getAllCustomers = (obj, whereClause, success, failure) => {
        const {limit, offset} = obj;
        Users.findAndCountAll({
            where: whereClause,
            attributes: ["id", "name", "email", "phone", "address"],
            order: [["name", "DESC"]],
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
    getAllCustomers: getAllCustomers,
    fetchCustomersByClause: fetchCustomersByClause
}