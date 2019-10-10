'use strict';
const express = require('express');
const router = express.Router();
//Middleware
const {authenticate, adminAuth} = require('../../app/middleware/ApiAuthMiddleware');

//Controllers
const contactController = require('../../app/contact-us/ContactController');

//Validators
const contactValidator  = require('../../app/contact-us/ContactValidator');


router.post('/save', contactValidator.save(), contactController.save);

//
// //Admin Routes Only
// router.use(authenticate,adminAuth);
router.get('/all', contactController.fetch);

module.exports = router;

