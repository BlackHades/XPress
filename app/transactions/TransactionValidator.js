'use strict';

const { check } = require('express-validator/check'), role = require("../users/UserConstant");
const transactionConstant = require('./TransactionConstant');
const userRepository = require('../users/UserRepository');

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
        }),
        check("transactionType","Invalid Transaction Type").isIn([transactionConstant.TYPE_BITCOIN, transactionConstant.TYPE_CARD]),
        check("quantity","Quantity is required").not().isEmpty().isNumeric(),
        check("mode","Mode is required(INSTANT or WALLET)").isIn([transactionConstant.MODE_INSTANT, transactionConstant.MODE_WALLET]),
    ];
};

module.exports = {
    create
};