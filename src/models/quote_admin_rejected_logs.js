module.exports = function (sequelize, Sequelize) {
    const QuoteAdminRejected = sequelize.define(
        "quote_admin_rejected_logs",
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
    QuoteAdminRejected.associate = function (models) {
        QuoteAdminRejected.belongsTo(models.Quotes, {
            foreignKey: {
                allowNull: false,
            }
        });
    }
    return QuoteAdminRejected;
};
