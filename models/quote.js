const { Sequelize } = require('sequelize')
const db = require('../config/db')

const Quote = db.define('quotes', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
    }
}, {
    schema: 'tbl',
})

module.exports = Quote;