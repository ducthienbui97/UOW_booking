"use strict";
module.exports = (sequelize, DataTypes) => {
  var Event = sequelize.define(
    "Event",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
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
      start_time: DataTypes.DATE,
      end_time: {
        type: DataTypes.DATE,
        validate: {
          isAfter: function(end) {
            if (this.start_time >= end) {
              throw new Error("End time must be after start time");
            }
          }
        }
      },
      max: {
        type: DataTypes.INTEGER,
        validate: {
          min: 1
        }
      }
    },
    {}
  );
  Event.associate = function(models) {
    // associations can be defined here
    Event.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
    Event.hasMany(models.Transaction, {
      foreignKey: "eventId",
      onDelete: "CASCADE"
    });
    Event.hasMany(models.Promotion, {
      foreignKey: "eventId",
      onDelete: "CASCADE"
    });
  };
  return Event;
};
