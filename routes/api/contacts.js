'use strict';
const express = require('express');
const router = express.Router();
//Middleware
const { authenticate, adminAuth } = require('../../app/middleware/ApiAuthMiddleware');

//Controllers
const contactController = require('../../app/contact-us/ContactController');

//Validators
const contactValidator = require('../../app/contact-us/ContactValidator');


router.post('/save', contactValidator.save(), contactController.save);
router.post('/callback', contactController.callback)
//
// //Admin Routes Only
router.get('/all', contactController.fetch);

router.use(authenticate, adminAuth);
router.get('/callbacks', contactController.callbacks)


module.exports = router;

