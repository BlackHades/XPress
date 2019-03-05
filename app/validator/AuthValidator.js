const { check } = require('express-validator/check');
const {fetchByEmail} = require('../api/users/UserRepository');

let login = () => {
    return [
        check('email','email is required').exists(),
        check('password','password is required').exists(),
        check('email','email has been taken').custom(value => {
            return fetchByEmail(value).then(user => {
                // console.log("Validation-Email: " + user);
                if(!user){
                    return Promise.reject('Invalid Email');
                }
            })
        })
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
        })
    ];
};

module.exports = {
  login,
  register
};