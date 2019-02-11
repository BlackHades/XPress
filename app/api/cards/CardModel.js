

module.exports = (sequelize, type) => {

    return sequelize.define('cards', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name:{
            type: type.STRING,
            unique: true,
        },
        description: {
            type: type.TEXT,
            allowNull: false
        },
    });
};
// Export the model
// module.exports = mongoose.model('User', UserSchema);