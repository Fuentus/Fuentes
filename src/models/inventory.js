module.exports = function (sequelize, Sequelize) {
    const Inventory = sequelize.define(
      "Inventory",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          notNull: true,
          unique: true,
        },
        item_name: {
          type: Sequelize.STRING,
          notNull: true,
        },
        item_desc: {
          type: Sequelize.STRING,
          notNull: true,
        },
        operations_tagged: {
          type: Sequelize.STRING,
          allowNull: true,
          foreignKey: false
        },
        availability: {
          type: Sequelize.INTEGER,
          notNull: true,
        },
        cost: {
            type: Sequelize.INTEGER,
            notNull: true,
          },
      },
      {
        schema: "tbl",
      }
    );

  Inventory.associate = function (models) {
    Inventory.hasMany(models.Operations);
  };
  return Inventory;
};