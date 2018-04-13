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
      code: DataTypes.STRING,
      isPercentage: DataTypes.BOOLEAN,
      amount: DataTypes.FLOAT,
      expire: DataTypes.DATE,
      minSpend: DataTypes.FLOAT,
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
