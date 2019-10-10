
module.exports = (sequelize, type) => {

    return sequelize.define('sms', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        to: type.STRING,
        message:type.STRING
    });
};