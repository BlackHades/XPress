const { check } = require('express-validator/check');
const {fetchByEmail} = require('../api/users/UserRepository');

let change = () => {
    return [
        check('oldPassword','Old Password is Required').exists(),
        check('newPassword','New Password is Required').exists(),
    ];
};


let reset = () => {
    return [
        check('newPassword','New Password is Required').exists(),
        check('email').custom(value => {
            return fetchByEmail(value).then(user => {
                if(!user){
                    return Promise.reject('Email Not Found');
                }
            })
        })
    ];
};

module.exports = {
    change,
    reset
};