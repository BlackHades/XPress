"use strict";"use strict";
const { check, param } = require('express-validator/check');
const userRepository = require('../users/UserRepository');
const affiliateRepository = require("./AffiliateRepository");

/**
 * Create User Validation
 * @returns {any[]}
 */
exports.create = () => {
    return [
        check('name','Name is required').not().isEmpty(),
        check('username','Username is required').not().isEmpty(),
        check('password','Password is required').not().isEmpty(),
        check('phoneNumber','Phone Number is required').not().isEmpty(),
        check('email','Email is required').not().isEmpty(),
        check('avatar','Avatar is required').not().isEmpty(),
        check('facebookProfileLink','Facebook profile link is required').not().isEmpty(),
        check('twitterHandle','Twitter handle is required').not().isEmpty(),
        check('instagramUsername','Instagram username is required').not().isEmpty(),
        check('primaryPlaceOfAdvert','Primary place of advert is required').not().isEmpty(),
        check('shortNote','Short note is required').not().isEmpty(),
        check('email').custom(async value => {

            await affiliateRepository.truncate();
            return affiliateRepository.findOne({email: value}).then(affiliate => {
                if(affiliate) return Promise.reject('Email has been taken');
            })
        }),
        check('username').custom(value => {
            return affiliateRepository.findOne({username: value}).then(user => {
                if(user){
                    return Promise.reject('Username is not available');
                }
            })
        }),
        check('phoneNumber').custom(async value => {
            return affiliateRepository.findOne({phoneNumber: value}).then(affiliate => {
                if(affiliate) return Promise.reject('Phone number has been taken');
            })
        }),
    ];
};