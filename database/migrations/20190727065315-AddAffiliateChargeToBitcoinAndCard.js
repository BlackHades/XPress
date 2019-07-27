'use strict';

module.exports = {
  up: async  (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */

    try {
      await queryInterface.addColumn('bitcoins', 'affiliateCharge', {
        type: Sequelize.FLOAT,
        defaultValue: 0,
        after: "value"
      });
      await queryInterface.addColumn('bitcoins', 'superAffiliateCharge', {
        type: Sequelize.FLOAT,
        defaultValue: 0,
        after: "affiliateCharge"
      });

      await queryInterface.addColumn('cards', 'affiliateCharge', {
        type: Sequelize.FLOAT,
        defaultValue: 0,
        after: "isAvailable"
      });
      await queryInterface.addColumn('cards', 'superAffiliateCharge', {
        type: Sequelize.FLOAT,
        defaultValue: 0,
        after: "affiliateCharge"
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
      await queryInterface.removeColumn('bitcoins', 'affiliateCharge');
      await queryInterface.removeColumn('bitcoins', 'superAffiliateCharge');
      await queryInterface.removeColumn('cards', 'affiliateCharge');
      await queryInterface.removeColumn('cards', 'superAffiliateCharge');
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }
};
