module.exports = function (sequelize, DataTypes) {
    const {INTEGER, TEXT, STRING, DECIMAL} = DataTypes;
    const Inventory = sequelize.define(
        "Inventory",
        {
            id: {
                type: INTEGER,
                autoIncrement: true,
                primaryKey: true,
                notNull: true,
                unique: true,
            },
            itemName: {
                type: STRING,
                notNull: true,
            },
            itemDesc: {
                type: TEXT,
                notNull: true,
            },
            availability: {
                type: INTEGER,
                notNull: true,
            },
            cost: {
                type: DECIMAL,
                validate: {
                    isDecimal: true
                }
            },
            supplierInfo: {
                type: STRING,
                allowNull: true
            }
        },
        {
            schema: "tbl"
        }
    );

    Inventory.associate = function (models) {
    };
    return Inventory;
};
