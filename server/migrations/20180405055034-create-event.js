'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Events', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
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
            start_time: {
                allowNull: false,
                type: Sequelize.DATE
            },
            end_time:{
                allowNull: false,
                type: Sequelize.DATE,
                validate: {
                    isAfter: function(end) {
                        if (this.start_time >= end) {
                            throw new Error('End start_time must be less then start start_time')
                        }
                    }
                }
            },
            imageURL: {
                type: Sequelize.STRING
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