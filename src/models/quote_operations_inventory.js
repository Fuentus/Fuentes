module.exports = function (sequelize, DataTypes) {
    const {quote_operations: QuotesOperations, Inventory} = sequelize.models;
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
                key: 'tag_quote_operations_id'
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
        },
        req_quantity:{
            type: INTEGER
        }
    }, {
        timestamps: true,
        underscored: true,
        schema: "tbl",
        version: true
    });

    QuoteOperationInv.associate = function (models) {
        const {quote_operations: QuotesOperations, Inventory} = models;
        QuoteOperationInv.belongsTo(QuotesOperations, {
            foreignKey: 'quote_operation_id',
            targetKey: 'tag_quote_operations_id',
            as: 'QuotesOperations'
        });
        QuoteOperationInv.belongsTo(Inventory, {foreignKey: 'inv_id', targetKey: 'id', as: 'Inventories'});
    };
    return QuoteOperationInv;
};