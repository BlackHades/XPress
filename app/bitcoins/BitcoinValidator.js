'use strict';
const { check,param } = require('express-validator/check');
const {fetchByName} = require('../cards/CardRepository');

let create = () => {
    return [
        check('name','Bitcoin Name is required').not().isEmpty(),
        check('lowerBound','Bitcoin Lower Bound is required').not().isEmpty().isNumeric(),
        check('lowerBound','Bitcoin Lower Bound is not a number').isNumeric(),
        check('upperBound','Bitcoin Upper Bound is required').not().isEmpty(),
        check('upperBound','Bitcoin Upper Bound is not a number').isNumeric(),
        check('value','Bitcoin value is required').not().isEmpty(),
    ];
};


let update = () => {
    return [
        param("bitcoinId","Bitcoin Id is required").exists(),
        check('name','Bitcoin Name is required').not().isEmpty(),
        check('lowerBound','Bitcoin Lower Bound is required').not().isEmpty().isNumeric(),
        check('lowerBound','Bitcoin Lower Bound is not a number').isNumeric(),
        check('upperBound','Bitcoin Upper Bound is required').not().isEmpty(),
        check('upperBound','Bitcoin Upper Bound is not a number').isNumeric(),
        check('value','Bitcoin value is required').not().isEmpty(),
    ];
};


module.exports = {
    create,
    update
};