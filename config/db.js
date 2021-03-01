const Sequelize = require('sequelize')

//const sequelize = new Sequelize('mysql://root:5432/quote_table')

const sequelize = new Sequelize(
  `${process.env.MYSQL_DATABASE}`,
  `${process.env.MYSQL_USER}`,
  `${process.env.MYSQL_PASS}`,
  {
    host: `${process.env.MYSQL_HOST}`,
    dialect: 'mysql'
  });
module.exports = sequelize
