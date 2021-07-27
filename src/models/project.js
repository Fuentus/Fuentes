module.exports = function (sequelize, DataTypes) {
    const {INTEGER, TEXT, STRING, DATE} = DataTypes;
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
        const {Quotes} = models;
        Projects.belongsTo(Quotes);
    };
    return Projects;
};