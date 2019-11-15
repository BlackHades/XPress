'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn("users", "btcAddress", {
            allowNull: true,
            type: Sequelize.STRING,
            after: "isActive",
            defaultValue: null

        });
    },

    down: (queryInterface, Sequelize) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.dropTable('users');
        */
        return queryInterface.removeColumn("users", "btcAddress");
    }
};