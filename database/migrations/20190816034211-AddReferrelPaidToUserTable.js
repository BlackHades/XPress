'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.addColumn("users", "referralPaid", {
      after: "referralCode",
      type: Sequelize.STRING,
      allowNull: true
    })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */

    return queryInterface.removeColumn("users", "referralPaid");

  }
};
