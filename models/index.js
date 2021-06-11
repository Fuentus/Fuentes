const Sequelize = require("sequelize");
const db = {};
const fs = require('fs');
const path = require('path');
const basename = path.basename(module.filename);

const sequelize = new Sequelize(
  `${process.env.MYSQL_DATABASE}`,
  `${process.env.MYSQL_USER}`,
  `${process.env.MYSQL_PASS}`,
  {
    host: `${process.env.MYSQL_HOST}`,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
);

fs.readdirSync(__dirname)
  .filter(function (file) {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach(function (file) {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
    db[model.name] = model;
  });

Object.keys(db).forEach(function (modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
