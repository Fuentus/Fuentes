const { Sequelize } = require('sequelize')
const db = require('../config/db')

const Quote = db.define('quote_table', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        notNull: true,
        unique: true
    },
    title: {
        type: Sequelize.STRING,
        notNull: true,
    },
    desc: {
        type: Sequelize.STRING
    },
    status: {
        type: Sequelize.ENUM('PENDING', 'ACCEPTED', 'COMPLETED'),
        notNull: true,
    },
    createdAt: {
        type: Sequelize.DATE,
        notNull: true,
        isDate: true
    },
    modifiedAt: {
        type: Sequelize.DATE,
        isDate: true
    }
})

module.exports = Quote;