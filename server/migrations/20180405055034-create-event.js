'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Events', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING
            },
            description: {
                allowNull: false,
                type: Sequelize.TEXT
            },
            price: {
                allowNull: false,
                defaultValue: 0,
                type: Sequelize.FLOAT
            },
            capacity: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            max: {
                allowNull: false,
                defaultValue: 1,
                type: Sequelize.INTEGER
            },
            location: {
                allowNull: false,
                type: Sequelize.STRING
            },
            time: {
                allowNull: false,
                type: Sequelize.DATE
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
        return queryInterface.dropTable('Events');
    }
};