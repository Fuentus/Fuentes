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
        defaultValue: 'PENDING',
        notNull: true,
    }
}, {
    schema: 'tbl'
})
Quote.associate = function (models) {
    Quote.belongsTo(models.User);
    Quote.hasMany(models.Measure);
};

module.exports = Quote;