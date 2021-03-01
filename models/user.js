const { Sequelize } = require('sequelize')
const db = require('../config/db')

const User = db.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    notNull: true,
  }, email: {
    type: Sequelize.STRING,
    unique: true,
    validate: {
      isEmail: {
        msg: "Must be a valid email address",
      }
    },
    notNull: true,
  }, password: {
    type: Sequelize.STRING,
    required: true
  }, status: {
    type: Sequelize.ENUM('CREATED', 'DELETED'),
    defaultValue: 'CREATED'
  }
}, {
  schema: 'tbl'
});

User.associate = function (models) {
  User.hasMany(models.Quote);;
};
module.exports = User;
