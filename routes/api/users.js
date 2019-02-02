const express = require('express');
const app = express();
const router = express.Router();

//Middleware
const {authenticate,adminAuth} = require('../../app/middleware/ApiAuthMiddleware');

//Controllers
const userController = require('../../app/api/users/UserController');
//All User
router.use(authenticate);
//Routes 1. get User Details
router.post('/me', userController.create);


//Agents And Above


//Administrator Only
//Admin Middleware


router.use(adminAuth);
router.post('/create', userController.create);

module.exports = router;

