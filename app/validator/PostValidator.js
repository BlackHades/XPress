'use strict';
const { check } = require('express-validator/check');


const create = () => {
    return [
        check('title','Title is required').exists(),
        check('content','Content is required').exists(),
    ];
};



module.exports = {
  create
};