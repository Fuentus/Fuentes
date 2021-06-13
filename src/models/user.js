module.exports = function (sequelize, Sequelize) {
  const Users = sequelize.define(
    "Users",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        notNull: true,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        validate: {
          isEmail: {
            msg: "Must be a valid email address",
          },
        },
        notNull: true,
      },
      password: {
        type: Sequelize.STRING,
        required: true,
      },
      status: {
        type: Sequelize.ENUM("CREATED", "DELETED"),
        defaultValue: "CREATED",
      },
      role: {
        type: Sequelize.ENUM("ADMIN", "USER"),
        defaultValue: "USER",
      }
    },
    {
      schema: "tbl",
      paranoid: true
    }
  );

  Users.associate = function (models) {
    Users.hasMany(models.Quotes);
  };
  return Users;
};
