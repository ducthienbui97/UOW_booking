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
          min: 1
        }
      },
      stripeId: DataTypes.STRING,
      promotionCode: DataTypes.STRING,
      total: DataTypes.FLOAT,
      discounted: {
        type:DataTypes.FLOAT,
        defaultValue: 0
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
    Transaction.belongsTo(models.Event,{
      foreignKey:"eventId",
      onDelete: "CASCADE"
    });
    Transaction.belongsTo(models.User,{
      foreignKey:"userId",
      onDelete:"CASCADE",
    });
    Transaction.hasMany(models.Ticket, {
      foreignKey: "transactionId",
      onDelete: "CASCADE"
    });

  };
  return Transaction;
};
