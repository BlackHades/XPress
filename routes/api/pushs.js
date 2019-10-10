'use strict';
const express = require('express');
const app = express();
const router = express.Router();

//Middleware
const {authenticate,adminAuth} = require('../../app/middleware/ApiAuthMiddleware');

//Controllers
const pushController = require('../../app/push-notifications/PushTokenController');

//validator
const pushValidator  = require("../../app/push-notifications/PushTokenValidator");

//General Auth
router.use(authenticate);
//Register Token
router.post("/register", pushValidator.register(),pushController.register);



module.exports = router;

