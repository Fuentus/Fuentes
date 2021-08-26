module.exports = function (sequelize, DataTypes) {
    const {INTEGER, STRING} = DataTypes;
    const Inspections = sequelize.define(
        "Inspections",
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
                type: STRING,
                notNull: true,
            },
            cost: {
                type: INTEGER,
                notNull: true
            }
        },
        {
            schema: "tbl"
        }
    );

    Inspections.associate = function (models) {
        const {Quotes} = models;
        Inspections.hasMany(Quotes);
    };

    return Inspections;
};
