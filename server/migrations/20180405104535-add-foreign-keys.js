'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn('Events', 'userId', {
                type: Sequelize.UUID,
                onDelete: 'CASCADE',
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            }),
            queryInterface.addColumn('Transactions', 'userId', {
                type: Sequelize.UUID,
                onDelete: 'CASCADE',
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            }),
            queryInterface.addColumn('Promotions', 'eventId', {
                type: Sequelize.UUID,
                onDelete: 'CASCADE',
                allowNull: false,
                references: {
                    model: 'Events',
                    key: 'id'
                }
            }),
            queryInterface.addColumn('Transactions', 'promotionId', {
                type: Sequelize.UUID,
                onDelete: 'SET NULL',
                references: {
                    model: 'Promotions',
                    key: 'id'
                }
            }),
            queryInterface.addColumn('Tickets', 'transactionId', {
                type: Sequelize.UUID,
                onDelete: 'CASCADE',
                allowNull: false,
                references: {
                    model: 'Transactions',
                    key: 'id'
                }
            }),
            queryInterface.addColumn('Transactions','eventId',{
                type: Sequelize.UUID,
                onDelete: 'CASCADE',
                allowNull: false,
                references: {
                    model: 'Transactions',
                    key: 'id'
                }
            })
        ])
    },
    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn('Events', 'userId'),
            queryInterface.removeColumn('Transactions','userId'),
            queryInterface.removeColumn('Promotions', 'eventId'),
            queryInterface.removeColumn('Transactions', 'promotionId'),
            queryInterface.removeColumn('Tickets','transactionId'),
            queryInterface.removeColumn('Transactions','eventId')
        ])
    }
};