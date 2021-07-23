module.exports = function (sequelize, DataTypes) {
    const {INTEGER, TEXT, STRING} = DataTypes;
    const Operations = sequelize.define(
        "Operations",
        {
            id: {
                type: INTEGER,
                autoIncrement: true,
                primaryKey: true,
                notNull: true,
                unique: true,
            },
            name: {
                type: STRING,
                notNull: true,
            },
            desc: {
                type: TEXT,
                notNull: true,
            }
        },
        {
            schema: "tbl",
        }
    );

    Operations.associate = function (models) {
        const {Quotes, inv_operations: InvOperations} = models;

        Operations.belongsToMany(Quotes, {
            through: "quote_operations",
            as: "Quotes",
            foreignKey: "quote_id",
        });
        Operations.hasMany(InvOperations, {
            foreignKey: "operation_id",
            as: "OperationInventories",
        });
    };


    return Operations;
};
  