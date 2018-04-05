'use strict';
module.exports = (sequelize, DataTypes) => {
  var Ticket = sequelize.define('Ticket', {
    number: DataTypes.INTEGER,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    studentNo: DataTypes.STRING
  }, {});
  Ticket.associate = function(models) {
    // associations can be defined here
  };
  return Ticket;
};