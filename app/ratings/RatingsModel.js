module.exports = (sequelize, type) => {
    return sequelize.define('ratings', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        agentId: type.INTEGER,
        userId : type.INTEGER ,
        createdAt : type.DATE,
        updatedAt : type.DATE,
        rating : type.INTEGER,
        comment: type.STRING
    });
};
