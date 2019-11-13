module.exports = (sequelize, type) => {
    return sequelize.define('callbacks', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: type.STRING,
        phone: type.STRING,
        called: {
            type: type.BOOLEAN,
            defaultValue: false
        },
    });
};
