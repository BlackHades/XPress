const { check } = require('express-validator/check');
const {fetchByEmail} = require('../api/users/UserRepository');
const jwt = require('jsonwebtoken');

let change = () => {
    return [
        check('oldPassword','Old Password is Required').exists(),
        check('newPassword','New Password is Required').exists(),
    ];
};


let reset = () => {
    return [
        check('newPassword','New Password is Required').exists(),
        check('token').not().isEmpty()
    ];
};

module.exports = {
    change,
    reset
};