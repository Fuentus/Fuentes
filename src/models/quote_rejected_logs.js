module.exports = function (sequelize, Sequelize) {
    const QuoteRejected = sequelize.define(
        "quote_rejected_logs",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                notNull: true,
                unique: true,
            },
            reason: {
                type: Sequelize.STRING,
                allowNull: true
            }
        },
        {
            schema: "tbl"
        }
    );
    QuoteRejected.associate = function (models) {
        QuoteRejected.belongsTo(models.Quotes, {
            foreignKey: {
                allowNull: false,
            }
        });
    }
    return QuoteRejected;
};
