module.exports = function (sequelize, Sequelize) {
    const {INTEGER, STRING, ENUM, TEXT} = Sequelize;
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
                type: ENUM("ADMIN", "USER"),
                defaultValue: "USER",
            },
            phone: {
                type: STRING,
                allowNull: true,
            },
            address: {
                type: TEXT,
                allowNull: true,
            }
        },
        {
            schema: "tbl",
            paranoid: true,
            version: true
        }
    );
    // Users.sync().then(() => {
    //     Users.create({
    //         email:"ravi_admin@r.com",
    //         password:"12345",
    //         role:"ADMIN",
    //         name:"ravi"
    //     });
    //     Users.create({
    //         email:"ravi_user@r.com",
    //         password:"12345",
    //         role:"USER",
    //         name:"ravi"
    //     });
    // });
    Users.associate = function (models) {
        const {Quotes} = models;
        Users.hasMany(Quotes);
    };
    return Users;
};
