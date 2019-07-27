"use strict";

module.exports = (sequelize, type) => {

    return sequelize.define('wallet_logs', {
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
        amount: {
            type: type.FLOAT,
            defaultValue: 0
        },
        description: {
            type: type.TEXT,
            allowNull: false
        },
        transactionId:{
            type: type.STRING,
            allowNull: true
        }
    });
};