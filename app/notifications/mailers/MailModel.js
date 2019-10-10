
module.exports = (sequelize, type) => {

    return sequelize.define('mailers', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        to: type.STRING,
        from: {
            type: type.STRING,
            allowNull: true
        },
        subject: type.STRING,
        message:type.STRING
    });
};