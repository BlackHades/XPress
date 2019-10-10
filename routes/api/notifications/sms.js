"use strict";
const express = require('express');
const router = express.Router();
//Controllers
const smsController = require('../../../app/notifications/sms/SMSController');
router.post('/send', smsController.send);
router.get('/', smsController.fetch);
module.exports = router;


