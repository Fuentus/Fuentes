const {QuoteStatus} = require("../controllers/service/QuoteStatus");
module.exports = function (sequelize, Sequelize) {
    const {INTEGER, TEXT, STRING, ENUM, DATE} = Sequelize;
    const Quotes = sequelize.define(
        "Quotes",
        {
            id: {
                type: INTEGER,
                primaryKey: true,
                autoIncrement: true,
                notNull: true,
                unique: true,
            },
            title: {
                type: TEXT,
                notNull: true,
            },
            desc: {
                type: STRING,
            },
            status: {
                type: ENUM,
                values: QuoteStatus.getAllQuotesStatus(),
                defaultValue: QuoteStatus.defaultValue(),
                notNull: true,
            },
            startDate: {
                type: DATE
            },
            endDate: {
                type: DATE
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
        // Quotes.belongsToMany(Operations, {
        //     through: "quote_operations",
        //     as: "Operations",
        //     foreignKey: "operation_id"
        // });
    };
    return Quotes;
};
