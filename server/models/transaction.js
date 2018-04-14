"use strict";
module.exports = (sequelize, DataTypes) => {
  var Transaction = sequelize.define(
    "Transaction",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      quantity: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: true,
          min: 1
        }
      },
      stripeId: DataTypes.STRING,
      promotionCode: DataTypes.STRING,
      total: {
        type: DataTypes.FLOAT,
        validate: {
          isFloat: true,
          min: 0
        }
      },
      discounted: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        validate: {
          isFloat: true,
          min: 0
        }
      },
      cancelled:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {}
  );
  Transaction.associate = function(models) {
    // associations can be defined here
    Transaction.belongsTo(models.Promotion, {
      foreignKey: "promotionId",
      onDelete: "SET NULL"
    });
    Transaction.belongsTo(models.Event, {
      foreignKey: "eventId",
      onDelete: "CASCADE"
    });
    Transaction.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
    Transaction.hasMany(models.Ticket, {
      foreignKey: "transactionId",
      onDelete: "CASCADE"
    });
  };
  return Transaction;
};
