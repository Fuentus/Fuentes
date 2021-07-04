const { QuoteStatus } = require("../util/fuentus_constants");

const qStatus = new QuoteStatus();

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
        values: qStatus.getAllQuotesStatus(),
        defaultValue: qStatus.get("QUOTE_RECEIVED"),
        notNull: true,
      },
    },
    {
      schema: "tbl",
      paranoid: true,
      version: true
    }
  );
  Quotes.associate = function (models) {
    Quotes.belongsTo(models.Users, {
      foreignKey: {
        allowNull: false,
      },
    });
    Quotes.hasMany(models.Measures, {
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    Quotes.hasMany(models.Uploads, {
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  };
  return Quotes;
};
