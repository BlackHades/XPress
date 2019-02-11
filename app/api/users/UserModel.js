
const roles = require('./UserConstant');

module.exports = (sequelize, type) => {

    return sequelize.define('users', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        roleId:{
            type: type.INTEGER,
            defaultValue: roles.USER,
        },
        name: type.STRING,
        email: {
            type: type.STRING,
            unique: true,
        },
        phone: {
            type: type.STRING,
            unique: true,
        },
        password: type.STRING,
        avatar: type.STRING,
        lastSeen: type.DATE
    });
};
// Export the model
// module.exports = mongoose.model('User', UserSchema);