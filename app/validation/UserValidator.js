const { check } = require('express-validator/check');
const {fetchByEmail} = require('../api/users/UserRepository');

let create = () => {
    return [
        check('name','Name is required').exists(),
        check('password','Password is required').exists(),
        check('email','email is required').exists(),
        check('email').custom(value => {
            return fetchByEmail(value).then(user => {
                if(user){
                    return Promise.reject('Email has been taken');
                }
            })
        })
    ];
};

module.exports = {
    create,
    register
};