'use strict';

module.exports = {
    up: (queryInterface, type) => {

        return queryInterface.createTable("ratings", {
            id: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            userId: {
                type: type.STRING,
                allowNull: false
            },
            agentId: {
                type: type.STRING,
                allowNull: false
            },
            comment: {
                type: type.STRING,
                allowNull: true
            },
            rating: {
                type: type.INT,
                defaultValue: 0
            },
            createdAt: {
                type: type.DATE,
                defaultValue: Date.now
            },
            updatedAt: {
                type: type.DATE,
                defaultValue: Date.now
            }
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable("ratings");
    }
};
