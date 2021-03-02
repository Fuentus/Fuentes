module.exports = function (sequelize, Sequelize) {
  const Measures = sequelize.define(
    "Measures",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        notNull: true,
        unique: true,
      },
      name: {
        type: Sequelize.STRING,
        notNull: true,
      },
      unit: {
        type: Sequelize.STRING,
        notNull: true,
      },
      qty: {
        type: Sequelize.STRING,
        notNull: true,
      },
    },
    {
      schema: "tbl",
    }
  );

  Measures.associate = function (models) {
    Measures.belongsTo(models.Quotes, {
      foreignKey: {
        allowNull: false,
      },
    });
  };
  return Measures;
};
