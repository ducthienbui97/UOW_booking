"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Promotions", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      code: {
        allowNull: false,
        type: Sequelize.STRING
      },
      isPercentage: {
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      amount: {
        defaultValue: 0,
        type: Sequelize.FLOAT
      },
      expire: {
        type: Sequelize.DATE
      },
      minSpend: {
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Promotions");
  }
};
