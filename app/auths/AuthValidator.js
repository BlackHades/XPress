const { check } = require('express-validator/check');
const {fetchByEmail,fetchByPhone} = require('../users/UserRepository');

let login = () => {
    return [
        check('email','email is required').exists(),
        check('password','password is required').exists()
    ];
};


let register = () => {
    return [
        check('name','Name is required').exists(),
        check('password','Password is required').exists(),
        check('email','Email is required').exists(),
        check('phone','Phone number is required').exists(),
        check('email').custom(value => {
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