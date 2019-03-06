'use strict';
const { check } = require('express-validator/check');
const {fetchByName} = require('../api/cards/CardRepository');

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


const destroy = () => {
    return [
        check('name','card Name is required').exists().not().isEmpty(),
        check('name').custom(value => {

        }),
    ];
};

module.exports = {
    create,
    update,
    destroy
};