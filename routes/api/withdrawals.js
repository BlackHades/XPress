'use strict';
const express = require('express');
const router = express.Router();

//Middleware
const {authenticate, adminAuth} = require('../../app/middleware/ApiAuthMiddleware');

const withdrawalController = require('../../app/withdrawals/WithdrawalController');

router.use(authenticate);

router.post("/request", withdrawalController.request);
router.get("/", withdrawalController.fetch);


router.use(adminAuth);
router.patch("/status", withdrawalController.status);


module.exports = router;

