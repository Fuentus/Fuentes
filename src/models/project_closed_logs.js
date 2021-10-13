module.exports = function (sequelize, Sequelize) {
    const ProjectClosedLogs = sequelize.define(
        "project_closed_logs",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                notNull: true,
                unique: true,
            },
            note: {
                type: Sequelize.STRING,
                allowNull: true
            }
        },
        {
            schema: "tbl"
        }
    );
    ProjectClosedLogs.associate = function (models) {
        ProjectClosedLogs.belongsTo(models.Projects, {
            foreignKey: {
                allowNull: false,
            }
        });
    }
    return ProjectClosedLogs;
};
