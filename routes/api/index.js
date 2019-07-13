"use strict";
const express = require('express');
const router = express.Router();
//Controllers
const AuthController = require('../../app/auths/AuthController');

//Validators
const AuthValidator  = require('../../app/auths/AuthValidator');


router.post('/login', AuthValidator.login(), AuthController.login);
router.post('/register', AuthValidator.register(), AuthController.register);



module.exports = router;


