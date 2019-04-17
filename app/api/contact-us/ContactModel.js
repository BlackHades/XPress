"use strict";

module.exports = (sequelize, type) => {

    return sequelize.define('contacts', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: type.STRING,
        email: type.STRING,
        website: {
            type: type.STRING,
            allowNull: true
        },
        businessPlan: {
            type: type.TEXT,
            allowNull: true
        },
        message: {
            type: type.TEXT,
        }
    });
};