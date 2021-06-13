module.exports = function (sequelize, Sequelize) {
    const Workers = sequelize.define(
      "Workers",
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          notNull: true,
          unique: true,
        },
        w_name: {
          type: Sequelize.STRING,
          notNull: true,
        },
        w_phone: {
            type: Sequelize.STRING,
            notNull: true
          },
        w_address: {
          type: Sequelize.STRING,
          notNull: true,
        },
        w_email: {
          type: Sequelize.STRING,
          unique: true,
          validate: {
            isEmail: {
                msg: "Must be a valid email address",
            },
            },
            notNull: true,
        },
        w_status: {
          type: Sequelize.ENUM("AVAILABLE"),
          defaultValue: "AVAILABLE",
          notNull: true,
        },
        w_operations: {
            type: Sequelize.STRING,
            allowNull: true,
        },
      },
      {
        schema: "tbl",
      }
    );

    Workers.associate = function (models) {
        Workers.belongsTo(models.Projects, {
          foreignKey: {
            allowNull: false,
          },
        });
        Workers.belongsTo(models.Operations, {
            foreignKey: {
                allowNull: false,
            }
        })
      };
    return Workers;
  };