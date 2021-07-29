const {FLOAT} = require("sequelize");
module.exports = function (sequelize, DataTypes) {
    const {project_workers: ProjectWorkers} = sequelize.models;
    const {DATE, UUID, UUIDV4,FLOAT} = DataTypes;
    const ProjectWorkersDate = sequelize.define('project_workers_log', {
        tag_workers_project_operation_date_id: {
            type: UUID,
            defaultValue: UUIDV4,
            primaryKey: true
        },
        tag_workers_project_operation_id: {
            type: UUID,
            primaryKey: false,
            references: {
                model: ProjectWorkers,
                key: 'tag_workers_project_id'
            },
            onDelete: 'cascade',
            onUpdate: 'cascade',
            unique: 'unique-worker-operation-per-project'
        },
        log_date: {
            type: DATE,
            notNull: true,
            unique: 'unique-worker-operation-per-project'
        },
        hrs_spent: {
            type: FLOAT,
            notNull: true
        }
    }, {
        timestamps: true,
        underscored: true,
        schema: "tbl",
        version: true
    });

    ProjectWorkersDate.associate = function (models) {
        const {project_workers: ProjectWorkers} = models;
        ProjectWorkersDate.belongsTo(ProjectWorkers, {
            foreignKey: 'tag_workers_project_operation_id',
            targetKey: 'tag_workers_project_id',
            as: 'ProjectWorkers'
        });
    };
    return ProjectWorkersDate;
};