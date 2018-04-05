'use strict';
module.exports = (sequelize, DataTypes) => {
    var User = sequelize.define('User', {
        name: DataTypes.STRING,
        password: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: true
            }
        },
        studentNo: {
            type: DataTypes.STRING,
            validate: {
                isNumeric: true
            }
        }
    }, {});
    User.associate = function(models) {
        // associations can be defined here
        User.hasMany(models.Event);
    };
    return User;
};