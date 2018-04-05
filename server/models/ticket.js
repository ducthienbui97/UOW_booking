'use strict';
module.exports = (sequelize, DataTypes) => {
    var Ticket = sequelize.define('Ticket', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        studentNo: DataTypes.STRING
    }, {});
    Ticket.associate = function(models) {
        // associations can be defined here
        Ticket.belongsTo(models.Transaction, {
            foreignKey: 'transactionId',
            onDelete: 'CASCADE'
        })
    };
    return Ticket;
};