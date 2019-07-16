"use strict";
const express = require('express');
const router = express.Router();
const mailRouter = require("./notifications/mailer");
const smsRouter = require("./notifications/sms");

const {authenticate, adminAuth, agentAuth} = require('../../app/middleware/ApiAuthMiddleware');


router.use(authenticate, adminAuth);
router.use('/mails',mailRouter);
router.use('/sms',smsRouter);
module.exports = router;


