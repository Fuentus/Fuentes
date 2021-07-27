const {FLOAT} = require("sequelize");
module.exports = function (sequelize, DataTypes) {
    const {quote_operations: QuotesOperations, Workers} = sequelize.models;
    const {INTEGER, UUID, UUIDV4} = DataTypes;
    const QuoteOperationWorkers = sequelize.define('quote_operation_workers', {
        tag_worker_operations_id: {
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
            unique: 'quote-worker-per-operations'
        },
        worker_id: {
            type: INTEGER,
            primaryKey: false,
            allowNull: true,
            references: {
                model: Workers,
                key: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'cascade',
            unique: 'quote-worker-per-operations'
        },
        total_hrs_req: {
            type: FLOAT
        }
    }, {
        timestamps: true,
        underscored: true,
        schema: "tbl",
        version: true
    });

    QuoteOperationWorkers.associate = function (models) {
        const {quote_operations: QuotesOperations, Workers} = models;
        QuoteOperationWorkers.belongsTo(QuotesOperations, {
            foreignKey: 'quote_operation_id',
            targetKey: 'tag_quote_operations_id',
            as: 'QuotesOperations'
        });
        QuoteOperationWorkers.belongsTo(Workers, {foreignKey: 'worker_id', targetKey: 'id', as: 'Workers'});
    };
    return QuoteOperationWorkers;
};