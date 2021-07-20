module.exports = function (sequelize, DataTypes) {
    const {INTEGER, TEXT, STRING, DECIMAL} = DataTypes;
    const Workers = sequelize.define(
        "Workers",
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
            phone: {
                type: STRING,
                notNull: true
            },
            address: {
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
            avail_per_day: {
                type: DECIMAL,
                validate: {
                    isDecimal: true
                }
            },
            cost_per_hr: {
                type: DECIMAL,
                validate: {
                    isDecimal: true
                }
            }
        },
        {
            schema: "tbl",
        }
    );

    Workers.associate = function (models) {
        const {Professions} = models;
        Workers.belongsTo(Professions, {
            foreignKey: {
                allowNull: false,
            },
        });
    };
    return Workers;
};