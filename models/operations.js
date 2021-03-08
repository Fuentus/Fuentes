module.exports = function (sequelize, Sequelize) {
    const Operations = sequelize.define(
      "Operations",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          notNull: true,
          unique: true,
        },
        o_name: {
          type: Sequelize.STRING,
          notNull: true,
        },
        o_desc: {
          type: Sequelize.STRING,
          notNull: true,
        },
        workers_req: {
          type: Sequelize.INTEGER,
          notNull: true,
        },
      },
      {
        schema: "tbl",
      }
    );
  
    Operations.associate = function (models) {
        Operations.belongsTo(models.Inventory, {
            foreignKey: {
              allowNull: false,
            },
          });
      Operations.hasMany(models.Inventory)
    };
    return Operations;
  };
  