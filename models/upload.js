module.exports = function (sequelize, Sequelize) {
    const Uploads = sequelize.define(
        "Uploads",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                notNull: true,
                unique: true,
              },
              fileDocument: {
                type: Sequelize.BLOB
              },
              fileName:{
                type: Sequelize.INTEGER,
                notNull: true
              },
              filePath:{
                type: Sequelize.STRING,
                notNull: true
              },
              createdAt: {
                allowNull: false,
                type: Sequelize.DATE
              },
              updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
              }
        }, {
            schema: "tbl"
        }
    );
    Uploads.associate = function (models) {
        Uploads.belongTo(models.Quotes, {
            foreignKey: {
                allowNull: false,
            }
        });
    }
}