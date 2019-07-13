"use strict";

/**
 * Full name
 Email
 Phone number
 Username
 Password
 Profile picture
 Facebook profile link
 Twitter username
 Ig username
 Primary place of advert
 Short note: strategy you plan to use in advertising Chiji14xchange
 */


module.exports = (sequelize, type) => {

    return sequelize.define('affiliates', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: type.STRING,
            allowNull:false
        },
        email: {
            type: type.STRING,
            unique: true,
            allowNull:false
        },
        phoneNumber: {
            type: type.STRING,
            unique: true,
            allowNull:false
        },
        username: {
            type: type.STRING,
            unique: true,
            allowNull:false
        },
        password: {
            type: type.STRING,
            allowNull:false
        },
        avatar: {
            type: type.STRING,
            allowNull:false
        },
        facebookProfileLink: {
            type: type.STRING,
            allowNull:false
        },
        twitterHandle: {
            type: type.STRING,
            allowNull:false
        },
        instagramUsername: {
            type: type.STRING,
            allowNull:false
        },
        primaryPlaceOfAdvert: {
            type: type.STRING,
            allowNull:false
        },
        shortNote: {
            type: type.TEXT,
            allowNull:false
        },
        emailVerifiedAt: {
            type: type.DATE,
            allowNull: true
        },
        phoneVerifiedAt: {
            type: type.DATE,
            allowNull: true
        },
        status:{
            type: type.STRING,
            defaultValue:"pending"
        },
        approvedBy: {
            type: type.INTEGER,
            allowNull:true
        }
    });
};