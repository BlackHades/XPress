'use strict';

module.exports = {
  up: (queryInterface, type) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */

    return queryInterface.createTable("sms", {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      to: type.STRING,
      message: type.TEXT,
      createdAt: {
        type: type.DATE,
        defaultValue: Date.now
      },
      updatedAt: {
        type: type.DATE,
        defaultValue: Date.now
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable("sms");
  }
};
