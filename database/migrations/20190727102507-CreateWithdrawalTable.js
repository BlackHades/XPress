'use strict';

module.exports = {
    up: (queryInterface, type) => {
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.createTable('users', { id: Sequelize.INTEGER });
        */


        return queryInterface.createTable("withdrawals", {
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
            amount: {
                type: type.FLOAT,
                defaultValue: 0
            },
            status:{
                type: type.STRING,
                defaultValue: "PENDING"
            },
            reason:{
                type: type.STRING,
                allowNull: true
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

        return queryInterface.dropTable("withdrawals");
    }
};
