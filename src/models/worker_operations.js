module.exports = function (sequelize, DataTypes) {
    const {INTEGER, UUID, DECIMAL} = DataTypes;
    const WorkerOperations = sequelize.define('worker_operations', {
        tag_inv_operations_id: {
            type: UUID,
            defaultValue: INTEGER,
            primaryKey: true
        },
        worker_id: {
            type: INTEGER,
            primaryKey: false,
            references: {
                model: 'tbl.Workers',
                key: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'cascade',
            unique: 'unique-worker-per-operations'
        },
        operation_id: {
            type: INTEGER,
            primaryKey: false,
            references: {
                model: 'tbl.Operations',
                key: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'cascade',
            unique: 'unique-worker-per-operations'
        },
        avail_per_day: {
            type: DECIMAL,
            notNull: true,
        }
    }, {
        timestamps: true,
        underscored: true,
        schema: "tbl",
        version: true
    });

    WorkerOperations.associate = function (models) {
        const {Operations, Inventory} = models;
        WorkerOperations.belongsTo(Inventory, {foreignKey: 'worker_id', targetKey: 'id', as: 'Workers'});
        WorkerOperations.belongsTo(Operations, {foreignKey: 'operation_id', targetKey: 'id', as: 'Operations'});
    };
    return WorkerOperations;
};