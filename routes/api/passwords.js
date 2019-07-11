const express = require('express');
const router = express.Router();

//Middleware
const {authenticate} = require('../../app/middleware/ApiAuthMiddleware');

//Controllers
const passwordController = require('../../app/passwords/PasswordController');

//Validators
const passwordValidator  = require('../../app/validator/PasswordValidator');

//Reset Password
router.post('/reset', passwordValidator.reset(), passwordController.reset);
router.get('/reset', passwordController.send);

//Auth
router.use(authenticate);

//Routes 1. Change Password
router.post('/change', passwordValidator.change(), passwordController.change);

module.exports = router;

