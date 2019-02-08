const express = require('express');
const app = express();
const router = express.Router();

//Middleware
const {authenticate,adminAuth} = require('../../app/middleware/ApiAuthMiddleware');

//Controllers
const userController = require('../../app/api/users/UserController');

//Validators
const userValidator  = require('../../app/validator/UserValidator');

//General Auth
router.use(authenticate);
router.post('/update', userValidator.update(),  userController.update);
router.post('/avatar', userValidator.avatar(),  userController.avatar);


//Agents And Above


//Administrator Only
//Admin Middleware


router.use(adminAuth);
router.post('/create', userValidator.create(), userController.create);
router.get('/all', userValidator.create(), userController.create);
router.delete('/delete/:id', userValidator.create(), userController.create);

module.exports = router;

