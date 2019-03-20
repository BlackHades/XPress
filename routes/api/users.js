const express = require('express');
const app = express();
const router = express.Router();

//Middleware
const {authenticate,agentAuth,adminAuth} = require('../../app/middleware/ApiAuthMiddleware');

//Controllers
const userController = require('../../app/api/users/UserController');

//Validators
const userValidator  = require('../../app/validator/UserValidator');

//General Auth
app.use(authenticate);
router.post('/update', userValidator.update(),  userController.update);
router.post('/avatar', userValidator.avatar(),  userController.avatar);
router.get("/details/:userId", userController.details);
router.get("/me", userController.me);

//Agents And Above

app.use(agentAuth);
router.get('/all', userController.all);

//Administrator Only
//Admin Middleware


app.use(adminAuth);
router.post('/create', userValidator.create(), userController.create);
router.delete('/delete/:userId', userValidator.destroy(), userController.destroy);

module.exports = router;

