module.exports = (sequelize, type) => {

    return sequelize.define('posts', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: type.STRING,
        content: type.TEXT,
        image: {
            type:type.STRING,
            allowNull:true
        },
        postedBy: type.INTEGER,
        tags: type.TEXT
    });
};
// Export the model
// module.exports = mongoose.model('User', UserSchema);