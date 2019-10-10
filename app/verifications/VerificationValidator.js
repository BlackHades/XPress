"use strict";
const { check } = require('express-validator/check');
const {fetchByEmail,fetchByPhone} = require('../users/UserRepository');

exports.verify = () => {
    return [
        check('type','Verification type is required (email, phone)').exists(),
        check('code','Verification code is required').exists()
    ];
};