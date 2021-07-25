module.exports = function (sequelize, DataTypes) {
    const {Quotes, Operations} = sequelize.models;
    const {INTEGER, FLOAT, STRING, UUID, UUIDV4, DECIMAL} = DataTypes;
    const QuoteOperation = sequelize.define('quote_operations', {
        tag_quote_operations_id: {
            type: UUID,
            allowNull: false,
            defaultValue: UUIDV4,
            primaryKey: true
        },
        quote_id: {
            type: INTEGER,
            primaryKey: false,
            references: {
                model: Quotes,
                key: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'cascade',
            unique: 'quote-per-operations'
        },
        operation_id: {
            type: INTEGER,
            primaryKey: false,
            references: {
                model: Operations,
                key: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'cascade',
            unique: 'quote-per-operations'
        },
        inspection: {
            type: STRING,
            notNull: true,
        },
        operation_total_hrs: {
            type: FLOAT,
            notNull: true,
        },
        operation_cost: {
            type: DECIMAL,
            validate: {
                isDecimal: true
            }
        }
    }, {
        timestamps: true,
        underscored: true,
        schema: "tbl",
        version: true
    });

    QuoteOperation.associate = function (models) {
        const {Quotes, Operations} = models;
        QuoteOperation.belongsTo(Quotes, {foreignKey: 'quote_id', targetKey: 'id', as: 'Quotes'});
        QuoteOperation.belongsTo(Operations, {foreignKey: 'operation_id', targetKey: 'id', as: 'Operations'});
    };
    return QuoteOperation;
};