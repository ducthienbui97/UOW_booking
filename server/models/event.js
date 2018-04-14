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
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate:{
          isFloat: true,
          min: 0
        }
      },
      capacity:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
          isInt: true,
          min: 1
        }
      },
      location:{
        type: DataTypes.STRING,
        allowNull: false
      },
      imageURL: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: true
        }
      },
      start_time: {
        type: DataTypes.DATE,
        allowNull: false
      },
      end_time: {
        type: DataTypes.DATE,
        validate: {
          isAfter: function(end){
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
