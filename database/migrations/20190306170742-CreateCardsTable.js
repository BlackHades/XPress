'use strict';

module.exports = {
  up: (queryInterface, type) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */

    return queryInterface.createTable('cards', {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: type.STRING,
      country: type.STRING,
      description: {
        type: type.TEXT,
        allowNull: true
      },
      type: {
        type: type.STRING,
        allowNull: true,
      },
      priceRange:{
        type: type.STRING,
        allowNull: true
      },
      amount:type.STRING,
    },{
      paranoid:true
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable("cards");

  }
};
