"use strict";
const express = require('express');
const router = express.Router();
const mailRouter = require("./notifications/mailer");
const smsRouter = require("./notifications/sms");
const newsRouter = require("./notifications/news");

const { authenticate, adminAuth, adminOrBloggerAuth } = require('../../app/middleware/ApiAuthMiddleware');
router.use('/news', newsRouter);

router.use(authenticate, adminOrBloggerAuth);
router.use('/mails', mailRouter);

router.use(authenticate, adminAuth);
router.use('/sms', smsRouter);

module.exports = router;