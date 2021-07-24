module.exports = function (sequelize, DataTypes) {
    const {Operations, Inventory} = sequelize.models;
    const {INTEGER, UUID, UUIDV4} = DataTypes;
    const InvOperations = sequelize.define('inv_operations', {
        tag_inv_operations_id: {
            type: UUID,
            allowNull: false,
            defaultValue: UUIDV4,
            primaryKey: true
        },
        inv_id: {
            type: INTEGER,
            primaryKey: false,
            references: {
                model: Inventory,
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
                model: Operations,
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
        const {Operations, Inventory} = models;
        InvOperations.belongsTo(Inventory, {foreignKey: 'inv_id', targetKey: 'id', as: 'Inventories'});
        InvOperations.belongsTo(Operations, {foreignKey: 'operation_id', targetKey: 'id', as: 'Operations'});
    };
    return InvOperations;
};