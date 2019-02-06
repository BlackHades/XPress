const files = require('./FileConstant');

module.exports = (sequelize, type) => {

    return sequelize.define('files', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        checksum:{
            type: type.STRING,
            unique: true
        },
        url: type.STRING,
        mimeType: type.STRING,
        extras: {
            type: type.TEXT,
            allowNull: true
        }
    });
};


// Export the model
