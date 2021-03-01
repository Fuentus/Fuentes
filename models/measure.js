const { Sequelize } = require('sequelize')
const db = require('../config/db')

const Measure = db.define('measures', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        notNull: true,
        unique: true
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
    }
},{
    schema: 'tbl',
});

module.exports = Measure;