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
            name: {
                type: Sequelize.STRING,
                notNull: true,
            },
            desc: {
                type: Sequelize.STRING,
                notNull: true,
            }
        },
        {
            schema: "tbl",
        }
    );

    Operations.associate = function (models) {
        const {Quotes,Inventory} = models;
        Operations.belongsToMany(Inventory, {
            through: "inv_operations",
            as: "Inventory",
            foreignKey: "inventory_id",
        });

        Operations.belongsToMany(Quotes, {
            through: "quote_operations",
            as: "Quotes",
            foreignKey: "quote_id",
        });
        // Operations.hasMany(models.Workers, { onDelete : 'cascade' , onUpdate: 'cascade'});
    };


    return Operations;
};
  