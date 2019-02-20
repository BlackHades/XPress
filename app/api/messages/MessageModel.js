const {STATUS_SENT} = require("./MessageConstant");

module.exports = (sequelize, type) => {

    return sequelize.define('messages', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mid:{
            type: type.STRING,
            unique: true
        },
        to: type.INTEGER,
        from: type.INTEGER,
        content: type.TEXT,
        type: type.STRING,
        mediaLink: {
            type: type.STRING,
            allowNull:true
        },
        agentId:{
            type: type.INTEGER,
            allowNull:true
        },
        status: {
            type: type.INTEGER,
            defaultValue: STATUS_SENT
        }
    });
};