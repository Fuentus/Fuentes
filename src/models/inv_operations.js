module.exports = function (sequelize, DataTypes) {
    const {INTEGER, UUID} = DataTypes;
    const InvOperations = sequelize.define('inv_operations', {
        tag_inv_operations_id: {
            type: UUID,
            defaultValue: INTEGER,
            primaryKey: true
        },
        inv_id: {
            type: INTEGER,
            primaryKey: false,
            references: {
                model: 'tbl.Inventories',
                key: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'cascade',
            unique: 'unique-inv-per-operations'
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
            unique: 'unique-inv-per-operations'
        },
        req_avail: {
            type: INTEGER,
            notNull: true,
        }
    }, {
        timestamps: true,
        underscored: true,
        schema: "tbl",
        version: true
    });

    InvOperations.associate = function (models) {
        const {Operations,Inventory} = models;
        InvOperations.belongsTo(Inventory, { foreignKey: 'inv_id', targetKey: 'id', as: 'Inventory' });
        InvOperations.belongsTo(Operations, { foreignKey: 'operation_id', targetKey: 'id', as: 'Operations' });
    };
    return InvOperations;
};