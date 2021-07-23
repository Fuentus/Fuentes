module.exports = function (sequelize, DataTypes) {
    const {INTEGER, STRING} = DataTypes;
    const Professions = sequelize.define(
        "Professions",
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
            }
        },
        {
            schema: "tbl_master"
        }
    );

    // Professions.sync().then(() => {
    //     Professions.create({
    //         name: 'PAINTING',
    //     });
    //     Professions.create({
    //         name: 'DRILLING'
    //     });
    // });

    Professions.associate = function (models) {
        const {Workers} = models;
        Professions.hasMany(Workers);
    };

    return Professions;
};
