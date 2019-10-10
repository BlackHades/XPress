"use strict";

module.exports = (sequelize, type) => {

    return sequelize.define('wallets', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: type.STRING,
            allowNull: false
        },
        userType: {
            type: type.STRING,
            defaultValue: "user"
        },
        balance: {
            type: type.STRING,
        }
    });
};