'use strict';
module.exports = (sequelize, DataTypes) => {
    var Event = sequelize.define('Event', {
        name: DataTypes.STRING,
        description: DataTypes.TEXT,
        price: DataTypes.FLOAT,
        capacity: DataTypes.INTEGER,
        max: DataTypes.INTEGER
    }, {});
    Event.associate = function(models) {
        // associations can be defined here
        Event.belongsTo(User);
    };
    return Event;
};