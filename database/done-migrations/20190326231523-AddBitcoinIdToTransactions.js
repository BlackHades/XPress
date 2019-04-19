'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */

    return Promise.all([
        queryInterface.addColumn("transactions","bitcoinId",{
          allowNull: true,
          after:"cardId",
          type:Sequelize.INTEGER,
        }),
        queryInterface.addColumn("transactions","transactionType",{
          allowNull: true,
          after:"transactionId",
          type:Sequelize.STRING,
          defaultValue:"CARD"
        })
    ]);

  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return Promise.all([
      queryInterface.removeColumn("transactions","bitcoinId"),
      queryInterface.removeColumn("transactions","transactionType"),
      queryInterface.changeColumn("transactions","cardId",{
        allowNull:false,
      })
    ]);
  }
};
