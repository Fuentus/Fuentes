module.exports = function (sequelize, DataTypes) {
    const {Quotes, Operations} = sequelize.models;
    const {INTEGER, UUID, UUIDV4} = DataTypes;
    const QuoteOperation = sequelize.define('quote_operations', {
        tag_inv_operations_id: {
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

    }, {
        timestamps: true,
        underscored: true,
        schema: "tbl",
        version: true
    });

    QuoteOperation.associate = function (models) {
        const {Quote, Operations} = models;
        // QuoteOperationInv.belongsTo(Quote, { foreignKey: 'quote_id', targetKey: 'id', as: 'Quotes' });
        // QuoteOperationInv.belongsTo(Inventory, { foreignKey: 'inv_id', targetKey: 'id', as: 'Inventories' });
        // QuoteOperationInv.belongsTo(Operations, { foreignKey: 'operation_id', targetKey: 'id', as: 'Operations' });
    };
    return QuoteOperation;
};