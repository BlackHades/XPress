'use strict';

const { check } = require('express-validator/check'), role = require("../api/users/UserConstant");
const transactionRepository = require('../api/transactions/TransactionRepository');
const cardRepository = require('../api/cards/CardRepository');
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
        }),
        check("cardId").custom(value => {
            return cardRepository.find(value).then(card => {
                if(!card || !card.isAvailable){
                    return Promise.reject("Card is either not found or not available");
                }
            })
        })
    ];
};

module.exports = {
    create
};