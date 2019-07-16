"use strict";
const express = require('express');
const router = express.Router();
//Controllers
const mailController = require('../../../app/notifications/mailers/MailController');

router.post('/send', mailController.send);


module.exports = router;


