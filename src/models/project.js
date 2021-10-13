const {ProjectStatus} = require("../controllers/service/ProjectStatus");

module.exports = function (sequelize, DataTypes) {
    const {INTEGER, TEXT, STRING, DATE, ENUM} = DataTypes;
    const Projects = sequelize.define(
        "Projects",
        {
            id: {
                type: INTEGER,
                primaryKey: true,
                autoIncrement: true,
                notNull: true,
                unique: true,
            },
            name: {
                type: STRING,
                notNull: true,
            },
            desc: {
                type: TEXT,
            },
            status: {
                type: ENUM,
                values: ProjectStatus.getAllProjectStatus(),
                defaultValue: ProjectStatus.defaultValue(),
                notNull: true,
            },
            start_date: {
                type: DATE,
                notNull: true
            },
            end_date: {
                type: DATE,
                notNull: true
            },
        },
        {
            schema: "tbl",
            paranoid: true,
            version: true
        }
    );
    Projects.associate = function (models) {
        const {Quotes, project_workers: ProjectWorkers} = models;
        Projects.belongsTo(Quotes);
        Projects.hasMany(ProjectWorkers, {
            foreignKey: "project_id",
            as: "ProjectWorkers",
        });
    };
    return Projects;
};