const { Sequelize } = require('sequelize')
const db = require('../config/db')

const Measures = db.define('quote_measures', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        notNull: true,
        unique: true
    },
    quote_id: {
        type: Sequelize.INTEGER,
        foreignKey : true,
        references: 'quote_table',
        referencesKey: 'quote_id',
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
})

module.exports = Measures;