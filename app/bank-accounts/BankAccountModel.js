"use strict";

module.exports = (sequelize, type) => {

    return sequelize.define('bank_accounts', {
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
        bankCode: {
            type: type.STRING,
            allowNull: true,
        },
        bankName: {
            type: type.STRING,
            defaultValue: 0
        },
        accountNumber: {
            type: type.STRING,
            allowNull: false
        },
        accountName: {
            type: type.STRING,
            allowNull: true
        }
    });
};