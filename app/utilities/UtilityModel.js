
module.exports = (sequelize, type) => {

    return sequelize.define('utilities', {
        key:{
            type: type.STRING,
            unique: true
        },
        value:{
            type: type.TEXT,
            allowNull: false
        }
    });
};