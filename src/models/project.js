module.exports = function (sequelize, Sequelize) {
    const Projects = sequelize.define(
      "Projects",
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          notNull: true,
          unique: true,
        },
        p_name: {
          type: Sequelize.STRING,
          notNull: true,
        },
        p_desc: {
          type: Sequelize.STRING,
        },
        hours_commited: {
          type: Sequelize.INTEGER
        },
        hours_left: {
          type: Sequelize.INTEGER
        },
        start_date: {
            type: Sequelize.DATE,
            notNull: true
        },
        end_date: {
            type: Sequelize.DATE,
            notNull: true
        },
        p_status: {
          type: Sequelize.ENUM("REQUEST RECIEVED", "NOT STARTED", "IN PROGRESS", "COMPLETED"),
          defaultValue: "REQUEST RECIEVED",
          notNull: true,
        },
      },
      {
        schema: "tbl",
      }
    );
      Projects.associate = function (models) {

        Projects.hasMany(models.Workers, { onDelete : 'cascade' , onUpdate: 'cascade'});
      };
    return Projects;
  };