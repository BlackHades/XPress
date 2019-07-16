"use strict";
const express = require('express');
const router = express.Router();
//Controllers
const smsController = require('../../../app/notifications/sms/SMSController');
router.post('/send', smsController.send);
module.exports = router;


