'use strict';
const { check } = require('express-validator/check');
const {fetchByName} = require('./CardRepository');

let create = () => {
    return [
        check('name','Card Name is required').not().isEmpty(),
        check('country','Card Country is required').not().isEmpty(),
        check('amount','Card Amount is required').not().isEmpty(),
    ];
};


let update = () => {
    return [
        check('name','Card Name is required').exists().not().isEmpty(),
        check('country','Card Country is required').exists().not().isEmpty(),
        check('amount','Card Amount is required').exists().not().isEmpty(),
    ];
};


module.exports = {
    create,
    update
};