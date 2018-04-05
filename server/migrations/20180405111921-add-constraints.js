'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addConstraint('Promotions', ['code', 'eventId'], {
            type: 'unique',
            name: 'unique_code'
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeConstraint('Promotions', 'unique_code')
    }
};