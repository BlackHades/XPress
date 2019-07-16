"use strict";
const express = require('express');
const router = express.Router();
const mailRouter = require("./notifications/mailer");

const {authenticate, adminAuth, agentAuth} = require('../../app/middleware/ApiAuthMiddleware');


router.use(authenticate, adminAuth);

router.use('/mails',mailRouter);
module.exports = router;


