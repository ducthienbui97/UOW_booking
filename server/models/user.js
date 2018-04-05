'use strict';
module.exports = (sequelize, DataTypes) => {
    var User = sequelize.define('User', {
        name: DataTypes.STRING,
        password: DataTypes.STRING,
        email: DataTypes.STRING,
        studentNo: DataTypes.STRING
    }, {});
    User.associate = function(models) {
        // associations can be defined here
        User.hasMany(Event);
    };
    return User;
};