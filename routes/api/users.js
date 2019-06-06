const express = require('express');
const router = express.Router();

//Middleware
const {authenticate,agentAuth,adminAuth} = require('../../app/middleware/ApiAuthMiddleware');

//Controllers
const userController = require('../../app/api/users/UserController');

//Validators
const userValidator  = require('../../app/validator/UserValidator');



//General Auth
router.use(authenticate);
router.post('/update', userValidator.update(),  userController.update);
router.post('/avatar', userValidator.avatar(),  userController.avatar);
router.get("/details/:userId", userController.details);
router.get("/me", userController.me);
router.get("/agents", userController.agents);
router.get('/all', userController.all);


//Agents And Above


router.use(agentAuth);
router.get("/toggle/status/:status", userController.toggleStatus);


//Administrator Only
//Admin Middleware


router.use(adminAuth);
router.post('/create', userValidator.create(), userController.create);
router.delete('/delete/:userId', userValidator.destroy(), userController.destroy);
router.post("/update/is/active", userController.toggleIsActive);
module.exports = router;

