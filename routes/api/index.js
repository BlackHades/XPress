const express = require('express');
const app = express();
const router = express.Router();
const {authenticate,agentAuth,adminAuth} = require('../../app/middleware/ApiAuthMiddleware');

//Controllers
const AuthController = require('../../app/api/auths/AuthController');

//Validators
const AuthValidator  = require('../../app/validator/AuthValidator');
/* GET home page. */

router.post('/login', AuthValidator.login(), AuthController.login);
router.post('/register', AuthValidator.register(), AuthController.register);



router.use(authenticate);
router.get("/refresh-token",AuthController.refreshToken);






module.exports = router;


