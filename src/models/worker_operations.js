module.exports = function (sequelize, DataTypes) {
    const {Operations, Workers} = sequelize.models;
    const {INTEGER, UUID, UUIDV4, DECIMAL} = DataTypes;
    const WorkerOperations = sequelize.define('worker_operations', {
        tag_workers_operations_id: {
            type: UUID,
            defaultValue: UUIDV4,
            primaryKey: true
        },
        worker_id: {
            type: INTEGER,
            primaryKey: false,
            references: {
                model: Workers,
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
                model: Operations,
                key: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'cascade',
            unique: 'unique-worker-per-operations'
        },
        avail_per_day: {
            type: DECIMAL,
            notNull: true,
        },
        est_cost: {
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