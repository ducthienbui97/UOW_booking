'use strict';
module.exports = (sequelize, DataTypes) => {
  var Promotion = sequelize.define('Promotion', {
    code: DataTypes.STRING,
    isPercentage: DataTypes.BOOLEAN,
    amount: DataTypes.FLOAT
  }, {});
  Promotion.associate = function(models) {
    // associations can be defined here
  };
  return Promotion;
};