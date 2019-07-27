'use strict';
const express = require('express');
const router = express.Router();

//Middleware
const {authenticate} = require('../../app/middleware/ApiAuthMiddleware');

const bankAccountController = require('../../app/bank-accounts/BankAccountController');

const bankAccountValidator  = require("../../app/bank-accounts/BankAccountValidator");

router.use(authenticate);

router.get("/", bankAccountController.fetch);

router.post("/", bankAccountValidator.save(), bankAccountController.save);

module.exports = router;

