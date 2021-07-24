const {MYSQL_DATABASE, MYSQL_USER, MYSQL_HOST, MYSQL_PASS} = require("../util/config");

const Sequelize = require("sequelize");
const db = {};
const fs = require('fs');
const path = require('path');
const basename = path.basename(module.filename);
const sequelize = new Sequelize(
    MYSQL_DATABASE,
    MYSQL_USER,
    MYSQL_PASS,
    {
        host: MYSQL_HOST,
        port: '3306',
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
