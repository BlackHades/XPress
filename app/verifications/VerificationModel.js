"use strict";

module.exports = (sequelize, type) => {

    return sequelize.define('verifications', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        code: {
            type: type.STRING,
            comment: "6 digit verification code"
        },
        value: {
            type: type.STRING,
        },
        type: {
            type: type.STRING,
            defaultValue: "email"
        },
        userType: {
            type: type.STRING,
            defaultValue: "user"
        }
    });
};