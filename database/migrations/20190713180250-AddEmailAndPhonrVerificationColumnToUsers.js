'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.createTable('users', { id: Sequelize.INTEGER });
        */

        try {
            await queryInterface.addColumn('users', 'emailVerifiedAt', {
                type: Sequelize.DATE,
                allowNull: true,
                after: "isActive"
            });

            await queryInterface.addColumn('users', 'phoneVerifiedAt', {
                type: Sequelize.DATE,
                allowNull: true,
                after: "emailVerifiedAt"
            });
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    },

    down: async (queryInterface, Sequelize) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.dropTable('users');
        */

        try {
            await queryInterface.removeColumn('users', 'emailVerifiedAt');
            await queryInterface.removeColumn('users', 'phoneVerifiedAt');
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }
};
