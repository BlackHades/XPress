'use strict';

module.exports = {
    up: (queryInterface, type) => {
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.createTable('users', { id: Sequelize.INTEGER });
        */


        return queryInterface.createTable('verifications', {
            id: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            code: {
                type: type.STRING,
                comment: "6 digit verification code"
            },
            value: {
                type: type.STRING,
            },
            type: {
                type: type.STRING,
                defaultValue: "email"
            },
            userType: {
                type: type.STRING,
                defaultValue: "user"
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

        return queryInterface.dropTable("verifications");
    }
};
