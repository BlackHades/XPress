'use strict';
const express = require('express');
const router = express.Router();

//Middleware
const {authenticate,adminAuth} = require('../../app/middleware/ApiAuthMiddleware');

//Controllers
const utilityController = require('../../app/utilities/UtilityController');

//validator
const utilityValidator  = require("../../app/utilities/UtilityValidator");


router.get("/fetch/:key?",utilityController.fetch);


//General Auth
router.use(authenticate, adminAuth);
//Register Token
router.post("/upsert", utilityValidator.upsert(),utilityController.upsert);



module.exports = router;

