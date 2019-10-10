'use strict';
const express = require('express');
const router = express.Router();

//Middleware
const {authenticate} = require('../../app/middleware/ApiAuthMiddleware');

//Controllers
const verificationController = require('../../app/verifications/VerificationController');

//validator
const verificationValidator  = require("../../app/verifications/VerificationValidator");

//General Auth
router.use(authenticate);
//Register Token
router.post("/", verificationValidator.verify(),verificationController.verify);
router.get("/resend", verificationController.resend);


module.exports = router;

