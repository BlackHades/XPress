const express = require('express');
const app = express();
const router = express.Router();
const authRouter = require('./auth');

//Controllers
const AuthController = require('../../app/api/auths/AuthController');

//Validators
const AuthValidator  = require('../../app/validation/AuthValidator');
/* GET home page. */

router.post('/login', AuthValidator.login(), AuthController.login);
router.post('/register', AuthValidator.register(), AuthController.register);






module.exports = router;


