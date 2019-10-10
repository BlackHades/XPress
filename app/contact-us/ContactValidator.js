'use strict';
const { check } = require('express-validator/check');


const save = () => {
    //name
    //email
    //website
    //businessPlan
    //message
    return [
        check('name','Your name is required').not().isEmpty(),
        check('email','Your email is required').not().isEmpty(),
        // check('businessPlan','Your website is required').exists(),
        check('message','Your message is required').not().isEmpty(),
    ];
};



module.exports = {
    save
};