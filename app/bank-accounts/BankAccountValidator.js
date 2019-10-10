"use strict";
const { check } = require('express-validator/check');

exports.save = () => {
    return [
        check('userId','User identifier is required').not().isEmpty(),
        check('userType','User type is required').not().isEmpty(),
        check('bankName','Bank name is required').not().isEmpty(),
        check('accountName','Account name is required').not().isEmpty(),
        check('accountNumber','Account number is required').not().isEmpty()
    ];
};