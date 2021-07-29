module.exports = function (sequelize, DataTypes) {
    const {Projects, Workers, Operations} = sequelize.models;
    const {INTEGER, UUID, UUIDV4, FLOAT} = DataTypes;
    const ProjectWorkers = sequelize.define('project_workers', {
        tag_workers_project_id: {
            type: UUID,
            defaultValue: UUIDV4,
            primaryKey: true
        },
        operation_id: {
            type: INTEGER,
            primaryKey: false,
            references: {
                model: Operations,
                key: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'cascade',
            unique: 'unique-worker-operation-per-project'
        },
        worker_id: {
            type: INTEGER,
            primaryKey: false,
            references: {
                model: Workers,
                key: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'cascade',
            unique: 'unique-worker-operation-per-project'
        },
        project_id: {
            type: INTEGER,
            primaryKey: false,
            references: {
                model: Projects,
                key: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'cascade',
            unique: 'unique-worker-operation-per-project'
        },
        total_hrs: {
            type: FLOAT
        }
    }, {
        timestamps: true,
        underscored: true,
        schema: "tbl",
        version: true
    });

    ProjectWorkers.associate = function (models) {
        const {Projects, Workers, project_workers_log: ProjectWorkersLog} = models;
        ProjectWorkers.belongsTo(Operations, {foreignKey: 'operation_id', targetKey: 'id', as: 'Operations'});
        ProjectWorkers.belongsTo(Workers, {foreignKey: 'worker_id', targetKey: 'id', as: 'Workers'});
        ProjectWorkers.belongsTo(Projects, {foreignKey: 'project_id', targetKey: 'id', as: 'Projects'});
    };
    return ProjectWorkers;
};