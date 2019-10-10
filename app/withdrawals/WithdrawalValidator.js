"use strict";
const { check } = require('express-validator/check');

exports.increase = () => {
    return [
        check('userId','User identifier is required').not().isEmpty(),
        check('userType','User type is required').not().isEmpty(),
        check('amount','amount is required').not().isEmpty(),
        check('description','amount is required').not().isEmpty()
    ];
};