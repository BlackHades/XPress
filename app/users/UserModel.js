"use strict";
const roles = require('./UserConstant');

module.exports = (sequelize, type) => {

    return sequelize.define('users', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        uid:{
            type: type.STRING,
            unique: true
        },
        roleId:{
            type: type.INTEGER,
            defaultValue: roles.USER,
        },
        name: type.STRING,
        username: type.STRING,
        email: {
            type: type.STRING,
            unique: true,
        },
        phone: {
            type: type.STRING,
            unique: true,
        },
        password: type.STRING,
        avatar: type.STRING,
        lastSeen: type.DATE,
        status:{
            type: type.STRING,
            defaultValue:"offline"
        },
        isActive:{
            type: type.BOOLEAN,
            defaultValue: true
        },
        affiliateCode:{
            type: type.STRING,
            allowNull: true,
        },
        referralCode:{
            type: type.STRING,
            allowNull: true,
        },
        referralPaid: {
            type: type.STRING,
            allowNull: true
        },
        emailVerifiedAt:{
            type: type.DATE,
            allowNull: true,
        },
        phoneVerifiedAt:{
            type: type.DATE,
            allowNull: true,
        }
    },{
        defaultScope: {
            attributes: {
                exclude: ["password"]
            }
        },scopes: {
            withPassword: {
                attributes:{
                    include: ["password"]
                }
            },
            active:{
                where:{
                    isActive: true
                }
            }
        }

    });
};
// Export the model
// module.exports = mongoose.model('User', UserSchema);