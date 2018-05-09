"use strict";
var bCrypt = require("bcrypt-nodejs");
var uuidv4 = require('uuid/v4');
module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert("Users", [
      {
        id: uuidv4(),
        name: "Admin",
        isAdmin: true,
        email: "admin@uow.edu.au",
        password: bCrypt.hashSync("admin"),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete("Users",{email: "admin@uow.edu.au"});
  }
};
