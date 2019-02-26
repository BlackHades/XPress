module.exports = (sequelize, type) => {
    return sequelize.define('comments', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: type.INTEGER,
        postId: type.INTEGER,
        content: type.TEXT
    });
};