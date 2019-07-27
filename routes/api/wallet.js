'use strict';
const express = require('express');
const router = express.Router();

//Middleware
const {authenticate, adminAuth} = require('../../app/middleware/ApiAuthMiddleware');

const walletController = require('../../app/wallets/WalletController');

const walletValidator  = require("../../app/wallets/WalletValidator");

router.use(authenticate);


router.use(adminAuth);

router.post("/increase", walletValidator.increase(),walletController.increase);

module.exports = router;

