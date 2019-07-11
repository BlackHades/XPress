'use strict';
const express = require('express');
const router = express.Router();
//Middleware
const {authenticate,adminAuth} = require('../../app/middleware/ApiAuthMiddleware');

//Controllers
const bitcoinController = require('../../app/bitcoins/BitcoinController');

//Validators
const bitcoinValidator  = require('../../app/validator/BitcoinValidator');


router.get('/all', bitcoinController.fetch);
router.get("/fetch/:bitcoinId", bitcoinController.find);



//Admin Routes Only
router.use(authenticate);
router.use(adminAuth);
router.post('/create', bitcoinValidator.create(), bitcoinController.create);
router.delete('/delete/:bitcoinId', bitcoinController.destroy);
router.post('/update/:bitcoinId', bitcoinValidator.update(), bitcoinController.update);

module.exports = router;

