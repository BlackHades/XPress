"use strict";
const { check } = require('express-validator/check');
const {fetchByEmail,fetchByPhone, truncate} = require('../users/UserRepository');

let login = () => {
    return [
        check('email','email is required').exists(),
        check('password','password is required').exists()
    ];
};


let register = () => {
    return [
        check('name','Name is required').not().isEmpty(),
        check('password','Password is required').not().isEmpty(),
        check('email','Email is required').not().isEmpty(),
        check('phone','Phone number is required').not().isEmpty(),
        check('email').custom(async value => {
            return fetchByEmail(value).then(user => {
                if(user){
                    return Promise.reject('Email has been taken');
                }
            })
        }),
        check('phone').custom(value => {
            return fetchByPhone(value).then(user => {
                if(user){
                    return Promise.reject('Phone Number has been taken');
                }
            })
        })
    ];
};

module.exports = {
  login,
  register
};