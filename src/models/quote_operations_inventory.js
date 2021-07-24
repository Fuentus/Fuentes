module.exports = function (sequelize, DataTypes) {
    const {quote_operations:QuotesOperations, Inventory} = sequelize.models;
    const {INTEGER, UUID, UUIDV4} = DataTypes;
    const QuoteOperationInv = sequelize.define('quote_operation_inv', {
        tag_inv_operations_id: {
            type: UUID,
            allowNull: false,
            defaultValue: UUIDV4,
            primaryKey: true
        },
        quote_operation_id: {
            type: UUID,
            primaryKey: false,
            references: {
                model: QuotesOperations,
                key: 'tag_inv_operations_id'
            },
            onDelete: 'cascade',
            onUpdate: 'cascade',
            unique: 'quote-inv-per-operations'
        },
        inv_id: {
            type: INTEGER,
            primaryKey: false,
            allowNull: true,
            references: {
                model: Inventory,
                key: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'cascade',
            unique: 'quote-inv-per-operations'
        }

    }, {
        timestamps: true,
        underscored: true,
        schema: "tbl",
        version: true
    });

    QuoteOperationInv.associate = function (models) {
        const {Quote, Operations, Inventory} = models;
        // QuoteOperationInv.belongsTo(Quote, { foreignKey: 'quote_id', targetKey: 'id', as: 'Quotes' });
        // QuoteOperationInv.belongsTo(Inventory, { foreignKey: 'inv_id', targetKey: 'id', as: 'Inventories' });
        // QuoteOperationInv.belongsTo(Operations, { foreignKey: 'operation_id', targetKey: 'id', as: 'Operations' });
    };
    return QuoteOperationInv;
};