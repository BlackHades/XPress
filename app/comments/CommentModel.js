module.exports = (sequelize, type) => {
    return sequelize.define('comments', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type:type.INTEGER,
            allowNull:false
        },
        postId: {
            type:type.INTEGER,
            allowNull:false
        },
        content: {
            type:type.TEXT,
            allowNull:false
        },
    });
};