

module.exports = (queryInterface, Sequelize) => {
    return queryInterface.define("transactions", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        transactionId: {
            type:Sequelize.STRING,
            unique: true
        },
        transactionType:{
            allowNull: false,
            type:Sequelize.STRING,
            defaultValue:"CARD"
        },
        cardId:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        bitcoinId:{
            allowNull: true,
            type:Sequelize.INTEGER,
        },
        userId: Sequelize.INTEGER,
        amount: Sequelize.STRING,
        description: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        extras:{
            type: Sequelize.TEXT,
            allowNull:true
        },
        status:{
            type: Sequelize.TEXT,
            defaultValue:"PENDING"
        },
        quantity:{
            type: Sequelize.INTEGER,
            defaultValue: 1
        },
        createdBy:Sequelize.INTEGER
    },{
        paranoid:true
    });
};