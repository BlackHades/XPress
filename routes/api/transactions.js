'use strict';
const express = require('express');
const router = express.Router();

//Middleware
const {authenticate, adminAuth, agentAuth} = require('../../app/middleware/ApiAuthMiddleware');

//Controllers
const transactionController = require('../../app/api/transactions/TransactionController');

//Validators
const transactionValidator  = require('../../app/validator/TransactionValidator');


//General Auth
router.use(authenticate);
router.get("/all",transactionController.all);

//Agents And Above
router.use(agentAuth);
router.post("/create",transactionValidator.create(),transactionController.create);


router.use(adminAuth);




module.exports = router;

