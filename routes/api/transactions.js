'use strict';
const express = require('express');
const router = express.Router();

//Middleware
const {authenticate, adminAuth, agentAuth} = require('../../app/middleware/ApiAuthMiddleware');

//Controllers
const transactionController = require('../../app/transactions/TransactionController');

//Validators
const transactionValidator  = require('../../app/transactions/TransactionValidator');


//General Auth
router.use(authenticate);
router.get("/all",transactionController.all);
router.get("/show/:transactionId", transactionController.show);
router.get("/details", transactionController.details);

//Agents And Above
router.use(agentAuth);
router.post("/create",transactionValidator.create(),transactionController.create);


router.use(adminAuth);
router.delete("/delete/:transactionId", transactionController.destroy);
router.get("/status", transactionController.status);



module.exports = router;

