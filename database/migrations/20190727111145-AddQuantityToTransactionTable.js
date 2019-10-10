'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.createTable('users', { id: Sequelize.INTEGER });
        */

        return queryInterface.addColumn("transactions", "quantity", {
            after: "description",
            type: Sequelize.INTEGER,
            defaultValue: 1
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn("transactions", "quantity");
    }
};
