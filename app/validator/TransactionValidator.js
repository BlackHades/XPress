'use strict';

const { check } = require('express-validator/check'), role = require("../api/users/UserConstant");
const transactionRepository = require('../api/transactions/TransactionRepository');
const userRepository = require('../api/users/UserRepository');

let create = () => {
    return [
        check('userId','User Reference is required').not().isEmpty(),
        check('amount','Transaction Amount is required').not().isEmpty().isNumeric(),
        check("userId").custom(value => {
            return userRepository.find(value).then(user => {
                if(!user || user.roleId !== role.USER){
                    return Promise.reject("User Reference is required");
                }
            })
        })
    ];
};

module.exports = {
    create
};