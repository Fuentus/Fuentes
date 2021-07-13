const {QuoteStatus} = require("../controllers/service/quote/QuoteStatus");
module.exports = function (sequelize, Sequelize) {
    const Quotes = sequelize.define(
        "Quotes",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                notNull: true,
                unique: true,
            },
            title: {
                type: Sequelize.STRING,
                notNull: true,
            },
            desc: {
                type: Sequelize.STRING,
            },
            status: {
                type: Sequelize.ENUM,
                values: QuoteStatus.getAllQuotesStatus(),
                defaultValue: QuoteStatus.defaultValue(),
                notNull: true,
            },
            startDate: {
                type: Sequelize.DATE
            },
            endDate: {
                type: Sequelize.DATE,
            }
        },
        {
            schema: "tbl",
            paranoid: true,
            version: true
        }
    );
    Quotes.associate = function (models) {
        const {Users, Measures, Uploads, Operations} = models;
        Quotes.belongsTo(Users, {
            foreignKey: {
                allowNull: false,
            },
        });
        Quotes.hasMany(Measures, {
            onDelete: "cascade",
            onUpdate: "cascade",
        });
        Quotes.hasMany(Uploads, {
            onDelete: "cascade",
            onUpdate: "cascade",
        });
        Quotes.belongsToMany(Operations, {
            through: "quote_operations",
            as: "Operations",
            foreignKey: "operation_id"
        });
    };
    return Quotes;
};
