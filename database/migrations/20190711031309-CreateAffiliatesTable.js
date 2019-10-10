'use strict';

module.exports = {
    up: (queryInterface, type) => {
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.createTable('users', { id: Sequelize.INTEGER });
        */
        return queryInterface.createTable('affiliates', {
            id: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: type.STRING,
                allowNull:false
            },
            email: {
                type: type.STRING,
                unique: true,
                allowNull:false
            },
            phoneNumber: {
                type: type.STRING,
                unique: true,
                allowNull:false
            },
            username: {
                type: type.STRING,
                unique: true,
                allowNull:false
            },
            password: {
                type: type.STRING,
                allowNull:false
            },
            avatar: {
                type: type.STRING,
                allowNull:false
            },
            facebookProfileLink: {
                type: type.STRING,
                allowNull:false
            },
            twitterHandle: {
                type: type.STRING,
                allowNull:false
            },
            instagramUsername: {
                type: type.STRING,
                allowNull:false
            },
            primaryPlaceOfAdvert: {
                type: type.STRING,
                allowNull:false
            },
            shortNote: {
                type: type.TEXT,
                allowNull:false
            },
            emailVerifiedAt: {
                type: type.DATE,
                allowNull: true
            },
            phoneVerifiedAt: {
                type: type.DATE,
                allowNull: true
            },
            status:{
                type: type.STRING,
                defaultValue:"pending"
            },
            approvedBy: {
                type: type.INTEGER,
                allowNull:true
            },
            createdAt: type.DATE,
            updatedAt: type.DATE,
        });

    },

    down: (queryInterface, Sequelize) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.dropTable('users');
        */
        return queryInterface.dropTable("affiliates");

    }
};
