"use strict";
const express = require('express');
const router = express.Router();
const mailRouter = require("./notifications/mailer");
const smsRouter = require("./notifications/sms");
const newsRouter = require("./notifications/news");

const { authenticate, adminAuth } = require('../../app/middleware/ApiAuthMiddleware');

router.use(authenticate, adminAuth);
router.use('/mails', mailRouter);
router.use('/sms', smsRouter);
router.use('/news', newsRouter);
module.exports = router;


