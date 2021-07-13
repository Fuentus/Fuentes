module.exports = function (sequelize, Sequelize) {
    const Inventory = sequelize.define(
        "Inventory",
        {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                notNull: true,
                unique: true,
            },
            itemName: {
                type: Sequelize.STRING,
                notNull: true,
            },
            itemDesc: {
                type: Sequelize.STRING,
                notNull: true,
            },
            operationsTagged: {
                type: Sequelize.STRING,
                allowNull: true,
                foreignKey: false
            },
            availability: {
                type: Sequelize.INTEGER,
                notNull: true,
            },
            cost: {
                type: Sequelize.INTEGER,
                notNull: true,
            },
            supplierInfo: {
                type: Sequelize.STRING,
                allowNull: true
            }
        },
        {
            schema: "tbl",
            paranoid: true,
            underscored: true,
            version: true
        }
    );

    Inventory.associate = function (models) {
        Inventory.belongsToMany(models.Operations, {
            through: "inv_operations",
            as: "operations",
            foreignKey: "operation_id",
        });
    };
    return Inventory;
};
