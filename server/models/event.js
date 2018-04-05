'use strict';
module.exports = (sequelize, DataTypes) => {
    var Event = sequelize.define('Event', {
        name: DataTypes.STRING,
        description: DataTypes.TEXT,
        price: DataTypes.FLOAT,
        capacity: DataTypes.INTEGER,
        location: DataTypes.STRING,
        imageURL: {
            type: DataTypes.STRING,
            validate: {
                isUrl: true
            }
        },
        time: DataTypes.DATE,
        max: {
            type: DataTypes.INTEGER,
            validate: {
                min: 1,
                max: 10
            }
        }
    }, {});
    Event.associate = function(models) {
        // associations can be defined here
        Event.belongsTo(models.User);
    };
    return Event;
};