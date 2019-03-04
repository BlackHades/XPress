const express = require('express');
const app = express();
const router = express.Router();

//Middleware
const {authenticate,adminAuth} = require('../../app/middleware/ApiAuthMiddleware');

//Controllers
const messageController = require('../../app/api/messages/MessageController');

//Validators
const messageValidator  = require('../../app/validator/UserValidator');

//General Auth
router.use(authenticate);
router.post('/send', userValidator.update(),  userController.update);
router.post('/avatar', userValidator.avatar(),  userController.avatar);


//Agents And Above


//Administrator Only
//Admin Middleware


// router.use(adminAuth);
// router.get('/all', userController.all);

module.exports = router;

