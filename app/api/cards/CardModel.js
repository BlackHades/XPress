"use strict";

module.exports = (sequelize, type) => {

    return sequelize.define('cards', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: type.STRING,
        avatar: {
            type: type.STRING,
            allowNull: true
        },
        country: type.STRING,
        description: {
            type: type.TEXT,
            allowNull: true
        },
        type: {
            type: type.STRING,
            allowNull: true,
        },
        priceRange:{
            type: type.STRING,
            allowNull: true
        },
        amount:type.STRING,
        isAvailable:{
            type: type.BOOLEAN,
            defaultValue: true
        }
    },{
        paranoid:true
    });
};
// Export the model
// module.exports = mongoose.model('User', UserSchema);