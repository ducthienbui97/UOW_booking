"use strict";
module.exports = (sequelize, DataTypes) => {
  var Promotion = sequelize.define(
    "Promotion",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isAlphanumeric: true
        }
      },
      isPercentage: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
        validate: {
          isLessThan100pc: function(value) {
            if (this.isPercentage && value > 100)
              throw new Error("Maximum discount is 100%");
          }
        }
      },
      expire: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: function() {
          return this.event.start_time;
        },
        validate: {
          isBeforeEvent: function(expire) {
            if (expire > this.event.start_time)
              throw new Error("Promotion should end before event start");
          }
        }
      },
      minSpend: DataTypes.FLOAT
    },
    {}
  );
  Promotion.associate = function(models) {
    // associations can be defined here
    Promotion.belongsTo(models.Event, {
      foreignKey: "eventId",
      onDelete: "CASCADE"
    });
    Promotion.hasMany(models.Transaction, {
      foreignKey: "promotionId",
      onDelete: "SET NULL"
    });
  };
  return Promotion;
};
