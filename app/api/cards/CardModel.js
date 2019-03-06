"use strict";

module.exports = (sequelize, type) => {

    return sequelize.define('cards', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: type.STRING,
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
    },{
        paranoid:true
    });
};
// Export the model
// module.exports = mongoose.model('User', UserSchema);