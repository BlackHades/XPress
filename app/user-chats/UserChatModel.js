"use strict";

module.exports = (sequelize, type) => {

    return sequelize.define('user_chats', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: type.STRING,
        },
        chatList: {
            type: type.JSON,
            allowNull: true
        }
    });
};