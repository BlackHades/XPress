'use strict'
const { check } = require('express-validator/check');
const {fetchByName} = require('../api/cards/CardRepository');

let create = () => {
    return [
        check('name','card Name is required').exists().not().isEmpty(),
        check('name').custom(value => {
            return fetchByName(value.toString().trim()).then(card => {
                if(card){
                    return Promise.reject('Card already exists.');
                }
            })
        }),
    ];
};


let update = () => {
    return [
        check('name','card Name is required').exists().not().isEmpty(),
        check('name').custom(value => {

        }),
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