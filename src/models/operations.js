module.exports = function (sequelize, Sequelize) {
    const Operations = sequelize.define(
        "Operations",
        {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                notNull: true,
                unique: true,
            },
            o_name: {
                type: Sequelize.STRING,
                notNull: true,
            },
            o_desc: {
                type: Sequelize.STRING,
                notNull: true,
            },
            workers_req: {
                type: Sequelize.INTEGER,
                notNull: true,
            },
            tools_materials: {
                type: Sequelize.STRING,
                notNull: true,
            }
        },
        {
            schema: "tbl",
        }
    );

    Operations.associate = function (models) {
        Operations.belongsToMany(models.Inventory, {
            through: "inv_operations",
            as: "inventory",
            foreignKey: "inventory_id",
        });
        // Operations.hasMany(models.Inventory)
        // Operations.hasMany(models.Workers, { onDelete : 'cascade' , onUpdate: 'cascade'});
    };


    return Operations;
};
  