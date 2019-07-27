'use strict';

module.exports = {
    up: (queryInterface, type) => {
        return queryInterface.createTable("wallets", {
            id: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            userId: {
                type: type.STRING,
                allowNull: false
            },
            userType: {
                type: type.STRING,
                defaultValue: "user"
            },
            balance: {
                type: type.FLOAT,
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
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.dropTable('users');
        */
        return queryInterface.dropTable('wallets');

    }
};
