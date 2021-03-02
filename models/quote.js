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
        type: Sequelize.ENUM("PENDING", "ACCEPTED", "COMPLETED"),
        defaultValue: "PENDING",
        notNull: true,
      },
    },
    {
      schema: "tbl",
    }
  );
  Quotes.associate = function (models) {
    Quotes.belongsTo(models.Users, {
      foreignKey: {
        allowNull: false,
      },
    });
    Quotes.hasMany(models.Measures);
  };
  return Quotes;
};
