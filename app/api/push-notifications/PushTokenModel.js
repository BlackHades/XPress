
module.exports = (sequelize, type) => {

    return sequelize.define('push_tokens', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId:{
            type: type.INTEGER,
        },
        token:{
            type: type.STRING,
        },
    });
};
// Export the model
// module.exports = mongoose.model('User', UserSchema);