"use strict";
module.exports = (sequelize, DataTypes) => {
  var Ticket = sequelize.define(
    "Ticket",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      name: DataTypes.STRING,
      email: {
        type:DataTypes.STRING,
        validate:{
          isEmail: true
        }
      },
      studentNo: {
        type:DataTypes.STRING,
        validate:{
          isNumeric: true
        }
      }
    },
    {}
  );
  Ticket.associate = function(models) {
    // associations can be defined here
    Ticket.belongsTo(models.Transaction, {
      foreignKey: "transactionId",
      onDelete: "CASCADE"
    });
  };
  return Ticket;
};
