'use strict';
module.exports = (sequelize, DataTypes) => {
  var Transaction = sequelize.define('Transaction', {
    quantity: DataTypes.INTEGER
  }, {});
  Transaction.associate = function(models) {
    // associations can be defined here
  };
  return Transaction;
};