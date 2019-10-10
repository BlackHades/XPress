"use strict";

module.exports = (sequelize, type) => {

    return sequelize.define('withdrawals', {
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
        status:{
            type: type.STRING,
            defaultValue: "PENDING"
        },
        reason:{
            type: type.STRING,
            allowNull: true
        }
    });
};