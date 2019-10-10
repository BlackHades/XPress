
module.exports = (sequelize, type) => {

    // from the admin to all users on the system
    return sequelize.define('news', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: type.STRING,
        message: type.STRING
    });
};