const { check } = require('express-validator/check');
const {fetchByEmail} = require('../api/users/UserRepository');


/**
 * Create User Validation
 * @returns {any[]}
 */
let create = () => {
    return [
        check('name','Name is required').exists(),
        check('password','Password is required').exists(),
        check('phone','Phone Number is required').exists(),
        check('email','email is required').exists(),
        check('roleId','User role is required').exists(),
        check('email').custom(value => {
            return fetchByEmail(value).then(user => {
                if(user){
                    return Promise.reject('Email has been taken');
                }
            })
        })
    ];
};

/**
 * Update User Validation
 * @returns {ValidationChain[]}
 */
let update = () => {
    return [
        check('name','Name is required').exists(),
        check('phone','Phone Number is required').exists(),
        check('email','email is required').exists()
    ];
};

let avatar = () => {
    return [
        check('avatar','Avatar is required').exists(),
    ];
};




module.exports = {
    create, update, avatar
};