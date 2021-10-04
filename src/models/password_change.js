module.exports = function (sequelize, Sequelize) {
    const {INTEGER} = Sequelize;
    const PasswordChange = sequelize.define(
        "password_change",
        {
            id: {
                type: INTEGER,
                primaryKey: true,
                autoIncrement: true,
                notNull: true,
                unique: true,
            },
            code: {
                type: INTEGER,
                notNull: true,
            }
        },
        {
            schema: "tbl"
        }
    );
    PasswordChange.associate = function (models) {
        const {Users} = models;
        PasswordChange.belongsTo(Users, {
            foreignKey: {
                allowNull: false,
            },
        });
    };
    return PasswordChange;
};
