module.exports = function (sequelize, Sequelize) {
    const {INTEGER} = Sequelize;
    const PasswordChangeWorker = sequelize.define(
        "password_change_worker",
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
    PasswordChangeWorker.associate = function (models) {
        const { Workers } = models;
        PasswordChangeWorker.belongsTo(Workers, {
            foreignKey: {
                allowNull: false,
            },
        });
    };
    return PasswordChangeWorker;
};
