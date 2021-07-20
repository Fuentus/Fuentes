module.exports = function (sequelize, Sequelize) {
    const {INTEGER, STRING, ENUM} = Sequelize;
    const Users = sequelize.define(
        "Users",
        {
            id: {
                type: INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            name: {
                type: STRING,
                notNull: true,
            },
            email: {
                type: STRING,
                unique: true,
                validate: {
                    isEmail: {
                        msg: "Must be a valid email address",
                    },
                },
                notNull: true,
            },
            password: {
                type: STRING,
                required: true,
            },
            status: {
                type: ENUM("CREATED", "DELETED"),
                defaultValue: "CREATED",
            },
            role: {
                type: ENUM("ADMIN", "USER", "WORKER"),
                defaultValue: "USER",
            }
        },
        {
            schema: "tbl",
            paranoid: true,
            version: true
        }
    );

    Users.associate = function (models) {
        const {Quotes} = models;
        Users.hasMany(Quotes);
    };
    return Users;
};
