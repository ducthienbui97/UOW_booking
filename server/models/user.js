'use strict';
module.exports = (sequelize, DataTypes) => {
    var User = sequelize.define('User', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        name: DataTypes.STRING,
        password: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        studentNo: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isNumeric: true
            }
        }
    }, {});
    User.associate = function(models) {
        // associations can be defined here
        User.hasMany(models.Event, {
            foreignKey: 'userId',
            onDelete: 'CASCADE'
        });
        User.hasMany(models.Transaction, {
            foreignKey: 'userId',
            onDelete: 'CASCADE'
        })
    };
    return User;
};