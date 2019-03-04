module.exports = (sequelize, type) => {
    return sequelize.define('online_users', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: type.STRING,
        socketId: {
            type:type.STRING,
            unique:true
        }
    });
};
// Export the model
// module.exports = mongoose.model('User', UserSchema);